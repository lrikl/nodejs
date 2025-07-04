const express = require('express');
const router = express.Router();

const controller = require('../controllers/messageController');

router.get("/", controller.home);
router.get("/form", controller.showForm);
router.post("/form", controller.submitForm);
router.get("/guests", controller.showMessages);

module.exports = router;