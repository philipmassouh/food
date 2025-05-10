// Function to fetch the JSON file and process it
async function loadRestaurants() {
    const response = await fetch("http://localhost:8000/restaurants.json");
    const restaurants = await response.json();

    // Filter restaurants that contain lat and lng
    const validRestaurants = restaurants.filter(
        (restaurant) => restaurant.lat && restaurant.lng
    );

    // Initialize the map
    const map = L.map("map").setView([33.9977671, -118.4748076], 12);

    // Add OpenStreetMap tile layer
    L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }
    ).addTo(map);

    // Loop through the valid restaurants and add markers to the map
    validRestaurants.forEach((restaurant) => {
        const marker = L.marker([restaurant.lat, restaurant.lng]).addTo(map);

        // When marker is clicked, open modal with restaurant data
        marker.on("click", function () {
            const modalContent = document.getElementById("modal-content");
            modalContent.innerHTML = createPopup(restaurant);
            const modal = document.getElementById('modal');
            modal.style.display = 'block';
        });
    });
}

// Close modal function
function closeModal() {
    document.getElementById("modal").style.display = "none";
}

// Call the loadRestaurants function on page load
loadRestaurants();