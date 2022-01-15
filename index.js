var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');

var port = 3000;
var BASE_API_PATH = "/api/v1";
var ACCESS_TOKEN_SECRET = (process.env.ACCESS_TOKEN_SECRET || "CHANGE_THIS_SUPER_SECRET_ACCESS_TOKEN_SECRET");
var REFRESH_TOKEN_SECRET = (process.env.REFRESH_TOKEN_SECRET || "CHANGE_THIS_SUPER_SECRET_ACCESS_TOKEN_SECRET");

const dbConnect = require('./db');
const User = require('./users');
const RefreshToken = require('./refreshTokens');

console.log("Starting API server...");

var app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("<html><body><h1>My server</h1></body></html>");
});

app.get(BASE_API_PATH + "/healthz", (req, res) => {
    res.sendStatus(200);
});

app.get(BASE_API_PATH + "/usuarios", authenticateTokenMiddleware, (req, res) => {
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

app.put(BASE_API_PATH + "/usuarios/:id", authenticateTokenMiddleware, (req, res) => {
    const { id } = req.params;
    const { email, name, password } = req.body;
    console.log(`${Date()} - PUT /usuarios/${id}`);
    User.findByIdAndUpdate(id, { email, name, password }, (err) => {
        if (err) {
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

app.delete(BASE_API_PATH + "/usuarios/:id", authenticateTokenMiddleware, (req, res) => {
    const { id } = req.params;
    console.log(`${Date()} - DELETE /usuarios/${id}`);
    User.findByIdAndDelete(id, (err) => {
        if (err) {
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        } else {
            res.sendStatus(204);
        }
    });
});

app.post("/login", async (req, res) => {
    console.log(`${Date()} - POST /login`);

    const username = req.body.username;
    const userPassword = req.body.password;

    User.findOne({ name: username }, async (err, usr) => {
        if (err) return res.sendStatus(500);
        if (!usr) return res.sendStatus(403);

        const isCorrectPassword = await usr.comparePassword(userPassword);
        if (!isCorrectPassword) return res.sendStatus(403);

        const userInfo = { username };

        const accessToken = generatePermanentAccessToken(userInfo);
        const refreshToken = generateRefreshToken(userInfo);

        RefreshToken.create({ value: refreshToken }, (err) => {
            if (err) {
                console.log(Date() + " - " + err);
                res.sendStatus(500);
            } else {
                res.json({ accessToken, refreshToken });
            }
        });
    });

});

app.post('/token', (req, res) => {
    console.log(`${Date()} - POST /token`);
    const refreshToken = req.body.token;

    RefreshToken.find({ value: refreshToken }, (err, tokens) => {
        if (err) {
            console.log(Date() + "-" + err);
            res.sendStatus(500);
        } else {
            if (!tokens.length) return res.sendStatus(403);
            jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (error, usr) => {
                if (error) return res.sendStatus(403);
                const accessToken = generateAccessToken({ username: usr.name });
                res.json({ accessToken });
            });
        }
    });
});

app.delete("/logout", (req, res) => {
    console.log(`${Date()} - POST /logout`);
    const refreshToken = req.body.token;
    RefreshToken.deleteMany({ value: refreshToken }, (err) => {
        if (err) {
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        } else {
            res.sendStatus(204);
        }
    });
});

app.post("/isAuthenticated", (req, res) => {
    console.log(`${Date()} - POST /isAuthenticated`);
    const accessToken = req.body.token;
    isTokenAuthenticated(accessToken) ? res.sendStatus(200) : res.sendStatus(403);
});

function generatePermanentAccessToken(userInfo) {
    return jwt.sign(userInfo, ACCESS_TOKEN_SECRET);
}

function generateAccessToken(userInfo) {
    return jwt.sign(userInfo, ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
}
function generateRefreshToken(userInfo) {
    return jwt.sign(userInfo, REFRESH_TOKEN_SECRET);
}

function authenticateTokenMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, usr) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

function isTokenAuthenticated(token) {
    if (!token) return false;

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, usr) => {
        return err ? false : true;
    });
}

dbConnect().then(
    () => {
        app.listen(port);
        console.log('Server ready!');
    },
    err => {
        console.log('Connection error: ' + err);
    }
);