const path = require("path");
const geocoder = require("../utils/geocoder");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Bootcamp = require("../models/Bootcamp");

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

// @desc    Get single bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found of id: ${req.params.id}`, 404)
        );
    }
    res.status(200).json(bootcamp);
});

// @desc    Create new bootcamp document
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    let newBootcamp;
    newBootcamp = await Bootcamp.create(req.body);
    res.status(201).json(newBootcamp);
});

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found of id: ${req.params.id}`, 404)
        );
    }

    res.status(201).json(bootcamp);
});

// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found of id: ${req.params.id}`, 404)
        );
    }

    bootcamp.remove();

    res.status(200).json(bootcamp);
});

// @desc    Get bootcamps within specific radius
// @route   DELETE /api/v1/bootcamps/radius/:zipcode/:distance
// @access  Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    // Get lat lon from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc radius using radians
    // Divide distance by radius of Earth
    // Earth radius is 3963 mi / 6378 km
    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    });

    res.status(200).json(bootcamps);
});

// @desc    Uploading photo for bootcamp
// @route   PUT /api/v1/bootcamps/:id/photo
// @access  Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found of id: ${req.params.id}`, 404)
        );
    }

    if (!req.files) {
        return next(new ErrorResponse("Please upload a image", 404));
    }

    const file = req.files.file;

    if (!file.mimetype.startsWith("image"))
        return next(new ErrorResponse("Please upload a image", 400));

    if (file.size > process.env.MAX_FILE_UPLOAD)
        return next(
            new ErrorResponse(
                `Max file of ${process.env.MAX_FILE_UPLOAD} bytes is allowed`,
                400
            )
        );

    // Creating custom filename
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
        if (err) {
            console.error(err);
            return next(new ErrorResponse("Problem with file upload", 500));
        }

        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

        res.status(200).json({
            success: true,
            data: file.name,
        });
    });
});
