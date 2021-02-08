const path = require("path");
const fs = require('fs')
const express = require("express");
const Prods = require("../models/prods");
const multer = require("multer");

const router = express.Router();

const handleErrors = (err) => {
    let errors = { 
        title: '',
        song: '',
        price: '',
     }

    if(err.message.includes("Prods validation failed")) {
        Object.values(err.errors).forEach(({ properties }) => {
        switch(properties.path) {
            case "title":
                errors.title = "Veuillez indiquer un titre"
            break;
            case "song":
                errors.song = "Veuillez indiquer un fichier audio"
            break;
            case "price":
                errors.price = "Veuillez indiquer un prix"
            break;
        }
        });
    }

    return errors;
}


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

router.get("/api/prods/:username", async (req, res) => {
    try {
        const prods = await Prods.find({
            artist: { $regex : new RegExp(req.params.username, "i") } 
        });

        const stringified = JSON.stringify(prods, null, 2);
        res.type('json').send(stringified);
    } catch (error) {
        console.log(error);
    }
});

router.get("/api/prods/images/:filename", (req, res) => {
    res.sendFile(path.resolve('uploads/prods/covers/' + req.params.filename));
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
                return cb(new Error("Veuillez indiquer un fichier au format .png, .jpg ou .jpeg"));
            }
    
            cb(undefined, true);
        }

        if(file.fieldname === "song") {
            if(!file.originalname.match(/\.(mp3|wav)$/)) {
                return cb(new Error("Veuillez indiquer un fichier au format .mp3 ou .wav"));
            }
    
            cb(undefined, true);
        }
    },
    limits: { fileSize: 1024 * 1024 * 50 },
      storage
     });

router.post("/api/prods", upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'song', maxCount: 1 }]), async (req, res) => {
    try {
        if(req.files.cover && req.files.cover[0].fieldname === "cover") {
            // if(req.files.cover[0].size > 1024 * 1024 * 5) {
            //     res.status(400).send();
            //     return;
            // }
            req.body.cover = req.files.cover[0].filename;
        }

        if(req.files.song && req.files.song[0].fieldname === "song") {
            const extname = path.extname(req.files.song[0].filename).replace(".", ""); // Récupère l'extension du fichier sans le "." 
            req.body.format = extname;

            // if(req.files.song[0].size > 1024 * 1024 * 50) {
            //     errors.song = "Le fichier est trop volumineux, 50 Mo maximum autorisés";
            //     res.status(400).json({errors});
            //     return;
            //  }
            req.body.song = req.files.song[0].filename;
        }

        const prod = new Prods(req.body);
        await prod.save();
        res.status(200).send();
    } catch(error) {
        const errors = handleErrors(error);
        res.status(400).json({errors});
    }
});

    router.delete("/api/prods/:id", async (req, res) => {
        const prodToDelete = await Prods.findById(req.params.id);
        await Prods.deleteOne(prodToDelete);
        
        if(prodToDelete.cover !== "placeholder.jpg") {
            fs.unlink("uploads/prods/covers/" + prodToDelete.cover, (err) => {
                if (err) {
                  console.error(err)
                  return
                }
            });
        }

        fs.unlink("uploads/prods/songs/" + prodToDelete.song, (err) => {
            if (err) {
              console.error(err)
              return
            }
        });
          
        res.status(200).json({ message: "La prod a bien été supprimée" })
    });

module.exports = router;