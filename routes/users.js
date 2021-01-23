const express = require("express");
const Users = require("../models/users");

const router = express.Router();

router.get("/api/users", async (req, res) => {
    const users = await Users.find({});
    const stringified = JSON.stringify(users, null, 2);
    res.type('json').send(stringified);
});

router.post("/api/users", async (req, res) => {});

module.exports = router;