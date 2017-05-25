'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const transactionsSchema =  new Schema({
  userId: Object,
  nominal: Number,
  recipient: String,
  account: String,
  bank: String,
  transactionsType: {
            type: String,
            enum: ['Real', 'Estimation']
          },
  verification: {
            type: String,
            enum: ['Verified', 'UnVerified']
          },
  verificationToken : String,
  verificationTokenExpires : Date,
  status: {
            type: String,
            enum: ['Paid', 'UnPaid']
          },
  dateRequested: Date,
  datePayed: Date,
  notes: String,
  items: [{
          name: String,
          price: Number,
          quantity: Number,
          totalprice: Number
        }]
}, {
  timestamps: true
})

let Transactions = mongoose.model('transactions', transactionsSchema)
module.exports = Transactions
