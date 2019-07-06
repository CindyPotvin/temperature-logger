const request = require("supertest"); /* Engine to test http requests */
const app = require("../app");

let agent, server;

describe("Adds a new temperature/humidity reading to file and read it", () => {
  // Hooks - Before All
  beforeAll(async () => {
    await new Promise((resolve, reject) => {
      server = app.listen(4444, err => {
        if (err) return reject(err);

        resolve();
      });
    });
    agent = request.agent(server);
  });

  afterAll(async done => {
    await new Promise((resolve, reject) =>
      server.close(err => {
        if (err) return reject(err);
        // SetImmediate priorise the done operation, otherwise a "handle not closed" warning is shown.
        setImmediate(done);
        resolve();
      })
    );
  });

  test("returns status 200 and saved info", async () => {
    await agent
      .post("/api/weather")
      .send({ weather: "1;30;90;100" })
      .expect(200);
  });

  test("returns status 200 and last weather info", async () => {
    await agent
      .get("/api/weather")
      .type("json")
      .send()
      .expect(200, { moduleId: "1", temperature: "30", humidity: "90", pressure: "100" });
  });
});
