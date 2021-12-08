var express = require('express');
var bodyParser = require('body-parser');
var DataStore = require('nedb');

var port = 3001;
var BASE_APPI_PATH = "/api/v1";
var DB_FILE_NAME= __dirname + "/usuarios.json"

console.log("Starting API server...");

var app = express();
app.use(bodyParser.json()); 

var db = new DataStore({
    filename: DB_FILE_NAME,
    autoload: true
})

app.get("/", (req, res) => {
    res.send("<html><body><h1>My server</html></body></h1>");
});

app.get(BASE_APPI_PATH + "/usuarios", (req, res) => {
    console.log(Date() + " - GET /usuarios");
    res.send([]);
});

app.post(BASE_APPI_PATH + "/usuarios", (req, res) => {
    console.log(Date() + " - POST /usuarios");
    var usuario = req.body;
    db.insert(usuario, (err) => {
        if(err){
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        }else{
            res.sendStatus(201);
        }
    });
});

app.listen(port);

console.log("Server ready!");