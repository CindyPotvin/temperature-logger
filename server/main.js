import { Meteor } from "meteor/meteor";
import { weathers } from "../imports/collections/weather";
import bodyParser from "body-parser";

Meteor.startup(() => {
  // code to run on server at startup

  Meteor.publish("currentWeather", function() {
    // Get the current (latest) weather
    // TODO: specify the identifier of a weather sensor. For now, only one module is supported.
    return weathers.find({}, { sort: { createdAt: -1 }, limit: 1 });
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
