import React from "react";
import { withTracker } from "meteor/react-meteor-data";
import { weathers } from "../../../imports/collections/weather";
import { Meteor } from "meteor/meteor";

const Weather = props => {
  if (props.weathers.length == 0) return <div>No Weather</div>;

  const currentWeather = props.weathers[0];
  return (
    <div id="Weather" className="InfoBlock">
      <h2>Module #{currentWeather.moduleId}</h2>
      <div className="WeatherLabelValue">
        <span className="Label">Température:</span>
        <span className="Value">{currentWeather.temperature}°C</span>
      </div>
      <div className="WeatherLabelValue">
        <span className="Label">Humidité:</span>
        <span className="Value">{currentWeather.humidity}%</span>
      </div>
      <div className="WeatherLabelValue">
        <span className="Label">Pression:</span>
        <span className="Value">{currentWeather.pressure}</span>
      </div>
    </div>
  );
};

export default withTracker(props => {
  // Do all your reactive data access in this method.
  // Note that this subscription will get cleaned up when your component is unmounted
  Meteor.subscribe("currentWeather");

  return { weathers: weathers.find({}).fetch() };
})(Weather);
