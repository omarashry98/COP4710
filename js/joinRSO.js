let joinRsoName = "";
let joinRsoId = 0;

async function perpareJoinRso() {
    readUserCookie();

    joinRsoName = document.getElementById("joinRsoName").value;
    email = document.getElementById("joinRsoEmail").value;

    // Check if fields are empty
    if (joinRsoName === "" || email === "") {
        alert("All fields are required");
        return;
    }

    // Check if email is valid
    var emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address");
        return;
    }

    joinRsoId = await searchRso();

    joinRso();
}

async function searchRso() {
    return new Promise((resolve, reject) => {
        let tmp = {
            name: joinRsoName,
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

function joinRso() {
    let tmp = {
        rso_id: joinRsoId,
        ids: [userId],
    };

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + "/UpdateRSOMembers." + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    try {
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    window.location.href="homepage.html";
                }
            }
        }
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
        return;
    }
}
