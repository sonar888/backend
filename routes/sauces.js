const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const saucesCtrl = require('../controllers/sauces');

router.get('/', multer, saucesCtrl.getAllSauces); //auth
router.get('/:id', multer, saucesCtrl.getOneSauce);


router.post('/',auth, multer, saucesCtrl.createSauce); //, multer auth
router.delete('/:id', auth, saucesCtrl.deleteSauce);
router.put('/:id', auth, multer, saucesCtrl.modifySauce);

router.post('/:id/like', saucesCtrl.likeSauce)

module.exports = router;