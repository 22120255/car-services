export function isStrongPassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

export function isEmailValid(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}
export function isUsernameValid(username) {
    const usernamePattern = /^[a-zA-ZÀ-ỹ ]{2,}$/;
    return usernamePattern.test(username);
}
export function isPhoneNumberValid(phoneNumber) {
    const phoneNumberPattern = /^(84|\+84|0)[0-9]{9}$/;
    return phoneNumberPattern.test(phoneNumber);
}
export const isValidDate = (dateString) => {
    const timestamp = Date.parse(dateString);
    return !isNaN(timestamp);
};

export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US');
}

export const formatNumber = (number, amount = 2) => {
    if (number >= 1e9)
        return (number / 1e6).toFixed(amount) + "M";
    if (number >= 1e6) {
        return (number / 1e6).toFixed(amount) + "M";
    } else if (number >= 1e3) {
        return (number / 1e3).toFixed(amount) + "K";
    } else {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: amount,
            maximumFractionDigits: amount
        }).format(number);
    }
};