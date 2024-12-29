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