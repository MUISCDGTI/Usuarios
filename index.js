var express = require('express');
var bodyParser = require('body-parser');

var port = 3000;
var BASE_API_PATH = "/api/v1";

const dbConnect = require('./db');
const User = require('./users');

console.log("Starting API server...");

var app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("<html><body><h1>My server</h1></body></html>");
});

app.get(BASE_API_PATH + "/healthz", (req, res) => {
    res.sendStatus(200);
});

app.get(BASE_API_PATH + "/usuarios", (req, res) => {
    console.log(Date() + " - GET /usuarios");

    User.find({}, (err, usuarios) => {
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

app.post(BASE_API_PATH + "/usuarios", (req, res) => {
    console.log(Date() + " - POST /usuarios");
    var usuario = req.body;
    User.create(usuario, (err) => {
        if (err) {
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        } else {
            res.sendStatus(201);
        }
    });
});

dbConnect().then(
    () => {
        app.listen(port);
        console.log('Server ready!');
    },
    err => {
        console.log('Connection error: ' + err);
    }
);