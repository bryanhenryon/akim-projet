const express = require("express");
const Prods = require("../models/prods");

const router = express.Router();

router.get("/api/prods", async (req, res) => {
    try {
        const query = req.query;

        const prods = await Prods.find({
            $or:[
                { title: { $regex : new RegExp(query.search, "i") }  },
                { artist: { $regex : new RegExp(query.search, "i") } }
            ] 
        });

        const stringified = JSON.stringify(prods, null, 2);
        res.type('json').send(stringified);
    } catch (error) {
        console.log(error);
    }
});

router.post("/api/prods", async (req, res) => {
    const prod = new Prods(req.body);
    await prod.save();
    res.send("Ca a marché");
});

module.exports = router;