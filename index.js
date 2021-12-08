var express = require('express');
var bodyParser = require('body-parser');
var DataStore = require('nedb');

var port = 3000;
var BASE_APPI_PATH = "/api/v1";
var DB_FILE_NAME= __dirname + "/usuarios.json"

console.log("Starting API server...");

var app = express();
app.use(bodyParser.json()); 

app.get("/", (req, res) => {
    res.send("<html><body><h1>My server</html></body></h1>");
});

app.get(BASE_APPI_PATH + "/usuarios", (req, res) => {
    console.log(Date() + " - GET /contacts");
    res.send(usuarios);
});

app.post(BASE_APPI_PATH + "/usuarios", (req, res) => {
    console.log(Date() + " - POST /contacts");
    var usuario = req.body;
    usuarios.push(usuario);
    res.sendStatus(201);
});

app.listen(port);

console.log("Server ready!");