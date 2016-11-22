let Messages = require('../models/messages')
exports.MessagesDelete = function(req,res,next){
    Messages.remove({_id: req.params.id},(err,data) => {
      if(err){
        console.log(err)
        return res.json({success: false, message: "failed to delete, message not found "})
      }
      res.json({success: true, message: "delete warehouse success"})
    })
}
exports.MessagesGet = function(req,res,next){
    Messages.find({_id: req.params.id},(err,data) => {
      if(err){
        console.log(err)
        return res.json({success: false, message: "message not found "})
      }
      res.json({success: true, data: data})
    })
}
exports.AllMessagesGet = function(req,res,next){
    Messages.find({},(err,data) => {
      if(err){
        console.log(err)
        return res.json({success: false, message: "message not found "})
      }
      res.json({success: true, data:data})
    })
}
exports.MessagesPost = function(req,res,next){

  let newMessage = new Messages()
  newMessage.content = req.body.content
  newMessage.userId = req.body.userId
  newMessage.tags = req.body.tags
    newMessage.save((err) => {
      if(err){
        console.log(err)
        return res.json({success: false, message: "save new message failed"})
      }
      res.json({success: true, message: "save new message success"})
    })
}
exports.MessagesCommentPut = function(req,res,next){
  Messages.find({_id: req.params.id},(err,data)=>{
    data.comments.push({userId: req.body.userId, comment: req.body.comment})
    data.save((err) => {
      if(err){
        console.log(err)
        return res.json({success: false, message: "save new comment failed"})
      }
      res.json({success: true, message: "save new comment success", count: data.comments.length})
    })
  })
}
exports.MessagesLikePut = function(req,res,next){
  Messages.find({_id: req.params.id},(err,data)=>{
    data.likes.push({userId: req.body.userId})
    data.save((err) => {
      if(err){
        console.log(err)
        return res.json({success: false, message: "save new like failed"})
      }
      res.json({success: true, message: "save new like success", count: data.likes.length})
    })
  })
}
