const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
app.use(express.json());
app.set("port", 3001);

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

mongoose.connect("mongodb://localhost:27017/IoTDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


app.listen(app.get("port"), function () {
    console.log(`App started on port ${app.get("port")}`)
})