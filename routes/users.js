const path = require("path");
const fs = require('fs');
const express = require("express");
const Users = require("../models/users");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");
const multer = require("multer");
const bcrypt = require("bcrypt");

const router = express.Router();

const createToken = (user) => {
    return jwt.sign({ user }, process.env.JWT_SECRET);
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

router.get("/api/users/me", auth, async (req, res) => {
    try {
        const user = await Users.findOne({ _id: req.user._id });

        if(!user) {
            throw new Error();
        }

        res.send(user)

    } catch (e) {
        console.log(e);
    }
});

router.get("/api/users/:username", async (req, res) => {
    const users = await Users.findOne({username: { $regex : new RegExp(req.params.username, "i") }});
    const stringified = JSON.stringify(users, null, 2);
    res.type('json').send(stringified);
});

router.get("/api/user/profile_picture/:filename", (req, res) => {
    res.sendFile(path.resolve('uploads/users/profile_pictures/' + req.params.filename));
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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, "uploads/users/profile_pictures/");
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
  });

  const upload = multer({ 
      fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            req.coverFileTypeError  = "Veuillez indiquer un fichier au format .png, .jpg ou .jpeg"
            cb(null, false);
         } else {
            cb(null, true);
         }
      },
      storage,
      limits: { fileSize: 1024 * 1024 * 10}
    }).single("profilePicture");

  
const handleErrors2 = (err) => {
    let errors = { 
        email: ''
     }

    if(err.message.includes("Validation failed: email")) {
        Object.values(err.errors).forEach(({ properties }) => {
               if(properties.type === "unique") {
                   errors.email = "Cette adresse est déjà utilisée"
               } else {
                   errors.email = properties.message
               }
        });
    }

    return errors;
}


router.patch("/api/users/me", auth, async (req, res) => {
    try {
        upload(req, res, async function (err) {
            if (err) {
                res.status(400).json({coverSizeError: "Le fichier est trop volumineux, 10 Mo maximum autorisés"})
                return;
            } else {
                const user = await Users.findOne({_id: req.user._id});
        
                if(!user) {
                    return res.status(404).send("L'utilisateur n'existe pas");
                }
        
                if(req.coverFileTypeError) {
                    return res.status(400).json({"coverFileTypeError": req.coverFileTypeError});
                }
                
                if(user.profilePicture !== "profile-picture-placeholder.png") {
                        fs.unlink("uploads/users/profile_pictures/" + user.profilePicture, (err) => {
                            if (err) {
                                console.error(err)
                                return
                            }
                        });
                    }
        
                if(req.file) {
                    req.body.profilePicture = req.file.filename;
                    if(user.profilePicture !== "profile-picture-placeholder.png") {
                        fs.unlink("uploads/users/profile_pictures/" + user.profilePicture, (err) => {
                            if (err) {
                                console.error(err)
                                return
                            }
                        });
                    }
                }
        
                const userToUpdate = await Users.findByIdAndUpdate(req.user._id, req.body, {  runValidators: true, context: 'query', useFindAndModify: false });
                res.send(userToUpdate);

            }
        });

    } catch (e) {
        const errors = handleErrors2(e);
        res.status(400).send(errors);
    }
});

router.patch("/api/users/me/new-password", auth, async (req, res) => {
    try {
        const user = await Users.findOne({_id: req.user._id});

        if(!user) {
            return res.status(404).send();
        }

        const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);

        if(!isMatch) {
            return res.status(400).json({
                "password": "Le mot de passe est incorrect"
            })
        }

       user.password = req.body.newPassword;

        updatedUser = await new Users(user);

        await updatedUser.save();

        res.send(updatedUser);

    } catch (err) {
        res.status(400).send();
    }
})

module.exports = router;