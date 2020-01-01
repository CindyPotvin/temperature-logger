import React, { useState } from "react";
import classNames from "classnames";
import WeatherVizualization from "./WeatherVisualization";
import { withTracker } from "meteor/react-meteor-data";
import { weathers } from "../../../imports/collections/weather";
import { weatherModules } from "../../../imports/collections/weatherModule";
import { Meteor } from "meteor/meteor";

const Weathers = props => {
  // If no weather information found, just display a message
  if (props.weathers.length == 0) return <div>No Weather</div>;
  //Sets the first module as selected
  let firstWeatherModule = props.weatherModules.find(
    weatherModule => weatherModule.moduleId === props.weathers[0].moduleId
  );
  const [selectedModule, setSelectedModule] = useState(firstWeatherModule);

  return (
    <div className="ui cards">
      {props.weathers.map(currentWeather => {
        // TODO: Create a little utility class for this and displaying the id + description
        let currentWeatherModule = props.weatherModules.find(
          weatherModule => weatherModule.moduleId === currentWeather.moduleId
        );

        var weatherCardClass = classNames("ui", "card", {
          green: currentWeather.moduleId == selectedModule.moduleId
        });
        return (
          <div
            className={weatherCardClass}
            key={currentWeather.moduleId}
            onClick={() => {
              setSelectedModule(currentWeatherModule);
            }}
          >
            <div className="content">
              <div className="header">
                Module #{currentWeather.moduleId} - {currentWeatherModule.description}
              </div>
            </div>
            <div className="WeatherLabelValue content">
              <span className="Label">Temperature:</span>
              <span className="Value">{currentWeather.temperature}°C</span>
            </div>
            <div className="WeatherLabelValue content">
              <span className="Label">Humidity:</span>
              <span className="Value">{currentWeather.humidity}%</span>
            </div>
            <div className="WeatherLabelValue content">
              <span className="Label">Pressure:</span>
              <span className="Value">{currentWeather.pressure}</span>
            </div>
          </div>
        );
      })}
      {selectedModule && <WeatherVizualization currentWeatherModule={selectedModule} />}
    </div>
  );
};

export default withTracker(props => {
  // Do all your reactive data access in this method.
  // Note that this subscription will get cleaned up when your component is unmounted
  Meteor.subscribe("currentWeathers");
  Meteor.subscribe("modules");

  return { weathers: weathers.find({}).fetch(), weatherModules: weatherModules.find({}).fetch() };
})(Weathers);
