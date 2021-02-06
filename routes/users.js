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

const handleErrors = (err) => {
    let errors = { 
        username: '',
        email: ''
     }

    if(err.message.includes("Users validation failed")) {
        Object.values(err.errors).forEach(({ properties }) => {
                switch(properties.path) {
                    case "username":
                        errors.username = "Ce pseudo est déjà utilisé"
                    break;
                    case "email":
                        errors.email = "Cette adresse email est déjà utilisée"
                    break;
                }
        });
    }

    return errors;
}

router.get("/api/users", async (req, res) => {
    try {
        const users = await Users.find({});
    const stringified = JSON.stringify(users, null, 2);
    res.type('json').send(stringified);
    } catch(error) {
        console.log(error);
    }
});

router.get("/api/users/:username", async (req, res) => {
    const users = await Users.findOne({username: { $regex : new RegExp(req.params.username, "i") }});
    const stringified = JSON.stringify(users, null, 2);
    res.type('json').send(stringified);
});

router.post("/api/users", async (req, res) => {
    try {
        const user = await new Users(req.body);
        await user.save();
        const token = createToken(user);
        res.status(201).send({
            user: {
                username: user.username,
                profilePicture: user.profilePicture
            },
            token
        });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
});

router.post("/api/users/login", async (req, res) => {
    try {
        const user = await Users.findByCredentials(req.body.username, req.body.password);
        const token = createToken(user._id);
        res.status(200).send({
            user: {
                username: user.username,
                profilePicture: user.profilePicture
            },
            token
        });
    } catch (error) {
        res.status(400).json({error: "Les identifiants sont incorrects, veuillez vérifier vos informations"});
    }
});

module.exports = router;