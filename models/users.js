const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require("bcrypt");

const usersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    maxLength: 20,
    unique: true,
    uniqueCaseInsensitive: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    uniqueCaseInsensitive: true,
    validate(value) {
      const regex = new RegExp(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
      const checkedEmail = regex.test(value);

      if(!checkedEmail) throw new Error("Email invalide");
    }
  },
  description:  {
    type: String,
    trim: true,
    default: ""
  },
  soundcloud: {
    type: String,
    trim: true,
    default: ""
  },
  instagram: {
    type: String,
    trim: true,
    default: ""
  },
  youtube: {
    type: String,
    trim: true,
    default: ""
  },
  twitter: {
    type: String,
    trim: true,
    default: ""
  },
  facebook: {
    type: String,
    trim: true,
    default: ""
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 6
  },
  profilePicture: {
    type: String,
    default: "profile-picture-placeholder.png"
  }
}, { timestamps: true });

usersSchema.plugin(uniqueValidator);

usersSchema.statics.findByCredentials = async (username, password) => {
  const user = await Users.findOne({ 
    username: username
   });

  if(!user) {
    throw new Error("Les identifiants sont incorrects");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if(!isMatch) {
    throw new Error("Les identifiants sont incorrects");
  }

  return user;
}

usersSchema.pre('save', async function(next) {
  if(this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});


const Users = mongoose.model("Users", usersSchema);

module.exports = Users;