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
            <tr>
                <td><b>Website:</b></td>
                <td><a href="${restaurant.Site}" target="_blank">${restaurant.Site}</a></td>
            </tr>
            <tr>
                <td><b>Instagram:</b></td>
                <td><a href="${restaurant.Instagram}" target="_blank">${restaurant.Instagram}</a></td>
            </tr>
            <tr>
                <td><b>Yelp:</b></td>
                <td><a href="${restaurant.Yelp}" target="_blank">${restaurant.Yelp}</a></td>
            </tr>
            <tr>
                <td><b>Address:</b></td>
                <td>${restaurant.Addresses}</td>
            </tr>
        </table>
        <b>Comments:</b> ${restaurant.Comments}
        </div>
    `;
}
