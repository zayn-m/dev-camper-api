const express = require("express");
const router = express.Router({ mergeParams: true });

const Course = require("../models/Course");
const coursesControllers = require("../controllers/courses");
const advancedResults = require("../middleware/advancedResults");

router
    .route("/")
    .get(
        advancedResults(Course, {
            path: "bootcamp",
            select: "name description",
        }),
        coursesControllers.getCourses
    )
    .post(coursesControllers.addCourse);

router
    .route("/:id")
    .get(coursesControllers.getCourse)
    .put(coursesControllers.updateCourse)
    .delete(coursesControllers.deleteCourse);

module.exports = router;
