import { Meteor } from "meteor/meteor";
import { weathers } from "../imports/collections/weather";
import { weatherModules } from "../imports/collections/weatherModule";
import bodyParser from "body-parser";
import { ReactiveAggregate } from "meteor/jcbernack:reactive-aggregate";
import url from "url";

Meteor.startup(() => {
   weatherModules.rawCollection().createIndex({ moduleId: 1 }, { unique: true });
   // **** Meteor publish that will automatically send up to date data.

   // Get the current (latest) weather for each module
   Meteor.publish("currentWeathers", function () {
      // Aggregation example:
      // http://hudsonburgess.com/2017/01/04/mongodb-first-doc-by-group.html
      const pipeline = [
         { $sort: { createdAt: -1 } },
         {
            $group: {
               _id: "$moduleId",
               weathers: { $push: "$$ROOT" },
            },
         },
         {
            $replaceRoot: {
               newRoot: { $arrayElemAt: ["$weathers", 0] },
            },
         },
      ];
      ReactiveAggregate(this, weathers, pipeline);
   });

   // Publish the list of module
   Meteor.publish("weatherModules", function () {
      return weatherModules.find({}, { $sort: { moduleId: 1 } });
   });

   // **** API endpoint to get or set data on demand only

   // Add weather data from one of the module into the database
   WebApp.connectHandlers.use("/api/weather", bodyParser.json());
   WebApp.connectHandlers.use("/api/weather", (request, response, next) => {
      if (request.method !== "POST") {
         response.writeHead(500);
         response.end();
      }

      var currentWeather = new Object();
      const weatherInfo = request.body.weather.trim().split(";");
      // Format:moduleId;temperature;humidityPercent;pressure
      currentWeather.moduleId = weatherInfo[0];
      currentWeather.temperature = weatherInfo[1];
      currentWeather.humidity = weatherInfo[2];
      currentWeather.pressure = weatherInfo[3];

      weathers.insert({
         createdAt: new Date(),
         ...currentWeather,
      });
      response.writeHead(200);
      response.end();
   });

   // Gets the minimum and maximum temperature for the last 30 days
   WebApp.connectHandlers.use("/api/temperatureHistory", bodyParser.json());
   WebApp.connectHandlers.use("/api/temperatureHistory", async (request, response, next) => {
      if (request.method !== "GET") {
         response.writeHead(500);
         response.end();
      }
      const queryObject = url.parse(request.url, true /*parseQueryString*/).query;
      const moduleId = queryObject.moduleId;

      // Gets the labels with the date range to display for the axis t ype
      const getAxisInfo = (axisType) => {
         const NUMBER_OF_HOURS = 24;
         const NUMBER_OF_MINUTES = 60;

         const MINUTE_DURATION = 60 * 1000;
         const HOUR_DURATION = NUMBER_OF_MINUTES * MINUTE_DURATION;
         const DAY_DURATION = NUMBER_OF_HOURS * HOUR_DURATION;

         const firstDate = new Date();
         let lastDate = new Date();
         let groupingFormat = "";
         let displayFormat = "";

         switch (axisType) {
            case "last_30_days": {
               groupingFormat = "%Y-%m-%d";
               displayFormat = groupingFormat;
               const NUMBER_OF_DAYS = 30;
               lastDate = new Date(firstDate - NUMBER_OF_DAYS * DAY_DURATION);
               break;
            }
            case "last_day": {
               groupingFormat = "%Y-%m-%dT%H";
               displayFormat = "%Y-%m-%dT%H:%M";
               lastDate = new Date(firstDate - DAY_DURATION);
               break;
            }
            case "last_hour": {
               groupingFormat = "%Y-%m-%dT%H:%M";
               displayFormat = "%Y-%m-%d %H:%M";
               lastDate = new Date(firstDate - HOUR_DURATION);
               break;
            }
         }
         return { firstDate, lastDate, groupingFormat, displayFormat };
      };

      const { firstDate, lastDate, groupingFormat, displayFormat } = getAxisInfo(
         queryObject.axisType
      );
      let responseBody = {};
      // Gets the minimum and maximum value from the database for each of those dates
      responseBody.minimumTemperatureData = [];
      responseBody.maximumTemperatureData = [];
      const pipeline = [
         {
            $match: {
               $and: [{ moduleId: moduleId }, { createdAt: { $lte: firstDate, $gte: lastDate } }],
            },
         },
         {
            $sort: { createdAt: -1 },
         },
         {
            $group: {
               _id: {
                  $dateToString: {
                     format: groupingFormat,
                     date: "$createdAt",
                     timezone: "America/Toronto",
                  },
               },
               temperatureDate: {
                  $first: {
                     $dateToString: {
                        format: displayFormat,
                        date: "$createdAt",
                        timezone: "America/Toronto",
                     },
                  },
               },
               temperatureMin: { $min: "$temperature" },
               temperatureMax: { $max: "$temperature" },
            },
         },
      ];
      const weathersMinMax = await weathers.rawCollection().aggregate(pipeline);

      await weathersMinMax.forEach((weather) => {
         console.log(weather);
         responseBody.minimumTemperatureData.push({
            t: weather.temperatureDate,
            y: weather.temperatureMin,
         });
         responseBody.maximumTemperatureData.push({
            t: weather.temperatureDate,
            y: weather.temperatureMax,
         });
      });

      const weatherSort = (weatherA, weatherB) => {
         let comparison = 0;
         if (weatherA.t > weatherB.t) {
            comparison = 1;
         } else if (weatherA.t < weatherB.t) {
            comparison = -1;
         }
         return comparison;
      };

      responseBody.minimumTemperatureData.sort(weatherSort);
      responseBody.maximumTemperatureData.sort(weatherSort);

      // Send the response
      response.setHeader("Content-Type", "application/json");
      response.write(JSON.stringify(responseBody));
      response.end();
   });
});
