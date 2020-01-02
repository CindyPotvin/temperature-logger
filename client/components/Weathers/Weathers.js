import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import WeatherVizualization from "./WeatherVisualization";
import { withTracker } from "meteor/react-meteor-data";
import { weathers } from "../../../imports/collections/weather";
import { weatherModules } from "../../../imports/collections/weatherModule";
import { Meteor } from "meteor/meteor";

const Weathers = props => {
  let findWeatherModule = moduleIdToFind => {
    return props.weatherModules.find(weatherModule => weatherModule.moduleId === moduleIdToFind);
  };

  const { t } = useTranslation();
  let firstWeatherModule = findWeatherModule(
    props.weathers.length > 0 ? props.weathers[0].moduleId : ""
  );
  console.log(firstWeatherModule);
  const [selectedModule, setSelectedModule] = useState(firstWeatherModule);
  React.useEffect(() => {
    setSelectedModule(firstWeatherModule);
  }, [props.weathers]);

  console.log(props.weathers);
  console.log(selectedModule);
  // If no weather information found, just display a message
  if (!selectedModule) return <div>No Weather</div>;

  return (
    <div className="ui cards">
      {props.weathers.map(currentWeather => {
        let currentWeatherModule = findWeatherModule(currentWeather.moduleId);

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
              <div className="header">{t("common.module-title", { currentWeatherModule })}</div>
            </div>
            <div className="WeatherLabelValue content">
              <span className="Label">{t("Weathers.temperature")}</span>
              <span className="Value">{currentWeather.temperature}°C</span>
            </div>
            <div className="WeatherLabelValue content">
              <span className="Label">{t("Weathers.humidity")}</span>
              <span className="Value">{currentWeather.humidity}%</span>
            </div>
            <div className="WeatherLabelValue content">
              <span className="Label">{t("Weathers.pressure")}</span>
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
