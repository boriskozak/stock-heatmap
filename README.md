# S&P 500 Stock Heatmap

A static web page that draws an S&P 500 treemap. Tile size is market cap or
volume. Tile color is daily change or week change. Stocks are grouped by
sector, or shown without grouping.

## Files

- `index.html` - page structure and toolbar controls.
- `index.css` - page styles.
- `stocks.js` - stock list grouped by sector, with fallback values.
- `treemap.js` - squarified treemap layout.
- `api.js` - fetches quotes from the local proxy and updates the stock list.
- `app.js` - rendering, tooltip, market status, and refresh timers.
- `server.py` - static file server and Yahoo Finance proxy. It uses only the
  Python standard library.

## Run with live data

1. Run the server:

   ```
   python3 server.py
   ```

2. Open `http://localhost:3000` in a browser.

The server serves the static files and answers `/api/quotes` requests, for
example `/api/quotes?symbols=AAPL,MSFT`. It fetches each quote from the Yahoo
Finance chart endpoint and returns price, daily change, week change, and
volume as JSON. Live data refreshes every 60 seconds.

## Run without live data

Open `index.html` directly, or serve the folder with any static file server.
The page renders with the fallback values in `stocks.js`. The live fetch
fails in this mode because there is no `/api/quotes` endpoint, and the page
keeps the fallback values.

## Notes

- Market status is evaluated in Eastern Time (America/New_York). Regular
  hours are 9:30 AM to 4:00 PM, Monday to Friday.
- No build step and no dependencies.
