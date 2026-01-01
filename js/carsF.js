// carsF.js
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("featuredCarsContainer");

  if (!container) {
    console.error("⚠ featuredCarsContainer not found in DOM");
    return;
  }

  // 1. Get static featured cars
  let allFeaturedCars = cars.filter((car) => car.featured === true);

  // 2. Get Supabase featured cars
  try {
    const { data: supabaseFeatured, error } = await supabase
      .from("cars")
      .select("*")
      .eq("featured", true);

    if (error) throw error;

    if (supabaseFeatured) {
      // Get list of original_ids from Supabase
      const editedStaticCarIds = supabaseFeatured
        .filter((car) => car.original_id)
        .map((car) => car.original_id);

      // Filter out static cars that have been copied
      allFeaturedCars = allFeaturedCars.filter(
        (car) => !editedStaticCarIds.includes(car.id)
      );

      // Add Supabase cars
      allFeaturedCars = [...allFeaturedCars, ...supabaseFeatured];
    }
  } catch (error) {
    console.error("Error fetching Supabase featured cars:", error.message);
  }

  if (allFeaturedCars.length === 0) {
    container.innerHTML = "<p>No featured cars available right now.</p>";
    return;
  }

  container.innerHTML = ""; // Clear loader if any

  // Use DocumentFragment for better performance
  const fragment = document.createDocumentFragment();

  allFeaturedCars.forEach((car) => {
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

    // New Badge Logic
    const currentYear = new Date().getFullYear();
    const isNew = car.year >= currentYear - 1; // 2024 or newer
    const newBadge = isNew ? `<span class="status-badge new">New</span>` : "";

    card.innerHTML = `
      <div class="card-media">
        <img src="${car.images[0]}" alt="${
      car.name
    }" class="car-img" loading="lazy" />
        <div class="price-badge">${ugxPrice}</div>
        <div class="year-badge">${car.year}</div>
      </div>

      <div class="card-body">
        <h3 class="car-name">${car.name}</h3>
        
        <div class="badge-row">
          <span class="${statusClass}">${statusText}</span>
          ${newBadge}
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

    fragment.appendChild(card);
  });

  container.appendChild(fragment);
});
