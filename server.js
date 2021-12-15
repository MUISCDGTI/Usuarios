var express = require('express');
var bodyParser = require('body-parser');
const Usuario = require('./usuarios');

var BASE_API_PATH = "/api/v1";

var app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("<html><body><h1>My server</h1></body></html>");
});

app.get(BASE_API_PATH + "/usuarios", (req, res) => {
    console.log(Date() + " - GET /usuarios");

    Usuario.find({}, (err, usuarios) => {
        if (err) {
            console.log(Date() + "-" + err);
            res.sendStatus(500);
        } else {
            res.send(usuarios.map((usuario) => {
                return usuario.cleanup();
            }));
        }
    });

});

app.get(BASE_API_PATH + "/healthz", (req, res) => {
    res.sendStatus(200);
})

app.post(BASE_API_PATH + "/usuarios", (req, res) => {
    console.log(Date() + " - POST /usuarios");
    var usuario = req.body;
    Usuario.create(usuario, (err) => {
        if (err) {
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        } else {
            res.sendStatus(201);
        }
    });
});

module.exports = app;