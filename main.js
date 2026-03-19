let tooltipsPermanent = false;
let trySpotsVisible = false;

async function loadRestaurants() {
    const [restaurantsResponse, tryResponse] = await Promise.all([
        fetch("restaurants.json"),
        fetch("try.json"),
    ]);
    const [restaurants, trySpots] = await Promise.all([
        restaurantsResponse.json(),
        tryResponse.json(),
    ]);

    function hasCoordinates(place) {
        return Number.isFinite(place.lat) && Number.isFinite(place.lng);
    }

    const validRestaurants = restaurants.filter(hasCoordinates);
    const validTrySpots = trySpots.filter(hasCoordinates);

    const map = L.map("map").setView([33.9977671, -118.4748076], 10);
    const restaurantLayer = L.layerGroup().addTo(map);
    const tryLayer = L.layerGroup();

    L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        },
    ).addTo(map);

    function buildTryIcon() {
        return L.divIcon({
            className: "try-marker",
            html: '<div class="try-marker-question">?</div>',
            iconSize: [24, 24],
            iconAnchor: [12, 12],
        });
    }

    function drawRestaurantMarkers() {
        restaurantLayer.clearLayers();

        validRestaurants.forEach((restaurant) => {
            const marker = L.circleMarker([restaurant.lat, restaurant.lng], {
                radius: 7.5,
                fillColor: "transparent",
                color: "#00a896",
                weight: 2,
                opacity: 1,
                fillOpacity: 1.0,
            }).addTo(restaurantLayer);
            marker.bindTooltip(restaurant.Name.toLowerCase(), {
                permanent: tooltipsPermanent,
                direction: "bottom",
                className: "custom-tooltip",
            });

            marker.on("click", function () {
                const modalContent = document.getElementById("modal");
                modalContent.innerHTML = buildRestaurantModal(restaurant);
                const modal = document.getElementById("modal");
                modal.style.visibility = "visible";
            });
        });
    }

    function drawTryMarkers() {
        tryLayer.clearLayers();

        validTrySpots.forEach((spot) => {
            const marker = L.marker([spot.lat, spot.lng], {
                icon: buildTryIcon(),
            }).addTo(tryLayer);

            marker.bindTooltip(spot.Name.toLowerCase(), {
                permanent: tooltipsPermanent,
                direction: "bottom",
                className: "custom-tooltip",
            });

            marker.on("click", function () {
                const modalContent = document.getElementById("modal");
                modalContent.innerHTML = buildTryModal(spot);
                const modal = document.getElementById("modal");
                modal.style.visibility = "visible";
            });
        });
    }

    function syncTryLayer() {
        if (trySpotsVisible) {
            if (!map.hasLayer(tryLayer)) {
                tryLayer.addTo(map);
            }
            return;
        }

        if (map.hasLayer(tryLayer)) {
            map.removeLayer(tryLayer);
        }
    }

    function drawMarkers() {
        drawRestaurantMarkers();
        drawTryMarkers();
        syncTryLayer();
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
        drawMarkers();
    });

    document.getElementById("toggle-try").addEventListener("click", () => {
        trySpotsVisible = !trySpotsVisible;
        syncTryLayer();
    });
}

function closeModal() {
    document.getElementById("modal").style.visibility = "hidden";
}

loadRestaurants();
