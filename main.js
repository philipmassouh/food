async function loadRestaurants() {
    const response = await fetch("http://localhost:8000/restaurants.json");
    const restaurants = await response.json();

    const validRestaurants = restaurants.filter(
        (restaurant) => restaurant.lat && restaurant.lng,
    );

    const map = L.map("map").setView([33.9977671, -118.4748076], 12);

    L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        },
    ).addTo(map);

    validRestaurants.forEach((restaurant) => {
        const marker = L.marker([restaurant.lat, restaurant.lng]).addTo(map);

        marker.on("click", function () {
            const modalContent = document.getElementById("modal-content");
            modalContent.innerHTML = createPopup(restaurant);
            const modal = document.getElementById("modal");
            modal.style.display = "block";
        });
    });
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

loadRestaurants();
