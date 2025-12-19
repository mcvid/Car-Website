// catalog.js

const catalogContainer = document.getElementById("catalogContainer");

async function loadCatalog() {
  if (!catalogContainer) return;

  // 1. Clear container
  catalogContainer.innerHTML = "";

  // 2. Combine static cars and Supabase cars
  let allCars = [...cars];

  try {
    const { data: supabaseCars, error } = await supabase
      .from("cars")
      .select("*");

    if (error) throw error;

    if (supabaseCars) {
      // Get list of original_ids from Supabase (these are static cars that have been edited)
      const editedStaticCarIds = supabaseCars
        .filter((car) => car.original_id)
        .map((car) => car.original_id);

      // Filter out static cars that have been copied to Supabase
      allCars = allCars.filter((car) => !editedStaticCarIds.includes(car.id));

      // Add Supabase cars
      allCars = [...allCars, ...supabaseCars];
    }
  } catch (error) {
    console.error("Error fetching Supabase cars:", error.message);
  }

  // 3. Render all cars
  allCars.forEach((car) => {
    const card = document.createElement("div");
    card.classList.add("car-card");

    // Format price and specs
    const ugxPrice = `${car.price_ugx.toLocaleString()} UGX`;
    const fuel = car.fuel || "N/A";
    const mileage = car.mileage || "0 km";
    const transmission = car.transmission || "Auto";

    // Determine status
    const isSold = car.status === "sold";
    const statusText = isSold ? "Sold" : "Available";
    const statusClass = isSold ? "status-badge sold" : "status-badge";

    card.innerHTML = `
      <div class="card-media">
        <img src="${car.images[0]}" alt="${car.name}" class="car-img" />
        <div class="price-badge">${ugxPrice}</div>
        <div class="year-badge">${car.year}</div>
      </div>

      <div class="card-body">
        <h3 class="car-name">${car.name}</h3>
        
        <div class="badge-row">
          <span class="${statusClass}">${statusText}</span>
          <span class="type-badge">${car.body_type || car.type || "SUV"}</span>
        </div>

        <div class="card-specs">
          <div class="spec-item">
            <i class="ri-gas-station-line"></i>
            <span>${fuel}</span>
          </div>
          <div class="spec-item">
            <i class="ri-road-map-line"></i>
            <span>${mileage}</span>
          </div>
          <div class="spec-item">
            <i class="ri-settings-3-line"></i>
            <span>${transmission}</span>
          </div>
        </div>

        <a href="details.html?id=${car.id}" class="details-btn">View Details</a>
      </div>
    `;

    catalogContainer.appendChild(card);
  });
}

// Initial load
loadCatalog();
