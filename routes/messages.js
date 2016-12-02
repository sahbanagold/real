let express = require('express');
let router = express.Router();
let messages = require('../controllers/messages')

router.get('/:id',messages.MessagesGet)
router.get('/',messages.AllMessagesGet)
router.delete('/:id',messages.MessagesDelete)
router.post('/',messages.MessagesPost)
// router.post('/image',messages.imageMessagesPost)
router.put('/comment/:id',messages.MessagesCommentPut)
router.put('/like/:id',messages.MessagesLikePut)
router.get('/like/:id',messages.MessagesGetLike)

module.exports = router;
