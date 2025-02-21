document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('input');
    const output = document.getElementById('output');
    const encodeBtn = document.getElementById('encodeBtn');
    const decodeBtn = document.getElementById('decodeBtn');
    const copyBtn = document.getElementById('copyBtn');
    const clearInputBtn = document.getElementById('clearInputBtn');
    const clearOutputBtn = document.getElementById('clearOutputBtn');

    // Encode button click handler
    encodeBtn.addEventListener('click', () => {
        try {
            const text = input.value;
            if (!text) {
                showTooltip('Please enter text to encode', 'warning');
                return;
            }
            output.value = btoa(text);
        } catch (error) {
            showTooltip('Invalid input for encoding', 'danger');
        }
    });

    // Decode button click handler
    decodeBtn.addEventListener('click', () => {
        try {
            const text = input.value;
            if (!text) {
                showTooltip('Please enter text to decode', 'warning');
                return;
            }
            output.value = atob(text);
        } catch (error) {
            showTooltip('Invalid Base64 input', 'danger');
        }
    });

    // Copy button click handler
    copyBtn.addEventListener('click', () => {
        if (!output.value) {
            showTooltip('Nothing to copy', 'warning');
            return;
        }
        output.select();
        document.execCommand('copy');
        showTooltip('Copied to clipboard!', 'success');
    });

    // Clear buttons click handlers
    clearInputBtn.addEventListener('click', () => {
        input.value = '';
        input.focus();
    });

    clearOutputBtn.addEventListener('click', () => {
        output.value = '';
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
}); 