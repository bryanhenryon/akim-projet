const mongoose = require("mongoose"); 

mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost/akim-project", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", () => console.log("Échec lors de la connexion à la base de données"));
db.once("open", () => console.log("Connexion à la base de données établie"));