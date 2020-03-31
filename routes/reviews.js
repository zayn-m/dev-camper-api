const express = require("express");
const router = express.Router({ mergeParams: true });

const Review = require("../models/Review");
const reviewsControllers = require("../controllers/reviews");
const { protect, authorize } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

router
    .route("/")
    .get(
        advancedResults(Review, {
            path: "bootcamp",
            select: "name description",
        }),
        reviewsControllers.getReviews
    )
    .post(protect, authorize("user", "admin"), reviewsControllers.addReview);

router
    .route("/:id")
    .get(reviewsControllers.getReview)
    .put(protect, authorize("user", "admin"), reviewsControllers.updateReview)
    .delete(
        protect,
        authorize("user", "admin"),
        reviewsControllers.deleteReview
    );

module.exports = router;
