// Resource Manager Module

const ResourceManager = {

    currentResourceId: null,



    async loadResources() {

        try {

            const tbody = document.getElementById('resourcesTableBody');

            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;"><div class="loading"></div></td></tr>';

            

            const resources = await ApiClient.getResources();

            

            if (resources && resources.length > 0) {

                tbody.innerHTML = resources.map(resource => this.generateResourceRow(resource)).join('');

            } else {

                // Use mock data for demonstration

                tbody.innerHTML = Config.MOCK_DATA.RESOURCES.map(resource => this.generateResourceRow(resource)).join('');

            }

            

            UIManager.showNotification('Resources loaded successfully!');

        } catch (error) {

            UIManager.showNotification('Failed to load resources', 'error');

        }

    },



    generateResourceRow(resource) {

        return `

            <tr>

                <td>${resource.id}</td>

                <td>${resource.primaryResource}</td>

                <td>${resource.drResource}</td>

                <td>

                    <span class="status-badge ${UIManager.getStatusClass(resource.status)}">

                        ${resource.status}

                    </span>

                </td>

                <td>${new Date(resource.lastCheck).toLocaleString()}</td>

                <td>

                    <button class="btn" onclick="ResourceManager.viewResourceDetails('${resource.id}')" style="padding: 5px 10px; margin: 2px;">

                        View

                    </button>

                    <button class="btn btn-warning" onclick="ResourceManager.forceStatusCheck('${resource.id}')" style="padding: 5px 10px; margin: 2px;">

                        Check

                    </button>

                </td>

            </tr>

        `;

    },



    async viewResourceDetails(resourceId) {

        try {

            this.currentResourceId = resourceId;

            const details = await ApiClient.getResourceDetails(resourceId);

            

            let detailsHtml = '';

            if (details) {

                detailsHtml = this.generateResourceDetailsHtml(details);

            } else {

                // Mock data

                detailsHtml = this.generateMockResourceDetailsHtml(resourceId);

            }

            

            UIManager.updateElementHTML('resourceDetails', detailsHtml);

            UIManager.openResourceModal(resourceId);

        } catch (error) {

            UIManager.showNotification('Failed to load resource details', 'error');

        }

    },



    generateResourceDetailsHtml(details) {

        return `

            <div class="api-endpoint">GET /api/resources/${details.id}</div>

            <div class="metric">

                <span class="metric-label">Resource ID</span>

                <span class="metric-value">${details.id}</span>

            </div>

            <div class="metric">

                <span class="metric-label">Type</span>

                <span class="metric-value">${details.type}</span>

            </div>

            <div class="metric">

                <span class="metric-label">Status</span>

                <span class="status-badge ${UIManager.getStatusClass(details.status)}">${details.status}</span>

            </div>

            <div class="metric">

                <span class="metric-label">Primary Location</span>

                <span class="metric-value">${details.primaryLocation}</span>

            </div>

            <div class="metric">

                <span class="metric-label">DR Location</span>

                <span class="metric-value">${details.drLocation}</span>

            </div>

        `;

    },



    generateMockResourceDetailsHtml(resourceId) {

        return `

            <div class="api-endpoint">GET /api/resources/${resourceId}</div>

            <div class="metric">

                <span class="metric-label">Resource ID</span>

                <span class="metric-value">${resourceId}</span>

            </div>

            <div class="metric">

                <span class="metric-label">Type</span>

                <span class="metric-value">Web Application</span>

            </div>

            <div class="metric">

                <span class="metric-label">Status</span>

                <span class="status-badge status-healthy">Healthy</span>

            </div>

            <div class="metric">

                <span class="metric-label">Primary Location</span>

                <span class="metric-value">East US</span>

            </div>

            <div class="metric">

                <span class="metric-label">DR Location</span>

                <span class="metric-value">West US</span>

            </div>

            <div class="metric">

                <span class="metric-label">Last Sync</span>

                <span class="metric-value">${new Date().toLocaleString()}</span>

            </div>

        `;

    },



    async forceStatusCheck(resourceId) {

        try {

            UIManager.showNotification(`Checking status for resource ${resourceId}...`);

            

            const result = await ApiClient.checkResourceStatus(resourceId);

            

            if (result && result.success) {

                UIManager.showNotification(`Status check completed for ${resourceId}!`);

                this.loadResources(); // Refresh the resources table

            } else {

                UIManager.showNotification(`Status check failed for ${resourceId}`, 'error');

            }

        } catch (error) {

            UIManager.showNotification(`Failed to check status for ${resourceId}`, 'error');

        }

    },



    async loadDiscrepancies() {

        try {

            const container = document.getElementById('discrepanciesList');

            container.innerHTML = '<div style="text-align: center;"><div class="loading"></div></div>';

            

            const discrepancies = await ApiClient.getDiscrepancies();

            

            if (discrepancies && discrepancies.length > 0) {

                container.innerHTML = discrepancies.map(disc => this.generateDiscrepancyItem(disc)).join('');

            } else {

                // Use mock data for demonstration

                container.innerHTML = Config.MOCK_DATA.DISCREPANCIES.map(disc => this.generateDiscrepancyItem(disc)).join('');

            }

            

            UIManager.showNotification('Discrepancies loaded successfully!');

        } catch (error) {

            UIManager.showNotification('Failed to load discrepancies', 'error');

        }

    },



    generateDiscrepancyItem(discrepancy) {

        return `

            <div class="discrepancy-item">

                <strong>${discrepancy.type}</strong><br>

                <small>Resource: ${discrepancy.resourceId}</small><br>

                ${discrepancy.description}

            </div>

        `;

    },



    viewDiscrepancies() {

        this.loadDiscrepancies();

        document.querySelector('.card:last-child').scrollIntoView({ 

            behavior: 'smooth' 

        });

    },



    viewAllResources() {

        this.loadResources();

        document.querySelector('.resources-table').scrollIntoView({ 

            behavior: 'smooth' 

        });

    },



    getResourcesTableData() {

        const rows = document.querySelectorAll('#resourcesTableBody tr');

        const resources = [];

        

        rows.forEach(row => {

            const cells = row.querySelectorAll('td');

            if (cells.length >= 5 && cells[0].textContent.trim() !== '') {

                resources.push({

                    id: cells[0].textContent.trim(),

                    primary: cells[1].textContent.trim(),

                    dr: cells[2].textContent.trim(),

                    status: cells[3].textContent.trim(),

                    lastCheck: cells[4].textContent.trim()

                });

            }

        });

        

        return resources.length > 0 ? resources : Config.MOCK_DATA.RESOURCES.map(r => ({

            id: r.id,

            primary: r.primaryResource,

            dr: r.drResource,

            status: r.status,

            lastCheck: new Date(r.lastCheck).toLocaleString()

        }));

    },



    getDiscrepanciesData() {

        const discrepancies = [];

        const items = document.querySelectorAll('.discrepancy-item');

        

        items.forEach(item => {

            const lines = item.textContent.split('\n').filter(line => line.trim());

            if (lines.length >= 3) {

                discrepancies.push({

                    type: lines[0].trim(),

                    resourceId: lines[1].replace('Resource:', '').trim(),

                    description: lines.slice(2).join(' ').trim()

                });

            }

        });

        

        return discrepancies.length > 0 ? discrepancies : Config.MOCK_DATA.DISCREPANCIES;

    },



    getCurrentResourceDetails() {

        const detailsDiv = document.getElementById('resourceDetails');

        const metrics = detailsDiv.querySelectorAll('.metric');

        const details = {};

        

        metrics.forEach(metric => {

            const label = metric.querySelector('.metric-label')?.textContent.trim();

            const value = metric.querySelector('.metric-value')?.textContent.trim();

            if (label && value) {

                details[label] = value;

            }

        });

        

        return Object.keys(details).length > 0 ? details : {

            'Resource ID': 'Sample Resource',

            'Type': 'Web Application',

            'Status': 'Healthy',

            'Primary Location': 'East US',

            'DR Location': 'West US',

            'Last Sync': new Date().toLocaleString()

        };

    }

};