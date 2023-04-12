let eventName = "";
let eventCat = "";
let eventDesc = "";
let eventDate = "";
let eventStart = "";
let eventStop = "";
let eventLoc = "";
let eventLat = "";
let eventLng = "";
let eventContactPhone = "";
let eventContactEmail = "";
let eventType = "";
let eventRsoName = "";

let eventAdminId = 0;
let eventRsoId = 0;

// Add event listener to the start time input
function setStopTime() {
    // Get references to the input fields
    const startTimeInput = document.getElementById("eventStartTime");
    const stopTimeInput = document.getElementById("eventStopTime");

    // Get the start time value
    const startTime = startTimeInput.value;

    // Parse the start time into hours and minutes
    const startHour = parseInt(startTime.substring(0, 2));
    const startMinute = parseInt(startTime.substring(3, 5));

    // Calculate the stop time
    const stopHour = startHour + 1;
    const stopMinute = startMinute;

    // Format the stop time as a string with leading zeros
    const stopHourStr = ("0" + stopHour).slice(-2);
    const stopMinuteStr = ("0" + stopMinute).slice(-2);

    // Set the stop time input value
    stopTimeInput.value = stopHourStr + ":" + stopMinuteStr;
}

async function validateEvent() {
    eventName = document.getElementById("eventName").value.trim();
    eventCat = document.getElementById("eventCategory").value.trim();
    eventDesc = document.getElementById("createEventDescription").value;
    eventDate = document.getElementById("eventDate").value;
    eventStart = document.getElementById("eventStartTime").value;
    eventStop = document.getElementById("eventStopTime").value;
    eventLoc = document.getElementById("eventLocationDiv").value.trim();
    eventLat = document.getElementById("eventLat").value.trim();
    eventLng = document.getElementById("eventLng").value.trim();
    eventContactPhone = document
        .getElementById("createEventContactPhone")
        .value.trim();
    eventContactEmail = document
        .getElementById("createEventContactEmail")
        .value.trim();
    eventType = document.getElementById("eventType").value;
    eventRsoName = document.getElementById("rsoNameDiv").value;

    // Check for empty fields
    if (
        eventName === "" ||
        eventCat === "" ||
        eventDesc === "" ||
        eventDate === "" ||
        eventStart === "" ||
        eventStop === "" ||
        eventLoc === "" ||
        eventLat === "" ||
        eventLng === "" ||
        eventContactPhone === "" ||
        eventContactEmail === ""
    ) {
        alert("Please fill in all fields.");
        return;
    }

    // Check that the event date is in the present or future
    const today = new Date().toISOString().split("T")[0];
    if (eventDate < today) {
        alert("Please select a date in the present or future.");
        return;
    }

    // Check that start time and end time is a valid combination
    if (eventStart >= eventStop) {
        alert("Please enter a valid start and stop time combination.");
        return;
    }

    // Check if event starts at
    if (eventStart.split(":")[1] !== "00") {
        alert("Event start time must be at the top of the hour.");
        return;
    }

    // Check that contact phone is valid
    const phoneRegex = /^(?:\d{3}-){2}\d{4}$|^\d{10}$/;
    if (!phoneRegex.test(eventContactPhone)) {
        alert("Please enter a valid phone number.");
        return;
    }

    // Check that contact email is valid
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(eventContactEmail)) {
        alert("Please enter a valid email address.");
        return;
    }

    // Check that latitude and longitude are not empty
    if (eventLat === "" || eventLng === "") {
        alert("Please enter a valid location.");
        return;
    }

    // check if the RSO name is valid and return id
    if (eventType === "RSO") {
        eventRsoId = await fetchRSO(eventRsoName);
        if (eventRsoId === -1) {
            alert("The RSO name doesn't exists");
            return;
        }
    }

    // check if the contact email (which should be admin) is in the database
    eventAdminId = await fetchAdmin(eventContactEmail);
    if (eventAdminId === -1) {
        alert("The contact email does not exist.");
        return;
    }

    createEvent();
}

async function fetchAdmin(adminEmail) {
    let tmp = {
        email: adminEmail,
    };

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + "/SearchUser." + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");

    // Return a new Promise
    return new Promise((resolve, reject) => {
        try {
            xhr.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    let jsonObject = JSON.parse(xhr.responseText);
                    if (jsonObject.error === "") {
                        eventAdminId = jsonObject.id;
                        resolve(eventAdminId); // Resolve the Promise with the value
                    }
                } else if (this.status === 404) {
                    eventAdminId = -1;
                    resolve(eventAdminId); // Resolve the Promise with the value
                }
            };
            xhr.send(jsonPayload);
        } catch (err) {
            console.log(err.message);
            reject(err); // Reject the Promise in case of an error
        }
    });
}

async function fetchRSO(rsoName) {
    let tmp = {
        name: rsoName,
    };

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + "/SearchRSO." + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");

    // Return a new Promise
    return new Promise((resolve, reject) => {
        try {
            xhr.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    let jsonObject = JSON.parse(xhr.responseText);
                    if (jsonObject.error === "") {
                        eventRsoId = jsonObject.id;
                        resolve(eventRsoId); // Resolve the Promise with the value
                    }
                } else if (this.status === 404) {
                    eventRsoId = -1;
                    resolve(eventRsoId); // Resolve the Promise with the value
                }
            };
            xhr.send(jsonPayload);
        } catch (err) {
            console.log(err.message);
            reject(err); // Reject the Promise in case of an error
        }
    });
}

function createEvent() {
    readUserCookie();

    let tmp = {
        name: eventName,
        category: eventCat,
        description: eventDesc,
        date: eventDate,
        start_time: eventStart,
        end_time: eventStop,
        location: eventLoc,
        latitude: eventLat,
        longitude: eventLng,
        contact_phone: eventContactPhone,
        contact_email: eventContactEmail,
        event_type: eventType,
        rso_id: eventRsoId === 0 ? null : eventRsoId,
        admin_id: eventAdminId,
        university_id: universityId,
    };

    console.log(tmp);

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + "/CreateEvent." + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState === 4) {
                let jsonObject = JSON.parse(xhr.responseText);
                if (this.status === 200) {
                    console.log(jsonObject.name);
                    window.location.href = "homepage.html";
                } else if (this.status === 409) {
                    
                    alert(jsonObject.error);
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
