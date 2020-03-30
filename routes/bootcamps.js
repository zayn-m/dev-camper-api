const express = require("express");
const router = express.Router();

const Bootcamp = require("../models/Bootcamp");
const bootcampControllers = require("../controllers/bootcamps");
const advancedResults = require("../middleware/advancedResults");

// Include other resource routers
const courseRouters = require("./courses");

// Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouters);

router
    .route("/radius/:zipcode/:distance")
    .get(bootcampControllers.getBootcampsInRadius);

router.route("/:id/photo").put(bootcampControllers.bootcampPhotoUpload);

router
    .route("/")
    .get(advancedResults(Bootcamp, "courses"), bootcampControllers.getBootcamps)
    .post(bootcampControllers.createBootcamp);

router
    .route("/:id")
    .get(bootcampControllers.getBootcamp)
    .put(bootcampControllers.updateBootcamp)
    .delete(bootcampControllers.deleteBootcamp);

module.exports = router;
