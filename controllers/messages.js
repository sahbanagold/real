let Messages = require('../models/messages')
const path = require('path')
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
    Messages.find({_id: req.params.id}).sort({date:-1}).exec((err,data) => {
      if(err){
        console.log(err)
        return res.json({success: false, message: "message not found "})
      }
      res.json({success: true, data: data})
    })
}
exports.AllMessagesGet = function(req,res,next){
    Messages.find({}).sort({date:-1}).populate('userId').exec((err,data) => {
      if(err){
        console.log(err)
        return res.json({success: false, message: "message not found "})
      }
      res.json({success: true, data:data})
    })
}
// exports.imageMessagesPost = function(req,res,next){
// console.log(req.files, "ini files message image");
// console.log(req);
// res.json({success:true})
//   // let newMessage = new Messages()
//   // newMessage.content = req.body.content
//   // newMessage.userId = req.session.userId
//   // newMessage.tags = req.body.tags
//   //   newMessage.save((err) => {
//   //     if(err){
//   //       console.log(err)
//   //       return res.json({success: false, message: "save new message failed"})
//   //     }
//   //     res.json({success: true, message: "save new message success", data:newMessage})
//   //   })
// }
exports.MessagesPost = function(req,res,next){
  var item_image
  var realpath
  console.log(req.files,"realpath luar")
  let newMessage = new Messages()
  newMessage.content = req.body.content
  newMessage.userId = req.session.userId
  newMessage.tags = req.body.tags

      if (req.files.photo.name != "") {
      item_image = req.files.photo
      var idimg  = new Date().getTime()
      realpath = path.join(__dirname,'../public/images/messages/')+idimg+item_image['name']
      console.log(realpath, "realpath dalam");
      item_image.mv(realpath, function(err) {
         if (err) {
             return res.status(500).send(err);
         }

           newMessage.image = 'http://'+req.headers.host+'/images/messages/'+idimg+item_image['name']
           newMessage.save(function (err) {
             if (err){
               console.log(err)
               return res.json({success: false,message: "message not found"})
             }
             console.log(newMessage,"new message test");
             res.json({success: true,message: "success save message", data: newMessage})
         })
      })
    } else{
      newMessage.image = 'http://'+req.headers.host+"images/testimonials/1.jpg"
      newMessage.save((err) => {
        if(err){
          console.log(err)
          return res.json({success: false, message: "save new message failed"})
        }
      res.json({success: true, message: "save new message success", data:newMessage})
      })
    }




}
exports.MessagesCommentPut = function(req,res,next){
  Messages.find({_id: req.params.id},(err,data)=>{
    console.log(req.body, "ini test command body");
    data[0].comments.push({commenter: req.session.userId, comment: req.body.comment})
    console.log(data[0].comments,"tst comment masuk");
    data[0].save((err) => {
      if(err){
        console.log(err)
        return res.json({success: false, message: "save new comment failed"})
      }
      res.json({success: true, message: "save new comment success", count: data[0].comments.length})
    })
  })
}
exports.MessagesLikePut = function(req,res,next){
  Messages.findOne({_id: req.params.id},(err,data)=>{
    data.likes.push(req.session.userId)
    data.save((err) => {
      if(err){
        console.log(err)
        return res.json({success: false, message: "save new like failed"})
      }
      res.json({success: true, message: "save new like success", count: data.likes.length})
    })
  })
}
