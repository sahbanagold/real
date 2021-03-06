let Messages = require('../models/messages')
let Users = require('../models/users')
const path = require('path')

exports.MessagesDelete = function(req,res,next){
  // if (!req.isAuthenticated()) {
  //   return res.redirect('/');
  // }
    Messages.remove({_id: req.params.id},(err,data) => {
      if(err){
        console.log(err)
        return res.json({success: false, message: "failed to delete, message not found "})
      }
      res.json({success: true, message: "delete warehouse success"})
    })
}
exports.MessagesGetLike = function(req,res,next){
  // if (!req.isAuthenticated()) {
  //   return res.redirect('/');
  // }
    Messages.findOne({_id:req.params.id},{'likes':1}).populate('likes','name profilePicture').exec((err,data) => {
      if(err){
        console.log(err)
        return res.json({success: false, message: "message not found "})
      }
      res.json({success: true, data: data})
    })
}
exports.MessagesGet = function(req,res,next){
  // if (!req.isAuthenticated()) {
  //   return res.redirect('/');
  // }
    Messages.find({_id: req.params.id}).sort({date:-1}).exec((err,data) => {
      if(err){
        console.log(err)
        return res.json({success: false, message: "message not found "})
      }
      data.map(msg=>{

      })
      res.json({success: true, data: data})
    })
}
exports.AllMessagesGet = function(req,res,next){
  // if (!req.isAuthenticated()) {
  //   return res.redirect('/');
  // }
    Messages.find({})
    .sort({createdAt:-1})
    .limit(10)
    .exec((err,data) => {
      if(err){
        console.log(err)
        return res.json({success: false, message: "message not found "})
      }


      res.json({success: true, data:data})
    })
}

exports.loadMoreMessagesGet = function(req,res,next){
  // if (!req.isAuthenticated()) {
  //   return res.redirect('/');
  // }
    Messages
      .findOne({_id:req.params.id})
      .then(message=>{
          if(message){
            Messages.find({createdAt:{$lt:new Date(message.createdAt)}})
            .sort({createdAt:-1})
            .populate('userId','name profilePicture')
            .populate('comments.commenter','name profilePicture')
            .limit(10)
            .exec((err,data) => {
              if(err){
                console.log(err)
                return res.json({success: false, message: "message not found "})
              }

              res.json({success: true, data:data})
            })
          } else{
            return res.json({success: false, message: "message not found "})
          }
      })

}

exports.lastMessageIdGet = function (req,res,next) {
  // if (!req.isAuthenticated()) {
  //   return res.redirect('/');
  // }
    Messages.findOne({})
    .sort({createdAt:1})
    .exec((err,data) => {
      if(data){
        res.json({success: true,message:"last message data content", data:data, lastId: data._id})
      } else {
        console.log(err)
        return res.json({success: false, message: "message not found "})
      }
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
  // if (!req.isAuthenticated()) {
  //   return res.redirect('/');
  // }
  var item_image
  var realpath
  console.log(req.files,"realpath luar")
  let newMessage = new Messages()
  newMessage.content = req.body.content
  newMessage.userId = {
    _id : req.session.userId,
    userEmail: req.session.email,
    profilePicture: req.session.profilePict,
    name: req.session.name
  }
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
             Messages.findOne({_id: newMessage._id}).populate('userId','name profilePicture').exec(function (err, message) {
               if (err){
                 console.log(err)
                 return res.json({success: false,message: "message not found"})
               }
               res.json({success: true,message: "success save message", data: message})
             })

         })
      })
    } else{
      newMessage.image = ""
      newMessage.save((err) => {
        if(err){
          console.log(err)

          return res.json({success: false, message: "save new message failed"})
        }
        Messages.findOne({_id: newMessage._id}).populate('userId','name profilePicture').exec(function (err, message) {
          if (err){
            console.log(err)
            return res.json({success: false,message: "message not found"})
          }
          res.json({success: true,message: "success save message", data: newMessage})
        })
      })
    }




}
exports.MessagesCommentPut = function(req,res,next){
  // if (!req.isAuthenticated()) {
  //   return res.redirect('/');
  // }
  Messages.find({_id: req.params.id},(err,data)=>{
    console.log(req.body, "ini test command body");
    data[0].comments.push({commenter: {
      _id : req.session.userId,
      userEmail: req.session.email,
      profilePicture: req.session.profilePict,
      name: req.session.name
    }, comment: req.body.comment})
    data[0].save((err) => {
      if(err){
        console.log(err)
        return res.json({success: false, message: "save new comment failed", err: err})
      }
      res.json({success: true, message: "save new comment success", count: data[0].comments.length, name: req.session.name, data: user})
    })
  })
}
exports.MessagesLikePut = function(req,res,next){
  // if (!req.isAuthenticated()) {
  //   return res.redirect('/');
  // }
  Messages.findOne({_id: req.params.id},(err,data)=>{
    if(err){
        return res.json({success: false, message: "post not found"})
    }
    if(data.likes.indexOf(req.session.userId) < 0) {
    data.likes.push(req.session.userId)
    data.save((err) => {
      if(err){
        console.log(err)
        return res.json({success: false, message: "save new like failed"})
      }
      res.json({success: true, message: "save new like success", count: data.likes.length})
    })
  } else{
    return res.json({success: false, message: "you have liked this post",count: data.likes.length})
  }
  })
}
