import express from "express";

const app = express();

app.get("/health", (_req, res) => {
    try {
        res.status(200).json({
            status: "healthy",
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        res.status(503).json({
            status: "unhealthy",
            timestamp: new Date().toISOString(),
            error: error,
        });
    }
});

app.listen(3001, () => {
    console.log(`Server running on port 3001`);
});
