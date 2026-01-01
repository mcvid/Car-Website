// compare.js

async function loadComparison() {
  const list = JSON.parse(localStorage.getItem("mcvid_compare") || "[]");
  if (list.length === 0) {
    document.getElementById("compareTableWrapper").innerHTML = `
            <div style="padding: 60px; text-align: center;">
                <h3>No cars selected for comparison.</h3>
                <p>Go back to the catalog and select some cars.</p>
                <a href="catalog.html" class="details-btn" style="display:inline-block; margin-top:20px;">Back to Catalog</a>
            </div>
        `;
    return;
  }

  // Fetch all needed cars
  const carsToCompare = [];
  for (const id of list) {
    let car = cars.find((c) => c.id === id);
    if (!car) {
      try {
        const { data, error } = await supabase
          .from("cars")
          .select("*")
          .eq("id", id)
          .single();
        if (data) car = data;
      } catch (e) {}
    }
    if (car) carsToCompare.push(car);
  }

  renderCompareTable(carsToCompare);
}

function renderCompareTable(carList) {
  const wrapper = document.getElementById("compareTableWrapper");

  // Cleaner, glassmorphic table construction
  let html = `<table class="compare-table">
        <thead>
            <tr>
                <th style="border-top-left-radius: 15px;">Features</th>
                ${carList
                  .map(
                    (car) => `
                    <th class="car-header-cell">
                        <div class="compare-img-box">
                            <img src="${car.images[0]}" alt="${car.name}">
                            <button class="remove-btn" onclick="removeFromCompare('${
                              car.id
                            }')" title="Remove Car">
                                <i class="ri-close-line"></i>
                            </button>
                        </div>
                        <h3>${car.name}</h3>
                        <p class="price-highlight">UGX ${car.price_ugx.toLocaleString()}</p>
                        <a href="details.html?id=${
                          car.id
                        }" class="view-btn">View</a>
                    </th>
                `
                  )
                  .join("")}
            </tr>
        </thead>
        <tbody>
    `;

  const rows = [
    { label: "Year", key: "year", icon: "ri-calendar-line" },
    { label: "Type", key: "type", icon: "ri-roadster-line" },
    { label: "Fuel", key: "fuel", icon: "ri-gas-station-line" },
    { label: "Mileage", key: "mileage", icon: "ri-road-map-line" },
    { label: "Transmission", key: "transmission", icon: "ri-settings-3-line" },
    { label: "Engine", key: "engine", icon: "ri-dashboard-3-line" },
    { label: "HP", key: "horsepower", icon: "ri-speed-up-line" },
    { label: "Seats", key: "seats", icon: "ri-user-3-line" },
    { label: "Location", key: "location", icon: "ri-map-pin-line" },
  ];

  rows.forEach((row) => {
    html += `
            <tr>
                <td class="feature-label"><i class="${row.icon}"></i> ${
      row.label
    }</td>
                ${carList
                  .map((car) => `<td>${car[row.key] || "N/A"}</td>`)
                  .join("")}
            </tr>
        `;
  });

  html += `</tbody></table>`;
  wrapper.innerHTML = html;
}

window.removeFromCompare = function (id) {
  let list = JSON.parse(localStorage.getItem("mcvid_compare") || "[]");
  list = list.filter((cid) => cid !== id);
  localStorage.setItem("mcvid_compare", JSON.stringify(list));
  loadComparison(); // Re-render
};

loadComparison();
