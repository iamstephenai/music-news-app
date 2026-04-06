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

        // This NEW query adds "AND" logic to ensure the news is about MUSIC
        const artistQuery = `("${ARTISTS.join('" OR "')}")`;
        const musicKeywords = `AND (music OR rock OR concert OR album OR tour OR song OR "rock and roll")`;
        const finalQuery = `${artistQuery} ${musicKeywords}`;
        
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(finalQuery)}&from=${dateStr}&sortBy=relevance&language=en&apiKey=${API_KEY}`;
        
        const response = await axios.get(url);
        const articles = response.data.articles || [];

        let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Legends Music News</title>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-zinc-950 text-white font-sans p-6">
            <div class="max-w-4xl mx-auto">
                <div class="flex justify-between items-end mb-8 border-b-4 border-yellow-600 pb-4">
                    <h1 class="text-4xl font-black uppercase italic tracking-tighter text-yellow-500">Music Legend Tracker</h1>
                    <span class="text-zinc-500 font-mono text-sm">Last 7 Days</span>
                </div>

                <div class="grid gap-8">
                    ${articles.length > 0 ? articles.map(a => `
                        <div class="bg-zinc-900 overflow-hidden rounded-xl border border-zinc-800 hover:border-yellow-600 transition-colors shadow-2xl">
                            <div class="p-6">
                                <div class="flex items-center gap-2 mb-3">
                                    <span class="bg-yellow-600 text-black text-[10px] font-black px-2 py-0.5 rounded uppercase">${a.source.name}</span>
                                    <span class="text-zinc-500 text-xs">${new Date(a.publishedAt).toLocaleDateString()}</span>
                                </div>
                                <h2 class="text-2xl font-bold text-white mb-3 leading-tight underline decoration-yellow-900 hover:decoration-yellow-500 cursor-pointer">${a.title}</h2>
                                <p class="text-zinc-400 text-sm mb-6 line-clamp-3">${a.description || 'No description available for this music update.'}</p>
                                <a href="${a.url}" target="_blank" class="inline-flex items-center text-yellow-500 font-black text-xs uppercase tracking-widest hover:text-white group">
                                    Read Music Report 
                                    <span class="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                                </a>
                            </div>
                        </div>
                    `).join('') : `
                        <div class="text-center py-20 border-2 border-dashed border-zinc-800 rounded-xl">
                            <p class="text-zinc-500 text-lg italic">No specific music news found for these artists in the last 7 days.</p>
                        </div>
                    `}
                </div>
            </div>
        </body>
        </html>`;

        res.send(html);
    } catch (err) {
        console.error(err);
        res.status(500).send("<h1>System updating... please refresh in 10 seconds.</h1>");
    }
});

app.listen(PORT, () => console.log(`Music App Active`));
