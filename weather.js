// Get the latest weather in the weather file
const fs = require('fs');
const readLastLines = require('read-last-lines');
const path = require('path');

// Adds a new weather in the format timestamp;moduleId;temperature;humidityPercent;pressure 
// for the current date and time.
exports.addNewWeather = (weatherData, config, env) => {
    console.log("weather info:" + weatherData);
    if (weatherData == undefined) {
       console.log("No weather found");
       return;
    }
    let weatherEntry = Date.now() + ";" + weatherData + "\n";
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
exports.getWeather = async (config, env) => {
    var currentWeather = new Object();
    const line = await readLastLines.read(path.join(__dirname, config.weatherFile[env]), 1);

    const weatherInfo = line.trim().split(';');
    // Format:timestamp;moduleId;temperature;humidityPercent;pressure 
    currentWeather.moduleId = weatherInfo[1];
    currentWeather.temperature = weatherInfo[2];
    currentWeather.humidity = weatherInfo[3];
    currentWeather.pressure = weatherInfo[4];  

    return (currentWeather);
};

