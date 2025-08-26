// API Client Module
const ApiClient = {
    async makeApiCall(endpoint, method = 'GET', body = null) {
        try {
            const options = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            
            if (body) {
                options.body = JSON.stringify(body);
            }

            const response = await fetch(`${Config.API_BASE_URL}${endpoint}`, options);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API call failed:', error);
            UIManager.showNotification(`API call failed: ${error.message}`, 'error');
            return null;
        }
    },

    // Dashboard API calls
    async getDashboardData() {
        return await this.makeApiCall(Config.ENDPOINTS.DASHBOARD);
    },

    async triggerScan() {
        return await this.makeApiCall(Config.ENDPOINTS.SCAN, 'POST');
    },

    async getResources() {
        return await this.makeApiCall(Config.ENDPOINTS.RESOURCES);
    },

    async getResourceDetails(resourceId) {
        const endpoint = Config.ENDPOINTS.RESOURCE_DETAILS.replace('{id}', resourceId);
        return await this.makeApiCall(endpoint);
    },

    // Fixed: Changed from STATUS_CHECK to REFRESH_RESOURCE
    async refreshResourceStatus(resourceId) {
        const endpoint = Config.ENDPOINTS.REFRESH_RESOURCE.replace('{id}', resourceId);
        return await this.makeApiCall(endpoint, 'POST');
    },

    async getDiscrepancies() {
        return await this.makeApiCall(Config.ENDPOINTS.DISCREPANCIES);
    },

    // Fixed: Changed from POST to GET for executive report
    async generateExecutiveReport() {
        return await this.makeApiCall(Config.ENDPOINTS.EXECUTIVE_REPORT, 'GET');
    },

    async checkHealth() {
        return await this.makeApiCall(Config.ENDPOINTS.HEALTH);
    },

    // New API methods for missing endpoints
    async getSystemHealth() {
        return await this.makeApiCall(Config.ENDPOINTS.SYSTEM_HEALTH);
    },

    async getDiscrepancySummary() {
        return await this.makeApiCall(Config.ENDPOINTS.DISCREPANCY_SUMMARY);
    },

    async getCriticalDiscrepancies() {
        return await this.makeApiCall(Config.ENDPOINTS.CRITICAL_DISCREPANCIES);
    },

    async resolveDiscrepancy(discrepancyId) {
        const endpoint = Config.ENDPOINTS.RESOLVE_DISCREPANCY.replace('{id}', discrepancyId);
        return await this.makeApiCall(endpoint, 'POST');
    },

    async getFeatureStatus() {
        return await this.makeApiCall(Config.ENDPOINTS.FEATURE_STATUS);
    },

    async getCostEstimate() {
        return await this.makeApiCall(Config.ENDPOINTS.COST_ESTIMATE);
    },

    async getDashboardReport() {
        return await this.makeApiCall(Config.ENDPOINTS.DASHBOARD_REPORT);
    },

    async sendTestAlert() {
        return await this.makeApiCall(Config.ENDPOINTS.TEST_ALERT, 'POST');
    },

    async clearCache() {
        return await this.makeApiCall(Config.ENDPOINTS.CLEAR_CACHE, 'DELETE');
    },

    async getCacheSize() {
        return await this.makeApiCall(Config.ENDPOINTS.CACHE_SIZE);
    },

    // Test methods for debugging
    async testEndpoint() {
        return await this.makeApiCall(Config.ENDPOINTS.TEST);
    },

    async testSimpleEndpoint() {
        return await this.makeApiCall(Config.ENDPOINTS.TEST_SIMPLE);
    },

    async testAzureAuth() {
        return await this.makeApiCall(Config.ENDPOINTS.TEST_AZURE_AUTH);
    }
};