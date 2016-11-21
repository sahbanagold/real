var Transactions = require('../models/transactions');

exports.transactionsGet = function(req,res,next){
  let pinId = "582ac8caf0e19e56aaf82580" //nannti ganti req.params.id
    Transactions.find({},(err,data) => {
      res.json(data)
    })
}
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
                sums: newitemtotalprice
              })
              console.log(newItems,"item pushed")
      }
    }
  }
  console.log(newItems,"tst item")
  if(newItems.length > 0){
    let newTransactions = new Transactions()
      newTransactions.userId= req.body.userId
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
      res.json({success: true,message: "success save transactions"})
    })
  } else{
    res.json({success: false,message: "no transactions saved"})
  }

}
