let universityName = "";
let universityLat = 0;
let universityLong = 0;
let universityDesc = "";
let universityStudents = 0;
let universityUrl = "";


function validateUniversity() {
    // make sure you add functionality to check if the user is a super admin
    readUserCookie();

    universityName = document.getElementById("universityLocation").value;
    universityDesc = document.getElementById("universityDescription").value;
    universityStudents = document.getElementById("numberOfStudents").value;
    console.log(universityStudents);
    universityUrl = document.getElementById("universityPictures").value;
    universityLat = document.getElementById("universityLat").value;
    universityLong = document.getElementById("universityLng").value;

    if (universityName === "") {
        alert("Please enter a university name.");
        return false;
    }
    if (numberOfStudents === "") {
        alert("Please enter the number of students.");
        return false;
    }

    // Check if number of students is a valid number
    if (!isNaN(numberOfStudents)) {
        alert("Please enter a valid number of students.");
        return false;
    }

    createUniversity();
}

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (_) {
        return false;
    }
}

function createUniversity() {
    let tmp = {
        name: universityName,
        description: universityDesc,
        num_students: universityStudents, // rember to remove the comma in the number
        image_url: universityUrl,
        latitude: universityLat,
        longitude: universityLong,
    };

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + "/CreateUniversity." + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
               // do something to notify the user the University has been created
               window.location.href="homepage.html";
            }
        }
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
        return;
    }
}

