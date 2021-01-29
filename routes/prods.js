const express = require("express");
const Prods = require("../models/prods");
const multer = require("multer");
const path = require("path");


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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if(file.fieldname === "cover") {
            return cb(null, "uploads/prods/covers/");
        } 

        if(file.fieldname === "song") {
            return cb(null, "uploads/prods/songs/");
        }
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
  });
  
  const upload = multer({ 
    fileFilter(req, file, cb) {
        if(file.fieldname === "cover") {
            if(!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
                return cb(new Error("Veuillez indiquer un fichier au format .png, .jpg ou .jpeg"))
            }
    
            cb(undefined, true);
        }

        if(file.fieldname === "song") {
            if(!file.originalname.match(/\.(mp3|wav)$/)) {
                return cb(new Error("Veuillez indiquer un fichier au format .mp3 ou .wav"))
            }
    
            cb(undefined, true);
        }
    },
      storage
     });

router.post("/api/prods", upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'song', maxCount: 1 }]), async (req, res) => {
    try {
        if(req.files.cover && req.files.cover[0].fieldname === "cover") {
            if(req.files.cover[0].size > 1024 * 1024 * 5) {
                res.status(400).json({error: "Le fichier est trop volumineux, 5 Mo maximum autorisés"});
                return;
            }
            req.body.cover = req.files.cover[0].filename;
        }

        if(req.files.song && req.files.song[0].fieldname === "song") {
            if(req.files.song[0].size > 1024 * 1024 * 50) {
                res.status(400).json({error: "Le fichier est trop volumineux, 50 Mo maximum autorisés"});
                return;
             }
            req.body.song = req.files.song[0].filename;
        }

        const prod = new Prods(req.body);
        await prod.save();
        res.send("Ca a marché");
    } catch(error) {
        console.log(error);
    }
});

module.exports = router;