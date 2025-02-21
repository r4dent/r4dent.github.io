document.addEventListener('DOMContentLoaded', () => {
    const jsonInput = document.getElementById('jsonInput');
    const formatBtn = document.getElementById('formatBtn');
    const minifyBtn = document.getElementById('minifyBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');

    // Format button click handler
    formatBtn.addEventListener('click', () => {
        const input = jsonInput.value.trim();
        if (!input) {
            showTooltip('Please enter JSON to format', 'warning');
            return;
        }

        try {
            const parsed = JSON.parse(input);
            jsonInput.value = JSON.stringify(parsed, null, 2);
            showTooltip('JSON formatted successfully', 'success');
        } catch (error) {
            showTooltip('Invalid JSON: ' + error.message, 'danger');
        }
    });

    // Minify button click handler
    minifyBtn.addEventListener('click', () => {
        const input = jsonInput.value.trim();
        if (!input) {
            showTooltip('Please enter JSON to minify', 'warning');
            return;
        }

        try {
            const parsed = JSON.parse(input);
            jsonInput.value = JSON.stringify(parsed);
            showTooltip('JSON minified successfully', 'success');
        } catch (error) {
            showTooltip('Invalid JSON: ' + error.message, 'danger');
        }
    });

    // Clear button click handler
    clearBtn.addEventListener('click', () => {
        jsonInput.value = '';
        jsonInput.focus();
    });

    // Copy button click handler
    copyBtn.addEventListener('click', () => {
        if (!jsonInput.value) {
            showTooltip('Nothing to copy', 'warning');
            return;
        }
        jsonInput.select();
        document.execCommand('copy');
        showTooltip('Copied to clipboard!', 'success');
    });

    function showTooltip(message, type) {
        const tooltip = document.createElement('div');
        tooltip.className = `alert alert-${type} position-fixed top-0 start-50 translate-middle-x mt-3 text-white`;
        tooltip.style.zIndex = '1050';
        
        // Set background color based on type
        switch(type) {
            case 'success':
                tooltip.style.backgroundColor = '#198754';
                break;
            case 'warning':
                tooltip.style.backgroundColor = '#ffc107';
                break;
            case 'danger':
                tooltip.style.backgroundColor = '#dc3545';
                break;
        }

        tooltip.textContent = message;
        document.body.appendChild(tooltip);

        setTimeout(() => {
            tooltip.remove();
        }, 2000);
    }

    // Add tab support
    jsonInput.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = this.selectionStart;
            const end = this.selectionEnd;
            this.value = this.value.substring(0, start) + '  ' + this.value.substring(end);
            this.selectionStart = this.selectionEnd = start + 2;
        }
    });
}); 