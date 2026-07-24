/**
 * stocks.js - S&P 500 stock data organized by sector
 * Realistic market cap weights and simulated daily changes
 */

const SECTORS = {
    "Technology": {
        stocks: [
            { ticker: "AAPL", name: "Apple Inc.", marketCap: 3440, price: 228.50, change: 1.85, weekChange: 3.20, volume: 58200000, isMajor: true },
            { ticker: "MSFT", name: "Microsoft Corp.", marketCap: 3180, price: 449.20, change: -0.42, weekChange: 1.10, volume: 22100000, isMajor: true },
            { ticker: "NVDA", name: "NVIDIA Corp.", marketCap: 2890, price: 118.40, change: 3.72, weekChange: 8.50, volume: 312000000, isMajor: true },
            { ticker: "AVGO", name: "Broadcom Inc.", marketCap: 820, price: 178.30, change: 2.15, weekChange: 5.40, volume: 32000000, isMajor: true },
            { ticker: "ORCL", name: "Oracle Corp.", marketCap: 510, price: 183.90, change: 0.65, weekChange: 2.10, volume: 8500000 },
            { ticker: "CRM", name: "Salesforce Inc.", marketCap: 310, price: 320.40, change: -1.20, weekChange: -2.80, volume: 6200000 },
            { ticker: "AMD", name: "Advanced Micro Devices", marketCap: 280, price: 172.30, change: 2.90, weekChange: 6.70, volume: 42000000, isMajor: true },
            { ticker: "CSCO", name: "Cisco Systems", marketCap: 240, price: 60.20, change: 0.33, weekChange: 0.80, volume: 18500000 },
            { ticker: "ACN", name: "Accenture plc", marketCap: 220, price: 350.10, change: -0.55, weekChange: -1.30, volume: 2100000 },
            { ticker: "ADBE", name: "Adobe Inc.", marketCap: 210, price: 480.60, change: -0.88, weekChange: -2.10, volume: 3400000 },
            { ticker: "IBM", name: "IBM Corp.", marketCap: 200, price: 215.40, change: 0.72, weekChange: 1.90, volume: 4200000 },
            { ticker: "INTC", name: "Intel Corp.", marketCap: 115, price: 26.80, change: -2.40, weekChange: -5.80, volume: 48000000, isMajor: true },
            { ticker: "INTU", name: "Intuit Inc.", marketCap: 185, price: 660.30, change: 0.45, weekChange: 1.20, volume: 1500000 },
            { ticker: "TXN", name: "Texas Instruments", marketCap: 180, price: 197.50, change: -0.30, weekChange: 0.40, volume: 5800000 },
            { ticker: "QCOM", name: "Qualcomm Inc.", marketCap: 175, price: 157.20, change: 1.55, weekChange: 3.80, volume: 7200000 },
            { ticker: "AMAT", name: "Applied Materials", marketCap: 155, price: 187.90, change: 2.10, weekChange: 4.60, volume: 6100000 },
            { ticker: "NOW", name: "ServiceNow Inc.", marketCap: 190, price: 925.40, change: -0.68, weekChange: -1.50, volume: 1800000 },
            { ticker: "PANW", name: "Palo Alto Networks", marketCap: 120, price: 365.20, change: 1.30, weekChange: 2.90, volume: 3600000 },
            { ticker: "MU", name: "Micron Technology", marketCap: 115, price: 103.80, change: 3.45, weekChange: 7.20, volume: 22000000 },
            { ticker: "LRCX", name: "Lam Research", marketCap: 110, price: 840.60, change: 1.80, weekChange: 4.10, volume: 1800000 },
            { ticker: "SNPS", name: "Synopsys Inc.", marketCap: 95, price: 610.30, change: 0.55, weekChange: 1.80, volume: 1200000 },
            { ticker: "KLAC", name: "KLA Corp.", marketCap: 95, price: 710.20, change: 1.65, weekChange: 3.40, volume: 1500000 },
            { ticker: "PLTR", name: "Palantir Technologies", marketCap: 250, price: 105.80, change: 4.20, weekChange: 12.50, volume: 85000000, isMajor: true },
        ]
    },
    "Communication Services": {
        stocks: [
            { ticker: "GOOG", name: "Alphabet Inc. (C)", marketCap: 2150, price: 172.30, change: 0.92, weekChange: 2.40, volume: 21500000, isMajor: true },
            { ticker: "GOOGL", name: "Alphabet Inc. (A)", marketCap: 2140, price: 171.80, change: 0.90, weekChange: 2.35, volume: 25200000, isMajor: true },
            { ticker: "META", name: "Meta Platforms", marketCap: 1580, price: 615.40, change: -1.35, weekChange: -3.20, volume: 15800000, isMajor: true },
            { ticker: "NFLX", name: "Netflix Inc.", marketCap: 420, price: 980.50, change: 2.10, weekChange: 5.60, volume: 5200000, isMajor: true },
            { ticker: "DIS", name: "Walt Disney Co.", marketCap: 195, price: 107.20, change: -0.78, weekChange: -1.90, volume: 9800000 },
            { ticker: "CMCSA", name: "Comcast Corp.", marketCap: 150, price: 38.90, change: -0.25, weekChange: -0.60, volume: 16200000 },
            { ticker: "TMUS", name: "T-Mobile US", marketCap: 255, price: 218.40, change: 0.35, weekChange: 0.90, volume: 4800000 },
            { ticker: "VZ", name: "Verizon Comm.", marketCap: 175, price: 41.50, change: 0.18, weekChange: 0.45, volume: 15800000 },
            { ticker: "T", name: "AT&T Inc.", marketCap: 165, price: 23.10, change: 0.12, weekChange: 0.30, volume: 28500000 },
            { ticker: "EA", name: "Electronic Arts", marketCap: 38, price: 142.80, change: -1.60, weekChange: -3.40, volume: 3200000 },
            { ticker: "WBD", name: "Warner Bros. Discovery", marketCap: 22, price: 9.10, change: -3.50, weekChange: -8.20, volume: 18500000 },
        ]
    },
    "Consumer Discretionary": {
        stocks: [
            { ticker: "AMZN", name: "Amazon.com Inc.", marketCap: 2180, price: 206.40, change: 1.45, weekChange: 3.80, volume: 42000000, isMajor: true },
            { ticker: "TSLA", name: "Tesla Inc.", marketCap: 920, price: 288.50, change: -2.85, weekChange: -6.40, volume: 95000000, isMajor: true },
            { ticker: "HD", name: "Home Depot Inc.", marketCap: 380, price: 390.20, change: 0.55, weekChange: 1.40, volume: 4200000, isMajor: true },
            { ticker: "MCD", name: "McDonald's Corp.", marketCap: 210, price: 290.80, change: -0.32, weekChange: -0.70, volume: 3100000 },
            { ticker: "NKE", name: "Nike Inc.", marketCap: 115, price: 75.40, change: -1.85, weekChange: -4.20, volume: 9800000 },
            { ticker: "LOW", name: "Lowe's Companies", marketCap: 140, price: 245.60, change: 0.42, weekChange: 1.10, volume: 3500000 },
            { ticker: "SBUX", name: "Starbucks Corp.", marketCap: 105, price: 92.30, change: -0.65, weekChange: -1.80, volume: 6800000 },
            { ticker: "TJX", name: "TJX Companies", marketCap: 135, price: 120.40, change: 0.78, weekChange: 1.95, volume: 3800000 },
            { ticker: "BKNG", name: "Booking Holdings", marketCap: 165, price: 4520.30, change: 1.20, weekChange: 2.80, volume: 320000 },
            { ticker: "CMG", name: "Chipotle Mexican Grill", marketCap: 78, price: 57.30, change: -0.90, weekChange: -2.30, volume: 8500000 },
            { ticker: "ABNB", name: "Airbnb Inc.", marketCap: 85, price: 135.60, change: 1.65, weekChange: 3.90, volume: 4800000 },
            { ticker: "GM", name: "General Motors Co.", marketCap: 55, price: 48.70, change: 0.85, weekChange: 2.10, volume: 8200000 },
            { ticker: "F", name: "Ford Motor Co.", marketCap: 42, price: 10.50, change: -1.20, weekChange: -3.10, volume: 42000000 },
        ]
    },
    "Healthcare": {
        stocks: [
            { ticker: "LLY", name: "Eli Lilly & Co.", marketCap: 820, price: 862.40, change: 1.90, weekChange: 4.50, volume: 3200000, isMajor: true },
            { ticker: "UNH", name: "UnitedHealth Group", marketCap: 480, price: 520.30, change: -1.10, weekChange: -2.80, volume: 3800000, isMajor: true },
            { ticker: "JNJ", name: "Johnson & Johnson", marketCap: 380, price: 158.20, change: 0.28, weekChange: 0.65, volume: 7200000, isMajor: true },
            { ticker: "ABBV", name: "AbbVie Inc.", marketCap: 340, price: 192.50, change: -0.45, weekChange: -1.20, volume: 5600000 },
            { ticker: "MRK", name: "Merck & Co.", marketCap: 300, price: 118.90, change: -0.72, weekChange: -1.80, volume: 8100000 },
            { ticker: "TMO", name: "Thermo Fisher", marketCap: 210, price: 555.40, change: 0.55, weekChange: 1.30, volume: 1500000 },
            { ticker: "ABT", name: "Abbott Labs", marketCap: 200, price: 115.80, change: 0.38, weekChange: 0.90, volume: 4800000 },
            { ticker: "PFE", name: "Pfizer Inc.", marketCap: 145, price: 25.60, change: -0.85, weekChange: -2.10, volume: 32000000 },
            { ticker: "DHR", name: "Danaher Corp.", marketCap: 175, price: 240.30, change: 0.42, weekChange: 1.05, volume: 2200000 },
            { ticker: "AMGN", name: "Amgen Inc.", marketCap: 155, price: 288.70, change: -0.60, weekChange: -1.45, volume: 2800000 },
            { ticker: "BMY", name: "Bristol-Myers Squibb", marketCap: 110, price: 54.20, change: -1.30, weekChange: -3.20, volume: 12500000 },
            { ticker: "ISRG", name: "Intuitive Surgical", marketCap: 170, price: 480.60, change: 1.45, weekChange: 3.60, volume: 1800000 },
            { ticker: "GILD", name: "Gilead Sciences", marketCap: 115, price: 92.40, change: 0.65, weekChange: 1.60, volume: 5200000 },
            { ticker: "VRTX", name: "Vertex Pharma", marketCap: 120, price: 465.80, change: 0.88, weekChange: 2.10, volume: 1500000 },
            { ticker: "MDT", name: "Medtronic plc", marketCap: 108, price: 82.30, change: -0.35, weekChange: -0.85, volume: 5500000 },
        ]
    },
    "Financials": {
        stocks: [
            { ticker: "BRK.B", name: "Berkshire Hathaway B", marketCap: 980, price: 455.20, change: 0.45, weekChange: 1.10, volume: 3800000, isMajor: true },
            { ticker: "JPM", name: "JPMorgan Chase", marketCap: 680, price: 235.60, change: 0.88, weekChange: 2.20, volume: 8500000, isMajor: true },
            { ticker: "V", name: "Visa Inc.", marketCap: 600, price: 305.40, change: 0.62, weekChange: 1.55, volume: 5200000, isMajor: true },
            { ticker: "MA", name: "Mastercard Inc.", marketCap: 480, price: 515.80, change: 0.72, weekChange: 1.80, volume: 3200000, isMajor: true },
            { ticker: "BAC", name: "Bank of America", marketCap: 340, price: 43.20, change: -0.55, weekChange: -1.30, volume: 32000000 },
            { ticker: "WFC", name: "Wells Fargo & Co.", marketCap: 220, price: 64.50, change: -0.38, weekChange: -0.90, volume: 16500000 },
            { ticker: "GS", name: "Goldman Sachs", marketCap: 185, price: 555.20, change: 1.20, weekChange: 2.90, volume: 2200000 },
            { ticker: "MS", name: "Morgan Stanley", marketCap: 175, price: 108.30, change: 0.92, weekChange: 2.30, volume: 6500000 },
            { ticker: "AXP", name: "American Express", marketCap: 195, price: 268.40, change: 0.48, weekChange: 1.20, volume: 3100000 },
            { ticker: "SPGI", name: "S&P Global", marketCap: 155, price: 502.30, change: 0.35, weekChange: 0.85, volume: 1200000 },
            { ticker: "BLK", name: "BlackRock Inc.", marketCap: 145, price: 960.50, change: 0.58, weekChange: 1.45, volume: 450000 },
            { ticker: "C", name: "Citigroup Inc.", marketCap: 125, price: 66.80, change: -0.72, weekChange: -1.80, volume: 12500000 },
            { ticker: "SCHW", name: "Charles Schwab", marketCap: 140, price: 78.40, change: 0.95, weekChange: 2.40, volume: 7800000 },
            { ticker: "CB", name: "Chubb Ltd.", marketCap: 110, price: 268.90, change: 0.22, weekChange: 0.55, volume: 1500000 },
        ]
    },
    "Consumer Staples": {
        stocks: [
            { ticker: "WMT", name: "Walmart Inc.", marketCap: 680, price: 84.60, change: 0.52, weekChange: 1.30, volume: 8500000, isMajor: true },
            { ticker: "PG", name: "Procter & Gamble", marketCap: 380, price: 160.30, change: -0.18, weekChange: -0.45, volume: 5800000, isMajor: true },
            { ticker: "COST", name: "Costco Wholesale", marketCap: 410, price: 930.40, change: 0.75, weekChange: 1.90, volume: 1800000, isMajor: true },
            { ticker: "KO", name: "Coca-Cola Co.", marketCap: 260, price: 60.20, change: -0.15, weekChange: -0.35, volume: 12500000 },
            { ticker: "PEP", name: "PepsiCo Inc.", marketCap: 225, price: 164.80, change: -0.42, weekChange: -1.05, volume: 5200000 },
            { ticker: "PM", name: "Philip Morris Int'l", marketCap: 190, price: 122.40, change: 0.35, weekChange: 0.85, volume: 4500000 },
            { ticker: "MDLZ", name: "Mondelez Int'l", marketCap: 88, price: 65.30, change: -0.28, weekChange: -0.70, volume: 6200000 },
            { ticker: "MO", name: "Altria Group", marketCap: 82, price: 48.70, change: 0.18, weekChange: 0.42, volume: 8500000 },
            { ticker: "CL", name: "Colgate-Palmolive", marketCap: 78, price: 95.40, change: -0.22, weekChange: -0.55, volume: 3200000 },
            { ticker: "KHC", name: "Kraft Heinz Co.", marketCap: 38, price: 31.20, change: -0.85, weekChange: -2.10, volume: 5800000 },
        ]
    },
    "Energy": {
        stocks: [
            { ticker: "XOM", name: "Exxon Mobil Corp.", marketCap: 480, price: 113.50, change: -1.20, weekChange: -2.90, volume: 14500000, isMajor: true },
            { ticker: "CVX", name: "Chevron Corp.", marketCap: 280, price: 152.30, change: -0.95, weekChange: -2.30, volume: 7800000, isMajor: true },
            { ticker: "COP", name: "ConocoPhillips", marketCap: 125, price: 105.60, change: -1.55, weekChange: -3.80, volume: 5200000 },
            { ticker: "SLB", name: "Schlumberger Ltd.", marketCap: 68, price: 47.80, change: -2.10, weekChange: -5.20, volume: 8500000 },
            { ticker: "EOG", name: "EOG Resources", marketCap: 72, price: 123.40, change: -1.35, weekChange: -3.30, volume: 3200000 },
            { ticker: "MPC", name: "Marathon Petroleum", marketCap: 58, price: 155.20, change: -0.88, weekChange: -2.15, volume: 2800000 },
            { ticker: "PXD", name: "Pioneer Natural Res.", marketCap: 52, price: 225.60, change: -1.75, weekChange: -4.30, volume: 2500000 },
            { ticker: "PSX", name: "Phillips 66", marketCap: 48, price: 115.30, change: -0.62, weekChange: -1.50, volume: 2200000 },
            { ticker: "VLO", name: "Valero Energy", marketCap: 45, price: 135.80, change: -1.42, weekChange: -3.50, volume: 2800000 },
            { ticker: "OXY", name: "Occidental Petroleum", marketCap: 42, price: 52.40, change: -2.30, weekChange: -5.70, volume: 12500000 },
        ]
    },
    "Industrials": {
        stocks: [
            { ticker: "GE", name: "GE Aerospace", marketCap: 210, price: 192.50, change: 1.10, weekChange: 2.70, volume: 5200000, isMajor: true },
            { ticker: "CAT", name: "Caterpillar Inc.", marketCap: 175, price: 360.40, change: -0.45, weekChange: -1.10, volume: 2800000 },
            { ticker: "UNP", name: "Union Pacific", marketCap: 148, price: 245.30, change: 0.32, weekChange: 0.80, volume: 2500000 },
            { ticker: "RTX", name: "RTX Corp.", marketCap: 155, price: 115.20, change: 0.55, weekChange: 1.35, volume: 4200000 },
            { ticker: "HON", name: "Honeywell Int'l", marketCap: 135, price: 208.40, change: -0.28, weekChange: -0.70, volume: 3200000 },
            { ticker: "BA", name: "Boeing Co.", marketCap: 115, price: 188.60, change: -1.80, weekChange: -4.40, volume: 8500000, isMajor: true },
            { ticker: "DE", name: "Deere & Co.", marketCap: 120, price: 418.30, change: 0.65, weekChange: 1.60, volume: 1500000 },
            { ticker: "LMT", name: "Lockheed Martin", marketCap: 115, price: 475.20, change: 0.42, weekChange: 1.05, volume: 1200000 },
            { ticker: "UPS", name: "United Parcel Service", marketCap: 95, price: 115.60, change: -0.55, weekChange: -1.30, volume: 3800000 },
            { ticker: "ADP", name: "Automatic Data Proc.", marketCap: 110, price: 270.40, change: 0.28, weekChange: 0.70, volume: 1800000 },
            { ticker: "MMM", name: "3M Company", marketCap: 68, price: 125.30, change: 0.48, weekChange: 1.15, volume: 3200000 },
            { ticker: "WM", name: "Waste Management", marketCap: 82, price: 210.60, change: 0.22, weekChange: 0.55, volume: 1500000 },
            { ticker: "FDX", name: "FedEx Corp.", marketCap: 62, price: 258.40, change: -0.75, weekChange: -1.85, volume: 2200000 },
            { ticker: "GD", name: "General Dynamics", marketCap: 75, price: 275.30, change: 0.35, weekChange: 0.85, volume: 1200000 },
        ]
    },
    "Real Estate": {
        stocks: [
            { ticker: "PLD", name: "Prologis Inc.", marketCap: 115, price: 125.40, change: 0.72, weekChange: 1.80, volume: 4200000 },
            { ticker: "AMT", name: "American Tower", marketCap: 95, price: 205.30, change: 0.48, weekChange: 1.15, volume: 2200000 },
            { ticker: "EQIX", name: "Equinix Inc.", marketCap: 82, price: 870.60, change: 0.35, weekChange: 0.85, volume: 580000 },
            { ticker: "CCI", name: "Crown Castle", marketCap: 42, price: 96.80, change: -0.55, weekChange: -1.35, volume: 3500000 },
            { ticker: "SPG", name: "Simon Property", marketCap: 52, price: 160.40, change: 0.28, weekChange: 0.65, volume: 1800000 },
            { ticker: "PSA", name: "Public Storage", marketCap: 55, price: 315.20, change: 0.18, weekChange: 0.42, volume: 850000 },
            { ticker: "O", name: "Realty Income Corp.", marketCap: 48, price: 55.60, change: -0.32, weekChange: -0.78, volume: 5200000 },
            { ticker: "WELL", name: "Welltower Inc.", marketCap: 58, price: 120.30, change: 0.62, weekChange: 1.50, volume: 2200000 },
        ]
    },
    "Materials": {
        stocks: [
            { ticker: "LIN", name: "Linde plc", marketCap: 210, price: 438.50, change: 0.42, weekChange: 1.05, volume: 1800000, isMajor: true },
            { ticker: "APD", name: "Air Products", marketCap: 62, price: 280.30, change: -0.35, weekChange: -0.85, volume: 1200000 },
            { ticker: "SHW", name: "Sherwin-Williams", marketCap: 88, price: 345.60, change: 0.55, weekChange: 1.35, volume: 1500000 },
            { ticker: "FCX", name: "Freeport-McMoRan", marketCap: 65, price: 45.20, change: -1.85, weekChange: -4.50, volume: 12500000 },
            { ticker: "ECL", name: "Ecolab Inc.", marketCap: 58, price: 210.40, change: 0.28, weekChange: 0.70, volume: 1200000 },
            { ticker: "NEM", name: "Newmont Corp.", marketCap: 52, price: 45.80, change: 2.40, weekChange: 5.80, volume: 8500000 },
            { ticker: "DOW", name: "Dow Inc.", marketCap: 35, price: 50.30, change: -1.20, weekChange: -2.90, volume: 5200000 },
            { ticker: "NUE", name: "Nucor Corp.", marketCap: 38, price: 158.20, change: -0.92, weekChange: -2.25, volume: 2200000 },
        ]
    },
    "Utilities": {
        stocks: [
            { ticker: "NEE", name: "NextEra Energy", marketCap: 155, price: 75.40, change: 0.55, weekChange: 1.35, volume: 8500000 },
            { ticker: "SO", name: "Southern Co.", marketCap: 88, price: 82.30, change: 0.22, weekChange: 0.55, volume: 4200000 },
            { ticker: "DUK", name: "Duke Energy Corp.", marketCap: 82, price: 106.50, change: -0.18, weekChange: -0.42, volume: 3200000 },
            { ticker: "CEG", name: "Constellation Energy", marketCap: 78, price: 248.60, change: 3.20, weekChange: 7.80, volume: 5800000, isMajor: true },
            { ticker: "SRE", name: "Sempra", marketCap: 52, price: 82.40, change: 0.15, weekChange: 0.35, volume: 2500000 },
            { ticker: "AEP", name: "American Electric", marketCap: 48, price: 96.30, change: -0.28, weekChange: -0.70, volume: 2800000 },
            { ticker: "D", name: "Dominion Energy", marketCap: 42, price: 52.60, change: -0.35, weekChange: -0.85, volume: 4200000 },
            { ticker: "EXC", name: "Exelon Corp.", marketCap: 38, price: 38.40, change: 0.18, weekChange: 0.42, volume: 5200000 },
        ]
    }
};

// Helper to flatten all stocks with sector info
function getAllStocks() {
    const all = [];
    for (const [sector, data] of Object.entries(SECTORS)) {
        for (const stock of data.stocks) {
            all.push({ ...stock, sector });
        }
    }
    return all;
}

// Get stocks grouped by sector with total market caps
function getStocksBySector() {
    const result = [];
    for (const [sector, data] of Object.entries(SECTORS)) {
        const totalMarketCap = data.stocks.reduce((sum, s) => sum + s.marketCap, 0);
        result.push({
            sector,
            totalMarketCap,
            stocks: data.stocks.map(s => ({ ...s, sector }))
        });
    }
    // Sort sectors by total market cap descending
    result.sort((a, b) => b.totalMarketCap - a.totalMarketCap);
    return result;
}
