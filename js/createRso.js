const urlBase = "http://collegeeventwebsite.com/LAMPAPI";
const extension = "php";

// cookie variables
let userId = 0;
let fullName = "";
let userlevel = "";

let rsoName = "";
let rsoEmail = "";
let rsoDescription = "";
let adminName = "";
let rsoUniversityId = 0;
let uniId = 0;
let initialMembers;

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
                        ulElement.style.backgroundColor = "#ffffff";
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

function searchAdmin() {
    let tmp = { email: rsoEmail };
    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + "/SearchAdmin." + extension;
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
                    userlevel = jsonObject.userlevel;
                }
            } else if (this.status === 401) {
                alert("RSO Email provided doesn't have privileges to create RSO");
                return;
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        
    }
}

function createRSO() {
    searchAdmin();
    if (userId === 0) {
        return;
    }

    let tmp = {
        name: rsoName,
        description: rsoDescription,
        university_id: rsoUniversityId,
        admin_id: userId,
        status: 'active',
    }
    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + "/CreateRSO." + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    
}

function validateRsoForm() {
    // check user level
    if (userlevel !== "admin") {
        alert("Only admins can make RSOs");
        return;
    }

    const createRsoForm = document.getElementById("createRSOForm");

    createRsoForm.addEventListener("submit", function (event) {
        // prevent the form from submitting
        event.preventDefault();

        // perform client-side validation
        rsoName = document.getElementById("rsoName").value;
        rsoEmail = document.getElementById("rsoEmail").value;
        rsoDescription = document.getElementById("rsoDescription").value;
        adminName = document.getElementById("rsoAdmin").value;
        rsoUniversityId = uniId;
        initialMembers = parseInitialMembers();

        // Check if RSO name is empty
        if (rsoName.trim() === "") {
            alert("RSO name cannot be empty");
            return;
        }

        // Check if rso email is valid
        if (!validateEmailDomain(rsoEmail, uniUrl)) {
            alert("RSO Email does not match University");
            return;
        }

        // Check if user selected a university
        if (rsoUniversityId === 0) {
            alert("Please select a University");
            return;
        }

        // Check if the initial Members have same domain as University
        for (const member of initialMembers) {
            if (!validateEmailDomain(member, uniUrl)) {
                alert(
                    "One of the members contains an email that does not match University"
                );
                return;
            }
        }

        if (adminName.trim() === "") {
            alert("RSO Admin name cannot be empty");
            return;
        }

        createRSO();
    });
}

function validateEmailDomain(email, schoolUrl) {
    const domain = schoolUrl.split(".")[1];
    return email.endsWith(`.${domain}.edu`);
}

function parseInitialMembers() {
    const initialMembers = document
        .getElementById("initialMemebers")
        .value.split(",")
        .map((email) => email.trim());
    return initialMembers;
}

function readUserCookie() {
    userId = -1;
    fullName = "";
    userlevel = "";
    let data = readCookie("UserCookie");
    if (data == null) {
        window.location.href = "index.html";
    }
    let splits = data.split(",");
    for (var i = 0; i < splits.length; i++) {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if (tokens[0] == "fullName") {
            fullName = tokens[1];
        } else if (tokens[0] == "userId") {
            userId = parseInt(tokens[1].trim());
        } else if (tokens[0] == "userlevel") {
            userlevel = tokens[1];
        }
    }

    if (userId < 0) {
        window.location.href = "index.html";
    } else {
        // document.getElementById("userName").innerHTML = "Logged in as " + fullName;
    }
}
