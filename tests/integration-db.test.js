const Usuario = require('../usuarios');
const mongoose = require('mongoose');
const dbConnect = require('../db');

describe('Usuarios DB connection', () => {
    beforeAll(() => {
        return dbConnect();
    })

    beforeEach((done) => {
        Usuario.deleteMany({}, (err) => {
            done();
        });
    });

    it('writes a usuario in the DB', (done) => {
        const usuario = new Usuario({name: 'pepe', phone: '666'});
        usuario.save((err, usuario) => {
            expect(err).toBeNull();
            Usuario.find({}, (err, usuarios) => {
                expect(usuarios).toBeArrayOfSize(1);
                done();
            });
        });
    });

    afterAll((done) => {
        mongoose.connection.db.dropDatabase(() => {
            mongoose.connection.close(done);
        });
    });

})