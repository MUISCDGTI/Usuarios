var express = require('express');
var bodyParser = require('body-parser');
var DataStore = require('nedb');

var port = 3000;
var BASE_API_PATH = "/api/v1";
var DB_FILE_NAME = __dirname + "/usuarios.json";

console.log("Starting API server...");

var app = express();
app.use(bodyParser.json());

var db = new DataStore({
    filename: DB_FILE_NAME,
    autoload: true
});

app.get("/", (req, res) => {
    res.send("<html><body><h1>My server</h1></body></html>");
});

app.get(BASE_API_PATH + "/healthz", (req, res) => {
    res.sendStatus(200);
});

app.get(BASE_API_PATH + "/usuarios", (req, res) => {
    console.log(Date() + " - GET /usuarios");

    db.find({}, (err, usuarios) => {
        if (err) {
            console.log(Date() + "-" + err);
            res.sendStatus(500);
        } else {
            res.send(usuarios.map((usuario) => {
                delete usuario._id;
                return usuario;
            }));
        }
    });

});

app.post(BASE_API_PATH + "/usuarios", (req, res) => {
    console.log(Date() + " - POST /usuarios");
    var usuario = req.body;
    db.insert(usuario, (err) => {
        if (err) {
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        } else {
            res.sendStatus(201);
        }
    });
});

app.listen(port);

console.log("Server ready!");