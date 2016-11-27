var Transactions = require('../models/transactions')
var Warehouse = require('../models/warehouse')
var User = require('../models/users')
// exports.transactionsSeeds = function(req,res,next){
//   let newItems = []
//   console.log(req.body)
//   if(req.body.itemname){
//     for (let i = 0; i < req.body.itemname.length; i++) {
//       let newitemname = ""
//       let newitemprice = ""
//       let newitemquantity = ""
//       let newitemtotalprice = ""
//       if(req.body.itemname[i] !== "") newitemname =  req.body.itemname[i]
//       if(req.body.itemprice[i] !== "") newitemprice =  parseInt(req.body.itemprice[i])
//       if(req.body.quantity[i] !== "") newitemquantity =  parseInt(req.body.quantity[i])
//       if(req.body.totalprice[i] !== "") newitemtotalprice =  parseInt(req.body.totalprice[i])
//       if(newitemname !== "" && newitemprice !== "" && newitemquantity !== "" && newitemtotalprice !== ""){
//         newItems.push({
//                 name: newitemname,
//                 price: newitemprice,
//                 quantity: newitemquantity,
//                 totalprice: newitemtotalprice
//               })
//       }
//     }
//   }
//
//   if(newItems.length > 0){
//     let newTransactions = new Transactions()
//       newTransactions.userId= req.session.userId
//       newTransactions.nominal= req.body.nominal
//       newTransactions.recipient= req.body.penerima
//       newTransactions.account= req.body.rekening
//       newTransactions.bank= req.body.bank
//       newTransactions.status= "UnPaid"
//       newTransactions.dateRequested= new Date()
//       newTransactions.notes= req.body.keterangan
//       newTransactions.items= newItems
//       newTransactions.save(function (err) {
//         if (err){
//           console.log(err)
//           return
//         }
//         newTransactions.populate('userId').populate(function (err, saved) {
//           if (err){
//             console.log(err)
//             return
//           }
//           res.json({success: true,message: "success save transactions", data: saved})
//         })
//       })
//   } else{
//     res.json({success: false,message: "no transactions saved"})
//   }
// }

exports.userSeeds = function(req, res, next) {
  let name =["Sahbana Gold","Ivan Gerard","Ari Adi ","Tevin Amos","Rony","Andrew","Septian","Raisa"]
  let email = ["sahbanalo@gmail.com","ivan@gmail.com","ari@gmail.com","tevin@gmail.com","ronney.halim@gmail.com","andrew@gmail.com","septian@gmail.com","raisa@gmail.com"]
  let password = ["bana","ivan","ari","tevin","rony","andrew","septian","raisa"]
  let role = [0,1]
  let index = 1
  for (var i = 0; i < name.length; i++) {
    let newUser = new User()
    newUser.name = name[i]
    newUser.userEmail = email[i]
    newUser.role = role
    newUser.encryptedPassword = newUser.generateHash(password[i])
    newUser.isActive = 'Active'
    newUser.profilePicture = "/images/testimonials/1.jpg"
    newUser.save(function (err) {
      if(err){
        console.log("error creating new user with error: ",err)
        return res.json({success: false, message: "save new user failed"})
      }
      if(index++ == name.length) res.json({success: true, message: "new user added"})
    })
  }
}

// exports.warehouseSeeds = function(req,res,next){
//   let gudangName = ["Gudang Padang","Gudang Jakarta","Gudang Semarang","Gudang Surabaya"]
//   let location = ["Padang","Jakarta Barat","Semarang","Surabaya"]
//   for(var i=0;i<gudangName.length;i++) {
//     Users.find({}).exec((err,user) => {
//       if(err){
//         console.log(err)
//         return res.json({success: false, message: "message not found "})
//       }
//       for(let j;j<user.length;j++){
//           for(let k;k<user.length;k++){
//             let newWarehouse = new Warehouse()
//             newWarehouse.name = gudangName[i]
//             newWarehouse.userId = user[j]._id
//             newWarehouse.type = "Gudang Utama"
//             newWarehouse.location = location[k]
//             newWarehouse.save((err) => {
//               if(err){
//                 console.log(err)
//                 return res.json({success: false, message: "save new warehouse failed"})
//               }
//               res.json({success: true, message: "save new warehouse success"})
//             })
//           }
//       }
//     })
//   }
// }
