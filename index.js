onst express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

const ARTISTS = ["Paul McCartney", "Elvis Presley", "Bruce Springsteen", "Burton Cummings", "Neil Sedaka"];

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
                apiKey: 'b1426c01a2e040e091a09d57d0e67570'
            }
        });

        const articles = response.data.articles || [];
        let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Music Legends News</title>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-black text-white p-5 font-sans">
            <div class="max-w-4xl mx-auto">
                <h1 class="text-4xl font-bold text-yellow-500 mb-8 border-b border-yellow-500 pb-2">MUSIC LEGENDS NEWS</h1>
                <div class="grid gap-6">
                    ${articles.map(a => `
                        <div class="bg-zinc-900 p-6 rounded border border-zinc-800 shadow-xl">
                            <small class="text-zinc-500 font-bold">${new Date(a.publishedAt).toDateString()}</small>
                            <h2 class="text-xl font-bold my-2 hover:text-yellow-400 leading-tight">${a.title}</h2>
                            <p class="text-zinc-400 mb-4 text-sm">${a.description || ''}</p>
                            <a href="${a.url}" target="_blank" class="text-yellow-500 font-bold hover:underline">READ STORY →</a>
                        </div>
                    `).join('')}
                </div>
            </div>
        </body>
        </html>`;
        res.send(htmlContent);
    } catch (error) {
        res.send("<h1>News source is busy. Please refresh in 10 seconds.</h1>");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running!`);
});
