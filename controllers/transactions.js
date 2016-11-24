var Transactions = require('../models/transactions')
var Warehouse = require('../models/warehouse')
exports.transactionsGet = function(req,res,next){
    Transactions.find({_id:req.params.id}).sort({date:-1}).exec((err,data) => {
      if(err){
        console.log(err)
        return res.json({success: false, message: "transaction not found"})
      }
      res.json({success: true, data: data})
    })
}
exports.transactionsFilterGet = function(req,res,next){
    Transactions.find({userId:req.params.id}).sort({date:-1}).exec((err,data) => {
      if(err){
        console.log(err)
        return res.json({success: false, message: "transaction not found"})
      }
      res.json({success: true, data: data})
    })
}
// Maps.find({createdAt:{$gt: startDate, $lt: dateMidnight}}).exec(function(err,result){

exports.allTransactionsGet = function(req,res,next){
  let startDate = new Date()
  let dateMidnight = new Date(startDate)

  startDate.setSeconds(0);
  startDate.setHours(0);
  startDate.setMinutes(0);

  dateMidnight.setHours(23);
  dateMidnight.setMinutes(59);
  dateMidnight.setSeconds(59);
  //
  // dateMidnight.setDate(dateMidnight.getDate()-1)
  // startDate.setDate(startDate.getDate()-1)

  Warehouse.find({},(err,data) => {
    if(err){
      console.log(err)
      return res.json({success: false, message: "error, wareHouse not found"})
    }
    let datas = []
    let i = 1
    data.forEach((warehouse)=>{
      Transactions.find({userId: warehouse.userId}).or([
        { $or: [
          {createdAt:{$gt: startDate, $lt: dateMidnight}},
          {status: "UnPaid"}]
        }])
        .sort({date:-1}).populate('userId').exec((err,transactions) => {
        if(err){
          console.log(err)
          return res.json({success: false, message: "transaction not found"})
        }
        let newobject = Object.assign({},{
          userId: warehouse.userId,
          name: warehouse.name,
          profilePicture: warehouse.profilePicture,
          profilePictureThumb: warehouse.profilePictureThumb,
          type: warehouse.type,
          _id: warehouse._id,
          location: warehouse.location,
          transactions: transactions
          })

        datas.push(newobject)
        if(i++ == data.length){
            res.json({success: true, data: datas})
        }

      })
    })

  })
}
/////
// exports.allTransactionsGet = function(req,res,next){
//   Warehouse.find({},(err,data) => {
//     if(err){
//       console.log(err)
//       return res.json({success: false, message: "error, wareHouse not found"})
//     }
//     let datas = []
//     let i = 1
//     data.forEach((warehouse)=>{
//       Transactions.find({userId: warehouse.userId}).sort({date:-1}).populate('userId').exec((err,transactions) => {
//         if(err){
//           console.log(err)
//           return res.json({success: false, message: "transaction not found"})
//         }
//         let newobject = Object.assign({},{
//           userId: warehouse.userId,
//           name: warehouse.name,
//           profilePicture: warehouse.profilePicture,
//           profilePictureThumb: warehouse.profilePictureThumb,
//           type: warehouse.type,
//           _id: warehouse._id,
//           location: warehouse.location,
//           transactions: transactions
//           })
//
//         datas.push(newobject)
//         if(i++ == data.length){
//             res.json({success: true, data: datas})
//         }
//
//       })
//     })
//
//   })
// }
exports.transactionsPost = function(req,res,next){
  let newItems = []
  console.log(req.body)
  if(req.body.itemname){
    for (let i = 0; i < req.body.itemname.length; i++) {
      let newitemname = ""
      let newitemprice = ""
      let newitemquantity = ""
      let newitemtotalprice = ""
      if(req.body.itemname[i] !== "") newitemname =  req.body.itemname[i]
      if(req.body.itemprice[i] !== "") newitemprice =  parseInt(req.body.itemprice[i])
      if(req.body.quantity[i] !== "") newitemquantity =  parseInt(req.body.quantity[i])
      if(req.body.totalprice[i] !== "") newitemtotalprice =  parseInt(req.body.totalprice[i])
      if(newitemname !== "" && newitemprice !== "" && newitemquantity !== "" && newitemtotalprice !== ""){
        newItems.push({
                name: newitemname,
                price: newitemprice,
                quantity: newitemquantity,
                totalprice: newitemtotalprice
              })

      }
    }
  }

  if(newItems.length > 0){
    let newTransactions = new Transactions()
      newTransactions.userId= req.session.userId
      newTransactions.nominal= req.body.nominal
      newTransactions.recipient= req.body.penerima
      newTransactions.account= req.body.rekening
      newTransactions.bank= req.body.bank
      newTransactions.status= "UnPaid"
      newTransactions.dateRequested= new Date()
      newTransactions.notes= req.body.keterangan
      newTransactions.items= newItems
      newTransactions.save(function (err) {
        if (err){
          console.log(err)
          return
        }
        newTransactions.populate('userId').populate(function (err, saved) {
          if (err){
            console.log(err)
            return
          }
          res.json({success: true,message: "success save transactions", data: saved})
        })
      })
  } else{
    res.json({success: false,message: "no transactions saved"})
  }
}

exports.transactionsPut = function(req,res,next){
    Transactions.find({_id: req.params.id},(err,transaction) => {
      transaction[0].status = "Paid"
      transaction[0].save(function (err) {
        if (err){
          console.log(err)
          return res.json({success: false,message: "update transaction payment status failed"})
        }
        res.json({success: true,message: "success save transaction payment status", data: transaction[0]})
    })
  })
}
