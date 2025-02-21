document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    const analysisDiv = document.getElementById('analysis');

    // Requirements elements
    const lengthCheck = document.getElementById('lengthCheck');
    const uppercaseCheck = document.getElementById('uppercaseCheck');
    const lowercaseCheck = document.getElementById('lowercaseCheck');
    const numberCheck = document.getElementById('numberCheck');
    const symbolCheck = document.getElementById('symbolCheck');

    // Common password patterns
    const commonPatterns = [
        /^123/, /password/i, /qwerty/i, /abc/, /admin/i,
        /letmein/i, /welcome/i, /monkey/i, /dragon/i
    ];

    // Toggle password visibility
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        togglePassword.innerHTML = type === 'password' ? 
            '<i class="bi bi-eye"></i>' : 
            '<i class="bi bi-eye-slash"></i>';
    });

    // Check password strength on input
    passwordInput.addEventListener('input', checkStrength);

    function checkStrength() {
        const password = passwordInput.value;
        let strength = 0;
        let feedback = [];

        // Check length
        const hasLength = password.length >= 12;
        updateRequirement(lengthCheck, hasLength);
        strength += hasLength ? 25 : 0;

        // Check uppercase
        const hasUppercase = /[A-Z]/.test(password);
        updateRequirement(uppercaseCheck, hasUppercase);
        strength += hasUppercase ? 20 : 0;

        // Check lowercase
        const hasLowercase = /[a-z]/.test(password);
        updateRequirement(lowercaseCheck, hasLowercase);
        strength += hasLowercase ? 20 : 0;

        // Check numbers
        const hasNumber = /[0-9]/.test(password);
        updateRequirement(numberCheck, hasNumber);
        strength += hasNumber ? 20 : 0;

        // Check symbols
        const hasSymbol = /[!@#$%^&*]/.test(password);
        updateRequirement(symbolCheck, hasSymbol);
        strength += hasSymbol ? 15 : 0;

        // Additional checks
        if (password) {
            // Check for repeating characters
            if (/(.)\1{2,}/.test(password)) {
                strength -= 10;
                feedback.push("Avoid repeating characters");
            }

            // Check for sequential characters
            if (/abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i.test(password)) {
                strength -= 10;
                feedback.push("Avoid sequential letters");
            }

            // Check for sequential numbers
            if (/012|123|234|345|456|567|678|789/.test(password)) {
                strength -= 10;
                feedback.push("Avoid sequential numbers");
            }

            // Check for common patterns
            if (commonPatterns.some(pattern => pattern.test(password))) {
                strength -= 20;
                feedback.push("Avoid common password patterns");
            }

            // Check for keyboard patterns
            if (/qwert|asdf|zxcv/i.test(password)) {
                strength -= 10;
                feedback.push("Avoid keyboard patterns");
            }
        }

        // Update strength indicator
        strength = Math.max(0, Math.min(100, strength));
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

        // Display analysis
        if (password) {
            if (feedback.length === 0) {
                feedback.push("Good password! Meets all requirements.");
            }
            analysisDiv.innerHTML = feedback.map(f => `<p>• ${f}</p>`).join('');
        } else {
            analysisDiv.innerHTML = '<p>Enter a password to see analysis</p>';
        }
    }

    function updateRequirement(element, passed) {
        const icon = passed ? 
            '<i class="bi bi-check-circle-fill text-success"></i>' : 
            '<i class="bi bi-x-circle-fill text-danger"></i>';
        element.querySelector('.bi').outerHTML = icon;
    }

    // Initial check
    checkStrength();
}); 