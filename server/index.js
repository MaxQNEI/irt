import compression from "compression";
import express from "express";
import HTTP from "http";
import PATH from "path";
import { Server as socket } from "socket.io";
import { EXPRESS_HOST, EXPRESS_PORT, IS_PRODUCTION } from "../index.js";
import { randStr } from "../library/rand.js";

const SESSION = "session";

// DB
let Sessions = {};
let Usernames = [];

const app = express();
const server = HTTP.createServer(app);
const io = new socket(server, {
    transports: ["websocket"],
    pingInterval: 25000,
    pingTimeout: 5000
});

// express
{
    app.set("trust proxy", 1);

    app.use(compression());
    app.use(express.json());

    app.use(
        express.static(PATH.resolve(import.meta.dirname, "..", "public"), {
            cacheControl: IS_PRODUCTION,
            index: "index.html"
        })
    );

    app.use((req, res, next) => {
        // parse
        const usp = Object.fromEntries(new URLSearchParams((req.headers.cookie || "").replace(/; /g, "&")).entries());

        // use or generate
        req.sessionId = usp[SESSION] ?? randStr(24);

        // get data
        if (Sessions[req.sessionId]) {
            req.session = Sessions[req.sessionId] || {};
        } else {
            req.sessionId = randStr(24);
            req.session = Sessions[req.sessionId] = {};
        }

        // set cookie
        res.setHeader("Set-Cookie", `${SESSION}=${encodeURIComponent(req.sessionId)}; HttpOnly; Path=/; Max-Age=3600`);

        next();
    });

    app.get("/account/username-get", (req, res, next) => {
        console.log(`[${req.session.username || req.sessionId}] Request: http://${req.headers.host}${req.url}`);

        // if (req.session.username === undefined) {
        //     do {
        //         req.session.username = randStr(16, "dl");
        //     } while (Usernames.includes(req.session.username));
        // }
        // Usernames.push(req.session.username);

        res.json({ ok: true, username: req.session.username || "" });
    });

    app.post("/account/username-set", (req, res, next) => {
        console.log(`[${req.session.username || req.sessionId}] Request: http://${req.headers.host}${req.url}`);

        const username = req.body.username;
        if (username === undefined) {
            return res.status(400).json({ ok: false, error: ["USERNAME NOT GIVEN"] });
        } else if (typeof username !== "string") {
            return res.status(400).json({ ok: false, error: ["USERNAME MUST BE A STRING"] });
        } else if (username.length === 0) {
            return res.json({ ok: false, error: ["USERNAME IS EMPTY"] });
        } else if (username.length < 3) {
            return res.json({ ok: false, error: ["USERNAME MUST BE AT LEAST 3 CHARACTERS LONG"] });
        } else if (username.length > 16) {
            return res.json({ ok: false, error: ["USERNAME CAN BE UP TO 16 CHARACTERS LONG"] });
        } else if (/^\d/.test(username)) {
            return res.json({ ok: false, error: ["USERNAME MUST START WITH A LETTER"] });
        } else if (/[^\da-z]/i.test(username)) {
            return res.json({ ok: false, error: ["USERNAME CAN ONLY CONTAIN NUMBERS AND LETTERS"] });
        } else if (Usernames.includes(username)) {
            return res.json({ ok: false, error: ["USERNAME IS ALREADY IN USE"] });
        }

        req.session.username = username;
        Usernames.push(username);

        res.json({ ok: true, username: req.session.username });
    });
}

// socket
{
    const Rooms = {};

    io.on("connection", (socket) => {
        const { id } = socket;
        console.log(`[socket/${id}] connect`);

        socket.on("disconnect", (reason) => {
            console.log(`[socket/${id}] disconnect:`, reason);
        });
    });
}

// start
{
    server.listen(EXPRESS_PORT, EXPRESS_HOST, () => {
        console.log(`Listen: http://${EXPRESS_HOST || "*"}:${EXPRESS_PORT}`);
    });
}
