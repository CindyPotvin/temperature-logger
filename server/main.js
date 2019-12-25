import { Meteor } from "meteor/meteor";
import { weathers } from "../imports/collections/weather";
import bodyParser from "body-parser";
import { ReactiveAggregate } from "meteor/jcbernack:reactive-aggregate";
import url from "url";

Meteor.startup(() => {
  // **** Meteor publish that will automatically send up to date data.

  // Get the current (latest) weather for each module
  Meteor.publish("currentWeathers", function() {
    // Aggregation example:
    // http://hudsonburgess.com/2017/01/04/mongodb-first-doc-by-group.html
    const pipeline = [
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$moduleId",
          weathers: { $push: "$$ROOT" }
        }
      },
      {
        $replaceRoot: {
          newRoot: { $arrayElemAt: ["$weathers", 0] }
        }
      }
    ];
    ReactiveAggregate(this, weathers, pipeline);
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
      ...currentWeather
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
    let responseBody = {};
    // Gets the labels with the date range to display (always the last 30 days starting today, for now).
    responseBody.labels = new Array();
    const numberOfDays = 30;
    const dayDuration = 24 * 60 * 60 * 1000;
    const firstDate = new Date();
    const lastDate = new Date(firstDate - numberOfDays * dayDuration);
    for (var i = numberOfDays - 1; i >= 0; i--) {
      responseBody.labels.push(new Date(firstDate - i * 24 * 60 * 60 * 1000).toLocaleDateString());
    }
    // Gets the minimum and maximum value from the database for each of those dates
    responseBody.minimumTemperatureData = [];
    responseBody.maximumTemperatureData = [];
    const pipeline = [
      {
        $match: {
          $and: [{ moduleId: moduleId }, { createdAt: { $lte: firstDate, $gte: lastDate } }]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          temperatureMin: { $min: "$temperature" },
          temperatureMax: { $max: "$temperature" }
        }
      }
    ];
    const weathersMinMax = await weathers.rawCollection().aggregate(pipeline);
    await weathersMinMax.forEach(weather => {
      responseBody.minimumTemperatureData.push({ t: weather._id, y: weather.temperatureMin });
      responseBody.maximumTemperatureData.push({ t: weather._id, y: weather.temperatureMax });
    });
    // Send the response
    response.setHeader("Content-Type", "application/json");
    response.write(JSON.stringify(responseBody));
    response.end();
  });
});
