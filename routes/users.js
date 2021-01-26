const express = require("express");
const Users = require("../models/users");
const jwt = require("jsonwebtoken");

const router = express.Router();

const maxAge = 3 * 24 * 60 * 60; // 3 jours
const createToken = (user) => {
    return jwt.sign({ user }, process.env.JWT_SECRET, {
        expiresIn: maxAge
    });
}

router.get("/api/users", async (req, res) => {
    const users = await Users.find({});
    const stringified = JSON.stringify(users, null, 2);
    res.type('json').send(stringified);
});

router.get("/api/users/:username", async (req, res) => {
    console.log(req.body);
    const users = await Users.findOne({username: { $regex : new RegExp(req.params.username, "i") }});
    const stringified = JSON.stringify(users, null, 2);
    res.type('json').send(stringified);
});

router.post("/api/users", async (req, res) => {
    try {
        const user = await new Users(req.body);
        await user.save();
        const token = createToken(user);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).send({
            user,
            token
        });
    } catch (error) {
        console.log(error);
    }
});

router.post("/api/users/login", async (req, res) => {
    try {
        const user = await Users.findByCredentials(req.body.username, req.body.password);
        const token = createToken(user._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).send({
            user,
            token
        });
    } catch (error) {
        res.status(400).send();
        console.log(error);
    }
});

module.exports = router;