const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose")

const app = express();

  const Car = require("./models/car.js");

  app.use(express.urlencoded({ extended: false }));
 
  app.get("/", async (req, res) => {
    res.render("index.ejs");
  });

  app.get('/cars', async (req, res) => {
      const foundCars = await Car.find()
      res.send(foundCars)
  })

  app.post("/cars", async (req, res) => {
    console.log(req.body);
    if(req.body.isReadyToDrive === "on"){
        req.body.isReadyToDrive = true
    }else {
       req.body.isReadyToDrive = false
    }
    const createdCar = await Car.create(req.body);
      res.redirect('/cars');
  });

  app.get("/cars/new" , (req, res) => {
    res.render("cars/new.ejs");
  });

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
  });