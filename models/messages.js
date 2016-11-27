'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const messageSchema =  new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  content: String,
  image:String,
  comments: [{
    commenter:Object,
    comment: String,
    likes: [Object]
  }],
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'users'
    }
  ],
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: 'users'
    }
  ]
}, {
  timestamps: true
})

let Messages = mongoose.model('messages', messageSchema)
module.exports = Messages
