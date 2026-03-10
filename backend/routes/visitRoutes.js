const express = require('express');
const router = express.Router();
const visitController = require('../controllers/visitController');

router.post('/', visitController.scheduleVisit);
router.get('/', visitController.getVisits);
router.put('/:id/outcome', visitController.updateOutcome);

module.exports = router;
