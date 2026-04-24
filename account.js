// Account Management System
// Uses localStorage to store user accounts (client-side)

// Initialize accounts from localStorage
function initializeAccounts() {
    if (!localStorage.getItem('accounts')) {
        localStorage.setItem('accounts', JSON.stringify([]));
    }
}

// Get all accounts from localStorage
function getAccounts() {
    initializeAccounts();
    return JSON.parse(localStorage.getItem('accounts')) || [];
}

// Save accounts to localStorage
function saveAccounts(accounts) {
    localStorage.setItem('accounts', JSON.stringify(accounts));
}

// Get currently logged-in user
function getCurrentUser() {
    return localStorage.getItem('currentUser');
}

// Set current user after login
function setCurrentUser(username) {
    localStorage.setItem('currentUser', username);
}

// Logout user
function logoutUser() {
    localStorage.removeItem('currentUser');
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate password strength (at least 6 characters, 1 uppercase, 1 number)
function isValidPassword(password) {
    return password.length >= 6 && 
           /[A-Z]/.test(password) && 
           /\d/.test(password);
}

// Validate username (alphanumeric, 3-20 characters, no spaces)
function isValidUsername(username) {
    return username.length >= 3 && 
           username.length <= 20 && 
           /^[a-zA-Z0-9_]+$/.test(username);
}

// Check if username already exists
function usernameExists(username) {
    const accounts = getAccounts();
    return accounts.some(acc => acc.username.toLowerCase() === username.toLowerCase());
}

// Check if email already exists
function emailExists(email) {
    const accounts = getAccounts();
    return accounts.some(acc => acc.email.toLowerCase() === email.toLowerCase());
}

// Create new account
function createAccount(email, username, password, passwordConfirm) {
    // Validate inputs
    if (!email || !username || !password || !passwordConfirm) {
        return { success: false, message: 'All fields are required.' };
    }

    // Validate email
    if (!isValidEmail(email)) {
        return { success: false, message: 'Please enter a valid email address.' };
    }

    // Check if email already exists
    if (emailExists(email)) {
        return { success: false, message: 'This email is already registered.' };
    }

    // Validate username
    if (!isValidUsername(username)) {
        return { success: false, message: 'Username must be 3-20 characters (alphanumeric and underscore only).' };
    }

    // Check if username already exists
    if (usernameExists(username)) {
        return { success: false, message: 'This username is already taken.' };
    }

    // Validate password strength
    if (!isValidPassword(password)) {
        return { success: false, message: 'Password must be at least 6 characters with 1 uppercase letter and 1 number.' };
    }

    // Check password match
    if (password !== passwordConfirm) {
        return { success: false, message: 'Passwords do not match.' };
    }

    // Create new account
    const accounts = getAccounts();
    const newAccount = {
        id: Date.now(),
        email: email,
        username: username,
        password: password, // In production, this should be hashed!
        createdAt: new Date().toISOString()
    };

    accounts.push(newAccount);
    saveAccounts(accounts);

    return { success: true, message: 'Account created successfully! You can now sign in.' };
}

// Sign in user
function signIn(username, password) {
    if (!username || !password) {
        return { success: false, message: 'Username and password are required.' };
    }

    const accounts = getAccounts();
    const account = accounts.find(acc => 
        acc.username.toLowerCase() === username.toLowerCase()
    );

    if (!account) {
        return { success: false, message: 'Username not found.' };
    }

    if (account.password !== password) {
        return { success: false, message: 'Incorrect password.' };
    }

    setCurrentUser(account.username);
    return { success: true, message: 'Signed in successfully!' };
}

// Handle account creation form submission
function handleCreateAccount(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const username = document.getElementById('uname').value.trim();
    const password = document.getElementById('psw').value;
    const passwordConfirm = document.getElementById('psw-confirm').value;
    const agreeCheckbox = document.getElementById('agree').checked;

    const errorDiv = document.getElementById('errorMessage');

    // Check if user agrees to terms
    if (!agreeCheckbox) {
        if (errorDiv) {
            errorDiv.textContent = 'You must agree to the Terms and Conditions.';
            errorDiv.style.display = 'block';
        }
        return;
    }

    // Attempt to create account
    const result = createAccount(email, username, password, passwordConfirm);

    if (errorDiv) {
        errorDiv.textContent = result.message;
        errorDiv.style.display = result.success ? 'none' : 'block';
        errorDiv.className = result.success ? 'success-message' : 'error-message';
    }

    if (result.success) {
        // Clear form and redirect after 2 seconds
        document.getElementById('createAccountForm').reset();
        setTimeout(() => {
            window.location.href = 'signIn.html';
        }, 2000);
    }
}

// Handle sign-in form submission
function handleSignIn(event) {
    event.preventDefault();

    const username = document.getElementById('uname').value.trim();
    const password = document.getElementById('psw').value;
    const rememberMe = document.getElementById('remember').checked;

    const errorDiv = document.getElementById('errorMessage');

    // Attempt to sign in
    const result = signIn(username, password);

    if (errorDiv) {
        errorDiv.textContent = result.message;
        errorDiv.style.display = result.success ? 'none' : 'block';
        errorDiv.className = result.success ? 'success-message' : 'error-message';
    }

    if (result.success) {
        if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
        }
        // Redirect to dashboard or home after 1 second
        setTimeout(() => {
            window.location.href = 'index.html?loggedIn=true';
        }, 1000);
    }
}

// Check if user is already logged in (for redirect if needed)
function checkUserLoggedIn() {
    return getCurrentUser() !== null;
}

// Get user profile information
function getUserProfile(username) {
    const accounts = getAccounts();
    return accounts.find(acc => acc.username.toLowerCase() === username.toLowerCase());
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', function() {
    initializeAccounts();
    
    // Auto-login if rememberMe is set
    if (localStorage.getItem('rememberMe') === 'true' && !getCurrentUser()) {
        // Could implement auto-login here if desired
    }
});