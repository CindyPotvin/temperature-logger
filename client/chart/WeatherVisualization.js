import Chart from "chart.js";
import axios from "axios";

/**
Shows the weather information using Chart.js, querying the information from the backend.
@param {object} currentWeatherModule - Information about the module used to display the data.
@param {string} axisType - The X axis to display the data. Supported types: last_hour, last_day and last_30_days
*/

export const AXIS_TYPES = ["last_30_days", "last_hour", "last_day"];

export const drawWeatherVisualization = async (currentWeatherModule, axisType) => {
   var ctx = document.getElementById("myChart").getContext("2d");
   let response;
   try {
      response = await axios.get(
         "/api/temperatureHistory?moduleId=" + currentWeatherModule.moduleId
      );
      console.log(response);
   } catch (error) {
      console.error(error);
   }

   let axis = {};

   axis.last_hour = {
      type: "time",
      time: {
         unit: "minute",
         round: "minute",
         displayFormats: {
            day: "h:mm a",
         },
         ticks: {
            suggestedMin: new Date(new Date() - 60 * 60 * 1000),
            suggestedMax: new Date(),
            source: "auto",
         },
      },
   };

   axis.last_day = {
      type: "time",
      time: {
         unit: "hour",
         round: "hour",
         displayFormats: {
            day: "h:mm a",
         },
         ticks: {
            suggestedMin: new Date(new Date() - 24 * 60 * 60 * 1000),
            suggestedMax: new Date(),
            source: "auto",
         },
      },
   };

   axis.last_30_days = {
      type: "time",
      time: {
         unit: "day",
         round: "day",
         displayFormats: {
            day: "D/M",
         },
         ticks: {
            suggestedMin: new Date(new Date() - 30 * 24 * 60 * 60 * 1000),
            suggestedMax: new Date(),
            source: "auto",
         },
      },
   };
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
               lineTension: 0.1,
            },
            {
               label: "Minimum",
               data: response.data.minimumTemperatureData,
               fill: false,
               borderColor: "rgb(75, 66, 245)",
               lineTension: 0.1,
            },
         ],
      },
      options: {
         maintainAspectRatio: false,
         responsive: true,
         layout: {
            padding: {
               right: 40,
            },
         },
         scales: {
            xAxes: [{ ...axis[axisType] }],
            yAxes: [
               {
                  ticks: {
                     suggestedMin: -40,
                     suggestedMax: 40,
                  },
               },
            ],
         },
      },
   });
};
