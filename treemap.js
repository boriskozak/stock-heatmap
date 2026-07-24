/**
 * treemap.js - Squarified Treemap Layout Algorithm
 * Implements Bruls, Huizing, and van Wijk's squarified treemap algorithm
 * for optimal aspect ratio rectangles
 */

class TreemapLayout {
    /**
     * Compute a squarified treemap layout
     * @param {Array} items - Array of { value, ...data }
     * @param {number} x - Left bound
     * @param {number} y - Top bound
     * @param {number} w - Width
     * @param {number} h - Height
     * @param {number} padding - Padding between cells
     * @returns {Array} Array of { x, y, w, h, ...data }
     */
    static compute(items, x, y, w, h, padding = 1) {
        if (!items || items.length === 0) return [];

        // Sort by value descending for better squarification
        const sorted = [...items].sort((a, b) => b.value - a.value);
        const totalValue = sorted.reduce((s, item) => s + item.value, 0);

        if (totalValue === 0) return [];

        const rects = [];
        this._squarify(sorted, totalValue, { x, y, w, h }, rects, padding);
        return rects;
    }

    static _squarify(items, totalValue, bounds, rects, padding) {
        if (items.length === 0) return;
        if (items.length === 1) {
            const item = items[0];
            rects.push({
                x: bounds.x + padding,
                y: bounds.y + padding,
                w: Math.max(0, bounds.w - padding * 2),
                h: Math.max(0, bounds.h - padding * 2),
                ...item
            });
            return;
        }

        // Determine the shorter side
        const isWide = bounds.w >= bounds.h;
        const shortSide = isWide ? bounds.h : bounds.w;

        // Find optimal row
        let row = [];
        let rowValue = 0;
        let bestRatio = Infinity;

        for (let i = 0; i < items.length; i++) {
            const testRow = [...row, items[i]];
            const testValue = rowValue + items[i].value;
            const ratio = this._worstRatio(testRow, testValue, totalValue, shortSide, bounds.w * bounds.h);

            if (ratio <= bestRatio) {
                row = testRow;
                rowValue = testValue;
                bestRatio = ratio;
            } else {
                break;
            }
        }

        // Layout the row
        const rowFraction = rowValue / totalValue;
        const rowSize = isWide
            ? bounds.w * rowFraction
            : bounds.h * rowFraction;

        let offset = 0;
        for (const item of row) {
            const itemFraction = item.value / rowValue;
            const itemSize = shortSide * itemFraction;

            const rect = isWide
                ? {
                    x: bounds.x + padding,
                    y: bounds.y + offset + padding,
                    w: Math.max(0, rowSize - padding * 2),
                    h: Math.max(0, itemSize - padding * 2)
                }
                : {
                    x: bounds.x + offset + padding,
                    y: bounds.y + padding,
                    w: Math.max(0, itemSize - padding * 2),
                    h: Math.max(0, rowSize - padding * 2)
                };

            rects.push({ ...rect, ...item });
            offset += itemSize;
        }

        // Recurse with remaining items and reduced bounds
        const remaining = items.slice(row.length);
        const remainingValue = totalValue - rowValue;
        const newBounds = isWide
            ? { x: bounds.x + rowSize, y: bounds.y, w: bounds.w - rowSize, h: bounds.h }
            : { x: bounds.x, y: bounds.y + rowSize, w: bounds.w, h: bounds.h - rowSize };

        this._squarify(remaining, remainingValue, newBounds, rects, padding);
    }

    static _worstRatio(row, rowValue, totalValue, shortSide, totalArea) {
        if (row.length === 0) return Infinity;

        const rowArea = (rowValue / totalValue) * totalArea;
        const rowWidth = rowArea / shortSide;

        let worst = 0;
        for (const item of row) {
            const itemArea = (item.value / totalValue) * totalArea;
            const itemHeight = itemArea / rowWidth;
            const ratio = Math.max(rowWidth / itemHeight, itemHeight / rowWidth);
            worst = Math.max(worst, ratio);
        }
        return worst;
    }

    /**
     * Compute a two-level treemap: sectors containing stocks
     */
    static computeSectorLayout(sectors, x, y, w, h, sectorPadding = 2, cellPadding = 1) {
        // First, layout sectors
        const sectorItems = sectors.map(s => ({
            value: s.totalMarketCap,
            sector: s.sector,
            stocks: s.stocks
        }));

        const sectorRects = this.compute(sectorItems, x, y, w, h, sectorPadding);
        const result = [];

        const SECTOR_HEADER = 20;

        for (const sectorRect of sectorRects) {
            const stockItems = sectorRect.stocks.map(s => ({
                value: s.marketCap,
                ...s
            }));

            // Layout stocks within sector bounds (below header)
            const stockRects = this.compute(
                stockItems,
                sectorRect.x,
                sectorRect.y + SECTOR_HEADER,
                sectorRect.w,
                Math.max(0, sectorRect.h - SECTOR_HEADER),
                cellPadding
            );

            result.push({
                sector: sectorRect.sector,
                bounds: sectorRect,
                stocks: stockRects
            });
        }

        return result;
    }
}
