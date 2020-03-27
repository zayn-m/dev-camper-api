const express = require('express');
const router = express.Router();

const bootcampControllers = require('../controllers/bootcamps');

router.route('/').get(bootcampControllers.getBootcamps).post(bootcampControllers.createBootcamp);

router
	.route('/:id')
	.get(bootcampControllers.getBootcamp)
	.put(bootcampControllers.updateBootcamp)
	.delete(bootcampControllers.deleteBootcamp);

module.exports = router;
