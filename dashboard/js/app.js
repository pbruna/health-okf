/**
 * Main Application Logic
 */

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // Theme Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    // Default is light. Check local storage if user saved a preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.setAttribute('data-lucide', 'sun');
    }

    lucide.createIcons(); // Re-render icon if changed to sun

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        let newTheme = 'light';
        let newIcon = 'moon';

        if (currentTheme !== 'dark') {
            newTheme = 'dark';
            newIcon = 'sun';
        }

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        themeIcon.setAttribute('data-lucide', newIcon);
        lucide.createIcons();
        
        // Re-render chart colors based on theme if chart exists
        if (window.mainChartInstance) {
            updateChartTheme(newTheme);
        }
    });

    const parser = new HealthParser();
    
    // UI Elements
    const dateDisplay = document.getElementById('date-display');
    const syncStatus = document.getElementById('sync-status');
    const syncStatusContainer = document.getElementById('sync-status-container');
    
    // Metrics
    const bpValue = document.getElementById('bp-value');
    const hrvValue = document.getElementById('hrv-value');
    const bbValue = document.getElementById('bb-value');
    const sleepValue = document.getElementById('sleep-value');
    
    // Sections
    const alertsList = document.getElementById('alerts-list');
    const rawLogContent = document.getElementById('raw-log-content');
    
    try {
        // Fetch data
        const logData = await parser.fetchLatestLog();
        
        // Update Header Date
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateDisplay.textContent = logData.date.toLocaleDateString('es-ES', options);
        
        // Update Status
        syncStatus.classList.remove('loading');
        syncStatusContainer.title = "Sincronizado";

        // Update Metrics
        bpValue.textContent = logData.parsed.bp;
        hrvValue.textContent = logData.parsed.hrv;
        
        if (logData.parsed.bodyBatteryMax) {
            bbValue.innerHTML = `${logData.parsed.bodyBattery} <span style="font-size: 0.6em; color: var(--text-muted);">/ ${logData.parsed.bodyBatteryMax} máx</span>`;
        } else {
            bbValue.textContent = logData.parsed.bodyBattery;
        }

        sleepValue.textContent = logData.parsed.sleepScore;

        // Update Alerts
        if (logData.parsed.alerts && logData.parsed.alerts.length > 0) {
            alertsList.innerHTML = logData.parsed.alerts.map(a => `<li>${a}</li>`).join('');
        } else {
            alertsList.innerHTML = `<li><span style="color: var(--text-muted)">No hay alertas para este día.</span></li>`;
        }

        // Render Markdown Log
        if (window.marked) {
            rawLogContent.innerHTML = marked.parse(logData.rawText);
        } else {
            rawLogContent.textContent = "Error: Marked.js no cargado.";
        }

        // Initialize chart
        initChart(logData.parsed.hrv, logData.parsed.bodyBattery);

    } catch (error) {
        console.error(error);
        dateDisplay.textContent = "Error al cargar datos";
        syncStatus.classList.remove('loading');
        syncStatus.style.backgroundColor = 'var(--accent-bp)';
        alertsList.innerHTML = `<li>No se pudo cargar el log.</li>`;
        rawLogContent.innerHTML = `<p>Revisa la conexión.</p>`;
    }
});

// Chart.js instance tracking
window.mainChartInstance = null;

function getChartColors(theme) {
    if (theme === 'dark') {
        return {
            grid: 'rgba(255, 255, 255, 0.05)',
            text: '#a1a1aa'
        };
    }
    return {
        grid: 'rgba(0, 0, 0, 0.05)',
        text: '#6b7280'
    };
}

function updateChartTheme(theme) {
    const colors = getChartColors(theme);
    window.mainChartInstance.options.scales.x.grid.color = colors.grid;
    window.mainChartInstance.options.scales.y.grid.color = colors.grid;
    window.mainChartInstance.options.scales.x.ticks.color = colors.text;
    window.mainChartInstance.options.scales.y.ticks.color = colors.text;
    window.mainChartInstance.options.plugins.legend.labels.color = colors.text;
    window.mainChartInstance.update();
}

function initChart(latestHrv, latestBb) {
    const ctx = document.getElementById('mainChart').getContext('2d');
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const colors = getChartColors(currentTheme);
    
    const hrvBase = parseInt(latestHrv) || 30;
    const bbBase = parseInt(latestBb) || 50;

    const data = {
        labels: ['D-6', 'D-5', 'D-4', 'D-3', 'D-2', 'Ayer', 'Hoy'],
        datasets: [
            {
                label: 'HRV (ms)',
                data: [hrvBase+5, hrvBase+2, hrvBase-1, hrvBase+4, hrvBase, hrvBase-3, hrvBase],
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'Body Battery',
                data: [bbBase-10, bbBase+20, bbBase+5, bbBase-15, bbBase+10, bbBase-5, bbBase],
                borderColor: '#10b981',
                backgroundColor: 'transparent',
                tension: 0.4,
                borderDash: [5, 5]
            }
        ]
    };

    window.mainChartInstance = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: colors.text, font: { family: 'Inter' } }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: colors.grid },
                    ticks: { color: colors.text, font: { family: 'Inter' } }
                },
                x: {
                    grid: { color: colors.grid },
                    ticks: { color: colors.text, font: { family: 'Inter' } }
                }
            }
        }
    });
}

// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}
