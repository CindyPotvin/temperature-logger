import Chart from "chart.js";
import axios from "axios";

const drawWeatherVisualization = async currentWeatherModule => {
  var ctx = document.getElementById("myChart").getContext("2d");
  let response;
  try {
    response = await axios.get("/api/temperatureHistory?moduleId=" + currentWeatherModule.moduleId);
  } catch (error) {
    console.error(error);
  }
  var myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: response.data.labels,
      datasets: [
        {
          label: "Maximum",
          data: response.data.maximumTemperatureData,
          fill: false,
          borderColor: "rgb(245, 99, 66)",
          lineTension: 0.1
        },
        {
          label: "Minimum",
          data: response.data.minimumTemperatureData,
          fill: false,
          borderColor: "rgb(75, 66, 245)",
          lineTension: 0.1
        }
      ]
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      layout: {
        padding: {
          right: 40
        }
      },
      scales: {
        xAxes: [
          {
            type: "time",
            time: {
              unit: "day",
              round: "day",
              displayFormats: {
                day: "D/M"
              },
              ticks: {
                suggestedMin: new Date(new Date() - 30 * 24 * 60 * 60 * 1000),
                suggestedMax: new Date(),
                source: "auto"
              }
            }
          }
        ],
        yAxes: [
          {
            ticks: {
              suggestedMin: -40,
              suggestedMax: 40
            }
          }
        ]
      }
    }
  });
};

export default drawWeatherVisualization;
