// initMap and Geocode are functions strictly for the
function initMap() {}

function geocode(location, latElement, lngElement) {
    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: location.value }, function (results, status) {
        
        if (status === "OK") {
            var location = results[0].geometry.location;

            latElement.value = location.lat();
            lngElement.value = location.lng();
        } else {
            alert("Geocoding failed: " + status);
        }
    });
}
