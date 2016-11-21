'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const messageSchema =  new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  content: String,
  comments: [
    {{
      userId: Schema.Types.ObjectId,
      ref: 'users'
    },comment: String,
    likes: [
      {
        userId: Schema.Types.ObjectId,
        ref: 'users'
      }
    ]
    }
  ],
  likes: [
    {
      userId: Schema.Types.ObjectId,
      ref: 'users'
    }
  ],
  tags: [
    {
      userId: Schema.Types.ObjectId,
      ref: 'users'
    }
  ]
}, {
  timestamps: true
})

let Messages = mongoose.model('messages', messageSchema)
module.exports = TimeLines
