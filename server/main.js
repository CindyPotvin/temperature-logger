import { Meteor } from "meteor/meteor";
import { weathers } from "../imports/collections/weather";
import bodyParser from "body-parser";
import { ReactiveAggregate } from "meteor/jcbernack:reactive-aggregate";

Meteor.startup(() => {
  Meteor.publish("currentWeather", function() {
    // Get the current (latest) weather
    // Aggregation example:
    // http://hudsonburgess.com/2017/01/04/mongodb-first-doc-by-group.html
    var pipeline = [
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
});
