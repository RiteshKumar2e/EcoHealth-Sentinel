export const errorHandler = (err, req, res, next) => {
    const statusCode = err.status || 500;
    console.error(`[Error]: ${err.message}`);

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

export const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.url} not found`
    });
};
