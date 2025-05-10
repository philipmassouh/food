function createPopup(restaurant) {
    return `
    <div class="modal-dialog modal-dialog-scrollable">
        <b>${restaurant.Name}</b><br>
        <b>Type:</b> ${restaurant.Type}<br>
        <b>Patio:</b> ${restaurant.Patio ? "✅" : "❌"}<br>
        <b>Noise:</b> ${"👂".repeat(restaurant.Noise)}<br>
        <b>Chaos:</b> ${"💥".repeat(restaurant.Chaos)}<br>
        <b>Atmosphere:</b> ${"⭐️".repeat(restaurant.Atmosphere)}<br>
        <b>Service:</b> ${"⭐️".repeat(restaurant.Service)}<br>
        <b>Food:</b> ${"⭐️".repeat(restaurant.Food)}<br>
        <b>Value:</b> ${"⭐️".repeat(restaurant.Value)}<br>
        <b>Price:</b> ${"💰".repeat(restaurant.Price)}<br>
        <a href="${restaurant.Site}" target="_blank">Website</a><br>
        <a href="${restaurant.Instagram}" target="_blank">Instagram</a><br>
        <a href="${restaurant.Yelp}" target="_blank">Yelp</a><br>
        <b>Address:</b> ${restaurant.Addresses}<br>
        <b>Comments:</b> ${restaurant.Comments}
        </div>
    `;
}
