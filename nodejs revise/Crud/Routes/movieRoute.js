const express = require("express");
const route = express.Router();
const movieController = require("../Controllers/moviesController");
const authController = require("../Controllers/authController");
// const { request } = require("http");

// all functions

route.route("/movie-state").get(movieController.getALlMoviesStats)
route.route("/moviebyactor/:actor").get(movieController.movieByActors)
route.route("/")
  .get(authController.protect,movieController.getttALlMovies)
  .post(movieController.addnew);

route.route("/:id")
  .get( authController.protect,movieController.getmovieonbaseofId)
  .delete(authController.protect,authController.restrict("admin"), movieController.deletea)
  .patch(movieController.updatemovie);

module.exports = route;
