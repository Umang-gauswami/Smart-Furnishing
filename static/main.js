// const { console } = require("inspector");

document.addEventListener('DOMContentLoaded', function () {
    console.log("JS running");

    // User state
    let currentUser = null;
    console.log("DOM loaded");

    checkLoggedInUser();

    // Mock database of users (in a real app, this would be server-side)
    const usersDatabase = [
        { email: "user@example.com", password: "Password123!", name: "Demo User" }
    ];

    // DOM Elements
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');
    const authButtons = document.getElementById('authButtons');
    const userProfile = document.getElementById('userProfile');
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const logoutBtn = document.getElementById('logoutBtn');

    // Mobile Menu Toggle
    mobileMenuBtn.addEventListener('click', function () {
        navLinks.classList.toggle('active');
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                navLinks.classList.remove('active');
            }
        });
    });

    // Navbar Scroll Effect
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Login/Signup Modal
    const authModal = document.createElement('div');
    authModal.className = 'modal-overlay';
    authModal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="auth-tabs">
                <button class="auth-tab active" data-tab="login">Login</button>
                <button class="auth-tab" data-tab="signup">Sign Up</button>
            </div>
            
            <div class="form-message" id="formMessage"></div>
            
            <form class="auth-form active" id="loginForm">
                <div class="form-group">
                    <input type="email" id="loginEmail" placeholder="Email Address" required>
                </div>
                <div class="form-group">
                    <input type="password" id="loginPassword" placeholder="Password" required>
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%;">Login</button>
                <p class="auth-switch-text">
                    Don't have an account? <a class="auth-switch-link" data-switch="signup">Sign up</a>
                </p>
                
                <div class="divider">or</div>
                
                <div class="social-auth">
                    <p>Login with social account</p>
                    <div class="social-buttons">
                        <a href="#" class="social-btn google">
                            <i class="fab fa-google"></i>
                        </a>
                        <a href="#" class="social-btn facebook">
                            <i class="fab fa-facebook-f"></i>
                        </a>
                    </div>
                </div>
            </form>
            
            <form class="auth-form" id="signupForm">
                <div class="form-group">
                    <input type="text" id="signupName" placeholder="Full Name" required>
                </div>
                <div class="form-group">
                    <input type="email" id="signupEmail" placeholder="Email Address" required>
                </div>
                <div class="form-group">
                    <input type="password" id="signupPassword" placeholder="Password" required>
                    <div class="password-strength" id="passwordStrength"></div>
                </div>
                <div class="form-group">
                    <input type="password" id="signupConfirmPassword" placeholder="Confirm Password" required>
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%;">Create Account</button>
                <p class="auth-switch-text">
                    Already have an account? <a class="auth-switch-link" data-switch="login">Login</a>
                </p>
                
                <div class="divider">or</div>
                
                <div class="social-auth">
                    <p>Sign up with social account</p>
                    <div class="social-buttons">
                        <a href="#" class="social-btn google">
                            <i class="fab fa-google"></i>
                        </a>
                        <a href="#" class="social-btn facebook">
                            <i class="fab fa-facebook-f"></i>
                        </a>
                    </div>
                </div>
            </form>
        </div>
    `;

    // Check if email exists in database
    function checkEmailExists(email) {
        return usersDatabase.some(user => user.email === email);
    }

    // Check password strength
    function checkPasswordStrength(password) {
        const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
        const mediumRegex = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;

        if (strongRegex.test(password)) return 'strong';
        if (mediumRegex.test(password)) return 'medium';
        return 'weak';
    }

    // Show form message
    function showFormMessage(type, message) {
        const formMessage = authModal.querySelector('#formMessage');
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';

        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }

    // Auto-switch between login/signup based on email
    authModal.querySelector('#loginEmail').addEventListener('blur', function () {
        const email = this.value.trim();
        if (!email) return;

        const emailExists = checkEmailExists(email);
        const loginTab = authModal.querySelector('.auth-tab[data-tab="login"]');
        const signupTab = authModal.querySelector('.auth-tab[data-tab="signup"]');

        if (emailExists) {
            // Show login form
            loginTab.click();
            showFormMessage('success', 'Email found! Please enter your password.');
        } else {
            // Show signup form
            signupTab.click();
            // Pre-fill the email in signup form
            authModal.querySelector('#signupEmail').value = email;
            showFormMessage('info', 'New email detected. Please create an account.');
        }
    });

    // Password strength indicator
    authModal.querySelector('#signupPassword').addEventListener('input', function () {
        const password = this.value;
        const strength = checkPasswordStrength(password);
        const strengthElement = authModal.querySelector('#passwordStrength');

        if (!password) {
            strengthElement.textContent = '';
            return;
        }

        strengthElement.textContent = `Password strength: ${strength}`;
        strengthElement.className = `password-strength ${strength}`;
    });

    // Switch between login/signup forms
    authModal.querySelectorAll('.auth-switch-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetForm = this.dataset.switch;
            authModal.querySelector(`.auth-tab[data-tab="${targetForm}"]`).click();
        });
    });

    // Auth tab switching
    authModal.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', function () {
            const tabId = this.dataset.tab;

            authModal.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            authModal.querySelectorAll('.auth-form').forEach(form => {
                if (form.id === `${tabId}Form`) {
                    form.classList.add('active');
                } else {
                    form.classList.remove('active');
                }
            });

            // Clear any existing messages
            authModal.querySelector('#formMessage').style.display = 'none';
        });
    });

    // Close modal
    authModal.querySelector('.close-modal').addEventListener('click', () => {
        authModal.style.display = 'none';
    });


    // authModal.querySelector('#loginForm').addEventListener('submit', async function (e) {
    //     e.preventDefault();
    //     console.log("Login form submitted");
    //     const email = document.getElementById('loginEmail').value.trim();
    //     const password = document.getElementById('loginPassword').value;

    //     if (!email || !password) {
    //         showFormMessage('error', 'Please fill in all fields');
    //         return;
    //     }

    //     try {
    //         const res = await fetch('http://localhost:5000/api/auth/login', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ email, password })
    //         });

    //         const data = await res.json();

    //         if (res.ok) {
    //             showFormMessage('success', 'Login successful!');
    //             currentUser = { name: data.user.fullName, email: data.user.email };
    //             updateUserState();
    //             authModal.style.display = 'none';
    //         } else {
    //             showFormMessage('error', data.msg || 'Login failed');
    //         }
    //     } catch (err) {
    //         showFormMessage('error', 'Server error. Try again later.');
    //         console.error(err);
    //     }
    // });

    // authModal.querySelector('#loginForm').addEventListener('submit', async function (e) {
    //     e.preventDefault();
    //     console.log("Login form submitted");

    //     const email = document.getElementById('loginEmail').value.trim();
    //     const password = document.getElementById('loginPassword').value;

    //     if (!email || !password) {
    //         showFormMessage('error', 'Please fill in all fields');
    //         return;
    //     }

    //     try {
    //         const res = await fetch('http://localhost:5000/api/auth/login', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ email, password })
    //         });

    //         const data = await res.json();

    //         if (res.ok) {
    //             // ✅ Store the JWT token for authentication
    //             localStorage.setItem('authToken', data.token);

    //             const userRes = await fetch('http://localhost:5000/api/auth/user', {
    //                 headers: {
    //                     'x-auth-token': localStorage.getItem('authToken')
    //                 }
    //             });

    //             showFormMessage('success', 'Login successful!');
    //             currentUser = { name: data.user.fullName, email: data.user.email };
    //             updateUserState();
    //             authModal.style.display = 'none';
    //         } else {
    //             showFormMessage('error', data.msg || 'Login failed');
    //         }
    //     } catch (err) {
    //         showFormMessage('error', 'Server error. Try again later.');
    //         console.error(err);
    //     }
    // });

    authModal.querySelector('#loginForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        console.log("Login form submitted");

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        if (!email || !password) {
            showFormMessage('error', 'Please fill in all fields');
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                console.log("✅ Login response OK. Token is:", data.token);

                // ✅ Store the JWT token for authentication
                localStorage.setItem('authToken', data.token);

                // 🔁 Fetch full user data using token
                const userRes = await fetch('http://localhost:5000/api/auth/user', {
                    headers: {
                        'x-auth-token': localStorage.getItem('authToken')
                    }
                });

                const userData = await userRes.json();

                if (userRes.ok) {
                    currentUser = { name: userData.fullName, email: userData.email };
                    updateUserState();
                    showFormMessage('success', 'Login successful!');
                    authModal.style.display = 'none';
                } else {
                    showFormMessage('error', userData.msg || 'Failed to fetch user details');
                }
            } else {
                showFormMessage('error', data.msg || 'Login failed');
            }
        } catch (err) {
            showFormMessage('error', 'Server error. Try again later.');
            console.error(err);
        }
    });


    // Signup form submission
    // authModal.querySelector('#signupForm').addEventListener('submit', function(e) {
    //     e.preventDefault();
    //     const name = document.getElementById('signupName').value.trim();
    //     const email = document.getElementById('signupEmail').value.trim();
    //     const password = document.getElementById('signupPassword').value;
    //     const confirmPassword = document.getElementById('signupConfirmPassword').value;

    //     // Simple validation
    //     if (!name || !email || !password || !confirmPassword) {
    //         showFormMessage('error', 'Please fill in all fields');
    //         return;
    //     }

    //     if (password !== confirmPassword) {
    //         showFormMessage('error', 'Passwords do not match');
    //         return;
    //     }

    //     if (checkEmailExists(email)) {
    //         showFormMessage('error', 'Email already registered. Please login instead.');
    //         authModal.querySelector('.auth-tab[data-tab="login"]').click();
    //         return;
    //     }

    //     const passwordStrength = checkPasswordStrength(password);
    //     if (passwordStrength === 'weak') {
    //         showFormMessage('error', 'Please choose a stronger password (min 8 chars with uppercase, number & symbol)');
    //         return;
    //     }

    //     // Add new user (in real app, this would be a server call)
    //     usersDatabase.push({
    //         name: name,
    //         email: email,
    //         password: password
    //     });

    //     currentUser = {
    //         name: name,
    //         email: email
    //     };

    //     updateUserState();
    //     authModal.style.display = 'none';
    //     showFormMessage('success', 'Account created successfully! You are now logged in.');
    // });

    authModal.querySelector('#signupForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        console.log("Signup form submitted");
        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;

        if (!name || !email || !password || !confirmPassword) {
            showFormMessage('error', 'Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            showFormMessage('error', 'Passwords do not match');
            return;
        }

        const passwordStrength = checkPasswordStrength(password);
        if (passwordStrength === 'weak') {
            showFormMessage('error', 'Password is too weak');
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: name,
                    email,
                    password,
                    confirmPassword
                })
            });

            const data = await res.json();

            if (res.ok) {
                showFormMessage('success', 'Account created successfully!');
                currentUser = { name, email };
                updateUserState();
                authModal.style.display = 'none';
            } else {
                showFormMessage('error', data.msg || 'Signup failed');
            }
        } catch (err) {
            showFormMessage('error', 'Server error. Try again later.');
            console.error(err);
        }
    });


    // Close when clicking outside
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
            authModal.style.display = 'none';
        }
    });

    document.body.appendChild(authModal);

    // Show auth modal
    document.querySelectorAll('[data-auth]').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const action = this.dataset.auth;

            // Reset forms when opening modal
            authModal.querySelector('#loginForm').reset();
            authModal.querySelector('#signupForm').reset();
            authModal.querySelector('#formMessage').style.display = 'none';
            authModal.querySelector('#passwordStrength').textContent = '';

            if (action === 'login') {
                authModal.querySelector('.auth-tab[data-tab="login"]').click();
            } else {
                authModal.querySelector('.auth-tab[data-tab="signup"]').click();
            }

            authModal.style.display = 'flex';
            authModal.querySelector('#loginEmail').focus();
        });
    });

    // Logout functionality
    logoutBtn.addEventListener('click', function (e) {
        e.preventDefault();
        currentUser = null;
        updateUserState();
        showFormMessage('success', 'Logged out successfully');
    });

    // // Update user state in UI
    // function updateUserState() {
    //     if (currentUser) {
    //         authButtons.style.display = 'none';
    //         userProfile.style.display = 'block';
    //         userAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
    //         userName.textContent = currentUser.name;
    //     } else {
    //         authButtons.style.display = 'block';
    //         userProfile.style.display = 'none';
    //     }
    // }

    function updateUserState() {
        const userDisplay = document.getElementById('userDisplay');
        const authControls = document.getElementById('authControls');
        const guestControls = document.getElementById('guestControls');

        if (currentUser) {
            userDisplay.textContent = currentUser.name;
            authControls.style.display = 'block';
            guestControls.style.display = 'none';
        } else {
            userDisplay.textContent = '';
            authControls.style.display = 'none';
            guestControls.style.display = 'block';
        }
    }


    // Add auth buttons to mobile menu
    const mobileAuth = document.createElement('div');
    mobileAuth.className = 'mobile-auth';
    mobileAuth.innerHTML = `
        <a href="#" class="btn btn-primary" data-auth="login">Login</a>
        <a href="#" class="btn btn-outline" data-auth="signup">Sign Up</a>
    `;
    navLinks.appendChild(mobileAuth);

    // Initialize user state
    updateUserState();
});

async function checkLoggedInUser() {
    const token = localStorage.getItem('authToken');
    console.log("📦 Found token:", token);

    if (!token) return;

    try {
        const res = await fetch('http://localhost:5000/api/auth/user', {
            headers: {
                'x-auth-token': token
            }
        });

        const data = await res.json();

        if (res.ok) {
            currentUser = { name: data.fullName, email: data.email };
            updateUserState();
        } else {
            localStorage.removeItem('authToken');
        }
    } catch (err) {
        console.error("❌ Failed to auto-login:", err);
        localStorage.removeItem('authToken');
    }
}

function updateUserState() {
    const userDisplay = document.getElementById('userDisplay');
    const authControls = document.getElementById('authControls');
    const guestControls = document.getElementById('guestControls');

    console.log("🔄 Updating UI. currentUser:", currentUser);

    if (currentUser) {
        userDisplay.textContent = currentUser.name[0].toUpperCase() + currentUser.name.slice(1);
        authControls.style.display = 'block';
        guestControls.style.display = 'none';
    } else {
        userDisplay.textContent = '';
        authControls.style.display = 'none';
        guestControls.style.display = 'block';
    }
}

function logoutUser() {
    localStorage.removeItem('authToken');
    currentUser = null;
    updateUserState();
    // showFormMessage('success', 'Logged out successfully!');
    console.log("✅ User logged out successfully");
}

document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    logoutUser();
});

