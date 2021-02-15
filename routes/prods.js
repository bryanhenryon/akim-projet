const path = require("path");
const fs = require('fs');
const express = require("express");
const Prods = require("../models/prods");
const multer = require("multer");
const auth = require("../middlewares/auth");

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
router.get("/api/prod/:id", async (req, res) => {
    try {
        const prod = await Prods.findOne({_id: req.params.id});

        const stringified = JSON.stringify(prod, null, 2);
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

router.get("/api/prods/song/:filename", (req, res) => {
    res.sendFile(path.resolve('uploads/prods/songs/' + req.params.filename));
});


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(file);
        if(file.fieldname === "cover") {
            return cb(null, path.resolve("uploads/prods/covers/"));
        } 

        if(file.fieldname === "song") {
            return cb(null, path.resolve("uploads/prods/songs/"));
        }
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
  });
  
  const upload = multer({ 
    fileFilter(req, file, cb) {
        if(file.fieldname === "cover" && !file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            req.coverFileTypeError = "Veuillez indiquer un fichier au format .png, .jpg ou .jpeg";
            cb(null, false);
        } else if(file.fieldname === "song" && !file.originalname.match(/\.(mp3|wav)$/)){
            req.prodFileTypeError = "Veuillez indiquer un fichier au format .mp3 ou .wav";
            cb(null, false);
        } else {
            cb(null, true);
        }
    },
        limits: {
            fileSize: 1024 * 1024 * 50
        },
      storage
     }).fields([{ name: 'cover', maxCount: 1 }, { name: 'song', maxCount: 1 }]);

router.post("/api/prods", (req, res) => {
    upload(req, res, async err => {
        try {
            if (err) { 
                if (err.code == 'LIMIT_FILE_SIZE' && err.field) {
                    err.message = 'Le fichier est trop volumineux, 50 Mo maximum autorisés';
                }
                return res.status(400).json(err);
            } else {
            if(req.files.cover && req.files.cover[0].fieldname === "cover") {
                if(req.files.cover[0].size > 1024 * 1024 * 10) {
                    res.status(400).json({coverSizeError: "Le fichier est trop volumineux, 10 Mo maximum autorisés"});
                    return;
                }
                req.body.cover = req.files.cover[0].filename;
            }
    
            if(req.files.song && req.files.song[0].fieldname === "song") {
                req.body.song = req.files.song[0].filename;   
    
                const extname = path.extname(req.files.song[0].filename).replace(".", ""); 
                req.body.format = extname;
            }
    
            if(req.coverFileTypeError) {
                res.status(400).json({coverFileTypeError: req.coverFileTypeError});
                return;
            } 
    
            if(req.prodFileTypeError) {
                res.status(400).json({prodFileTypeError: req.prodFileTypeError});
                return;
            }
    
            const prod = new Prods(req.body);
            await prod.save();
            res.status(200).json(prod);
        }
        } catch(error) {
            res.status(400).json({error: error.message});
        }
    });
});


router.patch("/api/prods/:id", auth, (req, res) => {
    upload(req, res, async err => {
    try {
        if (err) { 
            if (err.code == 'LIMIT_FILE_SIZE' && err.field) {
                err.message = 'Le fichier est trop volumineux, 50 Mo maximum autorisés';
            }
            return res.status(400).json(err);
        } else {
        if(req.files.cover && req.files.cover[0].fieldname === "cover") {
            if(req.files.cover[0].size > 1024 * 1024 * 10) {
                res.status(400).json({coverSizeError: "Le fichier est trop volumineux, 10 Mo maximum autorisés"});
                return;
            }
            req.body.cover = req.files.cover[0].filename;
        }

        if(req.files.song && req.files.song[0].fieldname === "song") {
            req.body.song = req.files.song[0].filename;   

            const extname = path.extname(req.files.song[0].filename).replace(".", ""); // Récupère l'extension du fichier sans le "." 
            req.body.format = extname;
        }

        if(req.coverFileTypeError) {
            res.status(400).json({coverFileTypeError: req.coverFileTypeError});
            return;
        } 

        if(req.prodFileTypeError) {
            res.status(400).json({prodFileTypeError: req.prodFileTypeError});
            return;
        }

        const prod = await Prods.findById(req.params.id);

        if(!prod) {
            return res.status(404).send("La prod n'existe pas");
        }

        if(prod.artist !== req.user.username) {
            return res.status(401).send();
        }

        if(req.files.cover) {
            if(prod.cover !== "placeholder.jpg") {
                fs.unlink("uploads/prods/covers/" + prod.cover, (err) => {
                    if (err) {
                      console.error(err)
                      return
                    }
                });
            }
        }

           if(req.files.song) {
            fs.unlink("uploads/prods/songs/" + prod.song, (err) => {
                if (err) {
                  console.error(err)
                  return
                }
            });
        
           }

        const prodToUpdate = await Prods.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, useFindAndModify: false});

        res.send(prodToUpdate);
    }
    } catch (error) {
        res.status(400).send(error);
    }
});
});

    router.delete("/api/prods/:id", auth, async (req, res) => {
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
          
        res.send();
    });

module.exports = router;