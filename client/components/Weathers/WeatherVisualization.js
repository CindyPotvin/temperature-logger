import React, { useEffect } from "react";
import { withTranslation } from "react-i18next";
import drawWeatherVisualization from "../../chart/WeatherVisualization.js";

const WeatherVizualization = ({ currentWeatherModule, t }) => {
  useEffect(() => {
    drawWeatherVisualization(currentWeatherModule);
  }, [currentWeatherModule]);

  return (
    <div className="ui piled segment WeatherVizualization">
      <h2 className="ui header">
        {t("WeatherVisualization.visualization-title")}
        {t("common.module-title", { currentWeatherModule })}
      </h2>
      <div
        className="chart-container"
        style={{ position: "relative", height: "60vh", width: "100%" }}
      >
        <canvas id="myChart"></canvas>
      </div>
    </div>
  );
};

export default withTranslation()(WeatherVizualization);
