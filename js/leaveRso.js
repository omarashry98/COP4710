let leaveRsoName = "";
let leaveRsoId = 0;

async function prepareLeaveRso() {
    readUserCookie();

    leaveRsoName = document.getElementById("leaveRsoName").value;
    // Check if fields are empty
    if (leaveRsoName === "") {
        alert("RSO field is required");
        return;
    }

    leaveRsoId = await searchRsoName();
    let errMessage = await searchRsoMember();
    console.log(errMessage);
    if (errMessage.error !== "") {
        alert(errMessage);
        return;
    }

    removeFromRsoMembers();
}

async function searchRsoName() {
    return new Promise((resolve, reject) => {
        let tmp = {
            name: leaveRsoName,
        };

        let jsonPayload = JSON.stringify(tmp);
        let url = urlBase + "/SearchRSO." + extension;
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json");

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    let jsonObject = JSON.parse(xhr.responseText);
                    resolve(jsonObject.id);
                } else {
                    reject(new Error("Request failed"));
                }
            }
        };

        xhr.send(jsonPayload);
    });
}

function searchRsoMember() {
    return new Promise((resolve, reject) => {
        let tmp = {
            rso_id: leaveRsoId,
            user_id: userId,
        };

        let jsonPayload = JSON.stringify(tmp);
        let url = urlBase + "/SearchRSOMembers." + extension;
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        try {
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    let jsonObject = JSON.parse(xhr.responseText);
                    resolve(jsonObject);
                }
            };
            xhr.send(jsonPayload);
        } catch (err) {
            console.log(err.message);
            reject(err);
        }
    });
}

function removeFromRsoMembers() {
    let tmp = {
        userid: userId,
        rsoname: leaveRsoName,
    };

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + "/DeleteRSOMember." + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    try {
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                let jsonObject = JSON.parse(xhr.responseText);
                if (xhr.status === 200) {
                    window.location.href = "homepage.html";
                    return;
                }
            }
        }
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
        return;
    }
}
 