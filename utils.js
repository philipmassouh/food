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

function buildButtons(restaurant) {
    return `
        <div><button type="button" class="link-btn" id="close-btn" onclick="closeModal()">  <i id="close-icon" class="fa-solid fa-xmark">       </i></button></div>
        <div><button type="button" class="link-btn"><a href="${restaurant.Site}"                     target="_blank"><i class="fa-solid  fa-link">      </i></a></button></div>
        <div><button type="button" class="link-btn"><a href="${restaurant.Instagram}"                target="_blank"><i class="fa-brands fa-instagram"> </i></a></button></div>
        <div><button type="button" class="link-btn"><a href="${restaurant.Yelp}"                     target="_blank"><i class="fa-brands fa-yelp">      </i></a></button></div>
        `;
}

function buildTags(restaurant) {
    return `
        ${restaurant.Tags.map((tag) => `<span class="modal-tag">${tag}</span>`).join("")}
    `;
}

function buildTable(restaurant) {
    return `
        <table id="modal-table">
            <tr><td>Patio      </td><td>${restaurant.Patio ? "✅" : "❌"}           </td></tr>
            <tr><td>Noise      </td><td>${scoreToEmoji(restaurant.Noise, "👂")}     </td></tr>
            <tr><td>Chaos      </td><td>${scoreToEmoji(restaurant.Chaos, "💥")}     </td></tr>
            <tr><td>Atmosphere </td><td>${scoreToEmoji(restaurant.Atmosphere, "⛩️")}</td></tr>
            <tr><td>Service    </td><td>${scoreToEmoji(restaurant.Service, "😌")}   </td></tr>
            <tr><td>Food       </td><td>${scoreToEmoji(restaurant.Food, "🧑‍🍳")}      </td></tr>
            <tr><td>Value      </td><td>${scoreToEmoji(restaurant.Value, "⭐️")}     </td></tr>
            <tr><td>Price      </td><td>${scoreToEmoji(restaurant.Price, "💰")}     </td></tr>
        </table>
    `;
}

function buildModal(restaurant) {
    return `
        <div id="modal-left">
            <div id="modal-title">
                ${restaurant.Name}
            </div>
            <div id="modal-tags">
                ${buildTags(restaurant)}
            </div>
            <div id="modal-table">
                ${buildTable(restaurant)}
            </div>
            <div id="modal-address">
                <a href="${addressToLink(restaurant.Addresses)}" target="_blank">${restaurant.Addresses}</a>
            </div>
            <div id="modal-quote">
                ${restaurant.Comments}
            </div>
        </div>
        <div id="modal-right">
            ${buildButtons(restaurant)}
        </div>
    `;
}
