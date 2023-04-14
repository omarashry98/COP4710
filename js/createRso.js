let rsoName = "";
let rsoDescription = "";
let rsoUniversity = "";
let rsoEmail = "";
let initialMembers;
let rsoAdminName = "";

let rsoUniversityId = 0;
let rsoAdminId = 0;

let createRsoId = 0;
let initialMembersIds;

async function validateRsoForm() {
    readUserCookie();

    // perform client-side validation
    rsoName = document.getElementById("createRsoName").value;
    rsoDescription = document.getElementById("createRsoDescription").value;
    rsoUniversity = document.getElementById("createRsoUniversity").value;
    rsoEmail = document.getElementById("createRsoEmail").value;
    rsoAdminName = document.getElementById("createRsoAdmin").value;
    initialMembers = parseInitialMembers();

    // Check if RSO name is empty
    if (
        rsoName === "" ||
        rsoDescription === "" ||
        rsoUniversity === "" ||
        rsoEmail === "" ||
        rsoAdminName === ""
    ) {
        alert("All fields must be filled.");
        return;
    }

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(rsoEmail)) {
        alert("Please enter a valid email.");
        return;
    }

    rsoAdminId = await fetchAdmin(rsoEmail);
    if (rsoAdminId === -1) {
        alert("The contact email does not exist.");
        return;
    }

    rsoUniversityId = await searchUniversity(rsoUniversity);
    if (rsoUniversityId === -1) {
        alert("The University does not exist in our system.")
        return;
    }

    await createRSO();

    initialMembersIds = await searchMultipleUsers();
    if (initialMembersIds === null) {
        alert("One of the emails are incorrect");
        return;
    }
    console.log(initialMembersIds);

    await updateCreateRsoMembers();
}

async function createRSO() {
    let tmp = {
        name: rsoName,
        description: rsoDescription,
        university_id: rsoUniversityId,
        admin_id: userId,
        status: "active",
    };

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + "/CreateRSO." + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    try {
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                let jsonObject = JSON.parse(xhr.responseText);
                if (xhr.status === 200) {
                    window.location.href = "homepage.html";
                    createRsoId = jsonObject.id;
                    return;
                } else {
                    alert("Error occurred");
                    return;
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
        return;
    }
}

async function searchMultipleUsers() {
    console.log(initialMembers);
    return new Promise((resolve, reject) => {
        let tmp = {
            emails: initialMembers,
        };

        let jsonPayload = JSON.stringify(tmp);
        let url = urlBase + "/SearchMultipleUsers." + extension;
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (this.status === 200) {
                    let jsonObject = JSON.parse(xhr.responseText);
                    resolve(jsonObject.ids);
                } else {
                    resolve(null);
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

function parseInitialMembers() {
    const initialMembers = document
        .getElementById("initialMembers")
        .value.split(",")
        .map((email) => email.trim());
    return initialMembers;
}

async function updateCreateRsoMembers() {
    console.log("here");
    initialMembersIds.push(rsoAdminId);
    let tmp = {
        rso_id: createRsoId,
        ids: initialMembersIds
    };

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + "/UpdateRSOMembers." + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    try {
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (this.status === 200) {
                    window.location.href = "homepage.html";
                } 
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
        return;
    }
}
