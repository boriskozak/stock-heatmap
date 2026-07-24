"""
server.py — Static file server + Yahoo Finance API proxy
Run: python server.py
Serves on http://localhost:3000
"""

import http.server
import json
import urllib.request
import urllib.parse
import urllib.error
import os
import sys
import threading
from pathlib import Path

PORT = 3000
STATIC_DIR = Path(__file__).parent

# Yahoo Finance v8 chart endpoint (no auth needed)
YAHOO_CHART_URL = "https://query2.finance.yahoo.com/v8/finance/chart/{symbol}?interval=1d&range=5d&includePrePost=false"

# User agent to avoid blocks
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/json",
}


def fetch_single_quote(symbol):
    """Fetch a single stock quote from Yahoo Finance v8 chart API."""
    url = YAHOO_CHART_URL.format(symbol=urllib.parse.quote(symbol))
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        return None

    result = data.get("chart", {}).get("result")
    if not result:
        return None

    meta = result[0].get("meta", {})
    indicators = result[0].get("indicators", {})
    quote_data = indicators.get("quote", [{}])[0]
    closes = quote_data.get("close", [])
    volumes = quote_data.get("volume", [])

    current_price = meta.get("regularMarketPrice")

    # Clean list of valid closes in 5d range
    valid_closes = [c for c in closes if c is not None]

    if current_price is None and valid_closes:
        current_price = valid_closes[-1]

    if current_price is None:
        return None

    # Yesterday's close for Daily Change
    # In 5-day chart data with 1d interval, valid_closes contains the daily closes.
    # The last element valid_closes[-1] is today's current/close price.
    # The second-to-last element valid_closes[-2] is yesterday's close price.
    if len(valid_closes) >= 2:
        previous_close = valid_closes[-2]
    else:
        previous_close = meta.get("chartPreviousClose") or (valid_closes[0] if valid_closes else None)

    if not previous_close or previous_close <= 0:
        daily_change = 0.0
    else:
        daily_change = ((current_price - previous_close) / previous_close) * 100

    # 5-day (Weekly) change: referenced against chartPreviousClose or start of 5d range
    chart_prev = meta.get("chartPreviousClose") or (valid_closes[0] if valid_closes else None)
    if not chart_prev or chart_prev <= 0:
        week_change = daily_change
    else:
        week_change = ((current_price - chart_prev) / chart_prev) * 100

    # Latest volume
    volume = 0
    for v in reversed(volumes):
        if v is not None:
            volume = v
            break

    return {
        "ticker": meta.get("symbol", symbol),
        "price": round(current_price, 2),
        "change": round(daily_change, 2),
        "weekChange": round(week_change, 2),
        "volume": volume,
        "name": meta.get("shortName") or meta.get("longName"),
    }


def fetch_batch_quotes(symbols):
    """Fetch quotes for multiple symbols using threads."""
    results = {}
    lock = threading.Lock()

    def worker(sym):
        quote = fetch_single_quote(sym)
        if quote:
            with lock:
                results[sym] = quote

    threads = []
    for sym in symbols:
        t = threading.Thread(target=worker, args=(sym,))
        threads.append(t)
        t.start()

    # Wait for all threads (with timeout)
    for t in threads:
        t.join(timeout=10)

    return results


class HeatmapHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(STATIC_DIR), **kwargs)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)

        if parsed.path == "/api/quotes":
            self._handle_quotes(parsed)
        else:
            # Serve static files
            super().do_GET()

    def _handle_quotes(self, parsed):
        """Handle /api/quotes?symbols=AAPL,MSFT,..."""
        params = urllib.parse.parse_qs(parsed.query)
        symbols_str = params.get("symbols", [""])[0]

        if not symbols_str:
            self._json_response(400, {"error": "Missing symbols parameter"})
            return

        symbols = [s.strip() for s in symbols_str.split(",") if s.strip()]
        if len(symbols) > 200:
            symbols = symbols[:200]

        print(f"[API] Fetching {len(symbols)} quotes...")
        quotes = fetch_batch_quotes(symbols)
        print(f"[API] Got {len(quotes)}/{len(symbols)} quotes")

        self._json_response(200, {
            "quotes": quotes,
            "fetched": len(quotes),
            "total": len(symbols),
        })

    def _json_response(self, status, data):
        body = json.dumps(data).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format, *args):
        # Only log API calls, not static file requests
        msg = format % args
        if "/api/" in msg:
            print(f"[Server] {msg}")


def main():
    server = http.server.HTTPServer(("", PORT), HeatmapHandler)
    print(f"Heatmap server running at http://localhost:{PORT}")
    print(f"Serving files from: {STATIC_DIR}")
    print(f"API proxy: /api/quotes?symbols=AAPL,MSFT,...")
    print(f"Press Ctrl+C to stop\n")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down...")
        server.shutdown()


if __name__ == "__main__":
    main()
