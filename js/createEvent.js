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

let eventAdminId = "";
let eventRsoId = "";

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

function validateEvent(event) {
    event.preventDefault();
    // make sure you add functionality to check if the user is an admin
    if (userlevel !== "admin") {
        alert("Only Admins can create an Event");
        return;
    }

    eventName = document.getElementById("eventName").value.trim();
    eventCat = document.getElementById("eventCategory").value.trim();
    eventDesc = document.getElementById("eventDescription").value.trim();
    eventDate = document.getElementById("eventDate").value;
    eventStart = document.getElementById("eventStartTime").value;
    eventStop = document.getElementById("eventStopTime").value;
    eventLoc = document.getElementById("eventLocationDiv").value.trim();
    eventLat = document.getElementById("eventLat").value.trim();
    eventLng = document.getElementById("eventLng").value.trim();
    eventContactPhone = document.getElementById("contactPhone").trim();
    eventContactEmail = document.getElementById("contactEmail").trim();
    eventType = document.getElementById("eventType").value;

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
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(contactPhone)) {
        alert("Please enter a valid phone number.");
        return;
    }

    // Check that contact email is valid
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(contactEmail)) {
        alert("Please enter a valid email address.");
        return;
    }

    // Check that latitude and longitude are not empty
    if (eventLat === "" || eventLng === "") {
        alert("Please enter a valid location.");
        return;
    }

    
}

function createEvent() {
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
        rso_id: eventRsoId,
        admin_id: eventAdminId,
    };
}
