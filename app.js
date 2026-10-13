/**
 * app.js - Stock Heatmap Application
 * Eye-candy edition: particles, breathing, animated counts, ambient glow
 */

(function () {
    'use strict';

    // ===== COLOR ENGINE =====
    const ColorEngine = {
        getColor(change) {
            const absChange = Math.abs(change);
            const maxChange = 3.5;
            const t = Math.min(absChange / maxChange, 1);
            const s = t * t * (3 - 2 * t); // smoothstep

            if (change > 0) {
                const h = 150 - s * 14;
                const sat = 48 + s * 44;
                const l = 12 + s * 24;
                return `hsl(${h}, ${sat}%, ${l}%)`;
            } else if (change < 0) {
                const h = 355 + s * 10;
                const sat = 52 + s * 42;
                const l = 12 + s * 22;
                return `hsl(${h}, ${sat}%, ${l}%)`;
            }
            return 'hsl(228, 10%, 14%)';
        }
    };

    // ===== SPARKLINE =====
    function generateSparklineSVG(change, width, height) {
        const pts = 24;
        const data = [];
        let val = 50;
        const trend = change > 0 ? 0.4 : change < 0 ? -0.4 : 0;
        for (let i = 0; i < pts; i++) {
            val += (Math.random() - 0.47) * 2.5 + trend;
            val = Math.max(10, Math.min(90, val));
            data.push(val);
        }
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;
        const pathPts = data.map((v, i) => {
            const x = (i / (pts - 1)) * width;
            const y = height - ((v - min) / range) * height;
            return `${x},${y}`;
        });
        const color = change >= 0 ? 'rgba(52,211,114,0.4)' : 'rgba(248,88,88,0.4)';
        return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
            <polyline points="${pathPts.join(' ')}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
    }

    // ===== ANIMATED NUMBER COUNTER =====
    function animateValue(el, from, to, duration = 600) {
        const start = performance.now();
        const sign = to >= 0 ? '+' : '';

        function step(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = from + (to - from) * eased;
            el.textContent = sign + current.toFixed(2) + '%';
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }
        requestAnimationFrame(step);
    }

    // ===== CANVAS FX SYSTEM — Ripples + Scanline =====
    const FX = {
        canvas: null,
        ctx: null,
        ripples: [],       // expanding rings from ticking cells
        scanlineY: -100,   // current scanline position
        scanlineActive: false,
        cellPositions: new Map(),

        init() {
            this.canvas = document.getElementById('particleCanvas');
            this.ctx = this.canvas.getContext('2d');
            this._resize();
            window.addEventListener('resize', () => this._resize());
            this._startScanlineCycle();
            this._loop();
        },

        _resize() {
            const container = document.getElementById('heatmapContainer');
            const rect = container.getBoundingClientRect();
            this.canvas.width = rect.width;
            this.canvas.height = rect.height;
        },

        updateCellPositions(positions) {
            this.cellPositions = positions;
        },

        /**
         * Spawn a ripple ring from a cell that just ticked
         */
        spawnRipple(ticker, change) {
            const pos = this.cellPositions.get(ticker);
            if (!pos) return;

            const absChange = Math.abs(change);
            if (absChange < 0.3) return; // Tiny moves don't ripple

            const cx = pos.x + pos.w / 2;
            const cy = pos.y + pos.h / 2;
            const isGreen = change > 0;
            const maxRadius = Math.max(pos.w, pos.h) * (absChange >= 2 ? 1.2 : 0.7);

            this.ripples.push({
                cx, cy,
                radius: 4,
                maxRadius,
                speed: 0.8 + absChange * 0.4,
                alpha: absChange >= 2 ? 0.5 : absChange >= 1 ? 0.35 : 0.2,
                lineWidth: absChange >= 2 ? 2.5 : 1.5,
                r: isGreen ? 52 : 248,
                g: isGreen ? 211 : 88,
                b: isGreen ? 114 : 88,
            });
        },

        /**
         * Scanline sweeps down every ~6 seconds
         */
        _startScanlineCycle() {
            const runScanline = () => {
                this.scanlineY = -20;
                this.scanlineActive = true;
                // Schedule next sweep
                setTimeout(runScanline, 6000 + Math.random() * 2000);
            };
            // First sweep after 2s
            setTimeout(runScanline, 2000);
        },

        _loop() {
            const { ctx, canvas } = this;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // --- Draw ripple rings ---
            for (let i = this.ripples.length - 1; i >= 0; i--) {
                const r = this.ripples[i];
                r.radius += r.speed;

                // Fade as it expands
                const progress = r.radius / r.maxRadius;
                const alpha = r.alpha * (1 - progress);

                if (progress >= 1 || alpha <= 0.01) {
                    this.ripples.splice(i, 1);
                    continue;
                }

                ctx.beginPath();
                ctx.arc(r.cx, r.cy, r.radius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(${r.r}, ${r.g}, ${r.b}, ${alpha})`;
                ctx.lineWidth = r.lineWidth * (1 - progress * 0.5);
                ctx.stroke();

                // Optional inner glow ring
                if (r.alpha >= 0.3 && progress < 0.5) {
                    ctx.beginPath();
                    ctx.arc(r.cx, r.cy, r.radius * 0.7, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(${r.r}, ${r.g}, ${r.b}, ${alpha * 0.3})`;
                    ctx.lineWidth = r.lineWidth * 0.5;
                    ctx.stroke();
                }
            }

            // --- Draw scanline ---
            if (this.scanlineActive) {
                this.scanlineY += 2.5;

                if (this.scanlineY > canvas.height + 40) {
                    this.scanlineActive = false;
                } else {
                    // Main scanline — thin bright band
                    const gradient = ctx.createLinearGradient(0, this.scanlineY - 20, 0, this.scanlineY + 20);
                    gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
                    gradient.addColorStop(0.35, 'rgba(255, 255, 255, 0.015)');
                    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.04)');
                    gradient.addColorStop(0.65, 'rgba(255, 255, 255, 0.015)');
                    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

                    ctx.fillStyle = gradient;
                    ctx.fillRect(0, this.scanlineY - 20, canvas.width, 40);

                    // Sharp center line
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
                    ctx.fillRect(0, this.scanlineY - 0.5, canvas.width, 1);
                }
            }

            // Cap ripples
            if (this.ripples.length > 60) {
                this.ripples.splice(0, this.ripples.length - 60);
            }

            requestAnimationFrame(() => this._loop());
        }
    };

    // ===== AMBIENT GLOW =====
    const AmbientGlow = {
        update() {
            const allStocks = getAllStocks();
            let totalWeight = 0;
            let weightedChange = 0;
            for (const s of allStocks) {
                totalWeight += s.marketCap;
                weightedChange += s.change * s.marketCap;
            }
            const avgChange = weightedChange / totalWeight;

            const container = document.getElementById('heatmapContainer');
            const intensity = Math.min(Math.abs(avgChange) / 2, 1) * 0.08;

            if (avgChange > 0.05) {
                container.style.background = `radial-gradient(ellipse at 50% 100%, rgba(52, 211, 114, ${intensity}) 0%, var(--neutral-900) 70%)`;
            } else if (avgChange < -0.05) {
                container.style.background = `radial-gradient(ellipse at 50% 100%, rgba(248, 88, 88, ${intensity}) 0%, var(--neutral-900) 70%)`;
            } else {
                container.style.background = 'var(--neutral-900)';
            }
        }
    };

    // ===== TOOLTIP =====
    const Tooltip = {
        el: document.getElementById('tooltip'),
        _visible: false,

        show(stock, mx, my) {
            const cls = stock.change >= 0 ? 'positive' : 'negative';
            const cs = stock.change >= 0 ? '+' : '';
            const ws = stock.weekChange >= 0 ? '+' : '';
            this.el.innerHTML = `
                <div class="tooltip-header">
                    <span class="tooltip-ticker">${stock.ticker}</span>
                    <span class="tooltip-change ${cls}">${cs}${stock.change.toFixed(2)}%</span>
                </div>
                <div class="tooltip-name">${stock.name}</div>
                <div class="tooltip-row"><span class="tooltip-row-label">Price</span><span class="tooltip-row-value">$${stock.price.toFixed(2)}</span></div>
                <div class="tooltip-row"><span class="tooltip-row-label">Market Cap</span><span class="tooltip-row-value">$${this._fmtCap(stock.marketCap)}</span></div>
                <div class="tooltip-row"><span class="tooltip-row-label">Volume</span><span class="tooltip-row-value">${this._fmtVol(stock.volume)}</span></div>
                <div class="tooltip-row"><span class="tooltip-row-label">Week Change</span><span class="tooltip-row-value" style="color:${stock.weekChange >= 0 ? '#4ade80' : '#f87171'}">${ws}${stock.weekChange.toFixed(2)}%</span></div>
                <div class="tooltip-sector">${stock.sector}</div>
            `;
            this._pos(mx, my);
            this.el.classList.add('visible');
            this._visible = true;
        },
        hide() { this.el.classList.remove('visible'); this._visible = false; },
        move(mx, my) { if (this._visible) this._pos(mx, my); },
        _pos(mx, my) {
            const r = this.el.getBoundingClientRect();
            let x = mx + 16, y = my + 16;
            if (x + r.width + 10 > window.innerWidth) x = mx - r.width - 16;
            if (y + r.height + 10 > window.innerHeight) y = my - r.height - 16;
            this.el.style.left = Math.max(8, x) + 'px';
            this.el.style.top = Math.max(8, y) + 'px';
        },
        _fmtCap(c) { return c >= 1000 ? (c / 1000).toFixed(1) + 'T' : c.toFixed(0) + 'B'; },
        _fmtVol(v) { return v >= 1e9 ? (v / 1e9).toFixed(1) + 'B' : v >= 1e6 ? (v / 1e6).toFixed(1) + 'M' : v >= 1e3 ? (v / 1e3).toFixed(0) + 'K' : v.toString(); }
    };

    // ===== RENDERER =====
    const Renderer = {
        container: document.getElementById('heatmap'),

        render(grouping) {
            this.container.innerHTML = '';
            const rect = this.container.getBoundingClientRect();
            const W = rect.width, H = rect.height;

            if (grouping === 'sector') {
                this._renderSectorGrouped(W, H);
            } else {
                this._renderFlat(W, H);
            }
        },

        _renderSectorGrouped(W, H) {
            const sectors = getStocksBySector();
            const layout = TreemapLayout.computeSectorLayout(sectors, 0, 0, W, H, 2, 1);
            const positions = new Map();
            let delay = 0;

            for (const sg of layout) {
                const groupEl = document.createElement('div');
                groupEl.className = 'sector-group';
                groupEl.style.cssText = `left:${sg.bounds.x}px;top:${sg.bounds.y}px;width:${sg.bounds.w}px;height:${sg.bounds.h}px`;

                const label = document.createElement('div');
                label.className = 'sector-label';
                label.textContent = sg.sector;
                groupEl.appendChild(label);

                const contentEl = document.createElement('div');
                contentEl.className = 'sector-content';
                groupEl.appendChild(contentEl);

                for (const stock of sg.stocks) {
                    const cell = this._createCell(stock, sg.bounds, delay);
                    contentEl.appendChild(cell);
                    // Track absolute position for particles
                    positions.set(stock.ticker, {
                        x: stock.x,
                        y: stock.y,
                        w: stock.w,
                        h: stock.h,
                        change: stock.change
                    });
                    delay += 10;
                }

                this.container.appendChild(groupEl);
            }

            FX.updateCellPositions(positions);
        },

        _renderFlat(W, H) {
            const all = getAllStocks().map(s => ({ value: s.marketCap, ...s }));
            const rects = TreemapLayout.compute(all, 0, 0, W, H, 1);
            const positions = new Map();
            let delay = 0;

            for (const stock of rects) {
                const cell = this._createCell(stock, null, delay);
                this.container.appendChild(cell);
                positions.set(stock.ticker, { x: stock.x, y: stock.y, w: stock.w, h: stock.h, change: stock.change });
                delay += 6;
            }

            FX.updateCellPositions(positions);
        },

        _createCell(stock, sectorBounds, delay) {
            const cell = document.createElement('div');
            cell.className = 'stock-cell entering';
            cell.id = `cell-${stock.ticker.replace('.', '-')}`;

            const relX = sectorBounds ? stock.x - sectorBounds.x : stock.x;
            const relY = sectorBounds ? stock.y - sectorBounds.y - 20 : stock.y;

            cell.style.cssText = `left:${relX}px;top:${relY}px;width:${stock.w}px;height:${stock.h}px;animation-delay:${delay}ms`;
            cell.style.backgroundColor = ColorEngine.getColor(
                state.colorMetric === 'weekChange' ? stock.weekChange : stock.change
            );

            const change = state.colorMetric === 'weekChange' ? stock.weekChange : stock.change;
            const absChange = Math.abs(change);

            // Persistent glow for major movers
            if (stock.isMajor && absChange >= 2) {
                cell.classList.add(change > 0 ? 'glow-green-intense' : 'glow-red-intense');
            } else if (stock.isMajor && absChange >= 1) {
                cell.classList.add(change > 0 ? 'glow-green' : 'glow-red');
            } else if (absChange >= 3) {
                cell.classList.add(change > 0 ? 'glow-green' : 'glow-red');
            }

            // Breathing animation based on movement intensity
            if (!stock.isMajor || absChange < 1) {
                if (absChange >= 1.5) {
                    cell.classList.add('breathing-heavy');
                } else if (absChange >= 0.8) {
                    cell.classList.add('breathing-medium');
                } else if (absChange >= 0.3) {
                    cell.classList.add('breathing-light');
                }
            }

            // Cell content
            const area = stock.w * stock.h;
            const minDim = Math.min(stock.w, stock.h);

            if (area > 8000 && minDim > 50) {
                const tickerSize = Math.min(Math.max(stock.w / 6, 12), 28);
                const changeSize = Math.min(Math.max(stock.w / 10, 9), 16);

                const ticker = document.createElement('div');
                ticker.className = 'stock-ticker';
                ticker.style.fontSize = tickerSize + 'px';
                ticker.textContent = stock.ticker;

                const changePct = document.createElement('div');
                changePct.className = 'stock-change';
                changePct.style.fontSize = changeSize + 'px';
                changePct.textContent = (change >= 0 ? '+' : '') + change.toFixed(2) + '%';
                changePct.dataset.value = change;

                cell.appendChild(ticker);
                cell.appendChild(changePct);

                if (area > 15000) {
                    const priceEl = document.createElement('div');
                    priceEl.className = 'stock-price';
                    priceEl.textContent = '$' + stock.price.toFixed(2);
                    cell.appendChild(priceEl);
                }

                if (area > 20000 && stock.w > 80) {
                    const spark = document.createElement('div');
                    spark.className = 'stock-spark';
                    spark.innerHTML = generateSparklineSVG(change, stock.w - 8, 16);
                    cell.appendChild(spark);
                }
            } else if (area > 3000 && minDim > 30) {
                const tickerSize = Math.min(Math.max(stock.w / 7, 9), 18);
                const changeSize = Math.min(Math.max(stock.w / 11, 8), 12);

                const ticker = document.createElement('div');
                ticker.className = 'stock-ticker';
                ticker.style.fontSize = tickerSize + 'px';
                ticker.textContent = stock.ticker;

                const changePct = document.createElement('div');
                changePct.className = 'stock-change';
                changePct.style.fontSize = changeSize + 'px';
                changePct.textContent = (change >= 0 ? '+' : '') + change.toFixed(2) + '%';
                changePct.dataset.value = change;

                cell.appendChild(ticker);
                cell.appendChild(changePct);
            } else if (area > 800 && minDim > 18) {
                const tickerSize = Math.min(Math.max(stock.w / 6, 7), 12);
                const ticker = document.createElement('div');
                ticker.className = 'stock-ticker';
                ticker.style.fontSize = tickerSize + 'px';
                ticker.textContent = stock.ticker;
                cell.appendChild(ticker);
            }

            // Events
            cell.addEventListener('mouseenter', (e) => Tooltip.show(stock, e.clientX, e.clientY));
            cell.addEventListener('mousemove', (e) => Tooltip.move(e.clientX, e.clientY));
            cell.addEventListener('mouseleave', () => Tooltip.hide());

            return cell;
        }
    };

    // ===== STATE =====
    const state = {
        sizeMetric: 'marketCap',
        colorMetric: 'change',
        grouping: 'sector'
    };

    // ===== SIMULATED TICKS =====
    function simulateTicks() {
        const allStocks = getAllStocks();
        // Update ~35% of stocks each tick
        const count = Math.floor(allStocks.length * 0.35);
        const shuffled = [...allStocks].sort(() => Math.random() - 0.5);
        const toUpdate = shuffled.slice(0, count);

        for (const stock of toUpdate) {
            const magnitude = stock.isMajor ? 0.14 : 0.07;
            const drift = (Math.random() - 0.5) * magnitude;
            const oldChange = stock.change;

            stock.change = parseFloat((stock.change + drift).toFixed(2));
            stock.price = parseFloat((stock.price * (1 + drift / 100)).toFixed(2));

            // Animate the cell
            const cellId = `cell-${stock.ticker.replace('.', '-')}`;
            const cell = document.getElementById(cellId);
            if (!cell) continue;

            const change = state.colorMetric === 'weekChange' ? stock.weekChange : stock.change;

            // Smooth color
            cell.style.backgroundColor = ColorEngine.getColor(change);

            // Animated number count
            const changeEl = cell.querySelector('.stock-change');
            if (changeEl) {
                const prevVal = parseFloat(changeEl.dataset.value) || oldChange;
                changeEl.dataset.value = change;
                animateValue(changeEl, prevVal, change, 500);
            }

            // Update price
            const priceEl = cell.querySelector('.stock-price');
            if (priceEl) priceEl.textContent = '$' + stock.price.toFixed(2);

            // Tick flash
            cell.classList.remove('tick-flash-green', 'tick-flash-red');
            void cell.offsetWidth;
            cell.classList.add(change >= 0 ? 'tick-flash-green' : 'tick-flash-red');

            // Update glow classes
            cell.classList.remove('glow-green', 'glow-red', 'glow-green-intense', 'glow-red-intense');
            const absChange = Math.abs(change);
            if (stock.isMajor && absChange >= 2) {
                cell.classList.add(change > 0 ? 'glow-green-intense' : 'glow-red-intense');
            } else if (stock.isMajor && absChange >= 1) {
                cell.classList.add(change > 0 ? 'glow-green' : 'glow-red');
            } else if (absChange >= 3) {
                cell.classList.add(change > 0 ? 'glow-green' : 'glow-red');
            }

            // Spawn ripple from ticking cell
            FX.spawnRipple(stock.ticker, change);
            const pos = FX.cellPositions.get(stock.ticker);
            if (pos) pos.change = change;
        }

        document.getElementById('lastUpdate').textContent = 'Updated ' + new Date().toLocaleTimeString();
    }

    // ===== CONTROLS =====
    function initControls() {
        document.getElementById('sizeMetric').addEventListener('change', (e) => {
            state.sizeMetric = e.target.value;
            Renderer.render(state.grouping);
        });
        document.getElementById('colorMetric').addEventListener('change', (e) => {
            state.colorMetric = e.target.value;
            Renderer.render(state.grouping);
        });
        document.getElementById('grouping').addEventListener('change', (e) => {
            state.grouping = e.target.value;
            Renderer.render(state.grouping);
        });

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                FX._resize();
                Renderer.render(state.grouping);
            }, 150);
        });
    }

    // ===== MARKET STATUS =====
    function updateMarketStatus() {
        // Regular market hours are 9:30 AM - 4:00 PM Eastern, Mon-Fri.
        // Evaluate them in the exchange's timezone, not the viewer's:
        // a viewer on the West Coast (or abroad) otherwise sees the
        // status flip hours early or late.
        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/New_York',
            weekday: 'short',
            hour: 'numeric',
            minute: 'numeric',
            hourCycle: 'h23'
        }).formatToParts(new Date());
        const et = {};
        for (const part of parts) et[part.type] = part.value;
        const day = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].includes(et.weekday);
        const time = parseInt(et.hour, 10) * 60 + parseInt(et.minute, 10);
        const isOpen = day && time >= 570 && time <= 960;

        const dot = document.querySelector('.status-dot');
        const text = document.querySelector('.status-text');

        if (isOpen) {
            dot.style.background = 'var(--green-400)';
            dot.style.animation = '';
            text.textContent = 'Market Open';
        } else {
            dot.style.background = 'var(--neutral-500)';
            dot.style.animation = 'none';
            text.textContent = 'Market Closed';
        }
    }

    // ===== LIVE DATA INTEGRATION =====
    let isLive = false;

    function updateBadge(live) {
        const badge = document.getElementById('indexBadge');
        if (live) {
            badge.textContent = 'S&P 500 • LIVE';
            badge.style.borderColor = 'rgba(52, 211, 114, 0.25)';
            badge.style.color = '#4ade80';
            badge.style.background = 'rgba(52, 211, 114, 0.08)';
        } else {
            badge.textContent = 'S&P 500';
            badge.style.borderColor = '';
            badge.style.color = '';
            badge.style.background = '';
        }
    }

    async function fetchLiveData() {
        const badge = document.getElementById('indexBadge');
        badge.textContent = 'S&P 500 ⏳';
        badge.style.opacity = '0.7';

        try {
            const success = await StockAPI.updateStockData();
            badge.style.opacity = '1';
            if (success) {
                isLive = true;
                updateBadge(true);
                Renderer.render(state.grouping);
                AmbientGlow.update();
            } else {
                updateBadge(false);
            }
        } catch (err) {
            console.error('[App] Live fetch failed:', err);
            badge.style.opacity = '1';
            updateBadge(false);
        }

        document.getElementById('lastUpdate').textContent =
            'Updated ' + new Date().toLocaleTimeString();
    }

    async function refreshLiveData() {
        try {
            const success = await StockAPI.updateStockData();
            if (success) {
                isLive = true;
                updateBadge(true);
                // Update cell colors/values without full re-render
                const allStocks = getAllStocks();
                for (const stock of allStocks) {
                    const cellId = `cell-${stock.ticker.replace('.', '-')}`;
                    const cell = document.getElementById(cellId);
                    if (!cell) continue;

                    const change = state.colorMetric === 'weekChange' ? stock.weekChange : stock.change;
                    cell.style.backgroundColor = ColorEngine.getColor(change);

                    const changeEl = cell.querySelector('.stock-change');
                    if (changeEl) {
                        const prev = parseFloat(changeEl.dataset.value) || 0;
                        changeEl.dataset.value = change;
                        animateValue(changeEl, prev, change, 600);
                    }
                    const priceEl = cell.querySelector('.stock-price');
                    if (priceEl) priceEl.textContent = '$' + stock.price.toFixed(2);

                    // Flash on change
                    cell.classList.remove('tick-flash-green', 'tick-flash-red');
                    void cell.offsetWidth;
                    cell.classList.add(change >= 0 ? 'tick-flash-green' : 'tick-flash-red');

                    FX.spawnRipple(stock.ticker, change);
                    const pos = FX.cellPositions.get(stock.ticker);
                    if (pos) pos.change = change;
                }
                AmbientGlow.update();
            }
        } catch (err) {
            console.error('[App] Refresh failed:', err);
        }
        document.getElementById('lastUpdate').textContent =
            'Updated ' + new Date().toLocaleTimeString();
    }

    // ===== INIT =====
    async function init() {
        updateMarketStatus();
        initControls();
        FX.init();

        // Render immediately with static/placeholder data
        Renderer.render(state.grouping);
        AmbientGlow.update();

        // Fetch live data (will re-render when done)
        await fetchLiveData();

        // Micro-drift between live refreshes keeps it alive
        setInterval(() => {
            simulateTicks();
            AmbientGlow.update();
        }, 3000);

        // Refresh live data every 60s
        setInterval(refreshLiveData, 60000);

        setInterval(updateMarketStatus, 60000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
