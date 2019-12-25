import React, { useState } from "react";
import classNames from "classnames";
import WeatherVizualization from "./WeatherVisualization";
import { withTracker } from "meteor/react-meteor-data";
import { weathers } from "../../../imports/collections/weather";
import { Meteor } from "meteor/meteor";

const Weathers = props => {
  // If no weather information found, just display a message
  if (props.weathers.length == 0) return <div>No Weather</div>;
  //Sets the first module as selected
  const [currentModuleId, setCurrentModuleId] = useState(props.weathers[0].moduleId);

  return (
    <div className="ui cards">
      {props.weathers.map(currentWeather => {
        var weatherCardClass = classNames("ui", "card", {
          green: currentWeather.moduleId == currentModuleId
        });

        return (
          <div
            className={weatherCardClass}
            key={currentWeather.moduleId}
            onClick={() => {
              setCurrentModuleId(currentWeather.moduleId);
            }}
          >
            <div className="content">
              <div className="header">Module #{currentWeather.moduleId}</div>
            </div>
            <div className="WeatherLabelValue content">
              <span className="Label">Température:</span>
              <span className="Value">{currentWeather.temperature}°C</span>
            </div>
            <div className="WeatherLabelValue content">
              <span className="Label">Humidité:</span>
              <span className="Value">{currentWeather.humidity}%</span>
            </div>
            <div className="WeatherLabelValue content">
              <span className="Label">Pression:</span>
              <span className="Value">{currentWeather.pressure}</span>
            </div>
          </div>
        );
      })}
      <WeatherVizualization currentModuleId={currentModuleId} />
    </div>
  );
};

export default withTracker(props => {
  // Do all your reactive data access in this method.
  // Note that this subscription will get cleaned up when your component is unmounted
  Meteor.subscribe("currentWeathers");

  return { weathers: weathers.find({}).fetch() };
})(Weathers);
