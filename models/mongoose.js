const mongoose = require("mongoose"); 
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URL, "mongodb://127.0.0.1:27017/projet-akim", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", () => console.log("Échec lors de la connexion à la base de données"));
db.once("open", () => console.log("Connexion à la base de données établie"));