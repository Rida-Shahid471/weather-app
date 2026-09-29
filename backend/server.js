const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/weather", async (req, res) => {
    try {
        const location = req.query.location;

        if (!location) {
            return res.status(400).json({
                error: "Please provide a location."
            });
        }

        const apiKey = process.env.WEATHER_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                error: "Weather API key is not configured."
            });
        }

        const apiURL =
            `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(location)}&aqi=yes`;

        const response = await fetch(apiURL);

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        res.json(data);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Unable to fetch weather data."
        });
    }
});

app.get("/", (req, res) => {
    res.send("SkyCast Weather Backend is running!");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});