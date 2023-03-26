// ====================================================== JOIN RSO =========================================================
// Get form elements
const rsoNameInput = document.getElementById("rsoName");
const universityInput = document.getElementById("university");
const adminEmailInput = document.getElementById("adminEmail");
const joinRSOButton = document.querySelector(
    "#joinRSOModal button.btn-primary"
);

// Add event listener to Join RSO button
joinRSOButton.addEventListener("click", (event) => {
    // Prevent default form submission behavior
    event.preventDefault();

    // Validate form inputs
    if (rsoNameInput.value.trim() === "") {
        alert("Please enter an RSO name.");
        return;
    }

    if (universityInput.value.trim() === "") {
        alert("Please enter a university name.");
        return;
    }

    if (adminEmailInput.value.trim() === "") {
        alert("Please enter an admin email.");
        return;
    }

    if (
        !adminEmailInput.value.includes("@") ||
        !adminEmailInput.value.endsWith(".edu")
    ) {
        alert("Please enter a valid .edu email address.");
        return;
    }

    // If form inputs are valid, submit the form
    document.querySelector("#joinRSOModal form").submit();
});

// ====================================================== CREATE UNIVERSTIY =========================================================
// check user level
var userLevel = "super admin"; // replace with actual user level
if (userLevel !== "super admin") {
    // disable button if user level is not admin
    var button = document.querySelector(
        "#createUniversityModal button[type='button']"
    );
    button.disabled = true;
    button.title = "Only admins can create universities";
} else {
    // form validation
    var form = document.querySelector("#createUniversityModal form");
    form.addEventListener("submit", function (event) {
        // prevent form submission
        event.preventDefault();

        // validate inputs
        var universityName = document.querySelector("#universityName").value;
        var universityLocation = document.querySelector(
            "#universityLocation"
        ).value;
        var numberOfStudents =
            document.querySelector("#numberOfStudents").value;

        if (!universityName) {
            alert("Please enter a university name.");
            return;
        }

        if (!universityLocation) {
            alert("Please enter a university location.");
            return;
        }

        if (!numberOfStudents || numberOfStudents < 0) {
            alert("Please enter a valid number of students.");
            return;
        }

        // submit form if all inputs are valid
        alert("University created successfully!");
        form.reset();
    });
}

// ====================================================== CREATE RSO FUNCTIONALITY =========================================================
function validateCreateRSOForm() {
    // get form fields
    const rsoName = document.getElementById("rsoName").value;
    const rsoDescription =
        document.getElementById("rsoDescription").value;
    const rsoEmail = document.getElementById("rsoEmail").value;
    const university = document.getElementById("university").value;
    const rsoAdmin = document.getElementById("rsoAdmin").value;

    // validate required fields
    if (
        !rsoName ||
        !rsoDescription ||
        !rsoEmail ||
        !university ||
        !rsoAdmin
    ) {
        alert("Please fill out all required fields.");
        return false;
    }

    // validate email format
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(rsoEmail)) {
        alert("Please enter a valid email address.");
        return false;
    }

    // validate university name
    const universityOptions =
        document.getElementById("university").options;
    const universityNames = [];
    for (let i = 0; i < universityOptions.length; i++) {
        universityNames.push(universityOptions[i].text);
    }
    if (!universityNames.includes(university)) {
        alert("Please select a valid university.");
        return false;
    }

    // validate admin name format (at least 2 words)
    const adminNameWords = rsoAdmin.split(" ");
    if (adminNameWords.length < 2) {
        alert("Please enter a valid admin name.");
        return false;
    }

    // submit form if all validation passes
    // document.getElementById("createRSOForm").submit();
    // call api to create event on the backend
}

// ====================================================== CREATE EVENT FUNCTIONALITY =========================================================
// Get form elements
const form = document.querySelector('#createEventModal form');
const eventName = document.querySelector('#eventName');
const eventCategory = document.querySelector('#eventCategory');
const eventDescription = document.querySelector('#eventDescription');
const eventDateTime = document.querySelector('#eventDateTime');
const eventLocation = document.querySelector('#eventLocation');
const contactPhone = document.querySelector('#contactPhone');
const contactEmail = document.querySelector('#contactEmail');

// Add form submission event listener
form.addEventListener('submit', function (event) {
    // Prevent form submission
    event.preventDefault();

    // Check if all required fields are filled
    if (!eventName.value || !eventCategory.value || !eventDateTime.value || !eventLocation.value || !contactPhone.value || !contactEmail.value) {
        alert('Please fill out all required fields!');
        return;
    }

    // Check if the event category is valid
    const validCategories = ['social', 'fundraising', 'tech talks', 'other'];
    if (!validCategories.includes(eventCategory.value.toLowerCase())) {
        alert('Invalid event category!');
        return;
    }

    // Check if the contact email is a valid email address
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(contactEmail.value)) {
        alert('Invalid email address!');
        return;
    }

    // Submit form
    form.submit();
});

// ====================================================== APPROVE FUNCTIONALITY =========================================================
function validateApprovePublicEventForm() {
    // get form fields
    const eventTitle = document.getElementById("eventTitle").value;
    const eventDescription =
        document.getElementById("eventDescription").value;
    const eventDateTime =
        document.getElementById("eventDateTime").value;
    const eventLocation =
        document.getElementById("eventLocation").value;
    const contactPhone =
        document.getElementById("contactPhone").value;
    const contactEmail =
        document.getElementById("contactEmail").value;

    // validate required fields
    if (
        !eventTitle ||
        !eventDescription ||
        !eventDateTime ||
        !eventLocation ||
        !contactPhone ||
        !contactEmail
    ) {
        alert("Please fill out all required fields.");
        return false;
    }

    // validate email format
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(contactEmail)) {
        alert("Please enter a valid email address.");
        return false;
    }

    // submit form if all validation passes
    document.getElementById("approvePublicEventForm").submit();
}