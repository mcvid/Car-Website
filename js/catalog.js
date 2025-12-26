// catalog.js

// catalog.js

const catalogContainer = document.getElementById("catalogContainer");
const searchInput = document.getElementById("searchInput");
const brandSelect = document.getElementById("brandSelect");
const fuelSelect = document.getElementById("fuelSelect");
const minPriceInput = document.getElementById("minPriceInput");
const maxPriceInput = document.getElementById("maxPriceInput");
const applyFiltersBtn = document.getElementById("applyFiltersBtn");

let allCarsData = []; // Store all cars here

async function loadCatalog() {
  if (!catalogContainer) return;

  // 1. Combine static cars and Supabase cars
  let initialCars = [...cars];

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
      initialCars = initialCars.filter(
        (car) => !editedStaticCarIds.includes(car.id)
      );

      // Add Supabase cars
      initialCars = [...initialCars, ...supabaseCars];
    }
  } catch (error) {
    console.error("Error fetching Supabase cars:", error.message);
  }

  // Store globally
  allCarsData = initialCars;

  // Populate dynamic filters
  populateFilters(allCarsData);

  // Initial Render
  renderCars(allCarsData);
}

// ===============================
// RENDER FUNCTION
// ===============================
function renderCars(carsToRender) {
  catalogContainer.innerHTML = "";

  if (carsToRender.length === 0) {
    catalogContainer.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666;">
        <h3>No cars found matching your criteria.</h3>
        <p>Try adjusting your filters.</p>
      </div>
    `;
    return;
  }

  carsToRender.forEach((car) => {
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

// ===============================
// FILTER LOGIC
// ===============================
function populateFilters(carList) {
  // Extract unique brands (Assuming brand is first word of name)
  const brands = new Set();
  carList.forEach((car) => {
    const brand = car.name.split(" ")[0]; // "Toyota Land Cruiser" -> "Toyota"
    if (brand) brands.add(brand);
  });

  // Populate Select
  brands.forEach((brand) => {
    const option = document.createElement("option");
    option.value = brand;
    option.textContent = brand;
    brandSelect.appendChild(option);
  });
}

function filterCars() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const selectedBrand = brandSelect.value;
  const selectedFuel = fuelSelect.value;
  const minPrice = parseFloat(minPriceInput.value) || 0;
  const maxPrice = parseFloat(maxPriceInput.value) || Infinity;

  const filtered = allCarsData.filter((car) => {
    // Search (Name or Type)
    const matchesSearch =
      car.name.toLowerCase().includes(searchTerm) ||
      (car.type && car.type.toLowerCase().includes(searchTerm));

    // Brand
    const carBrand = car.name.split(" ")[0];
    const matchesBrand = selectedBrand === "" || carBrand === selectedBrand;

    // Fuel
    const matchesFuel =
      selectedFuel === "" || (car.fuel && car.fuel.includes(selectedFuel));

    // Price
    const matchesPrice = car.price_ugx >= minPrice && car.price_ugx <= maxPrice;

    return matchesSearch && matchesBrand && matchesFuel && matchesPrice;
  });

  renderCars(filtered);
}

// Event Listeners
if (applyFiltersBtn) {
  applyFiltersBtn.addEventListener("click", filterCars);
}

// Optional: Filter on Enter key for inputs
const inputs = [searchInput, minPriceInput, maxPriceInput];
inputs.forEach((input) => {
  if (input) {
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") filterCars();
    });
  }
});

// Initial load
loadCatalog();
