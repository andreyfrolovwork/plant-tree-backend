const request = require("supertest")
const app = require("../app/app.js")
const { v1 } = require("uuid")
const mongoose = require("mongoose")
const { faker } = require("@faker-js/faker")
const wait = require("../shared/wait.js")

let server

beforeAll(async () => {
  server = await request(app)
})

afterAll(async () => {
  await mongoose.disconnect()
})

describe("check_auth", () => {

  test("/test - simple test", async () => {
    const res = await request(app).get("/api/test")
    expect(res._body).toBe("ok")
  })

  test("/test-auth - without auth", async () => {
    const res = await request(app).get("/api/test-auth")
    expect(res.statusCode).toBe(401)
  })


  test("/signup - create new user and login and test private route with new credentials", async () => {
    const NewUser = {
      email: faker.internet.email(),
      password: v1(),
    }
    const res = await request(app).post("/api/signup").send(NewUser)
    const userReturn = { ...res._body }
    expect(res._body).toHaveProperty("accessToken")
    expect(res._body).toHaveProperty("refreshToken")
    expect(res.statusCode).toBe(200)

    const res2 = await request(app).post("/api/login").send(NewUser)
    expect(res2._body).toHaveProperty("accessToken")
    expect(res2._body).toHaveProperty("refreshToken")
    expect(res2.statusCode).toBe(200)

    const res3 = await request(app)
      .get("/api/test-auth")
      .set({
        Authorization: `Bearer ${userReturn.accessToken}`,
      })
      .send(NewUser)
    expect(res3._body).toEqual("ok")

  })


  test("check accessToken expired", async () => {
    // change env
    process.env = Object.assign(process.env, {
      EXPIRES_IN_ACCESS_TOKEN: "1s",
      EXPIRES_IN_REFRESH_TOKEN: "1h",
    })
    // fake user
    const user2 = {
      email: faker.internet.email(),
      password: v1(),
    }
    // first response
    const res = await server.post("/api/signup").send(user2)
    const cookie = Object.assign(res["res"]["headers"]["set-cookie"][0])
    expect(res._body).toHaveProperty("accessToken")
    expect(res._body).toHaveProperty("refreshToken")
    // should success request
    const restTestAuthNoTExpired = await server.get("/api/test-auth").set({
      Authorization: `Bearer ${res._body.accessToken}`,
    })
    expect(restTestAuthNoTExpired.statusCode).toEqual(200)
    expect(restTestAuthNoTExpired._body).toEqual("ok")
    await wait(2000)
    // expect unsuccessful response with expired access token
    const restTestAuthExpired = await server.get("/api/test-auth").set({
      Authorization: `Bearer ${res._body.accessToken}`,
    })
    expect(restTestAuthExpired.statusCode).toEqual(401)
    // refresh
    const resRefresh = await server.get("/api/refresh").set("Cookie", cookie)
    expect(resRefresh._body).toHaveProperty("accessToken")
    expect(resRefresh._body).toHaveProperty("refreshToken")
    // should success request after refresh
    const afterRefresh = await server.get("/api/test-auth").set({
      Authorization: `Bearer ${resRefresh._body.accessToken}`,
    })
    expect(afterRefresh.statusCode).toEqual(200)
    expect(afterRefresh._body).toEqual("ok")
  })

  test("check refreshToken expired", async () => {
    // change env
    process.env = Object.assign(process.env, {
      EXPIRES_IN_ACCESS_TOKEN: "1s",
      EXPIRES_IN_REFRESH_TOKEN: "2s",
    })
    // fake user
    const user = {
      email: faker.internet.email(),
      password: v1(),
    }
    // registration
    const res = await server.post("/api/signup").send(user)
    expect(res._body).toHaveProperty("accessToken")
    expect(res._body).toHaveProperty("refreshToken")
    const cookie = Object.assign(res["res"]["headers"]["set-cookie"][0])
    // should be success response with fresh tokens
    const restTestAuthNoTExpired = await server.get("/api/test-auth").set({
      Authorization: `Bearer ${res._body.accessToken}`,
    })
    expect(restTestAuthNoTExpired.statusCode).toEqual(200)
    expect(restTestAuthNoTExpired._body).toEqual("ok")
    await wait(2000)
    // after wait should 401 status with expired access token
    const restTestAuthExpired = await server.get("/api/test-auth").set({
      Authorization: `Bearer ${res._body.accessToken}`,
    })
    expect(restTestAuthExpired.statusCode).toEqual(401)
    // should be 401 status with expired refresh token
    const resRefresh = await server.get("/api/refresh").set("Cookie", cookie)
    expect(resRefresh.statusCode).toEqual(401)
    // logged in and got new tokens
    const resLogin = await server.post("/api/login").send(user)
    expect(resLogin._body).toHaveProperty("accessToken")
    expect(resLogin._body).toHaveProperty("refreshToken")
    // should be successful response
    const afterLogin = await server.get("/api/test-auth").set({
      Authorization: `Bearer ${resLogin._body.accessToken}`,
    })
    expect(afterLogin.statusCode).toEqual(200)
    expect(afterLogin._body).toEqual("ok")
  })
})
