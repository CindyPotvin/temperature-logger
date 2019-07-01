const request = require('supertest'); /* Engine to test http requests */
const app = require('../app');

let agent, server;

describe("Adds a new temperature/humidity reading to file", () => {
    // Hooks - Before All
    beforeAll(async () => {
      await new Promise((resolve, reject) => {
          server = app.listen(4444, (err) => {
              if (err) 
                return reject(err);

              resolve();
          });
      });
      agent = request.agent(server);
    });

    afterAll(async (done) => {
      await new Promise((resolve, reject) => server.close((err) => {
          if (err) 
            return reject(err);
          // SetImmediate priorise the done operation, otherwise a "handle not closed" warning is shown.  
          setImmediate(done);
          resolve();
      }));
    });

    test("returns status 200 and saved info", async () => {
      await agent.post("/api/weather")
                         .send({ weather: "1;30;90;30" })
                         .expect(200);
    });
});