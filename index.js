const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');

const ARTISTS = [
    "Paul McCartney",
    "Elvis Presley",
    "Bruce Springsteen",
    "Burton Cummings Guess Who",
    "Neil Sedaka"
];

app.get('/', async (req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const dateString = sevenDaysAgo.toISOString().split('T')[0];

        const query = `("${ARTISTS.join('" OR "')}")`;
        
        const response = await axios.get(`https://newsapi.org/v2/everything`, {
            params: {
                q: query,
                from: dateString,
                sortBy: 'publishedAt',
                language: 'en',
                apiKey: 'b1426c01a2e040e091a09d57d0e67570' // YOUR KEY ADDED HERE
            }
        });

        res.render('index', { articles: response.data.articles, artists: ARTISTS });
    } catch (error) {
        console.error(error);
        res.send("Error fetching news. Please check your API limits.");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running!`);
});
