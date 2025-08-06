// Reports Module

const Reports = {

    async generateExecutiveReport() {

        try {

            UIManager.showNotification('Generating executive report...');

            

            const result = await ApiClient.generateExecutiveReport();

            

            if (result && result.reportUrl) {

                // If the API returns a download URL

                const link = document.createElement('a');

                link.href = result.reportUrl;

                link.download = `DR_Executive_Report_${new Date().toISOString().split('T')[0]}.pdf`;

                link.click();

                UIManager.showNotification('Executive report generated and downloaded!');

            } else {

                // Simulate download for demo

                this.simulatePDFDownload('DR_Executive_Report');

                UIManager.showNotification('Executive report generated! (Simulated download)');

            }

        } catch (error) {

            UIManager.showNotification('Failed to generate executive report', 'error');

        }

    },



    async downloadOverviewReport() {

        try {

            const reportData = {

                title: 'DR Overview Report',

                timestamp: new Date().toISOString(),

                metrics: {

                    totalResources: document.getElementById('totalResources').textContent,

                    healthyResources: document.getElementById('healthyResources').textContent,

                    issueResources: document.getElementById('issueResources').textContent,

                    totalDiscrepancies: document.getElementById('totalDiscrepancies').textContent

                }

            };



            const csv = this.generateReportCSV('Overview', reportData);

            Utilities.downloadCSV(csv, 'DR_Overview_Report');

            UIManager.showNotification('Overview report downloaded successfully!');

        } catch (error) {

            UIManager.showNotification('Failed to download overview report', 'error');

        }

    },



    async downloadScanReport() {

        try {

            const reportData = {

                title: 'DR Scan Report',

                timestamp: new Date().toISOString(),

                lastScan: document.getElementById('lastScan').textContent,

                scanDuration: document.getElementById('scanDuration').textContent,

                systemStatus: document.getElementById('systemStatus').textContent

            };



            const csv = this.generateReportCSV('Scan', reportData);

            Utilities.downloadCSV(csv, 'DR_Scan_Report');

            UIManager.showNotification('Scan report downloaded successfully!');

        } catch (error) {

            UIManager.showNotification('Failed to download scan report', 'error');

        }

    },



    async downloadSystemReport() {

        try {

            const reportData = {

                title: 'DR System Status Report',

                timestamp: new Date().toISOString(),

                apiStatus: document.getElementById('apiStatus').textContent,

                lastScan: document.getElementById('lastScan').textContent,

                scanDuration: document.getElementById('scanDuration').textContent,

                systemHealth: document.getElementById('systemStatus').textContent

            };



            const csv = this.generateReportCSV('System Status', reportData);

            Utilities.downloadCSV(csv, 'DR_System_Report');

            UIManager.showNotification('System report downloaded successfully!');

        } catch (error) {

            UIManager.showNotification('Failed to download system report', 'error');

        }

    },



    async downloadResourcesReport() {

        try {

            const resources = ResourceManager.getResourcesTableData();

            const csv = this.generateResourcesCSV(resources);

            Utilities.downloadCSV(csv, 'DR_Resources_Report');

            UIManager.showNotification('Resources report downloaded successfully!');

        } catch (error) {

            UIManager.showNotification('Failed to download resources report', 'error');

        }

    },



    async downloadDiscrepanciesReport() {

        try {

            const discrepancies = ResourceManager.getDiscrepanciesData();

            const csv = this.generateDiscrepanciesCSV(discrepancies);

            Utilities.downloadCSV(csv, 'DR_Discrepancies_Report');

            UIManager.showNotification('Discrepancies report downloaded successfully!');

        } catch (error) {

            UIManager.showNotification('Failed to download discrepancies report', 'error');

        }

    },



    async downloadResourceDetailsReport() {

        try {

            const resourceDetails = ResourceManager.getCurrentResourceDetails();

            const csv = this.generateResourceDetailsCSV(resourceDetails);

            Utilities.downloadCSV(csv, 'DR_Resource_Details_Report');

            UIManager.showNotification('Resource details report downloaded successfully!');

        } catch (error) {

            UIManager.showNotification('Failed to download resource details report', 'error');

        }

    },



    async downloadSummaryReport() {

        try {

            const summaryData = {

                overview: {

                    totalResources: document.getElementById('totalResources').textContent,

                    healthyResources: document.getElementById('healthyResources').textContent,

                    issueResources: document.getElementById('issueResources').textContent,

                    totalDiscrepancies: document.getElementById('totalDiscrepancies').textContent

                },

                systemStatus: {

                    apiStatus: document.getElementById('apiStatus').textContent,

                    lastScan: document.getElementById('lastScan').textContent,

                    scanDuration: document.getElementById('scanDuration').textContent,

                    systemHealth: document.getElementById('systemStatus').textContent

                },

                resources: ResourceManager.getResourcesTableData(),

                discrepancies: ResourceManager.getDiscrepanciesData()

            };



            const csv = this.generateSummaryCSV(summaryData);

            Utilities.downloadCSV(csv, 'DR_Complete_Summary_Report');

            UIManager.showNotification('Complete summary report downloaded successfully!');

        } catch (error) {

            UIManager.showNotification('Failed to download summary report', 'error');

        }

    },



    // Report generation helper methods

    generateReportCSV(reportType, data) {

        let csv = `DR ${reportType} Report\n`;

        csv += `Generated: ${new Date().toLocaleString()}\n\n`;

        

        if (data.metrics) {

            csv += 'Metric,Value\n';

            Object.entries(data.metrics).forEach(([key, value]) => {

                csv += `${key.replace(/([A-Z])/g, ' $1').trim()},${value}\n`;

            });

        } else {

            csv += 'Attribute,Value\n';

            Object.entries(data).forEach(([key, value]) => {

                if (key !== 'title' && key !== 'timestamp') {

                    csv += `${key.replace(/([A-Z])/g, ' $1').trim()},${value}\n`;

                }

            });

        }

        

        return csv;

    },



    generateResourcesCSV(resources) {

        let csv = 'DR Resources Report\n';

        csv += `Generated: ${new Date().toLocaleString()}\n\n`;

        csv += 'Resource ID,Primary Resource,DR Resource,Status,Last Check\n';

        

        resources.forEach(resource => {

            csv += `${resource.id},"${resource.primary}","${resource.dr}",${resource.status},"${resource.lastCheck}"\n`;

        });

        

        return csv;

    },



    generateDiscrepanciesCSV(discrepancies) {

        let csv = 'DR Configuration Discrepancies Report\n';

        csv += `Generated: ${new Date().toLocaleString()}\n\n`;

        csv += 'Type,Resource ID,Description\n';

        

        discrepancies.forEach(disc => {

            csv += `"${disc.type}","${disc.resourceId}","${disc.description}"\n`;

        });

        

        return csv;

    },



    generateResourceDetailsCSV(details) {

        let csv = 'DR Resource Details Report\n';

        csv += `Generated: ${new Date().toLocaleString()}\n\n`;

        csv += 'Attribute,Value\n';

        

        Object.entries(details).forEach(([key, value]) => {

            csv += `${key},"${value}"\n`;

        });

        

        return csv;

    },



    generateSummaryCSV(data) {

        let csv = 'DR Complete Summary Report\n';

        csv += `Generated: ${new Date().toLocaleString()}\n\n`;

        

        // Overview section

        csv += '=== OVERVIEW ===\n';

        csv += 'Metric,Value\n';

        Object.entries(data.overview).forEach(([key, value]) => {

            csv += `${key.replace(/([A-Z])/g, ' $1').trim()},${value}\n`;

        });

        

        csv += '\n=== SYSTEM STATUS ===\n';

        csv += 'Attribute,Value\n';

        Object.entries(data.systemStatus).forEach(([key, value]) => {

            csv += `${key.replace(/([A-Z])/g, ' $1').trim()},${value}\n`;

        });

        

        csv += '\n=== RESOURCES ===\n';

        csv += 'Resource ID,Primary Resource,DR Resource,Status,Last Check\n';

        data.resources.forEach(resource => {

            csv += `${resource.id},"${resource.primary}","${resource.dr}",${resource.status},"${resource.lastCheck}"\n`;

        });

        

        csv += '\n=== DISCREPANCIES ===\n';

        csv += 'Type,Resource ID,Description\n';

        data.discrepancies.forEach(disc => {

            csv += `"${disc.type}","${disc.resourceId}","${disc.description}"\n`;

        });

        

        return csv;

    },



    simulatePDFDownload(filename) {

        const pdfContent = `%PDF-1.4

1 0 obj

<<

/Type /Catalog

/Pages 2 0 R

>>

endobj



2 0 obj

<<

/Type /Pages

/Kids [3 0 R]

/Count 1

>>

endobj



3 0 obj

<<

/Type /Page

/Parent 2 0 R

/Resources <<

/Font <<

/F1 4 0 R

>>

>>

/MediaBox [0 0 612 792]

/Contents 5 0 R

>>

endobj



4 0 obj

<<

/Type /Font

/Subtype /Type1

/BaseFont /Times-Roman

>>

endobj



5 0 obj

<<

/Length 44

>>

stream

BT

/F1 12 Tf

72 720 Td

(DR Executive Report) Tj

ET

endstream

endobj



xref

0 6

0000000000 65535 f 

0000000010 00000 n 

0000000053 00000 n 

0000000125 00000 n 

0000000348 00000 n 

0000000440 00000 n 

trailer

<<

/Size 6

/Root 1 0 R

>>

startxref

553

%%EOF`;

        

        const blob = new Blob([pdfContent], { type: 'application/pdf' });

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');

        link.href = url;

        link.download = `${filename}_${new Date().toISOString().split('T')[0]}.pdf`;

        link.click();

        window.URL.revokeObjectURL(url);

    }

};