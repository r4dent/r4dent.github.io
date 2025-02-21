document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password');
    const generateBtn = document.getElementById('generateBtn');
    const lengthSlider = document.getElementById('length');
    const lengthValue = document.getElementById('lengthValue');
    const uppercaseCheck = document.getElementById('uppercase');
    const lowercaseCheck = document.getElementById('lowercase');
    const numbersCheck = document.getElementById('numbers');
    const symbolsCheck = document.getElementById('symbols');
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');

    // Character sets
    const charset = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*'
    };

    // Update length display
    lengthSlider.addEventListener('input', () => {
        lengthValue.textContent = `${lengthSlider.value} characters`;
    });

    // Generate password on button click
    generateBtn.addEventListener('click', generatePassword);

    // Copy password on click
    passwordInput.addEventListener('click', () => {
        if (passwordInput.value) {
            passwordInput.select();
            document.execCommand('copy');
            showTooltip();
        }
    });

    function generatePassword() {
        let chars = '';
        let password = '';

        // Build character set based on options
        if (uppercaseCheck.checked) chars += charset.uppercase;
        if (lowercaseCheck.checked) chars += charset.lowercase;
        if (numbersCheck.checked) chars += charset.numbers;
        if (symbolsCheck.checked) chars += charset.symbols;

        // Validate at least one option is selected
        if (!chars) {
            alert('Please select at least one character type');
            return;
        }

        // Generate random password
        const length = parseInt(lengthSlider.value);
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        // Ensure at least one character from each selected type
        if (uppercaseCheck.checked && !/[A-Z]/.test(password)) {
            const pos = Math.floor(Math.random() * length);
            password = password.substring(0, pos) + 
                      charset.uppercase.charAt(Math.floor(Math.random() * charset.uppercase.length)) +
                      password.substring(pos + 1);
        }
        if (lowercaseCheck.checked && !/[a-z]/.test(password)) {
            const pos = Math.floor(Math.random() * length);
            password = password.substring(0, pos) + 
                      charset.lowercase.charAt(Math.floor(Math.random() * charset.lowercase.length)) +
                      password.substring(pos + 1);
        }
        if (numbersCheck.checked && !/[0-9]/.test(password)) {
            const pos = Math.floor(Math.random() * length);
            password = password.substring(0, pos) + 
                      charset.numbers.charAt(Math.floor(Math.random() * charset.numbers.length)) +
                      password.substring(pos + 1);
        }
        if (symbolsCheck.checked && !/[!@#$%^&*]/.test(password)) {
            const pos = Math.floor(Math.random() * length);
            password = password.substring(0, pos) + 
                      charset.symbols.charAt(Math.floor(Math.random() * charset.symbols.length)) +
                      password.substring(pos + 1);
        }

        passwordInput.value = password;
        updateStrength(password);
    }

    function updateStrength(password) {
        let strength = 0;
        const checks = {
            length: password.length >= 12,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            numbers: /[0-9]/.test(password),
            symbols: /[!@#$%^&*]/.test(password)
        };

        // Calculate strength score
        strength += checks.length ? 25 : 0;
        strength += checks.uppercase ? 20 : 0;
        strength += checks.lowercase ? 20 : 0;
        strength += checks.numbers ? 20 : 0;
        strength += checks.symbols ? 15 : 0;

        // Update strength indicator
        strengthBar.style.width = `${strength}%`;
        strengthBar.className = 'progress-bar';
        
        if (strength < 40) {
            strengthBar.classList.add('bg-danger');
            strengthText.textContent = 'Weak';
        } else if (strength < 70) {
            strengthBar.classList.add('bg-warning');
            strengthText.textContent = 'Moderate';
        } else {
            strengthBar.classList.add('bg-success');
            strengthText.textContent = 'Strong';
        }
    }

    function showTooltip() {
        const tooltip = document.createElement('div');
        tooltip.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3 text-white';
        tooltip.style.zIndex = '1050';
        tooltip.style.backgroundColor = '#198754';  // Bootstrap success color
        tooltip.textContent = 'Password copied to clipboard!';
        document.body.appendChild(tooltip);

        setTimeout(() => {
            tooltip.remove();
        }, 2000);
    }

    // Generate initial password
    generatePassword();
}); 