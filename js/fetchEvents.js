let events;

function fetchEvents() {
    // call read user cookie to determine if user is allowed to access this api or not
    readUserCookie();
    let tmp = {
        universityid: universityId,
    };

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + "/FetchAllEvents." + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    try {
        xhr.onreadystatechange = function () {
            if (this.status === 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                events = jsonObject;
                displayEvents();
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
        return;
    }
}

function createEventCard(event) {
    return `
        <div class="col-md-6 col-lg-4 mb-5">
            <div class="card h-100">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${event.name}</h5>
                    <p class="card-text mb-1">${event.date} ${event.start_time}</p>
                    <p class="card-text mb-1">${event.location}</p>
                    <p class="card-text mb-4">${event.description}</p>
                    <div class="mt-auto">
                        <button type="button" class="btn btn-primary" onclick="loadEventDetails('${event.id}')">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function displayEvents() {
    const eventsContainer = document.getElementById("eventsContainer");
    const pageSize = 7;
    const totalPages = Math.ceil(events.length / pageSize);

    // Function to display events for a specific page
    function displayEventsForPage(page) {
        const startIndex = (page - 1) * pageSize;
        eventsContainer.innerHTML = "";

        for (
            let i = startIndex;
            i < Math.min(startIndex + pageSize, events.length);
            i++
        ) {
            eventsContainer.innerHTML += createEventCard(events[i]);
        }
    }

    // Display the first page of events
    displayEventsForPage(1);

    // Remove previous pagination container if it exists
    const existingPaginationContainer = document.getElementById(
        "paginationContainer"
    );
    if (existingPaginationContainer) {
        existingPaginationContainer.remove();
    }

    // Add pagination buttons if necessary
    if (totalPages > 1) {
        const paginationContainer = createPaginationButtons(
            totalPages,
            displayEventsForPage
        );
        paginationContainer.setAttribute("id", "paginationContainer"); // Assign an ID to the pagination container
        document.body.appendChild(paginationContainer);
    }
}

function createPaginationButtons(totalPages, onPageClick) {
    const paginationContainer = document.createElement("div");
    paginationContainer.classList.add(
        "d-flex",
        "justify-content-center",
        "my-4"
    );

    for (let i = 1; i <= totalPages; i++) {
        const paginationButton = document.createElement("button");
        paginationButton.classList.add("btn", "btn-secondary", "mx-2");
        paginationButton.textContent = i;
        paginationButton.addEventListener("click", () => {
            onPageClick(i);
        });

        paginationContainer.appendChild(paginationButton);
    }

    return paginationContainer;
}

function loadEventDetails(eventID) {
    // Assuming you have an array of events like this:
    // const events = [ { id: 1, name: 'Event 1', ... }, { id: 2, name: 'Event 2', ... }, ... ];

    eventID = parseInt(eventID);
    // Find the event in the events array
    const event = events.find((e) => e.id === eventID);

    // Find and store the elements to be updated
    const modalTitle = document.getElementById("eventDetailsModalLabel");
    const eventName = document.getElementById("eventDetailsName");
    const eventDateTime = document.getElementById("eventDetailsDate");
    const eventLocation = document.getElementById("eventDetailsLocation");
    const eventDescription = document.getElementById("eventDetailsDescription");
    const eventPhone = document.getElementById("eventDetailsPhone");
    const eventEmail = document.getElementById("eventDetailsEmail");
    const eventCategory = document.getElementById("eventDetailsCategory");
    const eventIframe = document.getElementById("eventDetailsMap");

    // Update the modal with the event data
    modalTitle.value = event.name;
    eventName.textContent = event.name;

    const formattedDate = convertDateFormat(event.date);
    const startTime12Hour = convertTo12Hour(event.start_time);
    const endTime12Hour = convertTo12Hour(event.end_time);
    eventDateTime.textContent = `${formattedDate} ${startTime12Hour} - ${endTime12Hour}`;

    eventLocation.textContent = event.location;
    eventDescription.textContent = event.description;
    eventPhone.innerHTML = `${event.contact_phone}`;
    eventEmail.innerHTML = `${event.contact_email}`;
    eventCategory.textContent = event.category;

    const mapOptions = {
        zoom: 14,
        center: new google.maps.LatLng(event.latitude, event.longitude),
    };
    const map = new google.maps.Map(eventIframe, mapOptions);
    const marker = new google.maps.Marker({
        position: new google.maps.LatLng(event.latitude, event.longitude),
        map: map,
    });

    // Open the modal using JavaScript
    const eventDetailsModal = new bootstrap.Modal(
        document.getElementById("eventDetailsModal")
    );
    eventDetailsModal.show();
}

function convertTo12Hour(time) {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "pm" : "am";
    const hour12 = hour % 12 || 12;

    return `${hour12}:${minutes} ${ampm}`;
}

function convertDateFormat(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${month}/${day}/${year}`;
}

document.addEventListener("DOMContentLoaded", function () {
    fetchEvents();
});
