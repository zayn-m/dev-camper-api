const express = require("express");
const router = express.Router({ mergeParams: true });

const Course = require("../models/Course");
const coursesControllers = require("../controllers/courses");
const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

router
    .route("/")
    .get(
        advancedResults(Course, {
            path: "bootcamp",
            select: "name description",
        }),
        coursesControllers.getCourses
    )
    .post(
        protect,
        authorize("publisher", "admin"),
        coursesControllers.addCourse
    );

router
    .route("/:id")
    .get(coursesControllers.getCourse)
    .put(
        protect,
        authorize("publisher", "admin"),
        coursesControllers.updateCourse
    )
    .delete(
        protect,
        authorize("publisher", "admin"),
        coursesControllers.deleteCourse
    );

module.exports = router;
