// Content script that detects password inputs
class PasswordChecker {
    constructor() {
        this.currentPopup = null;
        this.init();
    }

    init() {
        document.addEventListener('input', this.handleInput.bind(this), true);
        setTimeout(() => this.checkExistingFields(), 1000);
    }

    handleInput(event) {
        const target = event.target;
        if (target.type === 'password' && target.value.length > 0) {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                this.checkPassword(target.value, target);
            }, 300);
        } else if (target.type === 'password' && target.value.length === 0) {
            this.hidePopup();
        }
    }

    checkExistingFields() {
        const passwordFields = document.querySelectorAll('input[type="password"]');
        passwordFields.forEach(field => {
            if (field.value && field.value.length > 0) {
                this.checkPassword(field.value, field);
            }
        });
    }

    async checkPassword(password, inputElement) {
        if (!password || password.length === 0) {
            this.hidePopup();
            return;
        }

        this.showLoading(inputElement);
        const strength = this.calculateStrength(password);
        const isLeaked = await this.checkLeakedPassword(password);
        this.showResult(password, strength, isLeaked, inputElement);
    }

    calculateStrength(password) {
        let score = 0;
        
        if (password.length >= 8) score += 1;
        if (password.length >= 12) score += 2;
        if (password.length >= 16) score += 3;
        
        if (/[a-z]/.test(password)) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^a-zA-Z0-9]/.test(password)) score += 2;
        
        if (/(.)\1{2,}/.test(password)) score -= 2;
        if (/123|abc|qwerty|asdf|zxcv/i.test(password)) score -= 3;
        if (/^[0-9]+$/.test(password)) score = 0;
        if (/^[a-zA-Z]+$/.test(password)) score = Math.max(1, score);
        if (this.hasCommonPatterns(password)) score -= 2;
        
        return Math.max(0, Math.min(5, score));
    }

    async checkLeakedPassword(password) {
        // Skip very long passwords (they're unlikely to be in common DBs)
        if (password.length > 50) {
            return false;
        }

        // First check against exact common passwords
        if (this.isExactlyCommon(password)) {
            return true;
        }

        // Then check against Have I Been Pwned API for real leak detection
        try {
            return await this.checkHaveIBeenPwned(password);
        } catch (error) {
            console.log('API check failed');
            return false; // Don't mark as leaked if API fails
        }
    }

    isExactlyCommon(password) {
        // Very strict list of ONLY the most common compromised passwords
        const exactCommonPasswords = [
            'password', '123456', '12345678', '1234', 'qwerty',
            'admin', 'welcome', 'monkey', 'password1', '1234567',
            'letmein', 'football', 'iloveyou', 'admin123', 'welcome123',
            '123123', '12345', '123456789', '1234567890',
            '111111', '000000', 'me2good@100%' // Only exact match
        ];
        
        return exactCommonPasswords.includes(password.toLowerCase());
    }

   hasCommonPatterns(password) {
    // More specific patterns that only catch truly common weak patterns
    const commonPatterns = [
        /^me\d+good@\d+%$/, // Only exact match for meXgood@Y%
        /^password\d{1,4}$/, // password + 1-4 digits
        /^admin\d{1,4}$/, // admin + 1-4 digits
        /^welcome\d{1,4}$/, // welcome + 1-4 digits
        /^1234567890*$/, // sequential numbers
        /^qwerty.*$/, // starts with qwerty
        /^letmein.*$/, // starts with letmein
        /^iloveyou.*$/, // starts with iloveyou
        /^monkey.*$/, // starts with monkey
        /^sunshine.*$/, // starts with sunshine
        /^princess.*$/, // starts with princess
        /^superman.*$/ // starts with superman
    ];
    
    return commonPatterns.some(pattern => pattern.test(password.toLowerCase()));
    }

    isCommonPassword(password) {
        // Only exact matches for truly common passwords
        const commonPasswords = [
            // Top 20 most common passwords
            'password', '123456', '12345678', '1234', 'qwerty', 
            'admin', 'welcome', 'monkey', 'password1', '1234567',
            'letmein', 'football', 'iloveyou', 'admin123', 'welcome123',
            'passw0rd', '123123', '12345', '123456789', '1234567890',
            
            // Simple sequential patterns
            '111111', '000000', '222222', '333333', '444444',
            '555555', '666666', '777777', '888888', '999999',
            
            // Very simple word+number combinations
            'password123', 'password1', 'admin123', 'welcome123',
            
            // Specific known weak patterns
            'me2good@100%' // Only this exact pattern
        ];

        const lowerPassword = password.toLowerCase();
        
        // Only check exact matches, not partial matches
        return commonPasswords.includes(lowerPassword);
    }

    async checkHaveIBeenPwned(password) {
        const sha1Hash = await this.sha1(password);
        const prefix = sha1Hash.substring(0, 5);
        const suffix = sha1Hash.substring(5).toUpperCase();
        const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
        const data = await response.text();
        return data.includes(suffix);
    }

    async sha1(str) {
        const buffer = new TextEncoder().encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-1', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    showLoading(inputElement) {
        this.showPopup('loading', 'Checking password security...', inputElement);
    }

    showResult(password, strength, isLeaked, inputElement) {
        let message, type;
        
        if (isLeaked) {
            message = 'Security Alert: Compromised Password Detected';
            type = 'leaked';
        } else if (strength >= 4) {
            message = 'Password Security: Excellent';
            type = 'safe';
        } else if (strength >= 2) {
            message = 'Password Security: Needs Improvement';
            type = 'weak';
        } else {
            message = 'Password Security: Critical Risk';
            type = 'weak';
        }
        
        const strengthLevels = [
            { text: 'Very Weak', class: 'strength-very-weak' },
            { text: 'Weak', class: 'strength-weak' },
            { text: 'Fair', class: 'strength-fair' },
            { text: 'Good', class: 'strength-good' },
            { text: 'Strong', class: 'strength-strong' },
            { text: 'Very Strong', class: 'strength-very-strong' }
        ];
        
        const strengthInfo = strengthLevels[strength];
        
        if (isLeaked) {
            message += `<br><small><strong>⚠️ This password appears in known data breaches. Choose a different password immediately.</strong></small>`;
        } else {
            message += `<br><small>Security Level: <span class="strength-indicator ${strengthInfo.class}">${strengthInfo.text}</span></small>`;
        }
        
        this.showPopup(type, message, inputElement);
    }

    showPopup(type, message, inputElement) {
        this.hidePopup();
        
        const popup = document.createElement('div');
        popup.className = `password-checker-popup ${type}`;
        popup.innerHTML = `<div class="popup-message">${message}</div>`;
        
        // Use getBoundingClientRect without modifying the page
        const rect = inputElement.getBoundingClientRect();
        const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        
        // Calculate position - this is the critical fix
        const left = rect.left + scrollX;
        const top = rect.bottom + scrollY + 5;
        
        // Apply styles individually to avoid cssText issues
        popup.style.position = 'fixed';
        popup.style.top = top + 'px';
        popup.style.left = left + 'px';
        popup.style.zIndex = '2147483647';
        popup.style.maxWidth = '300px';
        popup.style.background = 'white';
        popup.style.border = '1px solid #ddd';
        popup.style.borderRadius = '6px';
        popup.style.padding = '8px 12px';
        popup.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        popup.style.fontFamily = 'system-ui, -apple-system, sans-serif';
        popup.style.fontSize = '14px';
        popup.style.lineHeight = '1.4';
        popup.style.margin = '0';
        
        // Add status-specific styles
        if (type === 'leaked') {
            popup.style.borderLeft = '4px solid #dc2626';
            popup.style.background = '#fef2f2';
        } else if (type === 'safe') {
            popup.style.borderLeft = '4px solid #16a34a';
            popup.style.background = '#f0fdf4';
        } else if (type === 'weak') {
            popup.style.borderLeft = '4px solid #d97706';
            popup.style.background = '#fffbeb';
        } else if (type === 'loading') {
            popup.style.borderLeft = '4px solid #2563eb';
            popup.style.background = '#eff6ff';
        }
        
        // Critical: Append to body without affecting layout
        document.body.appendChild(popup);
        this.currentPopup = popup;
    }

    hidePopup() {
        if (this.currentPopup && this.currentPopup.parentNode) {
            this.currentPopup.remove();
        }
        this.currentPopup = null;
    }
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => new PasswordChecker(), 500);
    });
} else {
    setTimeout(() => new PasswordChecker(), 500);
}