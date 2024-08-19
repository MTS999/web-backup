class ApiFeatures{

 constructor(query,queryStr){
    this.query=query
    this.queryStr=queryStr
 }

 filter(){
    const excludeObject = ["sort","fields","page","limit"];
    let filterQuery = { ...this.queryStr };
 
    excludeObject.forEach((element) => {
      delete filterQuery[element];
    });
    let queryString = JSON.stringify(filterQuery);
     queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    const parsedFilterQuery = JSON.parse(queryString);

    // Build the query object
     this.query = this.query.find(parsedFilterQuery);
     return this
 }

 sort(){
    if (this.queryStr.sort) {
        let sortBy;
        if (Array.isArray(this.query.sort)) {
          // If sort is an array, join the elements with commas and then replace commas with spaces
          // this is for   &sort-price&sort=rating
          sortBy = this.queryStr.sort.join(",").split(",").join(" ");
        } else {
          // this is for   sort=price,rating
  
        //   console.log(typeof this.query.sort, request.query.sort);
          // If sort is a string, replace commas with spaces directly
          sortBy = this.queryStr.sort.split(",").join(" ");
        }
        this.query = this.query.sort(sortBy);
      } else {
        this.query = this.query.sort("-createdAt"); 
      }
      return this 
 }
limitFields(){
    if (this.queryStr.fields) {
        const fields = this.queryStr.fields.split(",").join(" ");
        console.log(fields);
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select("-__v");
      }
      return this
}
paginate(){

     const page = this.queryStr.page || 1;

    const limit = this.queryStr.limit || 2;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    // if (request.query.page) {
    //   const count = await Movie.countDocuments();
    //   if (skip >= count) {queryObj
    //     queryObj
    //     queryObj
    //     queryObj
    //     throw new Error("The page is not found");
    //   }
    // }
    return this
}
 }

module.exports=ApiFeatures;  