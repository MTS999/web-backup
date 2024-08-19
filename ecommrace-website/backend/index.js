const express = require("express")
const cors = require("cors")
require("./db/config")

const app = express()
app.use(express.json());
app.use(cors())

const User = require("./db/User");
const Product = require("./db/Product");



const { resolveInclude } = require("ejs");
app.post("/signup", async (request, response) => {
    let user = new User(request.body)
    let result = await user.save()
    result = result.toObject()
    delete result.password
    response.send(result)
})

app.post("/login", async (request, response) => {
    if (request.body.email && request.body.password) {

        let user = await User.findOne(request.body).select("-password")
        if (user) {
            response.send(user)
          
        }
        else {
            response.status(404).json({ message: "User not found" }); // Send error message as JSON

        }
    }
    else {
        response.status(400).json({ message: "Invalid request" }); // Send error message as JSON

    }

})

app.post("/addproduct", async (request, response) => {
    let product = new Product(request.body)
    let result = await product.save()
    response.send(result)
})

app.get("/product", async (request, response) => {
    let product = await Product.find()
    if (product.length > 0) {

        response.send(product)
    }
    else {
        response.send("NO products found")

    }
})

app.delete("/delete/:id", async (request, response) => {
    let result = await Product.deleteOne({ _id: request.params.id })
    response.send(result)
})


app.put("/update/:id", async (request, response) => {
    let result = await Product.updateOne({ _id: request.params.id },

        {
            $set: request.body
        }
    )
    response.send(result)
})
app.get("/product/:id", async (request, response) => {
    let product = await Product.findOne({ _id: request.params.id })
    if (product) {

        response.send(product)
    }
    else {
        response.send("NO products found")

    }
})


app.get("/search/:key", async (request, response) => {
    let product = await Product.find({
        "$or": [
            {name:{$regex:request.params.key}},
            {price:{$regex:request.params.key}},
            {category:{$regex:request.params.key}}
        ]

    })
    if (product) {

        response.send(product)
    }
    else {
        response.send("NO products found")

    }
})
app.listen(5000)




