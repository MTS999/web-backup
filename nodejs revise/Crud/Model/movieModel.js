const mongoose = require("mongoose");
const validator=require("validator")
const movieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    unique: true,
    maxlength: [10, "no more then length of 10  "],
    minlength: [4, "minimum length of 4 is required"],
    trim: true,
  // validate:[validator.isAlpha,"name is not alphanumeric"],
  // validate: [validator.isAlpha, "name is not alphanumeric"],

    },
  description: {
    type: String,
    required: [true, "description is required"],
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, "duration is required"],
  },
  ratings: {
    type: Number,
    // min:[1,"rating must be greater then 1"],
    // max:[10,"rating must be lower then 10"]
    validate:{
      validator:function(value){
        return value>=1 && value<=10
      },
      message:"rating ({VALUE}) must be 1 and 10"
    }
  },
  totalRating: {
    type: Number,
    validator:{
      validator:function(value){
        return value>=1 && value<=10
      },
      message:"rating {value} must be 1 and 10"
    }
  },
  releaseYear: {
    type: Number,
    required: [true, "releae Year is required"],
  },
  releaseDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  genres: {
    type: [String],
    required: [true, "genres is required"],
    enum:{
      values:["Action", "Adventure", "Sci-Fic"] ,
      message:"diels is not include in this"
     }
    // select:false
  },
  directors: {
    type: [String],
    required: [true, "directors is required"],
  },
  actors: {
    type: [String],
    required: [true, "actors is required"],
  },
  price: {
    type: Number,
    required: [true, "actors is required"],
  },
});

const Movie = mongoose.model("movies", movieSchema);

module.exports = Movie;
