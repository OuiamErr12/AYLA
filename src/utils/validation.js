// Email validation
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Password validation
export const validatePassword = (password) => {
    // At least 6 characters
    if (password.length < 6) {
        return {
            isValid: false,
            message: 'Password must be at least 6 characters long',
        };
    }

    return {
        isValid: true,
        message: '',
    };
};

// Form validation
export const validateLoginForm = (email, password) => {
    const errors = {};

    if (!email) {
        errors.email = 'Email is required';
    } else if (!validateEmail(email)) {
        errors.email = 'Please enter a valid email';
    }

    if (!password) {
        errors.password = 'Password is required';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

export const validateRegisterForm = (email, password, confirmPassword, name) => {
    const errors = {};

    if (!name) {
        errors.name = 'Name is required';
    }

    if (!email) {
        errors.email = 'Email is required';
    } else if (!validateEmail(email)) {
        errors.email = 'Please enter a valid email';
    }

    if (!password) {
        errors.password = 'Password is required';
    } else {
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            errors.password = passwordValidation.message;
        }
    }

    if (!confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

export default {
    validateEmail,
    validatePassword,
    validateLoginForm,
    validateRegisterForm,
};
