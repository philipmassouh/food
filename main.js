let tooltipsPermanent = false;
let mapFilterMode = "been";

const MAP_FILTER_MODES = ["been", "try", "both"];
const MAP_FILTER_LABELS = {
    been: "Been",
    try: "Try",
    both: "Both",
};

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
    const topControls = document.getElementById("top-controls");

    L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        },
    ).addTo(map);

    L.DomEvent.disableClickPropagation(topControls);
    L.DomEvent.disableScrollPropagation(topControls);

    function bindControlAction(buttonId, action) {
        const button = document.getElementById(buttonId);
        let lastHandledAt = 0;

        function handleControlEvent(event) {
            event.preventDefault();
            event.stopPropagation();

            const now = Date.now();
            if (now - lastHandledAt < 350) {
                return;
            }

            lastHandledAt = now;
            action();
        }

        button.addEventListener("touchend", handleControlEvent, {
            passive: false,
        });
        button.addEventListener("click", handleControlEvent);
        button.addEventListener("keydown", (event) => {
            if (event.key !== "Enter" && event.key !== " ") {
                return;
            }

            handleControlEvent(event);
        });
    }

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
                modal.classList.remove("modal-try");
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
                modal.classList.add("modal-try");
                modal.style.visibility = "visible";
            });
        });
    }

    function syncLayerVisibility() {
        const showRestaurants = mapFilterMode === "been" || mapFilterMode === "both";
        const showTrySpots = mapFilterMode === "try" || mapFilterMode === "both";

        if (showRestaurants && !map.hasLayer(restaurantLayer)) {
            restaurantLayer.addTo(map);
        }

        if (!showRestaurants && map.hasLayer(restaurantLayer)) {
            map.removeLayer(restaurantLayer);
        }

        if (showTrySpots && !map.hasLayer(tryLayer)) {
            tryLayer.addTo(map);
        }

        if (!showTrySpots && map.hasLayer(tryLayer)) {
            map.removeLayer(tryLayer);
        }
    }

    function syncFilterButton() {
        document.getElementById("toggle-try").textContent =
            MAP_FILTER_LABELS[mapFilterMode];
    }

    function cycleMapFilterMode() {
        const currentIndex = MAP_FILTER_MODES.indexOf(mapFilterMode);
        const nextIndex = (currentIndex + 1) % MAP_FILTER_MODES.length;
        mapFilterMode = MAP_FILTER_MODES[nextIndex];

        syncLayerVisibility();
        syncFilterButton();
    }

    function drawMarkers() {
        drawRestaurantMarkers();
        drawTryMarkers();
        syncLayerVisibility();
    }

    drawMarkers();
    syncFilterButton();

    //NOTE:if loadRestaurants is called again this will have unexpected behavior
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeModal();
        }
    });

    bindControlAction("toggle-tooltips", () => {
        tooltipsPermanent = !tooltipsPermanent;
        drawMarkers();
    });

    bindControlAction("toggle-try", () => {
        cycleMapFilterMode();
    });
}

function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.visibility = "hidden";
    modal.classList.remove("modal-try");
}

loadRestaurants();
