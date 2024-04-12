let map;

window.initMap = async function() {
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    center: { lat: -1.286389, lng: 36.817223 },
    zoom: 8,
  });
  
    // Add event listener for search button
    document.getElementById("search-button").addEventListener("click", () => {
      const locationInput = document.getElementById("location-input").value;
      searchLocation(locationInput);
    });
  
    // Function to search for a location
    function searchLocation(location) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: location }, (results, status) => {
        if (status === "OK") {
          const resultLocation = results[0].geometry.location;
          map.setCenter(resultLocation);
          displayCoordinates(resultLocation.lat(), resultLocation.lng());
        } else if (status === "ZERO_RESULTS") {
            alert("No results found for the provided location.");
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
      });
    }
  
    // Add click event listener to map
    map.addListener("click", (event) => {
      const latitude = event.latLng.lat();
      const longitude = event.latLng.lng();
      displayCoordinates(latitude, longitude);
    });
  
    // Enable drawing manager for polygons
    const drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: false,
    });
    drawingManager.setMap(map);
  
    // Add event listener for polygon completion
    google.maps.event.addListener(drawingManager, "overlaycomplete", (event) => {
      if (event.type === google.maps.drawing.OverlayType.POLYGON) {
        const polygon = event.overlay;
        calculateArea(polygon.getPath().getArray());
        // Remove the polygon after calculation (optional)
        polygon.setMap(null);
      }
    });
  
    // Form submission for distance calculation
    const distanceForm = document.getElementById("distance-form");
    distanceForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const point1Lat = parseFloat(document.getElementById("point1-lat").value);
      const point1Lng = parseFloat(document.getElementById("point1-lng").value);
      const point2Lat = parseFloat(document.getElementById("point2-lat").value);
      const point2Lng = parseFloat(document.getElementById("point2-lng").value);
      const distance = calculateDistance(
        point1Lat,
        point1Lng,
        point2Lat,
        point2Lng
      );
      document.getElementById(
        "distance-value"
      ).textContent = `Distance: ${distance.toFixed(2)} kilometers`;
    });
  
    // Function to display latitude and longitude
    function displayCoordinates(latitude, longitude) {
      document.getElementById(
        "latitude"
      ).textContent = `Latitude: ${latitude.toFixed(6)}`;
      document.getElementById(
        "longitude"
      ).textContent = `Longitude: ${longitude.toFixed(6)}`;
    }
  
    // Function to calculate distance between two points using Haversine formula
    function calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6378137; // Earth’s mean radius in kilometers
      const dLat = rad(lat2 - lat1);
      const dLong = rad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(lat1)) *
          Math.cos(rad(lat2)) *
          Math.sin(dLong / 2) *
          Math.sin(dLong / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = R * c;
      return d; // returns the distance in kilometers
    }
  
    // Function to convert degrees to radians
    function rad(x) {
      return (x * Math.PI) / 180;
    }
  
    // Function to calculate area of a polygon
    function calculateArea(coordinates) {
      const area = google.maps.geometry.spherical.computeArea(coordinates);
      const areaInSquareKm = area / 1000000; // Convert area to square kilometers
      document.getElementById("area-value").textContent = `Area: ${areaInSquareKm.toFixed(2)} square kilometers`;
    }
  }
