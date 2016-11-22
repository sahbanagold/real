let Warehouse = require('../models/warehouse')
exports.warehouseDelete = function(req,res,next){
    Warehouse.remove({_id: req.params.id},(err,data) => {
      if(err){
        console.log(err)
        return res.json({success: false, message: "failed to delete, warehouse not found "})
      }
      res.json({success: true, message: "delete warehouse success"})
    })
}
exports.warehousePost = function(req,res,next){
  let newWarehouse = new Warehouse()
  newWarehouse.name = req.body.name
  newWarehouse.userId = req.body.userId
  newWarehouse.type = req.body.type
  newWarehouse.location = req.body.location
    newWarehouse.save((err) => {
      if(err){
        console.log(err)
        return res.json({success: false, message: "save new warehouse failed"})
      }
      res.json({success: true, message: "save new warehouse success"})
    })
}
exports.warehousePut = function(req,res,next){
Warehouse.find({_id: req.params.id},(err,data) => {
  data.name = req.body.name
  data.userId = req.body.userId
  data.type = req.body.type
  data.location = req.body.location
    data.save((err) => {
      if(err){
        console.log(err)
        return res.json({success: false, message: "warehouse not found"})
      }
      res.json({success: true, message: "update warehouse success"})
    })
  })
}
exports.warehousePicturePut = function(req,res,next){
Warehouse.find({_id: req.params.id},(err,data) => {
  data.profilePicture = req.body.profile
  data.profilePictureThumb = req.body.thumb  
    data.save((err) => {
      if(err){
        console.log(err)
        return res.json({success: false, message: "warehouse not found"})
      }
      res.json({success: true, message: "update warehouse success"})
    })
  })
}
exports.warehouseGet = function(req,res,next){
    Warehouse.find({}).populate('userId').exec((err,data) => {
      res.json(data)
    })
}
