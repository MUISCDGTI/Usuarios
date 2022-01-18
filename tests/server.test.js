jest.mock('../authenticationMiddleware', () => jest.fn((req, res, next) => next()));
const app = require('../index');
const request = require('supertest');
const User = require('../users');
let authenticateTokenMiddleware = require('../authenticationMiddleware');

describe("Users API", () => {
  describe("GET /", () => {
    it("Should return an HTML document", () => {
      return request(app).get("/").then((res) => {
        expect(res.status).toBe(200);
        expect(res.type).toEqual(expect.stringContaining("html"));
        expect(res.text).toEqual(expect.stringContaining("h1"));
      });
    });
  });
  describe("GET /api/v1/healthz", () => {
    it("Should return a 200 status", () => {
      return request(app).get("/api/v1/healthz").then((res) => {
        expect(res.status).toBe(200);
      });
    });
  });
  describe("GET /api/v1/users", () => {
    it("Should return a list of users", () => {
      const users = [
        { "_id": "id1", "name": "name1", "email": "email1@example.com", "password": "" },
        { "_id": "id2", "name": "name2", "email": "email2@example.com", "password": "" }
      ];
      users.forEach(usr => usr.cleanup = () => {
        return { id: usr._id, email: usr.email, name: usr.name };
      });
      jest.spyOn(User, "find").mockImplementation((query, callback) => {
        callback(null, users);
      });
      return request(app).get("/api/v1/users").then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(users.length);
      });
    });
    it("Should return 500 error", () => {
      jest.spyOn(User, "find").mockImplementation((query, callback) => {
        callback(true, users);
      });
      return request(app).get("/api/v1/users").then((res) => {
        expect(res.status).toBe(500);
      });
    });
  });
  describe("POST /api/v1/users", () => {
    it("Should return a new user", () => {
      const userIn = {
        "name": "name1", "email": "email1@example.com", "password": "password"
      };
      const newId = "new_id";
      const userOut = {
        "_id": newId, "name": "name1", "email": "email1@example.com", "password": "password", cleanup: function () { return { id: this._id, email: this.email, name: this.name }; }
      };

      jest.spyOn(User, "create").mockImplementation((usuario, callback) => {
        callback(null, userOut);
      });
      return request(app).post("/api/v1/users").send(userIn).then((res) => {
        expect(res.status).toBe(201);
        expect(res.body.id).toBe(newId);
      });
    });
    it("Should return 500 error", () => {
      const userIn = {
        "name": "name1", "email": "email1@example.com", "password": "password"
      };

      jest.spyOn(User, "create").mockImplementation((usuario, callback) => {
        callback(true, null);
      });
      return request(app).post("/api/v1/users").send(userIn).then((res) => {
        expect(res.status).toBe(500);
      });
    });
  });
  describe("PUT /api/v1/users/:id", () => {
    it("Should return a modified user", () => {
      const userId = "id";
      const userIn = {
        "name": "newName1", "email": "newEmail1@example.com", "password": "newPassword"
      };
      const userOut = {
        "id": userId, "name": "newName1", "email": "newEmail1@example.com"
      };

      jest.spyOn(User, "findByIdAndUpdate").mockImplementation((id, usuario, callback) => {
        callback(null);
      });
      return request(app).put("/api/v1/users/" + userId).send(userIn).then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual(userOut);
      });
    });
    it("Should return 500 error", () => {
      const userId = "id";
      const userIn = {
        "name": "name1", "email": "email1@example.com", "password": "password"
      };

      jest.spyOn(User, "findByIdAndUpdate").mockImplementation((id, usuario, callback) => {
        callback(true);
      });
      return request(app).put("/api/v1/users/" + userId).send(userIn).then((res) => {
        expect(res.status).toBe(500);
      });
    });
    it("Should return 400 error (name)", () => {
      const userId = "id";
      const userIn = { "email": "email1@example.com", "password": "password" };

      return request(app).put("/api/v1/users/" + userId).send(userIn).then((res) => {
        expect(res.status).toBe(400);
      });
    });
    it("Should return 400 error (email)", () => {
      const userId = "id";
      const userIn = { "name": "newName1", "password": "password" };

      return request(app).put("/api/v1/users/" + userId).send(userIn).then((res) => {
        expect(res.status).toBe(400);
      });
    });
    it("Should return 400 error (password)", () => {
      const userId = "id";
      const userIn = { "name": "newName1", "email": "email1@example.com" };

      return request(app).put("/api/v1/users/" + userId).send(userIn).then((res) => {
        expect(res.status).toBe(400);
      });
    });
  });
  describe("DELETE /api/v1/users/:id", () => {
    it("Should return a modified user", () => {
      const userId = "id";

      jest.spyOn(User, "findByIdAndDelete").mockImplementation((id, callback) => {
        callback(null);
      });
      return request(app).delete("/api/v1/users/" + userId).then((res) => {
        expect(res.status).toBe(204);
      });
    });
    it("Should return 500 error", () => {
      const userId = "id";

      jest.spyOn(User, "findByIdAndDelete").mockImplementation((id, callback) => {
        callback(true);
      });
      return request(app).delete("/api/v1/users/" + userId).then((res) => {
        expect(res.status).toBe(500);
      });
    });
  });
});