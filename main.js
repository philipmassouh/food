let tooltipsPermanent = false;

async function loadRestaurants() {
    const response = await fetch("restaurants.json");
    const restaurants = await response.json();

    const validRestaurants = restaurants.filter(
        (restaurant) => restaurant.lat && restaurant.lng,
    );

    const map = L.map("map").setView([33.9977671, -118.4748076], 10);

    L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        },
    ).addTo(map);

    function drawMarkers() {
        validRestaurants.forEach((restaurant) => {
            const marker = L.circleMarker([restaurant.lat, restaurant.lng], {
                radius: 7.5,
                fillColor: "#02C39A",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.7,
            }).addTo(map);
            marker.bindTooltip(restaurant.Name.toLowerCase(), {
                permanent: tooltipsPermanent,
                direction: "bottom",
                className: "custom-tooltip",
            });

            marker.on("click", function () {
                const modalContent = document.getElementById("modal");
                modalContent.innerHTML = buildModal(restaurant);
                const modal = document.getElementById("modal");
                modal.style.visibility = "visible";
            });
        });
    }

    drawMarkers();

    //NOTE:if loadRestaurants is called again this will have unexpected behavior
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeModal();
        }
    });

    document.getElementById("toggle-tooltips").addEventListener("click", () => {
        tooltipsPermanent = !tooltipsPermanent;
        map.eachLayer((layer) => {
            if (layer instanceof L.CircleMarker) {
                map.removeLayer(layer);
            }
        });
        drawMarkers();
    });
}

function closeModal() {
    document.getElementById("modal").style.visibility = "hidden";
}

document.body.insertAdjacentHTML(
    "beforeend",
    '<button id="toggle-tooltips" style="position: absolute; top: 10px; right: 10px; z-index: 2000;">Toggle Names</button>',
);

loadRestaurants();
