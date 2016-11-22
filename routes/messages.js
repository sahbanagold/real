let express = require('express');
let router = express.Router();
let messages = require('../controllers/messages')

router.get('/getOneMessage/:id',messages.MessagesGet)
router.get('/getAllMessage',messages.AllMessagesGet)
router.delete('/:id',messages.MessagesDelete)
router.post('/Messagespost',messages.MessagesPost)
router.put('/comment/:id',messages.MessagesCommentPut)
router.put('/like/:id',messages.MessageslikePut)

module.exports = router;
