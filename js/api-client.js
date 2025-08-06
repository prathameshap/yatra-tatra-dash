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



    async checkResourceStatus(resourceId) {

        const endpoint = Config.ENDPOINTS.STATUS_CHECK.replace('{id}', resourceId);

        return await this.makeApiCall(endpoint, 'POST');

    },



    async getDiscrepancies() {

        return await this.makeApiCall(Config.ENDPOINTS.DISCREPANCIES);

    },



    async generateExecutiveReport() {

        return await this.makeApiCall(Config.ENDPOINTS.EXECUTIVE_REPORT, 'POST');

    },



    async checkHealth() {

        return await this.makeApiCall(Config.ENDPOINTS.HEALTH);

    }

};