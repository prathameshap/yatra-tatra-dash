// Configuration Module
const Config = {
    // API Configuration
    API_BASE_URL: 'http://localhost:7071/api', // Change this to your API server
    
    // Auto-refresh settings
    AUTO_REFRESH_INTERVAL: 60000, // 60 seconds
    HEALTH_CHECK_INTERVAL: 30000, // 30 seconds
    
    // UI Settings
    NOTIFICATION_DURATION: 3000, // 3 seconds
    SCAN_PROGRESS_UPDATE_INTERVAL: 500, // 0.5 seconds
    
    // API Endpoints - Fixed to match backend
    ENDPOINTS: {
        DASHBOARD: '/dashboard',
        SCAN: '/scan',
        RESOURCES: '/resources',
        RESOURCE_DETAILS: '/resources/{id}',
        REFRESH_RESOURCE: '/resources/{id}/refresh', // Fixed: was STATUS_CHECK
        SYSTEM_HEALTH: '/resources/health', // Added missing endpoint
        DISCREPANCIES: '/discrepancies',
        DISCREPANCY_SUMMARY: '/discrepancies/summary', // Added missing endpoint
        CRITICAL_DISCREPANCIES: '/discrepancies/critical', // Added missing endpoint
        RESOLVE_DISCREPANCY: '/discrepancies/{id}/resolve', // Added missing endpoint
        FEATURE_STATUS: '/features', // Added missing endpoint
        COST_ESTIMATE: '/features/cost-estimate', // Added missing endpoint
        EXECUTIVE_REPORT: '/reports/executive',
        DASHBOARD_REPORT: '/reports/dashboard', // Added missing endpoint
        TEST_ALERT: '/alerts/test', // Added missing endpoint
        CLEAR_CACHE: '/cache', // Added missing endpoint
        CACHE_SIZE: '/cache/size', // Added missing endpoint
        HEALTH: '/health',
        TEST: '/test', // Added for debugging
        TEST_SIMPLE: '/test-simple', // Added for debugging
        TEST_AZURE_AUTH: '/test-azure-auth' // Added for testing Azure authentication
    },
    
    // Status mappings
    STATUS_CLASSES: {
        'healthy': 'status-healthy',
        'ok': 'status-healthy',
        'active': 'status-healthy',
        'warning': 'status-warning',
        'degraded': 'status-warning',
        'error': 'status-error',
        'failed': 'status-error',
        'critical': 'status-error'
    },
    
    // Default mock data for development
    MOCK_DATA: {
        RESOURCES: [
            { id: 'RES001', primaryResource: 'webapp-prod-east', drResource: 'webapp-dr-west', status: 'Healthy', lastCheck: new Date().toISOString() },
            { id: 'RES002', primaryResource: 'database-prod-east', drResource: 'database-dr-west', status: 'Warning', lastCheck: new Date().toISOString() },
            { id: 'RES003', primaryResource: 'storage-prod-east', drResource: 'storage-dr-west', status: 'Error', lastCheck: new Date().toISOString() }
        ],
        
        DISCREPANCIES: [
            {
                type: 'Configuration Mismatch',
                resourceId: 'RES002',
                description: 'Database backup retention period differs between primary (30 days) and DR (7 days) instances.'
            },
            {
                type: 'Version Discrepancy',
                resourceId: 'RES003',
                description: 'Storage tier configuration mismatch detected. Primary uses Standard, DR uses Premium.'
            }
        ],
        
        DASHBOARD: {
            totalResources: 15,
            healthyResources: 12,
            issueResources: 3,
            totalDiscrepancies: 2,
            lastScan: new Date().toISOString(),
            scanDuration: '45s'
        }
    }
};