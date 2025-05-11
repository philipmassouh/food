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
    <div>
        <h4 class="display-4">${restaurant.Name}</h4>

        <div class="btn-group btn-group-lg" role="group" aria-label="Basic example">
          <button type="button" class="btn"><a href="${addressToLink(restaurant.Addresses)}" target="_blank"><i class="fa-solid fa-map"></i></i></a></button>
          <button type="button" class="btn"><a href="${restaurant.Site}" target="_blank"><i class="fa-solid fa-link"></i></a></button>
          <button type="button" class="btn"><a href="${restaurant.Instagram}" target="_blank"><i class="fa-brands fa-instagram"></i></a></button>
          <button type="button" class="btn"><a href="${restaurant.Yelp}" target="_blank"><i class="fa-brands fa-yelp"></i></a></button>
        </div>

        <table class="table table-sm">
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

        <blockquote class="blockquote">
          <p class="mb-0">${restaurant.Comments}</p>
        </blockquote>

        </div>
    `;
}
