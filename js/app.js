// Main Application Module

const App = {

    version: '1.0.0',

    initialized: false,



    async initialize() {

        if (this.initialized) {

            console.warn('App already initialized');

            return;

        }



        try {

            console.log(`Initializing DR Monitoring Dashboard v${this.version}`);

            

            // Setup UI event handlers

            UIManager.setupEventHandlers();

            

            // Initialize modules in order

            await this.initializeModules();

            

            // Setup performance monitoring

            this.setupPerformanceMonitoring();

            

            // Setup error handling

            this.setupErrorHandling();

            

            this.initialized = true;

            

            console.log('DR Monitoring Dashboard initialized successfully!');

            console.log('Right-click anywhere for advanced options');

            console.log('Keyboard shortcuts: Ctrl+R (refresh), Ctrl+S (scan), ESC (close modal)');

            console.log('Performance data available at: window.drDashboardPerf');

            

            UIManager.showNotification('Dashboard initialized successfully!');

            

        } catch (error) {

            console.error('Failed to initialize dashboard:', error);

            UIManager.showNotification('Failed to initialize dashboard', 'error');

        }

    },



    async initializeModules() {

        // Initialize health monitor first

        HealthMonitor.initialize();

        

        // Initialize dashboard

        Dashboard.initialize();

        

        // Setup context menu

        this.setupContextMenu();

        

        // Setup additional features

        this.setupAdditionalFeatures();

    },



    setupPerformanceMonitoring() {

        const performanceData = {

            loadTime: performance.now(),

            apiCalls: 0,

            lastApiCall: null,

            errors: 0

        };

        

        // Wrap API calls to track performance

        const originalMakeApiCall = ApiClient.makeApiCall;

        ApiClient.makeApiCall = async function(...args) {

            const start = performance.now();

            performanceData.apiCalls++;

            

            try {

                const result = await originalMakeApiCall.apply(this, args);

                const duration = performance.now() - start;

                performanceData.lastApiCall = {

                    endpoint: args[0],

                    duration: Math.round(duration),

                    success: true,

                    timestamp: new Date().toISOString()

                };

                return result;

            } catch (error) {

                const duration = performance.now() - start;

                performanceData.lastApiCall = {

                    endpoint: args[0],

                    duration: Math.round(duration),

                    success: false,

                    error: error.message,

                    timestamp: new Date().toISOString()

                };

                performanceData.errors++;

                throw error;

            }

        };

        

        // Make performance data globally available

        window.drDashboardPerf = performanceData;

    },



    setupErrorHandling() {

        window.addEventListener('error', (event) => {

            console.error('Global error:', event.error);

            UIManager.showNotification('An unexpected error occurred', 'error');

        });



        window.addEventListener('unhandledrejection', (event) => {

            console.error('Unhandled promise rejection:', event.reason);

            UIManager.showNotification('An unexpected error occurred', 'error');

        });

    },



    setupContextMenu() {

        document.addEventListener('contextmenu', function(event) {

            event.preventDefault();

            

            const contextMenu = document.createElement('div');

            contextMenu.style.cssText = `

                position: fixed;

                left: ${event.clientX}px;

                top: ${event.clientY}px;

                background: white;

                border: 1px solid #ccc;

                border-radius: 5px;

                box-shadow: 0 4px 15px rgba(0,0,0,0.2);

                z-index: 2000;

                padding: 5px 0;

            `;

            

            contextMenu.innerHTML = `

                <div style="padding: 8px 15px; cursor: pointer; border-bottom: 1px solid #eee;" onclick="App.exportData(); this.parentElement.remove();">Export Data</div>

                <div style="padding: 8px 15px; cursor: pointer; border-bottom: 1px solid #eee;" onclick="App.searchResources(); this.parentElement.remove();">Search Resources</div>

                <div style="padding: 8px 15px; cursor: pointer; border-bottom: 1px solid #eee;" onclick="App.showApiTestPanel(); this.parentElement.remove();">Test APIs</div>

                <div style="padding: 8px 15px; cursor: pointer; border-bottom: 1px solid #eee;" onclick="App.showPerformanceInfo(); this.parentElement.remove();">Performance Info</div>

                <div style="padding: 8px 15px; cursor: pointer;" onclick="App.resetFilters(); this.parentElement.remove();">Reset Filters</div>

            `;

            

            document.body.appendChild(contextMenu);

            

            // Remove context menu when clicking elsewhere

            setTimeout(() => {

                document.addEventListener('click', function removeMenu() {

                    if (contextMenu.parentElement) {

                        contextMenu.remove();

                    }

                    document.removeEventListener('click', removeMenu);

                }, 10);

            });

        });

    },



    setupAdditionalFeatures() {

        // Add filter buttons to resources section

        setTimeout(() => {

            this.addFilterButtons();

        }, 100);

    },



    addFilterButtons() {

        const resourcesCard = document.querySelector('.resources-table')?.closest('.card');

        if (!resourcesCard) return;

        

        const headerDiv = resourcesCard.querySelector('.card-header');

        if (!headerDiv || headerDiv.querySelector('.filter-buttons')) return;

        

        const filterDiv = document.createElement('div');

        filterDiv.className = 'filter-buttons';

        filterDiv.style.marginTop = '10px';

        filterDiv.innerHTML = `

            <small style="color: #666;">Quick Filters:</small>

            <button class="btn" onclick="App.filterResourcesByStatus('all')" style="padding: 5px 10px; margin: 2px; font-size: 0.8rem;">All</button>

            <button class="btn btn-success" onclick="App.filterResourcesByStatus('healthy')" style="padding: 5px 10px; margin: 2px; font-size: 0.8rem;">Healthy</button>

            <button class="btn btn-warning" onclick="App.filterResourcesByStatus('warning')" style="padding: 5px 10px; margin: 2px; font-size: 0.8rem;">Warning</button>

            <button class="btn btn-danger" onclick="App.filterResourcesByStatus('error')" style="padding: 5px 10px; margin: 2px; font-size: 0.8rem;">Error</button>

            <button class="btn" onclick="App.exportData()" style="padding: 5px 10px; margin: 2px; font-size: 0.8rem;">Export</button>

        `;

        

        headerDiv.appendChild(filterDiv);

    },



    // Context menu actions

    exportData() {

        try {

            const resources = ResourceManager.getResourcesTableData();

            const csv = [

                'Resource ID,Primary Resource,DR Resource,Status,Last Check',

                ...resources.map(r => `${r.id},${r.primary},${r.dr},${r.status},"${r.lastCheck}"`)

            ].join('\n');

            

            Utilities.downloadCSV(csv, 'DR_Resources_Export');

            UIManager.showNotification('Resource data exported successfully!');

        } catch (error) {

            UIManager.showNotification('Failed to export resource data', 'error');

        }

    },



    searchResources() {

        const searchTerm = prompt('Enter resource ID or name to search:');

        if (searchTerm) {

            const rows = document.querySelectorAll('#resourcesTableBody tr');

            let found = false;

            

            rows.forEach(row => {

                const text = row.textContent.toLowerCase();

                if (text.includes(searchTerm.toLowerCase())) {

                    row.style.backgroundColor = '#fff3cd';

                    row.scrollIntoView({ behavior: 'smooth', block: 'center' });

                    found = true;

                } else {

                    row.style.backgroundColor = '';

                }

            });

            

            if (found) {

                UIManager.showNotification(`Found resource matching: ${searchTerm}`);

            } else {

                UIManager.showNotification(`No resources found matching: ${searchTerm}`, 'error');

            }

        }

    },



    showApiTestPanel() {

        const testPanel = document.createElement('div');

        testPanel.className = 'card';

        testPanel.style.cssText = `

            position: fixed;

            top: 50%;

            left: 50%;

            transform: translate(-50%, -50%);

            z-index: 1000;

            max-width: 500px;

            width: 90%;

        `;

        

        testPanel.innerHTML = `

            <div class="card-header">

                <div class="card-title">API Endpoint Tester</div>

                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; font-size: 20px; cursor: pointer;">&times;</button>

            </div>

            <div style="display: grid; gap: 10px;">

                <button class="btn" onclick="App.testApiEndpoint('/dashboard')">GET /api/dashboard</button>

                <button class="btn" onclick="App.testApiEndpoint('/scan', 'POST')">POST /api/scan</button>

                <button class="btn" onclick="App.testApiEndpoint('/resources')">GET /api/resources</button>

                <button class="btn" onclick="App.testApiEndpoint('/resources/RES001')">GET /api/resources/{id}</button>

                <button class="btn" onclick="App.testApiEndpoint('/resources/RES001/status-check', 'POST')">POST /api/resources/{id}/status-check</button>

                <button class="btn" onclick="App.testApiEndpoint('/discrepancies')">GET /api/discrepancies</button>

                <button class="btn" onclick="App.testApiEndpoint('/reports/executive', 'POST')">POST /api/reports/executive</button>

                <button class="btn" onclick="App.testApiEndpoint('/health')">GET /api/health</button>

            </div>

        `;

        

        document.body.appendChild(testPanel);

    },



    showPerformanceInfo() {

        const perf = window.drDashboardPerf;

        const info = `

Performance Information:

- Load Time: ${Math.round(perf.loadTime)}ms

- API Calls Made: ${perf.apiCalls}

- Errors: ${perf.errors}

- Last API Call: ${perf.lastApiCall ? `${perf.lastApiCall.endpoint} (${perf.lastApiCall.duration}ms)` : 'None'}

        `;

        

        alert(info);

    },



    resetFilters() {

        this.filterResourcesByStatus('all');

        UIManager.showNotification('All filters reset');

    },



    filterResourcesByStatus(status) {

        const rows = document.querySelectorAll('#resourcesTableBody tr');

        

        rows.forEach(row => {

            if (status === 'all') {

                row.style.display = '';

            } else {

                const statusCell = row.querySelector('.status-badge');

                if (statusCell && statusCell.textContent.toLowerCase().includes(status.toLowerCase())) {

                    row.style.display = '';

                } else {

                    row.style.display = 'none';

                }

            }

        });

        

        UIManager.showNotification(`Filtered resources by status: ${status}`);

    },



    testApiEndpoint(endpoint, method = 'GET') {

        UIManager.showNotification(`Testing ${method} ${endpoint}...`);

        

        ApiClient.makeApiCall(endpoint, method)

            .then(result => {

                if (result) {

                    UIManager.showNotification(`✅ ${endpoint} - Success`);

                    console.log(`API Response for ${endpoint}:`, result);

                } else {

                    UIManager.showNotification(`❌ ${endpoint} - Failed`, 'error');

                }

            })

            .catch(error => {

                UIManager.showNotification(`❌ ${endpoint} - Error: ${error.message}`, 'error');

            });

    },



    // Cleanup methods

    destroy() {

        Dashboard.stopAutoRefresh();

        HealthMonitor.stopPeriodicHealthCheck();

        this.initialized = false;

        console.log('Dashboard destroyed');

    }

};



// Initialize the application when DOM is loaded

document.addEventListener('DOMContentLoaded', function() {

    App.initialize();

});