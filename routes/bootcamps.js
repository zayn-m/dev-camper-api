const express = require("express");
const router = express.Router();

const Bootcamp = require("../models/Bootcamp");
const bootcampControllers = require("../controllers/bootcamps");
const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

// Include other resource routers
const courseRouters = require("./courses");
const reviewsRouters = require("./reviews");

// Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouters);
router.use("/:bootcampId/reviews", reviewsRouters);

router
    .route("/radius/:zipcode/:distance")
    .get(bootcampControllers.getBootcampsInRadius);

router
    .route("/:id/photo")
    .put(
        protect,
        authorize("publisher", "admin"),
        bootcampControllers.bootcampPhotoUpload
    );

router
    .route("/")
    .get(advancedResults(Bootcamp, "courses"), bootcampControllers.getBootcamps)
    .post(
        protect,
        authorize("publisher", "admin"),
        bootcampControllers.createBootcamp
    );

router
    .route("/:id")
    .get(bootcampControllers.getBootcamp)
    .put(
        protect,
        authorize("publisher", "admin"),
        bootcampControllers.updateBootcamp
    )
    .delete(
        protect,
        authorize("publisher", "admin"),
        bootcampControllers.deleteBootcamp
    );

module.exports = router;
