// Scan Manager Module

const ScanManager = {

    scanInProgress: false,

    progressInterval: null,



    async triggerFullScan() {

        if (this.scanInProgress) {

            UIManager.showNotification('Scan already in progress', 'warning');

            return;

        }



        try {

            this.scanInProgress = true;

            UIManager.showScanProgress();

            UIManager.updateElement('scanStatus', 'Initiating scan...');

            

            // Simulate scan progress

            let progress = 0;

            this.progressInterval = setInterval(() => {

                progress += Math.random() * 15;

                if (progress > 90) progress = 90;

                

                UIManager.updateScanProgress(progress);

            }, Config.SCAN_PROGRESS_UPDATE_INTERVAL);



            // Make API call to trigger scan

            const result = await ApiClient.triggerScan();

            

            this.completeScan(result !== null);

        } catch (error) {

            this.completeScan(false);

            UIManager.showNotification('Scan failed', 'error');

        }

    },



    completeScan(success) {

        clearInterval(this.progressInterval);

        

        const progressBar = document.getElementById('scanProgressBar');

        const scanStatus = document.getElementById('scanStatus');

        

        progressBar.style.width = '100%';

        

        if (success) {

            scanStatus.textContent = 'Scan completed successfully!';

            UIManager.showNotification('Full scan completed successfully!');

        } else {

            scanStatus.textContent = 'Scan failed!';

            UIManager.showNotification('Scan failed', 'error');

        }

        

        setTimeout(() => {

            UIManager.hideScanProgress();

            this.scanInProgress = false;

        }, 2000);



        if (success) {

            Dashboard.refreshDashboard();

        }

    },



    getScanStatus() {

        return {

            inProgress: this.scanInProgress,

            lastScan: document.getElementById('lastScan').textContent,

            duration: document.getElementById('scanDuration').textContent

        };

    }

};