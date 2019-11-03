import assert from "assert";
import supertest from "supertest";

describe("temperature-logger", function() {
  it("package.json has correct name", async function() {
    const { name } = await import("../package.json");
    assert.strictEqual(name, "temperature-logger");
  });

  if (Meteor.isClient) {
    it("client is not server", function() {
      assert.strictEqual(Meteor.isServer, false);
    });
  }

  if (Meteor.isServer) {
    it("server is not client", function() {
      assert.strictEqual(Meteor.isClient, false);
    });
  }
});

describe("Adds a new temperature/humidity reading to database", () => {
  var base_url;
  var request;

  before(function(done) {
    base_url = "http://localhost:3000";
    request = supertest(base_url);
    done();
  });

  it("returns status 200", async () => {
    await request
      .post("/api/weather")
      .send({ weather: "1;30;90;100" })
      .expect(200);
  });
});
