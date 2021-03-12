const express = require("express");
const mongoose = require("mongoose");
const app = express();
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require("dotenv").config();
const cors = require("cors");
app.use(express.json());
app.set("port", 3001);

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

mongoose.connect("mongodb://localhost:27017/DovetailDB", {
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
    password: String
})
const User = new mongoose.model("User", userSchema)

app.get("/", (req, res) => {
    try {
        res.send("Got it")
    }
    catch (e) {
        console.log("error in /")
    }
})

function randomString(length, chars) {
    var result = "";
    for (var i = length; i > 0; --i)
        result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}
function createUser(email, password, req, res) {
    User.create({
        email: email,
        password: password
    }, (err, user) => {
        if (err) console.log("Error in adding new user");
        else {
            res.redirect(
                307,
                "/login?user=" + true + "&password=" + password
            );
            user.save();
        }
    })
}
app.post("/verify", (req, res) => {
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
});
app.post("/otp-verify", (req, res) => {
    Verify.findOne({ email: req.body.email }, (err, found) => {
        if (!err) {
            if (found.otp == req.body.otp) {
                res.status(200).send("verified machi");
            } else {
                res.send("OTP incorrect");
            }
        } else {
            res.send("Email not found");
        }
    });
});

//For Authentication and Authorization
app.post("/signup", (req, res) => {
    const email = req.body.email;
    const pass = req.body.password;
    if (email && pass) {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(pass, salt, function (err, hash) {
                if (!err) {
                    createUser(email, hash, req, res);
                } else res.send("error in hash gen");
            });
        });
    } else
        return res.status(403).json({
            message: "Problem in signing up",
        });
});

app.post("/login", (req, res) => {
    const user_email = req.body.user ? req.body.email : req.body.loginDetails.email;
    const typePass = req.query.password || req.body.loginDetails.password;
    console.log(user_email + ',' + typePass)
    User.findOne({ email: user_email }, (err, found) => {
        if (!err && found) {
            bcrypt.compare(typePass, found.admin_password, (err, result) => {
                if (!err && result) {
                    const access = jwt.sign(
                        { email: user_email },
                        "AccessGiven",
                        { expiresIn: "10s" }
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
                        message: "You are unauthorized ",
                    });
                }
            });
        }
        else {
            return res.status(401).json({
                message: 'You are unauthorized'
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
            const accessToken = jwt.sign({ user: user.user }, "AccessGiven", {
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

const auth = async (req, res, next) => {
    var accessToken = req.headers["authorization"];
    if (!accessToken)
        return res.status(499).json({
            message: "Access Token required",
        });
    accessToken = accessToken.split(" ")[1];
    console.log(accessToken);
    jwt.verify(accessToken, "AccessGiven", async (err, user) => {
        if (user) {
            req.user = user;
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

app.post("/protected", auth, (req, res) => {
    return res.status(200).json({ message: "Protected content accessed" });
});


app.listen(app.get("port"), function () {
    console.log(`App started on port ${app.get("port")}`)
})