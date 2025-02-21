document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('input');
    const output = document.getElementById('output');
    const hashType = document.getElementById('hashType');
    const generateBtn = document.getElementById('generateBtn');
    const copyBtn = document.getElementById('copyBtn');

    // Generate hash on button click
    generateBtn.addEventListener('click', generateHash);

    // Generate hash on input change (real-time)
    input.addEventListener('input', generateHash);

    // Copy output on button click
    copyBtn.addEventListener('click', () => {
        if (!output.value) {
            showTooltip('Nothing to copy', 'warning');
            return;
        }
        output.select();
        document.execCommand('copy');
        showTooltip('Hash copied to clipboard!', 'success');
    });

    async function generateHash() {
        const text = input.value.trim();
        if (!text) {
            output.value = '';
            return;
        }

        try {
            const hashBuffer = await crypto.subtle.digest(
                getAlgorithm(hashType.value),
                new TextEncoder().encode(text)
            );

            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            output.value = hashHex;
        } catch (error) {
            showTooltip('Error generating hash', 'danger');
            output.value = '';
        }
    }

    function getAlgorithm(type) {
        switch (type) {
            case 'MD5':
                return 'MD5';
            case 'SHA-1':
                return 'SHA-1';
            case 'SHA-256':
                return 'SHA-256';
            case 'SHA-384':
                return 'SHA-384';
            case 'SHA-512':
                return 'SHA-512';
            default:
                return 'SHA-256';
        }
    }

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