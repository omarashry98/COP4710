const urlBase = "http://collegeeventwebsite.com/LAMPAPI";
const extension = "php";

// cookie variables
let userId = 0;
let fullName = "";

let uniId = 0;
let uniUrl = "";

// Function to show Univeristy List on forms
// currently using it for RSO's and Sign Up
window.onload = function () {
    // fetch("http://collegeeventwebsite.com/json/schools.json")
    fetch("http://127.0.0.1:5500/schools.json")
        .then((response) => response.json())
        .then((data) => {
            let names = data.map((obj) => obj["name"]);
            let sortedNames = names.sort();

            let input = document.getElementById("input");

            input.addEventListener("keyup", (e) => {
                removeElements();
                for (let i of sortedNames) {
                    if (
                        i.toLowerCase().startsWith(input.value.toLowerCase()) &&
                        input.value != ""
                    ) {
                        let listItem = document.createElement("li");

                        listItem.classList.add("list-items");
                        listItem.style.cursor = "pointer";
                        listItem.setAttribute(
                            "data-university-id",
                            data.find((obj) => obj["name"] === i).id
                        ); // add data-university-id attribute

                        listItem.setAttribute(
                            "data-university-email",
                            data.find((obj) => obj["name"] === i).school_url
                        ); // add data-university-email attribute

                        let word =
                            "<b>" + i.substr(0, input.value.length) + "</b>";
                        word += i.substr(input.value.length);

                        listItem.innerHTML = word;
                        const ulElement = document
                            .querySelector(".list")
                            .appendChild(listItem);
                        ulElement.style.backgroundColor = "#45f3ff";
                        ulElement.style.borderRadius = "0 0 5px 5px";
                        ulElement.style.top = "100%"; // positions the list beneath the input box
                        ulElement.style.position = "relative";
                        ulElement.style.width = "100%";
                        ulElement.style.zIndex = "999";
                    }
                }
                addListItemsEventListeners();
            });

            function addListItemsEventListeners() {
                const listItems = document.querySelectorAll(".list-items");
                listItems.forEach((listItem) => {
                    listItem.addEventListener("click", () => {
                        input.value = listItem.textContent;
                        const universityId =
                            listItem.getAttribute("data-university-id"); // retrieve university id
                        const universityEmail = listItem.getAttribute(
                            "data-university-email"
                        ); // retrieve university email
                        uniId = universityId;
                        uniUrl = universityEmail;
                        removeElements();
                    });
                });
            }

            function removeElements() {
                let items = document.querySelectorAll(".list-items");
                items.forEach((item) => {
                    item.remove();
                });
            }

            document.addEventListener("click", (e) => {
                const dropdown = document.querySelector(".list");
                if (!dropdown.contains(e.target)) {
                    removeElements();
                }
            });

            document.addEventListener("keydown", (e) => {
                if (e.key === "Escape") {
                    removeElements();
                }
            });
        })
        .catch((error) => console.log(error));
};

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

                    saveUserCookie();
                    // Clear input fields
                    document.getElementById("username").value = "";
                    document.getElementById("password").value = "";
                }
            } else if (this.status === 404) {
                document.getElementById("login-result").innerHTML =
                    "Invalid Credentials";
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("login-result").innerHTML = err.message;
    }
}

function signUp() {
    document.getElementById("signup-result").innerHTML = "";

    let email = document.getElementById("email").value;
    let password = document.getElementById("cfnpass").value;
    let name = document.getElementById("name").value;
    const selectElement = document.querySelector(".my-select");
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const userLevel = selectedOption.text;
    console.log(userLevel)
    
    let universityId = uniId;

    if (!validateEmailDomain(email, uniUrl)) {
        alert("Email domain and University does not match");
        return;
    }

    if (
        userLevel === 'Select an option'
    ) {
        alert("Please choose a user level");
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
                    userId = jsonObject.id;
                    fullName = jsonObject.fullName;

                    saveUserCookie();
                    // move them to another page
                    document.getElementById("name").value = "";
                    document.getElementById("email").value = "";
                    document.getElementById("pass").value = "";
                    document.getElementById("cfnpass").value = "";
                    document.getElementById("userlevel").value = "";
                    document.getElementById("input").value = "";
                }
            } else if (this.status === 400) {
                document.getElementById("signup-result").innerHTML =
                    "Email already exists";
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("signup-result").innerHTML = err.message;
    }
}

function validateEmailDomain(email, schoolUrl) {
    const domain = schoolUrl.split(".")[1];
    return email.includes(`${domain}.edu`);
}

function getUserType(userType) {
    switch (userType) {
        case "Super Admin":
            return 1;
        case "Admin":
            return 2;
        case "Student":
            return 3;
        default:
            return null;
    }
}

function saveUserCookie() {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + minutes * 60 * 1000);
    document.cookie =
        "UserCookie=fullName=" +
        fullName +
        ",userId=" +
        userId +
        ";expires=" +
        date.toGMTString();
}

function readUserCookie() {
    userId = -1;
    // let data = document.cookie;
    let data = readCookie("UserCookie");
    if (data == null) {
        window.location.href = "index.html";
    }
    let splits = data.split(",");
    for (var i = 0; i < splits.length; i++) {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if (tokens[0] == "firstName") {
            firstName = tokens[1];
        } else if (tokens[0] == "lastName") {
            lastName = tokens[1];
        } else if (tokens[0] == "userId") {
            userId = parseInt(tokens[1].trim());
        }
    }

    if (userId < 0) {
        window.location.href = "index.html";
    } else {
        // document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
    }
}
