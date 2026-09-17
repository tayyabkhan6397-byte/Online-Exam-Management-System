let selectedRole = "student";


// =========================================================
// CURRENT USER
// =========================================================

function getCurrentUser() {

    try {
        return JSON.parse(
            localStorage.getItem("user")
        );
    }

    catch (error) {
        return null;
    }
}


function requireRole(role) {

    const user = getCurrentUser();

    if (!user || user.role !== role) {

        window.location.href = "login.html";

        return null;
    }

    return user;
}


// =========================================================
// LOGIN ROLE
// =========================================================

function setRole(role) {

    selectedRole = role;

    const title =
        document.getElementById("loginTitle");

    const demo =
        document.getElementById("demoText");


    if (!title) return;


    if (role === "admin") {

        title.textContent = "Admin Login";


        document
            .getElementById("adminTab")
            ?.classList.add("active");

        document
            .getElementById("studentTab")
            ?.classList.remove("active");

    }

    else {

        title.textContent = "Student Login";


        document
            .getElementById("studentTab")
            ?.classList.add("active");

        document
            .getElementById("adminTab")
            ?.classList.remove("active");
    }
}


// =========================================================
// LOGIN
// =========================================================

async function login(e) {

    e.preventDefault();


    const email =
        document
            .getElementById("email")
            .value
            .trim();


    const password =
        document
            .getElementById("password")
            .value
            .trim();


    const msg =
        document.getElementById("loginMsg");


    if (!email || !password) {

        msg.textContent =
            "❌ Please enter email and password.";

        return;
    }


    msg.textContent =
        "⏳ Checking login...";


    try {

        // IMPORTANT:
        // Backend expects "email", not "username"

        const data =
            await API.login({

                email: email,

                password: password,

                role: selectedRole

            });


        if (data.success) {

            localStorage.setItem(
                "role",
                data.user.role
            );


            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );


            msg.textContent =
                "✅ Login successful!";


            setTimeout(() => {

                if (data.user.role === "admin") {

                    window.location.href =
                        "admin.html";

                }

                else {

                    window.location.href =
                        "student.html";
                }

            }, 500);

        }

        else {

            msg.textContent =
                "❌ " + data.message;
        }

    }

    catch (error) {

        console.error(
            "Login error:",
            error
        );


        msg.textContent =
            "❌ " +
            (
                error.message ||
                "Backend server is not connected."
            );
    }
}


// =========================================================
// PASSWORD
// =========================================================

function togglePassword() {

    const input =
        document.getElementById("password");


    if (!input) return;


    input.type =
        input.type === "password"
            ? "text"
            : "password";
}


// =========================================================
// REGISTER
// =========================================================

async function registerUser(e) {

    e.preventDefault();


    const name =
        document
            .getElementById("regName")
            .value
            .trim();


    const email =
        document
            .getElementById("regEmail")
            .value
            .trim();


    const password =
        document
            .getElementById("regPassword")
            .value
            .trim();


    const confirm =
        document
            .getElementById("regConfirm")
            .value
            .trim();


    const msg =
        document.getElementById("registerMsg");


    if (!name || !email || !password) {

        msg.textContent =
            "❌ All fields are required.";

        return;
    }


    if (password !== confirm) {

        msg.textContent =
            "❌ Passwords do not match.";

        return;
    }


    msg.textContent =
        "⏳ Creating account...";


    try {

        const data =
            await API.register({

                name: name,

                email: email,

                password: password

            });


        if (data.success) {

            msg.textContent =
                "✅ Account created successfully!";


            setTimeout(() => {

                window.location.href =
                    "login.html?role=student";

            }, 1000);

        }

        else {

            msg.textContent =
                "❌ " + data.message;
        }

    }

    catch (error) {

        console.error(
            "Registration error:",
            error
        );


        msg.textContent =
            "❌ " +
            (
                error.message ||
                "Backend server is not connected."
            );
    }
}


// =========================================================
// ADMIN SECTION
// =========================================================

function showSection(id) {

    document
        .querySelectorAll(".dashboard-section")
        .forEach(section => {

            section.classList.remove("active");

        });


    const section =
        document.getElementById(id);


    if (section) {

        section.classList.add("active");
    }


    document
        .querySelectorAll(".sidebar nav button")
        .forEach(button => {

            button.classList.remove("active");

        });


    const buttons =
        document.querySelectorAll(
            ".sidebar nav button"
        );


    buttons.forEach(button => {

        if (
            button
                .getAttribute("onclick")
                ?.includes(`'${id}'`)
        ) {

            button.classList.add("active");
        }

    });


    const title =
        document.getElementById("pageTitle");


    if (title) {

        title.textContent =
            id.charAt(0).toUpperCase() +
            id.slice(1);
    }
}


// =========================================================
// STUDENT SECTION
// =========================================================

function showStudentSection(id) {

    document
        .querySelectorAll(".dashboard-section")
        .forEach(section => {

            section.classList.remove("active");

        });


    document
        .getElementById(id)
        ?.classList.add("active");


    document
        .querySelectorAll(".sidebar nav button")
        .forEach(button => {

            button.classList.remove("active");

        });


    document
        .querySelectorAll(".sidebar nav button")
        .forEach(button => {

        if (
            button
                .getAttribute("onclick")
                ?.includes(`'${id}'`)
        ) {

            button.classList.add("active");
        }

    });
}


// =========================================================
// MODALS
// =========================================================

function openModal(id) {

    document
        .getElementById(id)
        ?.classList.add("show");
}


function closeModal(id) {

    document
        .getElementById(id)
        ?.classList.remove("show");
}


// =========================================================
// LOGOUT
// =========================================================

function logout() {

    localStorage.removeItem("role");

    localStorage.removeItem("user");

    sessionStorage.removeItem("currentExam");

    sessionStorage.removeItem("lastResult");

    window.location.href =
        "login.html";
}


// =========================================================
// LOAD SUBJECTS
// =========================================================

async function loadSubjects() {

    try {

        const data =
            await API.getSubjects();

        const subjects =
            data.subjects || data;


        console.log(
            "Subjects:",
            subjects
        );


        const dropdowns = [

            document.getElementById("subject"),

            document.getElementById(
                "questionSubject"
            ),

            document.getElementById(
                "examSubject"
            ),

            document.getElementById(
                "subjectSelect"
            ),

            document.getElementById(
                "questionSubjectSelect"
            ),

            document.getElementById(
                "examSubjectSelect"
            )

        ].filter(Boolean);


        dropdowns.forEach(select => {

            const currentValue =
                select.value;


            select.innerHTML =
                '<option value="">Select Subject</option>';


            subjects.forEach(subject => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    subject.name;


                option.textContent =
                    subject.name;


                select.appendChild(option);

            });


            if (currentValue) {

                select.value =
                    currentValue;
            }

        });

    }

    catch (error) {

        console.error(
            "Failed to load subjects:",
            error
        );
    }
}


// =========================================================
// ADD SUBJECT
// =========================================================

async function addSubject() {

    const input =
        document.getElementById("subjectName") ||

        document.getElementById("newSubject") ||

        document.getElementById("subjectInput") ||

        document.getElementById(
            "newSubjectName"
        );


    if (!input) {

        console.error(
            "Subject input not found."
        );

        return;
    }


    const name =
        input.value.trim();


    if (!name) {

        alert(
            "Please enter subject name."
        );

        return;
    }


    try {

        const data =
            await API.addSubject({

                name: name

            });


        if (data.success) {

            alert(
                "✅ Subject added successfully!"
            );


            input.value = "";


            await loadSubjects();

        }

        else {

            alert(
                "❌ " + data.message
            );
        }

    }

    catch (error) {

        console.error(error);


        alert(
            "❌ " +
            (
                error.message ||
                "Failed to add subject"
            )
        );
    }
}


// =========================================================
// THEME MANAGEMENT (WHITE / LIGHT THEME DEFAULT)
// =========================================================

function initTheme() {
    const savedTheme = localStorage.getItem("es_theme") || "light";
    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
    } else {
        document.body.classList.remove("dark-theme");
    }
    updateThemeButtons(savedTheme);
}

function toggleTheme() {
    const isDark = document.body.classList.toggle("dark-theme");
    const current = isDark ? "dark" : "light";
    localStorage.setItem("es_theme", current);
    updateThemeButtons(current);
}

function updateThemeButtons(theme) {
    document.querySelectorAll(".theme-toggle-btn").forEach(btn => {
        btn.innerHTML = theme === "dark" ? "☀️ Light" : "🌙 Dark";
        btn.setAttribute("title", theme === "dark" ? "Switch to White / Light Theme" : "Switch to Dark Theme");
    });
}


// =========================================================
// PAGE LOAD
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initTheme();

        loadSubjects();


        const params =
            new URLSearchParams(
                window.location.search
            );


        const role =
            params.get("role");


        if (
            role === "admin" ||
            role === "student"
        ) {

            setRole(role);
        }

    }
);
