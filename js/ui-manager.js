// UI Manager Module

const UIManager = {

    showNotification(message, type = 'success') {

        const notification = document.getElementById('notification');

        notification.textContent = message;

        notification.className = `notification ${type}`;

        notification.classList.add('show');

        

        setTimeout(() => {

            notification.classList.remove('show');

        }, Config.NOTIFICATION_DURATION);

    },



    updateLastUpdated() {

        document.getElementById('lastUpdated').textContent = 

            `Last updated: ${new Date().toLocaleTimeString()}`;

    },



    setLoading(elementId, isLoading) {

        const element = document.getElementById(elementId);

        if (isLoading) {

            element.innerHTML = '<div class="loading"></div>';

        }

    },



    getStatusClass(status) {

        return Config.STATUS_CLASSES[status?.toLowerCase()] || 'status-warning';

    },



    closeModal() {

        document.getElementById('resourceModal').style.display = 'none';

    },



    openResourceModal(resourceId) {

        document.getElementById('resourceModal').style.display = 'block';

    },



    updateElement(elementId, value) {

        const element = document.getElementById(elementId);

        if (element) {

            element.textContent = value;

        }

    },



    updateElementHTML(elementId, html) {

        const element = document.getElementById(elementId);

        if (element) {

            element.innerHTML = html;

        }

    },



    updateHealthIndicator(isHealthy) {

        const indicator = document.getElementById('healthIndicator');

        const status = document.getElementById('systemStatus');

        const apiStatus = document.getElementById('apiStatus');

        

        if (isHealthy) {

            indicator.style.background = '#27ae60';

            status.textContent = 'System Healthy';

            apiStatus.className = 'status-badge status-healthy';

            apiStatus.textContent = 'Healthy';

        } else {

            indicator.style.background = '#e74c3c';

            status.textContent = 'System Issues Detected';

            apiStatus.className = 'status-badge status-error';

            apiStatus.textContent = 'Issues Detected';

        }

    },



    updateScanProgress(progress) {

        const progressBar = document.getElementById('scanProgressBar');

        const scanStatus = document.getElementById('scanStatus');

        

        progressBar.style.width = progress + '%';

        scanStatus.textContent = `Scanning resources... ${Math.round(progress)}%`;

    },



    showScanProgress() {

        document.getElementById('scanProgress').style.display = 'block';

    },



    hideScanProgress() {

        document.getElementById('scanProgress').style.display = 'none';

        document.getElementById('scanStatus').textContent = '';

    },



    // Event handlers

    setupEventHandlers() {

        // Close modal when clicking outside

        window.onclick = function(event) {

            const modal = document.getElementById('resourceModal');

            if (event.target === modal) {

                UIManager.closeModal();

            }

        };



        // Keyboard shortcuts

        document.addEventListener('keydown', function(event) {

            // ESC to close modal

            if (event.key === 'Escape') {

                UIManager.closeModal();

            }

            

            // Ctrl+R to refresh dashboard

            if (event.ctrlKey && event.key === 'r') {

                event.preventDefault();

                Dashboard.refreshDashboard();

            }

            

            // Ctrl+S to trigger scan

            if (event.ctrlKey && event.key === 's') {

                event.preventDefault();

                ScanManager.triggerFullScan();

            }

        });

    }

};