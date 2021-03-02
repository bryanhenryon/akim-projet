const cors = require("cors");
const express = require("express");
const app = express();
require("./models/mongoose");
const prodsRouter = require("./routes/prods");
const usersRouter = require("./routes/users");
const paypalRouter = require("./routes/paypal");
require('dotenv').config();
require("./routes/paypal");

app.use(express.json());
app.use(cors());
app.use(express.static(__dirname + '/public/'));
app.use(prodsRouter, usersRouter, paypalRouter);

app.get(/.*/, (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});