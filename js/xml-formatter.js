document.addEventListener('DOMContentLoaded', () => {
    const xmlInput = document.getElementById('xmlInput');
    const formatBtn = document.getElementById('formatBtn');
    const minifyBtn = document.getElementById('minifyBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');

    // Format button click handler
    formatBtn.addEventListener('click', () => {
        const input = xmlInput.value.trim();
        if (!input) {
            showTooltip('Please enter XML to format', 'warning');
            return;
        }

        try {
            const formatted = formatXML(input);
            xmlInput.value = formatted;
            showTooltip('XML formatted successfully', 'success');
        } catch (error) {
            showTooltip('Invalid XML: ' + error.message, 'danger');
        }
    });

    // Minify button click handler
    minifyBtn.addEventListener('click', () => {
        const input = xmlInput.value.trim();
        if (!input) {
            showTooltip('Please enter XML to minify', 'warning');
            return;
        }

        try {
            const minified = minifyXML(input);
            xmlInput.value = minified;
            showTooltip('XML minified successfully', 'success');
        } catch (error) {
            showTooltip('Invalid XML: ' + error.message, 'danger');
        }
    });

    // Clear button click handler
    clearBtn.addEventListener('click', () => {
        xmlInput.value = '';
        xmlInput.focus();
    });

    // Copy button click handler
    copyBtn.addEventListener('click', () => {
        if (!xmlInput.value) {
            showTooltip('Nothing to copy', 'warning');
            return;
        }
        xmlInput.select();
        document.execCommand('copy');
        showTooltip('Copied to clipboard!', 'success');
    });

    function formatXML(xml) {
        // Parse XML to validate and create DOM
        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, 'text/xml');
        
        // Check for parsing errors
        const parserError = doc.querySelector('parsererror');
        if (parserError) {
            throw new Error(parserError.textContent);
        }

        // Format the XML with proper indentation
        let formatted = '';
        let indent = 0;
        
        // Convert XML DOM to string with formatting
        const serializer = new XMLSerializer();
        const xmlString = serializer.serializeToString(doc);
        
        // Process each character
        for (let i = 0; i < xmlString.length; i++) {
            const char = xmlString[i];
            
            if (char === '<') {
                // Check if it's a closing tag
                if (xmlString[i + 1] === '/') {
                    indent--;
                }
                
                // Add newline and indentation
                if (formatted.length > 0) {
                    formatted += '\n' + '  '.repeat(Math.max(0, indent));
                }
                
                // Check if it's not a closing tag
                if (xmlString[i + 1] !== '/' && xmlString[i + 1] !== '?') {
                    indent++;
                }
            }
            
            formatted += char;
        }
        
        return formatted;
    }

    function minifyXML(xml) {
        // Parse XML to validate
        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, 'text/xml');
        
        // Check for parsing errors
        const parserError = doc.querySelector('parsererror');
        if (parserError) {
            throw new Error(parserError.textContent);
        }

        // Serialize back to string
        const serializer = new XMLSerializer();
        let minified = serializer.serializeToString(doc);
        
        // Remove unnecessary whitespace while preserving space in text content
        minified = minified.replace(/>\s+</g, '><');
        
        return minified;
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

    // Add tab support
    xmlInput.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = this.selectionStart;
            const end = this.selectionEnd;
            this.value = this.value.substring(0, start) + '  ' + this.value.substring(end);
            this.selectionStart = this.selectionEnd = start + 2;
        }
    });
}); 