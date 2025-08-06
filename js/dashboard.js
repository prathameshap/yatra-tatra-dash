// Dashboard Module

const Dashboard = {

    data: null,

    autoRefreshInterval: null,



    async refreshDashboard() {

        try {

            UIManager.setLoading('totalResources', true);

            

            const data = await ApiClient.getDashboardData();

            

            if (data) {

                this.data = data;

                this.updateDashboardMetrics(data);

            } else {

                // Fallback with mock data

                this.updateDashboardMetrics(Config.MOCK_DATA.DASHBOARD);

            }

            

            UIManager.updateLastUpdated();

            UIManager.showNotification('Dashboard refreshed successfully!');

        } catch (error) {

            UIManager.showNotification('Failed to refresh dashboard', 'error');

        }

    },



    updateDashboardMetrics(data) {

        UIManager.updateElement('totalResources', data.totalResources || 0);

        UIManager.updateElement('healthyResources', data.healthyResources || 0);

        UIManager.updateElement('issueResources', data.issueResources || 0);

        UIManager.updateElement('totalDiscrepancies', data.totalDiscrepancies || 0);

        

        if (data.lastScan) {

            UIManager.updateElement('lastScan', new Date(data.lastScan).toLocaleString());

        }

        

        if (data.scanDuration) {

            UIManager.updateElement('scanDuration', data.scanDuration);

        }

    },



    startAutoRefresh() {

        this.autoRefreshInterval = setInterval(() => {

            if (!ScanManager.scanInProgress) {

                this.refreshDashboard();

            }

        }, Config.AUTO_REFRESH_INTERVAL);

    },



    stopAutoRefresh() {

        if (this.autoRefreshInterval) {

            clearInterval(this.autoRefreshInterval);

        }

    },



    initialize() {

        this.refreshDashboard();

        this.startAutoRefresh();

    }

};