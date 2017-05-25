'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const messageSchema =  new Schema({
  userId: Object,
  content: String,
  image:String,
  comments: [{
    commenter:Object,
    comment: String,
    likes: [Object]
  }],
  likes: [
    Object
  ],
  tags: [
    Object
  ]
}, {
  timestamps: true
})

let Messages = mongoose.model('messages', messageSchema)
module.exports = Messages
