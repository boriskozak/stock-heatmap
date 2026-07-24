/**
 * api.js — Fetches live stock data from our local Python proxy server
 * The proxy hits Yahoo Finance v8 chart API server-side (no CORS issues)
 */

const StockAPI = (() => {
    'use strict';

    const API_URL = '/api/quotes';

    /**
     * Collect all tickers from SECTORS
     */
    function getAllTickers() {
        const tickers = [];
        for (const [, data] of Object.entries(SECTORS)) {
            for (const stock of data.stocks) {
                tickers.push(stock.ticker);
            }
        }
        return tickers;
    }

    /**
     * Fetch live quotes for all tickers via our local proxy
     * Returns true if SECTORS was updated
     */
    async function updateStockData() {
        const tickers = getAllTickers();
        console.log(`[StockAPI] Fetching ${tickers.length} quotes via local proxy...`);

        // Split into batches of 50 to avoid URL length limits
        const batchSize = 50;
        const allQuotes = {};
        const batches = [];

        for (let i = 0; i < tickers.length; i += batchSize) {
            batches.push(tickers.slice(i, i + batchSize));
        }

        const fetchBatch = async (batch) => {
            const url = `${API_URL}?symbols=${batch.join(',')}`;
            const resp = await fetch(url);
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const data = await resp.json();
            return data.quotes || {};
        };

        // Fetch all batches in parallel
        const results = await Promise.allSettled(batches.map(fetchBatch));

        for (const result of results) {
            if (result.status === 'fulfilled') {
                Object.assign(allQuotes, result.value);
            }
        }

        const fetchedCount = Object.keys(allQuotes).length;
        if (fetchedCount === 0) {
            console.warn('[StockAPI] No live data received');
            return false;
        }

        // Update SECTORS in place
        for (const [, data] of Object.entries(SECTORS)) {
            for (const stock of data.stocks) {
                const q = allQuotes[stock.ticker];
                if (q) {
                    stock.price = q.price ?? stock.price;
                    stock.change = q.change ?? stock.change;
                    stock.weekChange = q.weekChange ?? stock.weekChange;
                    if (q.volume) stock.volume = q.volume;
                    if (q.name) stock.name = q.name;
                }
            }
        }

        console.log(`[StockAPI] Updated ${fetchedCount}/${tickers.length} stocks with live data`);
        return true;
    }

    return { updateStockData, getAllTickers };
})();
