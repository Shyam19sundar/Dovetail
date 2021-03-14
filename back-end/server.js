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
//videochat application --> Working correctly,but need to be deployed....
//by adding "proxy":"http://localhost:8000"

// const http2 = require("http");
// const app2 = express();
// const server2 = http2.createServer(app2);

// const vio = socketio(server2);

// const users = {};

// vio.on('connection', socket => {
//     if (!users[socket.id]) {
//         users[socket.id] = socket.id;
//     }
//     socket.emit("yourID", socket.id);
//     vio.sockets.emit("allUsers", users);
//     socket.on('disconnect', () => {
//         delete users[socket.id];
//     })

//     socket.on("callUser", (data) => {
//         vio.to(data.userToCall).emit('hey', { signal: data.signalData, from: data.from });
//     })

//     socket.on("acceptCall", (data) => {
//         vio.to(data.to).emit('callAccepted', data.signal);
//     })
// });

// server2.listen(8000, () => console.log('Video server is running on port 8000'));


//

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
})
const User = new mongoose.model("User", userSchema)

const messageSchema = new mongoose.Schema({
    message: String,
    fromEmail: String,
    toEmail: String,
    time: String,
    roomId: String
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

app.get('/getMyName', (req, res) => {
    User.findOne({ email: req.query.email }, (err, found) => {
        res.send(found.name)
    })
})

app.get('/getDetails', (req, res) => {
    User.findOne({ email: req.query.email }, (err, found) => {
        res.send(found)
    })
})

app.post('/updateInterst', auth, (req, res) => {
    User.findOne({ email: res.locals.user.email }, (err, found) => {
        if (found && !err) {
            found.interests.push(req.body.interests)
            found.save()
            res.send(found)
        }
    })
})

app.post('/newroom', auth, (req, res) => {
    Room.find({ roomName: req.body.roomName }, (err, found) => {
        if (!err) {
            if (found.length === 0) {
                Room.create({
                    roomName: req.body.roomName
                }, (err, room) => {
                    if (!err && room) {
                        User.findOne({ email: res.locals.user.email }, (err, foundUser) => {
                            if (!err && foundUser) {
                                room.roomMembers.push(foundUser._id)
                                room.save()
                                Room.find({}, (err, found) => {
                                    res.send(found)
                                })

                            }
                        })
                    }
                })
            } else {
                res.send("Already Exists")
            }
        }
    })
})

app.get('/roomList', (req, res) => {
    Room.find({}, (err, found) => {
        res.send(found)
    })
})

app.post('/joinRoom', auth, (req, res) => {
    Room.findOne({ roomName: req.body.roomName }, (err, found) => {
        found.roomMembers.push(res.locals.user.email)
        found.save()
        res.send(found)
    })
})

app.post('/directMessage', auth, (req, res) => {

    Message.find({
        $and: [
            { $or: [{ fromEmail: res.locals.user.email }, { fromEmail: req.body.receiver }] },
            { $or: [{ toEmail: res.locals.user.email }, { toEmail: req.body.receiver }] }
        ]
    }, (err, found) => {
        if (!err && found.length !== 0) {
            res.send(found)
        }
    })

})

app.post('/roomMessages', (req, res) => {
    Room.findOne({ roomName: req.body.roomName })
        .populate('roomMembers')
        .populate('roomMessages')
        .exec(function (err, messages) {
            if (err) return handleError(err);
            res.send(messages.roomMessages);
        })
})
app.post('/roomMembers', (req, res) => {
    Room.findOne({ roomName: req.body.roomName })
        .populate('roomMembers')
        .exec(function (err, members) {
            if (err) return handleError(err);
            res.send(members.roomMembers);
        })
})

app.post('/roomMessage', auth, (req, res) => {
    var d = new Date();
    var date = d.toLocaleString()
    Message.create({
        message: req.body.message,
        fromEmail: res.locals.user.email,
        time: date,
    }, (err, message) => {
        Room.findOne({ roomName: req.body.room }, (err, found) => {
            message.roomId = found._id
            message.save()
            found.roomMessages.push(message)
            found.save()
        })
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
function createUser(email, password, name, pass, res) {
    User.create({
        email: email,
        password: password,
        name: name
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
    const name = req.body.name
    if (email && pass) {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(pass, salt, function (err, hash) {
                if (!err) {
                    createUser(email, hash, name, pass, res);
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

app.post('/updatedDp', (req, res) => {
    console.log(req.body)
    User.findOne({ email: req.body.user }, (err, found) => {
        found.dp = req.body.dp
        found.save()
        res.send("Done")
    })
})

app.get('/profileDetails', (req, res) => {
    console.log(req.query)
    User.findOne({ email: req.query.user }, (err, found) => {
        res.send(found)
    })
})

app.post('/updateName', auth, (req, res) => {
    User.findOne({ email: res.locals.user.email }, (err, found) => {
        found.name = req.body.name
        found.save()
        res.send(found)
    })
})

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