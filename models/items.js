'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const itemSchema = new Schema({
  name: String,
})

const Items = mongoose.model('items', itemSchema)
module.exports = Items
