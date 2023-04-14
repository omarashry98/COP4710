const urlBase = "http://collegeeventwebsite.com/LAMPAPI";
const extension = "php";

// cookie variables
let userId = 0;
let fullName = "";
let userlevel = "";
let useremail = "";
let universityId = 0;

function login() {
    // Clear the login result regardless of status
    document.getElementById("login-result").innerHTML = "";

    let login = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let tmp = { username: login, password: password };
    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + "/Login." + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.error !== "No Records found") {
                    userId = jsonObject.id;
                    fullName = jsonObject.fullName;
                    userlevel = jsonObject.userlevel;
                    useremail = jsonObject.email;
                    universityId = jsonObject.university_id;

                    saveUserCookie();
                    // Clear input fields
                    window.location.href = "homepage.html";
                }
            } else if (this.status === 404) {
                alert("Invalid Credentials");
                return;
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        alert(err.message);
    }
}

function signOut() {
    // Clear user data
    userId = 0;
    fullName = "";
    useremail = "";
    userlevel = "";
    universityId = "";

    // Delete the UserCookie cookie
    document.cookie =
        "UserCookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Redirect to login page
    window.location.href = "index.html";
}

async function signUp() {
    document.getElementById("signup-result").innerHTML = "";

    let email = document.getElementById("email").value;
    let password = document.getElementById("cfnpass").value;
    let name = document.getElementById("name").value;
    let universityname = document.getElementById("universityNameDiv").value;
    let universityId = await searchUniversity(universityname);
    const selectElement = document.querySelector(".my-select");
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const userLevel = selectedOption.text;

    if (universityId === -1) {
        alert("University does not exist.");
        return;
    }

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email");
        return;
    }

    if (userLevel === "Select an option") {
        alert("Please choose a user level.");
        return;
    }

    let tmp = {
        fullname: name,
        email: email,
        password: password,
        universityid: universityId,
        userlevel: userLevel,
    };

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + "/Signup." + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error === "") {
                    // move them to another page
                    window.location.href = "index.html";
                }
            } else if (this.status === 400) {
                alert("Email already exists");
                return;
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
        return;
    }
}


function searchUniversity(universityName) {
    return new Promise((resolve, reject) => {
        let tmp = {
            name: universityName,
        };

        let jsonPayload = JSON.stringify(tmp);
        let url = urlBase + "/SearchUniversity." + extension;
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (this.status === 200) {
                    let jsonObject = JSON.parse(xhr.responseText);
                    resolve(jsonObject.id);
                } else if (this.status === 404) {
                    resolve(-1);
                }
            }
        };

        try {
            xhr.send(jsonPayload);
        } catch (err) {
            console.log(err.message);
            reject(err);
        }
    });
}

function validateEmailDomain(email, schoolUrl) {
    const domain = schoolUrl.split(".")[1];
    return email.includes(`${domain}.edu`);
}

// Modify these functions so it works for whatever is returned in Login.php look at postman
function saveUserCookie() {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + minutes * 60 * 1000);
    document.cookie =
        "UserCookie=fullName=" +
        fullName +
        ",userId=" +
        userId +
        ",userlevel=" +
        userlevel +
        ",useremail=" +
        useremail +
        ",universityid=" +
        universityId +
        ";expires=" +
        date.toGMTString();
}

function readUserCookie() {
    userId = -1;
    fullName = "";
    useremail = "";
    userlevel = "";
    universityId = "";

    const data = document.cookie.match(/(^|;) *UserCookie=([^;]*)/);
    if (data) {
        const cookieValue = data[2];
        const splits = cookieValue.split(",");
        for (let i = 0; i < splits.length; i++) {
            const thisOne = splits[i].trim();
            const tokens = thisOne.split("=");
            if (tokens[0] === "fullName") {
                fullName = tokens[1];
            } else if (tokens[0] === "userId") {
                userId = parseInt(tokens[1].trim());
            } else if (tokens[0] === "userlevel") {
                userlevel = tokens[1];
            } else if (tokens[0] === "useremail") {
                useremail = tokens[1];
            } else if (tokens[0] === "universityid") {
                universityId = tokens[1];
            }
        }
    }

    if (userId < 0) {
        window.location.href = "index.html";
    }

}


// Jquery to display buttons according to user level
$(document).ready(function () {
    // Assuming userLevel is already defined and has a value
    // For example: var userLevel = "superAdmin";

    // Show or hide buttons based on the userLevel
    function displayButtons() {
        // Hide all role-specific buttons by default
        $(".super-admin-only, .admin-only, .student-only").hide();

        // Show buttons based on userLevel
        if (userlevel === "super admin") {
            $(".super-admin-only").show();
        } else if (userlevel === "admin") {
            $(".admin-only").show();
        } else if (userlevel === "student") {
            $(".student-only").show();
        }
    }

    // Call the displayButtons function to set the visibility of buttons
    displayButtons();
});
