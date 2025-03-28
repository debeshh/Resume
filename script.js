const apiUrl = "http://localhost:3000/users";
const homeUrl = "http://localhost:3000/homes";

// Signup Function
document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signup-form");
    if (signupForm) {
        signupForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const name = document.getElementById("signup-name").value;
            const email = document.getElementById("signup-email").value;
            const password = document.getElementById("signup-password").value;

            fetch(apiUrl)
                .then(response => response.json())
                .then(users => {
                    const userExists = users.some(user => user.email === email);
                    if (userExists) {
                        alert("User already exists. Try logging in.");
                    } else {
                        const newId = users.length ? users[users.length - 1].id + 1 : 101;
                        fetch(apiUrl, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ id: newId, name, email, password })
                        }).then(() => {
                            alert("Signup successful! Now Log in");
                            window.location.href = "login.html";
                        });
                    }
                });
        });
    }

    // Login Function
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;

            fetch(apiUrl)
                .then(response => response.json())
                .then(users => {
                    const user = users.find(u => u.email === email && u.password === password);
                    if (user) {
                        localStorage.setItem("loggedInUser", JSON.stringify(user));
                        alert(`Welcome back, ${user.name}! Redirecting to home page...`);
                        window.location.href = "home.html";
                    } else {
                        alert("Invalid email or password.");
                    }
                });
        });
    }

    // Home Page: Display Username
    const usernameSpan = document.getElementById("username");
    if (usernameSpan) {
        const user = JSON.parse(localStorage.getItem("loggedInUser"));
        if (!user) {
            window.location.href = "login.html";
        } else {
            usernameSpan.textContent = user.name;
        }
    }

    // Resume Form Submission
    const homeForm = document.getElementById("resume-form");
    if (homeForm) {
        homeForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const user = JSON.parse(localStorage.getItem("loggedInUser"));
            if (!user) return alert("Please log in first.");

            const fileInput = document.getElementById("resume");
            const fileName = fileInput.files.length > 0 ? fileInput.files[0].name : "No file uploaded";

            const data = {
                id: user.id,
                username: user.name,
                email: document.getElementById("email").value,
                contact: document.getElementById("contact").value,
                resume: fileName
            };

            fetch(homeUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            }).then(() => alert("Details submitted successfully!"));
        });
    }
});

// Logout Function
function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
}