const express = require("express");
const Movie = require("../Model/movieModel");
const ApiFeatures = require("../utils/ApiFeatures");
const asyncErrorhandler = require("../utils/asyncErrorHandler");
const customError = require("../utils/CustomError");
let app = express();
app.use(express.json());

// all functions

// exports.getttALlMovies = async (request, response) => {
//   try {
//     const featurs = new ApiFeatures(Movie.find(), request.query).filter().sort().limitFields().paginate();
//     // const excludeObject = ["sort", "fields", "page", "limit"];
//     // let filterQuery = { ...request.query };

//     // excludeObject.forEach((element) => {
//     //   delete filterQuery[element];
//     // });
//     // let queryStr = JSON.stringify(filterQuery);
//     // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

//     // const parsedFilterQuery = JSON.parse(queryStr);

//     // // Build the query object
//     // let queryObj = Movie.find(parsedFilterQuery);

//     // sorting
//     // if (request.query.sort) {
//     //   let sortBy;
//     //   if (Array.isArray(request.query.sort)) {
//     //     // If sort is an array, join the elements with commas and then replace commas with spaces
//     //     // this is for   &sort-price&sort=rating
//     //     sortBy = request.query.sort.join(",").split(",").join(" ");
//     //   } else {
//     //     // this is for   sort=price,rating

//     //     console.log(typeof request.query.sort, request.query.sort);
//     //     // If sort is a string, replace commas with spaces directly
//     //     sortBy = request.query.sort.split(",").join(" ");
//     //   }
//     //   queryObj = queryObj.sort(sortBy);
//     // } else {
//     //   queryObj = queryObj.sort("-createdAt");
//     // }
//     //fields
//     // if (request.query.fields) {
//     //   const fields = request.query.fields.split(",").join(" ");
//     //   console.log(fields);
//     //   queryObj = queryObj.select(fields);
//     // } else {
//     //   queryObj = queryObj.select("-__v");
//     // }

//     // ?pagination
//     // const page = request.query.page || 1;

//     // const limit = request.query.limit || 2;
//     // const skip = (page - 1) * limit;
//     // queryObj = queryObj.skip(skip).limit(limit);

//     // if (request.query.page) {
//     //   const count = await Movie.countDocuments();
//     //   if (skip >= count) {queryObj
//     //     queryObj
//     //     queryObj
//     //     queryObj
//     //     throw new Error("The page is not found");
//     //   }
//     // }
//     // const movies = await queryObj;
//     const movies = await featurs.query;

//     response.status(200).json({
//       status: "success",
//       count: movies.length,
//       data: {
//         movies,
//       },
//     });
//   } catch (err) {
//     response.status(404).json({
//       status: "fail",
//       messege: err.message,
//     });
//   }
// };
exports.getttALlMovies = async (request, response) => {
  try {
    
    const featurs = new ApiFeatures(Movie.find(), request.query)
      .filter()
      .sort()
      .limitFields();

    const movies = await featurs.query;

    response.status(200).json({
      status: "success",
      count: movies.length,
      data: {
        movies,
      },
    });
  } catch (err) {
    response.status(404).json({
      status: "fail",
      messege: err.message,
    });
  }
};

exports.getmovieonbaseofId = asyncErrorhandler(
  async (request, response, next) => {
    const movies = await Movie.findById(request.params.id);

    if (!movies) {
      const error = new customError("movie not found with this id", 404);
      return next(error);
    }
    response.status(200).json({
      status: "success",
      data: {
        movies,
      },
    });
  }
);
exports.updatemovie =asyncErrorhandler( async (request, response,next) => {
    const updateMovie = await Movie.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true, runValidators: true } // model validation also apply on new object
    );
    if (!updateMovie) {
      const error = new customError("movie not found with this id", 404);
      return next(error);
    }
    response.status(200).json({
      status: "success",
      data: {
        updateMovie,
      },
    });

});

exports.deletea = asyncErrorhandler(async (request, response, next) => {
  const deleteMovie = await Movie.findByIdAndDelete(request.params.id);
  if (!deleteMovie) {
    const error = new customError("movie not found with this id", 404);
    return next(error);
  }
  response.status(202).json({
    status: "success",
    data: {
      data: deleteMovie,
    },
  });
});

exports.addnew = asyncErrorhandler(async (request, response, next) => {
  const movie = await Movie.create(request.body);
  response.status(200).json({
    status: "success",
    data: {
      movie,
    },
  });
});

exports.movieByActors = async (request, response) => {
  try {
    const actor = request.params.actor;
    const stats = await Movie.aggregate([
      { $unwind: "$actors" },
      {
        $group: {
          _id: "$actors",
          movieCount: { $sum: 1 },
          nameMovie: { $push: "$name" },
        },
      },
      { $addFields: { actor: "$_id" } },
      { $project: { _id: 0 } },
      { $sort: { movieCount: -1 } },
      { $limit: 6 },
      { $match: { actors: actor } },
    ]);
    response.status(200).json({
      status: "success",
      count: stats.length,

      data: {
        stats,
      },
    });
  } catch (error) {
    console.log(err);
    response.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.getALlMoviesStats = async (request, response) => {
  try {
    const stats = await Movie.aggregate([
      { $match: { ratings: { $gte: 8.9 } } },
      {
        $group: {
          _id: "$price",
          aveRating: { $avg: `$ratings` },
          avePrice: { $avg: `$price` },
          maxPrice: { $max: "$price" },
          minPrice: { $min: "$price" },
          totalPrice: { $sum: "$price" },
          movieCount: { $sum: 1 },
        },
      },
    ]);
    response.status(200).json({
      status: "success",
      count: stats.length,

      data: {
        stats,
      },
    });
  } catch (error) {
    console.log(err);
    response.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
// const express = require("express");
// let app = express();
// const fs = require("fs");

// let movies = JSON.parse(fs.readFileSync("./data/data.json", "utf-8"));
// app.use(express.json());

// // all functions
// exports.getttALlMovies = (request, response) => {
//   response.status(200).json({
//     status: "success",
//     requestTime: request.requesttime,
//     count: movies.length,
//     data: {
//       movies: movies,
//     },
//   });
// };

// exports.getmovieonbaseofId = (request, response) => {
//   const id = request.prams.id;
//   const movie = movies.find((ele) => ele.id == id);
//   if (!movie) {
//     return response.status(404).json({
//       status: "fail",
//       data: {
//         messege: "no found",
//       },
//     });
//   }

//   response.status(200).json({
//     status: "success",
//     data: {
//       movies: movie,
//     },
//   });
// };
// exports.updatemovie = (request, response) => {
//   const id = request.params.id;
//   const movie = movies.find((ele) => ele.id == id);
//   if (!movie) {
//     return response.status(404).json({
//       status: "fail",
//       data: {
//         messege: "no found",
//       },
//     });
//   }
//   const number = movies.indexOf(movie);

//   Object.assign(movie, request.body);

//   response.status(200).json({
//     status: "success",
//     data: {
//       movies: movie,
//     },
//   });
// };

// exports.deletea = (request, response) => {
//   const id = request.params.id;
//   const movie = movies.find((ele) => ele.id == id);
//   if (!movie) {
//     return response.status(404).json({
//       status: "fail",
//       data: {
//         messege: "no found",
//       },
//     });
//   }
//   const number = movies.indexOf(movie);

//   movies.splice(number, 1);

//   fs.writeFileSync("./data/data.json", JSON.stringify(movies), (error) => {});
//   response.status(200).json({
//     status: "success",
//     messege: "deleted succesfully",
//     data: {
//       movie: movies,
//     },
//   });
// };

// exports.addnew = (request, response) => {
//   const newObject = Object.assign({ id: 9 }, request.body);
//   console.log(newObject);
//   movies.push(newObject);
//   fs.writeFileSync("./data/data.json", JSON.stringify(movies));
//   response.status(201).json({
//     status: "success",
//     data: {
//       movies: newObject,
//     },
//   });
// };
