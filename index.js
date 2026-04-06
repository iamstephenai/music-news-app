const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

const ARTISTS = ["Paul McCartney", "Elvis Presley", "Bruce Springsteen", "Burton Cummings", "Neil Sedaka"];
const API_KEY = 'b1426c01a2e040e091a09d57d0e67570';

app.get('/', async (req, res) => {
    try {
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        const dateStr = lastWeek.toISOString().split('T')[0];

        const query = `("${ARTISTS.join('" OR "')}")`;
        
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&from=${dateStr}&sortBy=publishedAt&language=en&apiKey=${API_KEY}`;
        
        const response = await axios.get(url);
        const articles = response.data.articles || [];

        let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Music News</title>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-900 text-white font-sans p-4">
            <div class="max-w-3xl mx-auto">
                <h1 class="text-3xl font-black text-yellow-500 mb-6 border-b-2 border-yellow-500 pb-2 uppercase italic">Rock Legends 7-Day News</h1>
                <div class="space-y-6">
                    ${articles.length > 0 ? articles.map(a => `
                        <div class="bg-gray-800 p-5 rounded-lg border border-gray-700 shadow-md">
                            <h2 class="text-xl font-bold text-white mb-2 leading-tight">${a.title}</h2>
                            <p class="text-gray-400 text-sm mb-4">${a.description || ''}</p>
                            <div class="flex justify-between items-center">
                                <span class="text-xs text-yellow-600 font-mono">${new Date(a.publishedAt).toDateString()}</span>
                                <a href="${a.url}" target="_blank" class="bg-yellow-600 text-black px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">Read More</a>
                            </div>
                        </div>
                    `).join('') : '<p class="text-center text-gray-500">No news found for the last 7 days.</p>'}
                </div>
            </div>
        </body>
        </html>`;

        res.send(html);
    } catch (err) {
        console.error(err);
        res.status(500).send("<h1>News source is loading... please refresh in 30 seconds.</h1>");
    }
});

app.listen(PORT, () => console.log(`App running on port ${PORT}`));
