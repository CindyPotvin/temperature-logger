const app = require('./app');

// Starts the application and listen to requests
app.listen(4444, function () {
    console.log('Listening on http://localhost:' + (4444))
    });
