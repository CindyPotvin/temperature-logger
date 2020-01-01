import React, { useEffect } from "react";
import drawWeatherVisualization from "../../chart/WeatherVisualization.js";

const WeatherVizualization = props => {
  useEffect(() => {
    drawWeatherVisualization(props);
  }, [props]);

  return (
    <div className="ui piled segment WeatherVizualization">
      <h2 className="ui header">
        Temperature for the last 30 days for module #{props.currentWeatherModule.moduleId} -{" "}
        {props.currentWeatherModule.description}
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

export default WeatherVizualization;
