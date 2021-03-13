const express = require("express");
const http = require('http');
const socketio = require('socket.io');
const mongoose = require("mongoose");
const app = express();
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require("dotenv").config();
const cors = require("cors");
app.use(express.json());
app.set("port", 5000);
const server = http.createServer(app);
options = {
    cors: true,
    origins: ["http://127.0.0.1:3000"],
};
const io = socketio(server, options);
// const router = require('./router');
// app.use(router);

app.use(
    cors(
        {
            origin: "http://localhost:3000",
            credentials: true,
        }
    )
);

io.on('connect', (socket) => {
    console.log("Connected")

    const changeStream = Message.watch();
    changeStream.on("change", function (change) {
        console.log("User COLLECTION CHANGED");
        Message.find({}, (err, data) => {
            if (err) throw err;
            if (data) {
                // RESEND ALL USERS
                socket.emit("users", data);
            }
        });
    });

    // socket.on('join', ({ roomName }, callback) => {
    //     const { error, user } = addUser({ id: socket.id, roomName });
    //     console.log(roomName)
    //     console.log(socket.id)
    // if (error) return callback(error);

    // socket.join(user.room);

});
const auth = async (req, res, next) => {
    var accessToken = req.headers["authorization"];
    if (!accessToken)
        return res.status(499).json({
            message: "Access Token required",
        });
    accessToken = accessToken.split(" ")[1];
    jwt.verify(accessToken, "AccessGiven", async (err, user) => {
        if (user) {
            res.locals.user = user;
            next();
        } else if (err.message === "jwt expired") {
            return res.status(498).json({
                message: "Access Token expired",
            });
        } else
            return res.status(401).json({
                message: "User not authorized",
            });
    });
};

mongoose.connect("mongodb+srv://admin-Dovetail:dovetail2sm@cluster0.nxnwd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

var transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
    tls: {
        ciphers: "SSLv3",
    },
});

const verifySchema = new mongoose.Schema({
    email: String,
    otp: String,
});
const Verify = new mongoose.model("Verify", verifySchema);

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    name: String,
    dp: String,
    interests: [],
    works: []
})
const User = new mongoose.model("User", userSchema)

const messageSchema = new mongoose.Schema({
    message: String,
    fromEmail: String,
    toEmail: String,
    time: String,
})
const Message = new mongoose.model("Message", messageSchema)

const roomSchema = new mongoose.Schema({
    roomName: String,
    roomMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    roomMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
})
const Room = new mongoose.model('Room', roomSchema)

app.get("/", (req, res) => {
    try {
        res.send("Got it")
    }
    catch (e) {
        console.log("error in /")
    }
})

app.post('/getMe', auth, (req, res) => {
    res.send(res.locals.user.email)
})

app.post('/newroom', (req, res) => {
    Room.find({ roomName: req.body.roomName }, (err, found) => {
        if (!err) {
            if (found.length === 0) {
                Room.create({
                    roomName: req.body.roomName
                }, (err, room) => {
                    if (!err && room)
                        res.send("Created Room")
                })
            } else {
                res.send("Already Exists")
            }
        }
    })
})

app.post('/directMessage', auth, (req, res) => {
    Message.find({ fromEmail: res.locals.user.email, toEmail: req.body.receiver }, (err, found) => {
        if (!err && found.length !== 0) {
            res.send(found)
        }
    })
    Message.find({ toEmail: res.locals.user.email, fromEmail: req.body.receiver }, (err, found) => {
        if (!err && found.length !== 0) {
            res.send(found)
        }
    })
})

app.post('/roomMessages', (req, res) => {
    Room.findOne({ roomName: req.body.roomName })
        .populate('roomMembers')
        .populate('roomMessages')
        .exec(function (err, story) {
            if (err) return handleError(err);
            console.log(story);
        })
})

app.get('/allMembers', (req, res) => {
    User.find({}, (err, found) => {
        res.send(found)
    })
})

app.post('/addMessage', auth, (req, res) => {
    var d = new Date();
    var date = d.toLocaleString()
    Message.create({
        message: req.body.message,
        fromEmail: res.locals.user.email,
        toEmail: req.body.toEmail,
        time: date,
    })
})

function randomString(length, chars) {
    var result = "";
    for (var i = length; i > 0; --i)
        result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}
function createUser(email, password, pass, res) {
    User.create({
        email: email,
        password: password
    }, (err, user) => {
        if (err) console.log("Error in adding new user");
        else {
            res.redirect(
                307,
                "/login"
            );
            user.save();
        }
    })
}
app.post("/verify", (req, res) => {
    User.findOne({ email: req.body.email }, (err, found) => {
        if (found) {
            res.status(409).json({
                message: "Already signed-up",
            })
        }
        else {
            Verify.deleteMany({ email: req.body.email }, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("deleted");
                }
            });
            var random = randomString(
                6,
                "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
            );
            const user = new Verify({
                email: req.body.email,
                otp: random,
            });
            user.save();
            var mailOptions = {
                from: process.env.SMTP_USER,
                to: req.body.email,
                subject: "Verify your email address",
                text:
                    "To finish setting up your account, we just need to make sure this email address is yours.",
                html:
                    "<div>To verify your email address use this security code: '" +
                    random +
                    "'</div>",
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Email sent: " + info.response);
                }
            });
            res.status(200).json({
                message: "Verification mail sent!",
            })
        }
    });

});
app.post("/otp-verify", (req, res) => {
    Verify.findOne({ email: req.body.email }, (err, found) => {
        if (!err) {
            if (found.otp == req.body.otp) {
                res.status(200).send("verified");
            } else {
                res.status(401).send("OTP incorrect");
            }
        } else {
            res.send("Email not found");
        }
    });
});

//For Authentication and Authorization
app.post("/signup", (req, res) => {
    const email = req.body.user.email;
    const pass = req.body.user.password;
    if (email && pass) {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(pass, salt, function (err, hash) {
                if (!err) {
                    createUser(email, hash, pass, res);
                } else
                    return res.send("error in hash gen");
            });
        });
    } else
        return res.status(403).json({
            message: "Problem in signing up",
        });
});

app.post("/login", (req, res) => {
    const user_email = req.body.user ? req.body.user.email : req.body.email;
    const typePass = req.body.user ? req.body.user.password : req.body.password;
    console.log(user_email + ',,' + typePass)
    User.findOne({ email: user_email }, (err, found) => {
        console.log(found)
        if (!err && found) {
            bcrypt.compare(typePass, found.password, (err, result) => {
                console.log(result)
                if (!err && result) {
                    const access = jwt.sign(
                        { email: user_email },
                        "AccessGiven",
                        { expiresIn: "900s" }
                    );
                    const refresh = jwt.sign(
                        { email: user_email },
                        "TokenIssued",
                        { expiresIn: "7d" }
                    );
                    return res.status(201).json({
                        access: access,
                        refresh: refresh,
                    });
                } else {
                    return res.status(401).json({
                        message: "Incorrect password. Try again!",
                    });
                }
            });
        }
        else {
            return res.status(401).json({
                message: 'User email not found. Please sign-up'
            })
        }
    });
});

app.post("/refresh", (req, res) => {
    var refreshToken = req.body.refresh;
    if (!refreshToken)
        return res.status(499).json({
            message: "Refresh Token required",
        });
    jwt.verify(refreshToken, "TokenIssued", (err, user) => {
        if (!err) {
            const accessToken = jwt.sign({ email: user.email }, "AccessGiven", {
                expiresIn: "11s",
            });
            return res.status(200).json({
                access: accessToken,
            });
        } else if (err.message === "jwt expired") {
            return res.status(498).json({
                message: "Refresh Token expired, Login Again",
            });
        } else {
            return res.status(401).json({
                message: "Not Authorized",
            });
        }
    });
});

server.listen(app.get("port"), function () {
    console.log(`App started on port ${app.get("port")}`)
})