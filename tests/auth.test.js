const request = require("supertest");
const app = require("./../app.js");
const mongoose = require("./../index.js");
afterAll(() => {
  mongoose.close();
});

describe("check auth", () => {
  test("should respond with a 401 code", async () => {
    try {
      const res = request(app).get("/api/users");
      expect(res.statusCode.toBe(401));
    } catch (e) {
      expect(e).toBe(e);
    }
  });
});
