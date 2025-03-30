const apiUrl = "https://your-deployed-api.com/users"; // Replace with your deployed API URL
const homeUrl = "https://your-deployed-api.com/homes"; // Replace with your deployed API URL

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", function () {
    
    // Signup Function
    const signupForm = document.getElementById("signup-form");
    if (signupForm) {
        signupForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            const name = document.getElementById("signup-name").value;
            const email = document.getElementById("signup-email").value;
            const password = document.getElementById("signup-password").value;

            try {
                const response = await fetch(apiUrl);
                const users = await response.json();
                const userExists = users.some(user => user.email === email);

                if (userExists) {
                    alert("User already exists. Try logging in.");
                } else {
                    const newId = users.length ? users[users.length - 1].id + 1 : 101;
                    await fetch(apiUrl, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id: newId, name, email, password })
                    });
                    alert("Signup successful! Now log in.");
                    window.location.href = "login.html";
                }
            } catch (error) {
                console.error("Error during signup:", error);
                alert("Failed to connect to the server. Please try again later.");
            }
        });
    }

    // Login Function
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;

            try {
                const response = await fetch(apiUrl);
                const users = await response.json();
                const user = users.find(u => u.email === email && u.password === password);

                if (user) {
                    localStorage.setItem("loggedInUser", JSON.stringify(user));
                    alert(`Welcome back, ${user.name}! Redirecting to home page...`);
                    window.location.href = "home.html";
                } else {
                    alert("Invalid email or password.");
                }
            } catch (error) {
                console.error("Error during login:", error);
                alert("Failed to connect to the server. Please try again later.");
            }
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
        homeForm.addEventListener("submit", async function (event) {
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

            try {
                await fetch(homeUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });
                alert("Details submitted successfully!");
            } catch (error) {
                console.error("Error submitting details:", error);
                alert("Failed to submit details. Please try again later.");
            }
        });
    }
});

// Logout Function
function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
}