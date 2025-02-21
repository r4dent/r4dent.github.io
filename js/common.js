// Sidebar tools configuration
const sidebarTools = [
    { name: 'Subnet Calculator', url: '/tools/subnet-calculator.html', icon: '<i class="bi bi-calculator-fill"></i>' },
    { name: 'IP Address Locator', url: '/tools/ip-locator.html', icon: '<i class="bi bi-geo-alt-fill"></i>' },
    { name: 'Ping Tool', url: '/tools/ping-tool.html', icon: '<i class="bi bi-speedometer2"></i>' },
    { name: 'DNS Lookup', url: '/tools/dns-lookup.html', icon: '<i class="bi bi-search"></i>' },
    { name: 'Password Generator', url: '/tools/password-generator.html', icon: '<i class="bi bi-key-fill"></i>' },
    { name: 'Password Strength Checker', url: '/tools/password-strength.html', icon: '<i class="bi bi-shield-check"></i>' },
    { name: 'Hash Generator', url: '/tools/hash-generator.html', icon: '<i class="bi bi-hash"></i>' },
    { name: 'Base64 Encoder/Decoder', url: '/tools/base64.html', icon: '<i class="bi bi-arrow-repeat"></i>' },
    { name: 'JSON Formatter', url: '/tools/json-formatter.html', icon: '<i class="bi bi-braces"></i>' },
    { name: 'XML Formatter', url: '/tools/xml-formatter.html', icon: '<i class="bi bi-file-earmark-code"></i>' },
    { name: 'Regex Tester', url: '/tools/regex-tester.html', icon: '<i class="bi bi-regex"></i>' },
    { name: 'My IP', url: '/tools/my-ip.html', icon: '<i class="bi bi-globe"></i>' }
];

// Initialize sidebar
function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const links = sidebarTools.map(tool => {
        const isActive = window.location.pathname === tool.url;
        return `
            <a href="${tool.url}" class="nav-link ${isActive ? 'active' : ''}">
                ${tool.icon}
                <span>${tool.name}</span>
            </a>
        `;
    }).join('');
    sidebar.innerHTML = links;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeSidebar();

    // Add click handler for sidebar toggle
    const toggleButton = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');

    toggleButton.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        content.classList.toggle('shifted');
    });

    // Restore sidebar state from localStorage
    const sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (sidebarCollapsed) {
        sidebar.classList.add('collapsed');
        content.classList.add('shifted');
    }

    // Save sidebar state when toggled
    toggleButton.addEventListener('click', function() {
        localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
    });

    // Add tooltips for collapsed state
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.setAttribute('title', link.textContent.trim());
    });
});

// Global error handling
function setupErrorHandling() {
    window.onerror = function(msg, url, lineNo, columnNo, error) {
        console.error('Error: ', msg, 'URL: ', url, 'Line: ', lineNo, 'Column: ', columnNo, 'Error object: ', error);
        showErrorMessage('An unexpected error occurred. Please try again.');
        return false;
    };

    window.addEventListener('unhandledrejection', function(event) {
        console.error('Unhandled promise rejection:', event.reason);
        showErrorMessage('An unexpected error occurred. Please try again.');
    });
}

// Show error message to user
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger alert-dismissible fade show';
    errorDiv.role = 'alert';
    errorDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    // Find the main content area or fallback to body
    const mainContent = document.querySelector('main') || document.body;
    mainContent.insertBefore(errorDiv, mainContent.firstChild);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Input sanitization utility
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// Utility function to validate IP address
function isValidIPv4(ip) {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipv4Regex.test(ip)) return false;
    
    const parts = ip.split('.');
    return parts.every(part => {
        const num = parseInt(part, 10);
        return num >= 0 && num <= 255;
    });
}

// Utility function to copy text to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showSuccessMessage('Copied to clipboard!');
    } catch (err) {
        showErrorMessage('Failed to copy to clipboard');
        console.error('Failed to copy:', err);
    }
}

// Show success message
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success alert-dismissible fade show';
    successDiv.role = 'alert';
    successDiv.innerHTML = `        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    const mainContent = document.querySelector('main') || document.body;
    mainContent.insertBefore(successDiv, mainContent.firstChild);

    setTimeout(() => {
        successDiv.remove();
    }, 3000);
} 
