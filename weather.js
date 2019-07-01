// Get the latest weather in the weather file
const fs = require('fs');
const lastLine = require('last-line');

// Adds a new weather in the format timestamp;moduleId;temperature;humidityPercent;pressure 
// for the current date and time.
exports.addNewWeather = (weatherData, config, env) => {
    console.log("weather info:" + weatherData);
    if (weatherData == undefined) {
       console.log("No weather found");
       return;
    }
    let weatherEntry = Date.now() + ";" + weatherData + "\r\n";
    fs.open(__dirname + "/" + config.weatherFile[env], 'a', (error, fileDescriptor) => {
        if (error) {
            console.log(error);
            throw error;
        }
        fs.appendFile(fileDescriptor, weatherEntry, 'utf8', (error) => {
            if (error) {
                console.log(error);
                throw error;
            }

            fs.close(fileDescriptor, (error) => {
                if (error) {
                    console.log(error);
                    throw error;
                }
            });
        });
    });
};
// Returns the last weather information
exports.getWeather = (config, env) => {
    let currentWeather = new Object();
    lastLine(__dirname + "/" + config.weatherFile[env], function (err, res) {
        if (res !== undefined) {
            var weatherInfo = res.split(';');
            // Format:timestamp;moduleId;temperature;humidityPercent;pressure 
            currentWeather.moduleId = weatherInfo[1];
            currentWeather.temperature = weatherInfo[2];
            currentWeather.humidity = weatherInfo[3];
            currentWeather.pressure = weatherInfo[4];
            }
        else {
            console.log(err);
        }
        });
    return (currentWeather);
};

