const app = require('../server.js');
const Usuario = require('../usuarios.js');
const request = require('supertest');

describe("Hello world tests", () => {

    it("Should do an stupid test", () => {
        const a = 5;
        const b = 3;
        const sum = a + b;

        expect(sum).toBe(8);
    });

});

describe("Usuarios API", () => {
    describe("GET /", () => {
        it("Should return an HTML document", () => {
            return request(app).get("/").then((response) => {
                expect(response.status).toBe(200);
                expect(response.type).toEqual(expect.stringContaining("html"));
                expect(response.text).toEqual(expect.stringContaining("h1"));
            });
        });
    });

    describe("GET /usuarios", () => {

        beforeAll(() => {            
            const usuarios = [
                new Usuario({"name": "juan", "phone": "5555"}),
                new Usuario({"name": "pepe", "phone": "6666"})
            ];

            dbFind = jest.spyOn(Usuario, "find");
            dbFind.mockImplementation((query, callback) => {
                callback(null, usuarios);
            });
        });

        it('Should return all usuarios', () => {
            return request(app).get('/api/v1/usuarios').then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toBeArrayOfSize(2);
                expect(dbFind).toBeCalledWith({}, expect.any(Function));
            });
        });
    });

    describe('POST /usuarios', () => {
        const usuario = {name: "juan", phone: "6766"};
        let dbInsert;

        beforeEach(() => {
            dbInsert = jest.spyOn(Usuario, "create");
        });

        it('Should add a new usuario if everything is fine', () => {
            dbInsert.mockImplementation((c, callback) => {
                callback(false);
            });

            return request(app).post('/api/v1/usuarios').send(usuario).then((response) => {
                expect(response.statusCode).toBe(201);
                expect(dbInsert).toBeCalledWith(usuario, expect.any(Function));
            });
        });

        it('Should return 500 if there is a problem with the DB', () => {
            dbInsert.mockImplementation((c, callback) => {
                callback(true);
            });

            return request(app).post('/api/v1/usuarios').send(usuario).then((response) => {
                expect(response.statusCode).toBe(500);
            });
        });
    });
});