const express = require("express");
const app = express();
require("./models/mongoose");
const prodsRouter = require("./routes/prods");
const usersRouter = require("./routes/users");

app.use(express.static(__dirname + '/public/'));
app.use(express.json());
app.use(prodsRouter, usersRouter);

app.get(/.*/, (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});