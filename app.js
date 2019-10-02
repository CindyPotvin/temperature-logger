const express = require('express');  /*Web framework for Node*/
const bodyParser = require('body-parser'); /* Parses incoming requests (for json)*/
const morgan  = require('morgan') /* Show access logs in console */
const app = express();

const config = require('./config/config.js');
const weather = require('./weather.js');

app.use(morgan('combined'));
app.use(express.static(__dirname + '/static'));
app.use(bodyParser.json());

app.get('/api/hello', (request, response) => {
    response.send({ express: 'Hello From Express' });
});
  
// Adds the latest temperature and humidity to file
app.post('/api/weather', (request, response) => {
    const weatherData = request.body.weather;
    weather.addNewWeather(weatherData, config, app.settings.env);
    response.end();
});

// Gets the latest temperature and humidity from file
app.get('/api/weather', async (request, response) => {
    const currentWeather = await weather.getWeather(config, app.settings.env);
    console.log(currentWeather);
    response.send(currentWeather);
});

module.exports = app;
