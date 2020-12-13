import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import classNames from "classnames";
import { drawWeatherVisualization, AXIS_TYPES } from "../../chart/WeatherVisualization.js";

const WeatherVizualization = ({ currentWeatherModule, t }) => {
   const [axisType, setAxisType] = useState(AXIS_TYPES[0]);

   useEffect(() => {
      drawWeatherVisualization(currentWeatherModule, axisType);
   }, [currentWeatherModule, axisType]);

   const axisSelectionButtons = () => {
      return AXIS_TYPES.map((currentType) => {
         return (
            <button
               className="ui button"
               key={currentType}
               onClick={() => {
                  setAxisType(currentType);
               }}
               className={classNames("ui", "button", { active: currentType === axisType })}>
               {t("WeatherVisualization." + currentType)}
            </button>
         );
      });
   };

   return (
      <div className="ui piled segment WeatherVizualization">
         <h2 className="ui header">
            {t("WeatherVisualization.visualization-title")}
            {t("common.module-title", { currentWeatherModule })}
         </h2>
         <div className="ui buttons">{axisSelectionButtons()}</div>
         <div
            className="chart-container"
            style={{ position: "relative", height: "60vh", width: "100%" }}>
            <canvas id="myChart"></canvas>
         </div>
      </div>
   );
};

export default withTranslation()(WeatherVizualization);
