/**
 * Parser for Health OKF Markdown files
 */

class HealthParser {
    constructor() {
        this.basePath = '../logs/';
    }

    /**
     * Get the formatted path for a specific date
     */
    getLogPath(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${this.basePath}${year}/${month}/${year}-${month}-${day}.md`;
    }

    /**
     * Try to fetch the log for today, if not found, try yesterday
     */
    async fetchLatestLog() {
        let currentDate = new Date();
        let maxAttempts = 5;
        
        for (let i = 0; i < maxAttempts; i++) {
            const path = this.getLogPath(currentDate);
            try {
                const response = await fetch(path);
                if (response.ok) {
                    const text = await response.text();
                    return {
                        date: currentDate,
                        rawText: text,
                        parsed: this.parseLogText(text)
                    };
                }
            } catch (e) {
                console.warn(`Could not fetch log for ${path}`);
            }
            // Go back one day
            currentDate.setDate(currentDate.getDate() - 1);
        }
        
        throw new Error("No recent logs found in the last 5 days.");
    }

    /**
     * Parse the Markdown text and extract key metrics
     */
    parseLogText(text) {
        const data = {
            alerts: [],
            bodyBattery: '--',
            sleepScore: '--',
            hrv: '--',
            bp: '--/--',
            rawBody: text
        };

        // Extract Alerts
        const alertMatches = text.match(/⚠️(.*)/g);
        if (alertMatches) {
            data.alerts = alertMatches.map(a => a.replace('⚠️', '').trim());
        }

        // Extract Body Battery
        const bbActualMatch = text.match(/Actual\/Último:\s*(\d+)/);
        if (bbActualMatch) data.bodyBattery = bbActualMatch[1];
        
        const bbMaxMatch = text.match(/Mín\/Máx:\s*\d+\s*\/\s*(\d+)/);
        if (bbMaxMatch) data.bodyBatteryMax = bbMaxMatch[1];

        // Extract Sleep Score
        const sleepMatch = text.match(/Puntaje:\s*(\d+)/);
        if (sleepMatch) data.sleepScore = sleepMatch[1];

        // Extract HRV
        const hrvMatch = text.match(/HRV noche:\s*(\d+)\s*ms/);
        if (hrvMatch) data.hrv = hrvMatch[1];

        // Extract Blood Pressure from Markdown Table or legacy format
        const bpTableMatch = text.match(/\|\s*\d{2}:\d{2}\s*\|\s*(\d{2,3})\s*\|\s*(\d{2,3})\s*\|/);
        if (bpTableMatch) {
            data.bp = `${bpTableMatch[1]}/${bpTableMatch[2]}`;
        } else {
            const bpMatch = text.match(/(\d{2,3}\/\d{2,3})\s*mmHg/);
            if (bpMatch) data.bp = bpMatch[1];
        }

        return data;
    }
}

window.HealthParser = HealthParser;
