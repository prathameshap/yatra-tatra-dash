// Health Monitor Module

const HealthMonitor = {

    healthCheckInterval: null,



    async checkSystemHealth() {

        try {

            const health = await ApiClient.checkHealth();

            

            const isHealthy = health && health.status === 'healthy';

            UIManager.updateHealthIndicator(isHealthy);

            

            if (isHealthy) {

                UIManager.showNotification('System is healthy!');

            } else {

                UIManager.showNotification('System health issues detected', 'error');

            }



            return isHealthy;

        } catch (error) {

            UIManager.updateHealthIndicator(false);

            UIManager.showNotification('Failed to check system health', 'error');

            return false;

        }

    },



    startPeriodicHealthCheck() {

        this.healthCheckInterval = setInterval(() => {

            this.checkSystemHealth();

        }, Config.HEALTH_CHECK_INTERVAL);

    },



    stopPeriodicHealthCheck() {

        if (this.healthCheckInterval) {

            clearInterval(this.healthCheckInterval);

        }

    },



    getHealthStatus() {

        const indicator = document.getElementById('healthIndicator');

        const status = document.getElementById('systemStatus');

        const apiStatus = document.getElementById('apiStatus');

        

        return {

            indicatorColor: indicator.style.background,

            statusText: status.textContent,

            apiStatusText: apiStatus.textContent,

            apiStatusClass: apiStatus.className

        };

    },



    initialize() {

        this.checkSystemHealth();

        this.startPeriodicHealthCheck();

    }

};