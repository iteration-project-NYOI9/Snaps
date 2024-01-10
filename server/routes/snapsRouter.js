const express = require('express');

const router = express.Router();

const snapsController = require('../controllers/snapsController');

router.get('/', snapsController.seeSnaps, (req,res) => {
  return res.status(200).json(res.locals.allSnaps);
});

router.post('/', snapsController.addSnap, (req,res) => {
  return res.status(200).json(res.locals.allSnaps);
});



module.exports = router;