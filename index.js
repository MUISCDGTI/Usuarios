const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./swagger.json');

const cors = require('cors')

const corsOptions = {
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}

const BASE_API_PATH = "/api/v1";
const ACCESS_TOKEN_SECRET = (process.env.ACCESS_TOKEN_SECRET || "CHANGE_THIS_SUPER_SECRET_ACCESS_TOKEN_SECRET");
const REFRESH_TOKEN_SECRET = (process.env.REFRESH_TOKEN_SECRET || "CHANGE_THIS_SUPER_SECRET_ACCESS_TOKEN_SECRET");

const User = require('./users');
const RefreshToken = require('./refreshTokens');
const authenticateTokenMiddleware = require('./authenticationMiddleware');

console.log("Starting API server...");

const app = express();
app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use(cors(corsOptions))

app.get("/", (req, res) => {
    res.send("<html><body><h1>My server</h1></body></html>");
});

app.get(BASE_API_PATH + "/healthz", (req, res) => {
    res.sendStatus(200);
});

app.get(BASE_API_PATH + "/users", authenticateTokenMiddleware, (req, res) => {
    console.log(Date() + " - GET /users");

    User.find({}, (err, usuarios) => {
        if (err) {
            console.log(Date() + "-" + err);
            res.sendStatus(500);
        } else {
            res.status(200).send(usuarios.map((usuario) => {
                return usuario.cleanup();
            }));
        }
    });

});

app.post(BASE_API_PATH + "/users", (req, res) => {
    console.log(Date() + " - POST /usuarios");
    const usuario = req.body;
    User.create(usuario, (err, usr) => {
        if (err) {
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        } else {
            res.status(201).json(usr.cleanup());
        }
    });
});

app.put(BASE_API_PATH + "/users/:id", authenticateTokenMiddleware, (req, res) => {
    const { id } = req.params;
    const { email, name, password } = req.body;
    console.log(`${Date()} - PUT /usuarios/${id}`);
    if (!email || !name || !password) return res.sendStatus(400);
    User.findByIdAndUpdate(id, { email, name, password }, (err) => {
        if (err) {
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        } else {
            res.status(200).send({ id, name, email });
        }
    });
});

app.delete(BASE_API_PATH + "/users/:id", authenticateTokenMiddleware, (req, res) => {
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

        RefreshToken.create({ value: refreshToken }, (error) => {
            if (error) {
                console.log(Date() + " - " + error);
                res.sendStatus(500);
            } else {
                res.json({ accessToken, refreshToken, userInfo: usr.cleanup() });
            }
        });
    });

});

app.post('/refreshToken', (req, res) => {
    console.log(`${Date()} - POST /refreshToken`);
    const refreshToken = req.body.refreshToken;

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
    isTokenAuthenticated(accessToken, (isAuth) => isAuth ? res.sendStatus(204) : res.sendStatus(403));
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

function isTokenAuthenticated(token, callback) {
    if (!token) return callback(false);

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, usr) => callback(err ? false : true));
}

module.exports = app;