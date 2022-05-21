const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const saucesCtrl = require('../controllers/sauces');

router.get('/', multer, saucesCtrl.getAllSauces); //auth
router.post('/',auth, multer, saucesCtrl.createSauce); //, multer auth
router.get('/:id', multer, saucesCtrl.getOneSauce);

router.delete('/:id', auth, saucesCtrl.deleteSauce);
router.put('/:id', auth, multer, saucesCtrl.modifySauce);

module.exports = router;