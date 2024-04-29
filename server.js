const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose")
const methodOverride = require("method-override");
const morgan = require("morgan");

const app = express();

  const Car = require("./models/car.js");

  app.use(express.urlencoded({ extended: false }));
  app.use(methodOverride("_method"));
app.use(morgan("dev"));
 
  app.get("/", async (req, res) => {
    res.render("index.ejs");
  });

  app.get("/cars", async (req, res) => {
      const allCars = await Car.find();
      res.render("index.ejs", {cars: allCars});
  });

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

    app.get("/cars/:carId", async (req, res) => {
    const foundCar = await Car.findById(req.params.carId);
    res.render("cars/show.ejs", { car: foundCar });
  });

  app.delete("/cars/:carId", async (req, res) => {
    await Car.findByIdAndDelete(req.params.carId);
    res.redirect("/cars");
  });

  app.get("/cars/:carId/edit", async (req, res) => {
    const foundCar = await Car.findById(req.params.carId);
    res.render("cars/edit.ejs", {
      car: foundCar,
    });
  });

  app.put("/cars/:carId", async (req, res) => {
    // Handle the 'isReadyToEat' checkbox data
    if (req.body.isReadyToDrive === "on") {
      req.body.isReadyToDrive = true;
    } else {
      req.body.isReadyToDrive = false;
    }
    
    // Update the car in the database
    await Car.findByIdAndUpdate(req.params.carId, req.body);
  
    // Redirect to the car's show page to see the updates
    res.redirect(`/cars/${req.params.carId}`);
  });

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
  });