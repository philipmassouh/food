function createPopup(restaurant) {
    return `
        <b>${restaurant.Name}</b><br>
        <b>Type:</b> ${restaurant.Type}<br>
        <b>Patio:</b> ${restaurant.Patio ? "Yes" : "No"}<br>
        <b>Noise:</b> ${restaurant.Noise}<br>
        <b>Chaos:</b> ${restaurant.Chaos}<br>
        <b>Atmosphere:</b> ${restaurant.Atmosphere}<br>
        <b>Service:</b> ${restaurant.Service}<br>
        <b>Food:</b> ${restaurant.Food}<br>
        <b>Price:</b> ${restaurant.Price}<br>
        <b>Value:</b> ${restaurant.Value}<br>
        <a href="${restaurant.Site}" target="_blank">Website</a><br>
        <a href="${restaurant.Instagram}" target="_blank">Instagram</a><br>
        <a href="${restaurant.Yelp}" target="_blank">Yelp</a><br>
        <b>Address:</b> ${restaurant.Addresses}<br>
        <b>Comments:</b> ${restaurant.Comments}
    `;
}