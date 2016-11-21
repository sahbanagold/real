var Transactions = require('../models/transactions');

exports.transactionsGet = function(req,res,next){
  let pinId = "582ac8caf0e19e56aaf82580" //nannti ganti req.params.id
    Transactions.find({},(err,data) => {
      res.json(data)
    })
}
exports.transactionsPost = function(req,res,next){
  if(req.body.itemname){
    let newItems = []
    for (let i = 0; i < req.body.itemname.length; i++) {
      let newitemname = ""
      let newitemprice = ""
      let newitemquantity = ""
      let newitemtotalprice = ""
      if(req.body.itemname[i] !== "") newitemname =  req.body.itemname[i]
      if(req.body.itemprice[i] !== "") newitemname =  parseInt(req.body.itemprice[i])
      if(req.body.quantity[i] !== "") newitemname =  parseInt(req.body.quantity[i])
      if(req.body.totalprice[i] !== "") newitemname =  parseInt(req.body.totalprice[i])
      if(newitemname !== "" && newitemprice !== "" && newitemquantity !== "" && newitemtotalprice !== ""){
        newItems.push({
                name: String,
                price: Number,
                quantity: Number,
                sums: Number
              })
      }
    }
  }
  if(newItems.length > 0){
    let newTransactions = new Transactions({
      userId: req.body.userId,
      nominal: req.body.nominal,
      recipient: req.body.penerima,
      account: req.body.rekening,
      bank: req.body.bank, 
      status: "UnPaid",
      dateRequested: new Date(),
      notes: req.body.keterangan,
      items: newItems
    })
    newTransactions.save(function (err) {
      if (err){
        throw err
        return
      }
      res.json({success: true,message: "success save transactions"})
    })
  } else{
    res.json({success: false,message: "no transactions saved"})
  }

}
