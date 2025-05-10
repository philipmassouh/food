function addressToLink(address) {
    const query = encodeURIComponent(address);
    link = `https://www.google.com/maps/search/?api=1&query=${query}`;
    return link;
}

function scoreToEmoji(score, emoji) {
    if (score === 0) {
        return "🚫";
    }
    return emoji.repeat(score);
}

function createPopup(restaurant) {
    return `
    <div class="modal-dialog modal-dialog-scrollable">
        <h2>${restaurant.Name}</h2><br>
        <a href="${addressToLink(restaurant.Addresses)}" target="_blank">${restaurant.Addresses}</a>

        <a href="${restaurant.Site}" target="_blank">Website</a>
        <a href="${restaurant.Instagram}" target="_blank">Instagram</a>
        <a href="${restaurant.Yelp}" target="_blank">Yelp</a>
        <table>
            <tr>
                <td><b>Patio:</b></td>
                <td>${restaurant.Patio ? "✅" : "❌"}</td>
            </tr>
            <tr>
                <td><b>Noise:</b></td>
                <td>${scoreToEmoji(restaurant.Noise, "👂")}</td>
            </tr>
            <tr>
                <td><b>Chaos:</b></td>
                <td>${scoreToEmoji(restaurant.Chaos, "💥")}</td>
            </tr>
            <tr>
                <td><b>Atmosphere:</b></td>
                <td>${scoreToEmoji(restaurant.Atmosphere, "⭐️")}</td>
            </tr>
            <tr>
                <td><b>Service:</b></td>
                <td>${scoreToEmoji(restaurant.Service, "⭐️")}</td>
            </tr>
            <tr>
                <td><b>Food:</b></td>
                <td>${scoreToEmoji(restaurant.Food, "⭐️")}</td>
            </tr>
            <tr>
                <td><b>Value:</b></td>
                <td>${scoreToEmoji(restaurant.Value, "⭐️")}</td>
            </tr>
            <tr>
                <td><b>Price:</b></td>
                <td>${scoreToEmoji(restaurant.Price, "💰")}</td>
            </tr>
        </table>
        <b>Comments:</b> ${restaurant.Comments}
        </div>
    `;
}
