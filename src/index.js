const express = require('express')
const bodyparser = require("body-parser")
const mongoose = require('mongoose')
const route=require('./route')

const app = express()

app.use(bodyparser.json())

app.use('/', route)


mongoose.connect("mongodb+srv://shrati:65FywNUvGdDH49SQ@cluster0.tpfb4.mongodb.net/TaxStatus", { useNewUrlParser: true })
.then(() => console.log("database connected"))
.catch((e) => console.log(e))

app.listen(3000, () => console.log("Express app running on " + 3000))