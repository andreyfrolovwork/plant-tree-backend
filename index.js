require("dotenv").config();
const mongoose = require("mongoose");
const PORT = process.env.PORT;
const app = require("./app.js");

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
    });
    app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`));
  } catch (e) {
    console.log(e);
    debugger;
  }
};

start();
