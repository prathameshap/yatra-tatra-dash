// Utilities Module

const Utilities = {

    downloadCSV(csv, filename) {

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

        const link = document.createElement('a');

        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);

        link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);

        link.style.visibility = 'hidden';

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

    },



    formatDate(dateString) {

        return new Date(dateString).toLocaleString();

    },



    formatDuration(seconds) {

        if (seconds < 60) {

            return `${seconds}s`;

        } else if (seconds < 3600) {

            return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;

        } else {

            const hours = Math.floor(seconds / 3600);

            const minutes = Math.floor((seconds % 3600) / 60);

            return `${hours}h ${minutes}m`;

        }

    },



    debounce(func, wait) {

        let timeout;

        return function executedFunction(...args) {

            const later = () => {

                clearTimeout(timeout);

                func(...args);

            };

            clearTimeout(timeout);

            timeout = setTimeout(later, wait);

        };

    },



    throttle(func, limit) {

        let inThrottle;

        return function() {

            const args = arguments;

            const context = this;

            if (!inThrottle) {

                func.apply(context, args);

                inThrottle = true;

                setTimeout(() => inThrottle = false, limit);

            }

        };

    },



    generateUUID() {

        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {

            const r = Math.random() * 16 | 0;

            const v = c == 'x' ? r : (r & 0x3 | 0x8);

            return v.toString(16);

        });

    },



    sanitizeHTML(str) {

        const temp = document.createElement('div');

        temp.textContent = str;

        return temp.innerHTML;

    },



    validateEmail(email) {

        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return re.test(email);

    },



    copyToClipboard(text) {

        if (navigator.clipboard) {

            navigator.clipboard.writeText(text).then(() => {

                UIManager.showNotification('Copied to clipboard!');

            }).catch(() => {

                UIManager.showNotification('Failed to copy to clipboard', 'error');

            });

        } else {

            // Fallback for older browsers

            const textArea = document.createElement('textarea');

            textArea.value = text;

            document.body.appendChild(textArea);

            textArea.select();

            try {

                document.execCommand('copy');

                UIManager.showNotification('Copied to clipboard!');

            } catch (err) {

                UIManager.showNotification('Failed to copy to clipboard', 'error');

            }

            document.body.removeChild(textArea);

        }

    },



    exportToJSON(data, filename) {

        const jsonStr = JSON.stringify(data, null, 2);

        const blob = new Blob([jsonStr], { type: 'application/json' });

        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');

        link.href = url;

        link.download = `${filename}_${new Date().toISOString().split('T')[0]}.json`;

        link.click();

        URL.revokeObjectURL(url);

    },



    parseCSV(csvText) {

        const lines = csvText.split('\n');

        const headers = lines[0].split(',').map(h => h.trim());

        const data = [];



        for (let i = 1; i < lines.length; i++) {

            if (lines[i].trim() === '') continue;

            

            const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));

            const row = {};

            

            headers.forEach((header, index) => {

                row[header] = values[index] || '';

            });

            

            data.push(row);

        }



        return { headers, data };

    },



    formatFileSize(bytes) {

        if (bytes === 0) return '0 Bytes';

        

        const k = 1024;

        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];

    },



    isValidURL(string) {

        try {

            new URL(string);

            return true;

        } catch (_) {

            return false;

        }

    },



    getQueryParams() {

        const params = {};

        const queryString = window.location.search.slice(1);

        

        if (queryString) {

            queryString.split('&').forEach(param => {

                const [key, value] = param.split('=');

                params[decodeURIComponent(key)] = decodeURIComponent(value || '');

            });

        }

        

        return params;

    },



    setQueryParam(key, value) {

        const url = new URL(window.location);

        url.searchParams.set(key, value);

        window.history.pushState({}, '', url);

    },



    removeQueryParam(key) {

        const url = new URL(window.location);

        url.searchParams.delete(key);

        window.history.pushState({}, '', url);

    }

};