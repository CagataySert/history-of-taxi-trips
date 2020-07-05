const { expect, describe, it } = require("@jest/globals");
const request = require("supertest");

const app = require("../app");

let token;

beforeAll((done) => {
  request(app)
    .post("/login")
    .send({
      username: "admin",
      password: "123456",
    })
    .end((err, response) => {
      token = response.body.token; // save the token!
      done();
    });
});

describe("readMaxMinDistanceTravelled endpoint", () => {
  it("should return 400 with incorrect start.long", async () => {
    const result = await request(app)
      .get("/api/trip/readMaxMinDistanceTravelled")
      .set("Authorization", `Bearer ${token}`)
      .send({
        start: {
          long: "incorrect long",
          lat: 31.17821068,
        },
        radius: 5,
      });
    expect(result.status).toEqual(400);
    expect(result.body.status).toEqual(false);
    expect(result.body.message).toEqual({ start: "number.base" });
  });

  it("should return 400 with incorrect start.lat", async () => {
    const result = await request(app)
      .get("/api/trip/readMaxMinDistanceTravelled")
      .set("Authorization", `Bearer ${token}`)
      .send({
        start: {
          long: -97.38887025,
          lat: "incorrect lat",
        },
        radius: 5,
      });
    expect(result.status).toEqual(400);
    expect(result.body.status).toEqual(false);
    expect(result.body.message).toEqual({ start: "number.base" });
  });

  it("should return 400 with incorrect radius", async () => {
    const result = await request(app)
      .get("/api/trip/readMaxMinDistanceTravelled")
      .set("Authorization", `Bearer ${token}`)
      .send({
        start: {
          long: -97.38887025,
          lat: 31.17821068,
        },
        radius: "incorrect radius",
      });
    expect(result.status).toEqual(400);
    expect(result.body.status).toEqual(false);
    expect(result.body.message).toEqual({ radius: "number.base" });
  });

  it("should return 200 with correct values", async () => {
    const result = await request(app)
      .get("/api/trip/readMaxMinDistanceTravelled")
      .set("Authorization", `Bearer ${token}`)
      .send({
        start: {
          long: -97.38887025,
          lat: 31.17821068,
        },
        radius: 5,
      });
    expect(result.status).toEqual(200);
    expect(result.body.status).toEqual(true);
    expect(Number.isInteger(result.body.max)).toEqual(true);
    expect(Number.isInteger(result.body.min)).toEqual(true);
  });
});

describe("readGroupedByYear endpoint", () => {
  it("should return 400 with incorrect start.long", async () => {
    const result = await request(app)
      .get("/api/trip/readGroupedByYear")
      .set("Authorization", `Bearer ${token}`)
      .send({
        start: {
          long: "incorrect long",
          lat: 31.17821068,
        },
        radius: 5,
      });
    expect(result.status).toEqual(400);
    expect(result.body.status).toEqual(false);
    expect(result.body.message).toEqual({ start: "number.base" });
  });

  it("should return 400 with incorrect start.lat", async () => {
    const result = await request(app)
      .get("/api/trip/readGroupedByYear")
      .set("Authorization", `Bearer ${token}`)
      .send({
        start: {
          long: -97.38887025,
          lat: "incorrect lat",
        },
        radius: 5,
      });
    expect(result.status).toEqual(400);
    expect(result.body.status).toEqual(false);
    expect(result.body.message).toEqual({ start: "number.base" });
  });

  it("should return 400 with incorrect radius", async () => {
    const result = await request(app)
      .get("/api/trip/readGroupedByYear")
      .set("Authorization", `Bearer ${token}`)
      .send({
        start: {
          long: -97.38887025,
          lat: 31.17821068,
        },
        radius: "incorrect radius",
      });
    expect(result.status).toEqual(400);
    expect(result.body.status).toEqual(false);
    expect(result.body.message).toEqual({ radius: "number.base" });
  });

  it("should return 200 with correct values", async () => {
    const result = await request(app)
      .get("/api/trip/readGroupedByYear")
      .set("Authorization", `Bearer ${token}`)
      .send({
        start: {
          long: -97.38887025,
          lat: 31.17821068,
        },
        radius: 5,
      });
    expect(result.status).toEqual(200);
    expect(result.body.status).toEqual(true);
    expect(Array.isArray(result.body.trips)).toBe(true);
  });
});
