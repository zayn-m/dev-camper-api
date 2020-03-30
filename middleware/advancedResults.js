const advancedResults = (model, populate) => async (req, res, next) => {
    let query;
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ["select", "sort", "page", "limit"];

    // Iterate removeFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);

    // Create operators $lt, $lte, $gt etc
    queryStr = queryStr.replace(
        /\b(gt|gte|lt|lte|in)\b/g,
        (match) => `$${match}`
    );

    query = model.find(JSON.parse(queryStr));

    // Select fields
    if (req.query.select) {
        const fields = req.query.select.split(",").join(" ");
        query = query.select(fields);
    }

    // Sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        query = query.sort(sortBy);
    } else {
        query = query.sort({ createdAt: -1 });
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();

    query = query.skip(skip).limit(limit);

    if (populate) {
        query = query.populate(populate);
    }

    // Run query
    const results = await query;

    // Pagination results
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit,
        };
    }

    if (skip > 0) {
        pagination.prev = {
            page: page - 1,
            limit,
        };
    }

    res.advancedResults = {
        success: true,
        count: results.length,
        pagination,
        data: results,
    };

    next();
};

module.exports = advancedResults;
