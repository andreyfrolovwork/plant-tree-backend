require("dotenv").config();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5000;
const app = require("./app.js");

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    module.exports = mongoose;
    app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
