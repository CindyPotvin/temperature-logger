import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import WeatherVizualization from "./WeatherVisualization";
import { withTracker } from "meteor/react-meteor-data";
import { weathers } from "../../../imports/collections/weather";
import { weatherModules } from "../../../imports/collections/weatherModule";
import { Meteor } from "meteor/meteor";

const Weathers = (props) => {
   let findWeather = (moduleIdToFind) => {
      return props.weathers.find((weather) => weather.moduleId === moduleIdToFind);
   };

   const { t } = useTranslation();

   const [selectedModule, setSelectedModule] = useState("");
   const [lastUpdated, setLastUpdated] = useState("");

   React.useEffect(() => {
      if (!selectedModule) {
         let firstWeatherModule = props.weatherModules.length > 0 ? props.weatherModules[0] : "";
         setSelectedModule(firstWeatherModule);
      }
   }, [props.weatherModules]);

   React.useEffect(() => {
      if (props.weathers && props.weathers.length > 0) {
         setLastUpdated(props.weathers[props.weathers.length - 1].createdAt.toLocaleString());
      } else {
         setLastUpdated("");
      }
   }, [props.weathers]);

   // If no weather information found, just display a message
   if (!selectedModule || props.weathers.length == 0) return <div>No Weather</div>;

   return (
      <div>
         <div className="WeatherLastUpdated">
            {t("Weathers.updated-at")}
            {lastUpdated}
         </div>
         <div className="ui cards">
            {props.weatherModules.map((currentWeatherModule) => {
               let currentWeather = findWeather(currentWeatherModule.moduleId);
               var weatherCardClass = classNames("ui", "card", {
                  green: currentWeatherModule.moduleId == selectedModule.moduleId,
               });
               return (
                  <div
                     className={weatherCardClass}
                     key={currentWeatherModule.moduleId}
                     onClick={() => {
                        setSelectedModule(currentWeatherModule);
                     }}>
                     <div className="content">
                        <div className="header">
                           {t("common.module-title", { currentWeatherModule })}
                        </div>
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
      </div>
   );
};

export default withTracker((props) => {
   // Do all your reactive data access in this method.
   // Note that this subscription will get cleaned up when your component is unmounted
   Meteor.subscribe("currentWeathers");
   Meteor.subscribe("modules");

   return { weathers: weathers.find({}).fetch(), weatherModules: weatherModules.find({}).fetch() };
})(Weathers);
