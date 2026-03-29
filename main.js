let tooltipsPermanent = false;
let mapFilterMode = "been";

const MAP_FILTER_MODES = ["been", "try", "both"];

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

    const controls = document.getElementById("map-controls");
    L.DomEvent.disableClickPropagation(controls);
    L.DomEvent.disableScrollPropagation(controls);

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
                className: "map-tooltip",
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
                className: "map-tooltip",
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

    function setMapFilterMode(nextMode) {
        if (!MAP_FILTER_MODES.includes(nextMode)) {
            return;
        }

        mapFilterMode = nextMode;
        syncLayerVisibility();
        syncFilterControls();
    }

    function syncFilterControls() {
        const tooltipButton = document.getElementById("toggle-tooltips");
        tooltipButton.classList.toggle("is-active", tooltipsPermanent);
        tooltipButton.setAttribute("aria-pressed", String(tooltipsPermanent));

        MAP_FILTER_MODES.forEach((mode) => {
            const button = document.getElementById(`filter-${mode}`);
            const isActive = mode === mapFilterMode;

            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });
    }

    function drawMarkers() {
        drawRestaurantMarkers();
        drawTryMarkers();
        syncLayerVisibility();
    }

    drawMarkers();
    syncFilterControls();

    //NOTE:if loadRestaurants is called again this will have unexpected behavior
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeModal();
        }
    });

    document.getElementById("toggle-tooltips").addEventListener("click", () => {
        tooltipsPermanent = !tooltipsPermanent;
        drawMarkers();
        syncFilterControls();
    });

    MAP_FILTER_MODES.forEach((mode) => {
        document.getElementById(`filter-${mode}`).addEventListener("click", () => {
            setMapFilterMode(mode);
        });
    });
}

function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.visibility = "hidden";
    modal.classList.remove("modal-try");
}

loadRestaurants();
