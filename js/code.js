const urlBase = "http://collegeeventwebsite.com/LAMPAPI";
const extension = "php";

// cookie variables
let userId = 0;
let fullName = "";

function login() {
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
                    document.getElementById("login-result").innerHTML = "";
                    userId = jsonObject.id;
                    fullName = jsonObject.fullName;

                    saveUserCookie();
                    // Clear input fields
                    document.getElementById("username").value = "";
                    document.getElementById("password").value = "";
                }
            } else if (this.status === 404) {
                document.getElementById("login-result").innerHTML = "Invalid Credentials";
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("login-result").innerHTML = err.message;
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
