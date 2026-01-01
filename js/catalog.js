// catalog.js

// catalog.js

const catalogContainer = document.getElementById("catalogContainer");
const searchInput = document.getElementById("searchInput");
const brandSelect = document.getElementById("brandSelect");
const fuelSelect = document.getElementById("fuelSelect");
const priceRange = document.getElementById("priceRange");
const priceValue = document.getElementById("priceValue");
const wishlistFilter = document.getElementById("wishlistFilter");
const applyFiltersBtn = document.getElementById("applyFiltersBtn");

// 11. DEBOUNCE UTILITY
function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

const debouncedFilter = debounce(() => filterCars());

// Update price display on slide
if (priceRange) {
  priceRange.oninput = function () {
    const val = parseInt(this.value);
    if (val >= 500000000) {
      priceValue.textContent = "Any";
    } else {
      priceValue.textContent = (val / 1000000).toFixed(0) + "M+";
    }
    debouncedFilter(); // Optimized live update
  };
}

// Wishlist filter update
if (wishlistFilter) {
  wishlistFilter.onchange = filterCars;
}

// Add debouncing to select filters for better performance
if (brandSelect) {
  brandSelect.onchange = debouncedFilter;
}
if (fuelSelect) {
  fuelSelect.onchange = debouncedFilter;
}

async function loadCatalog() {
  if (!catalogContainer) return;
  let initialCars = [...cars];
  try {
    const { data: supabaseCars, error } = await supabase
      .from("cars")
      .select("*");
    if (error) throw error;
    if (supabaseCars) {
      const editedStaticCarIds = supabaseCars
        .filter((car) => car.original_id)
        .map((car) => car.original_id);
      initialCars = initialCars.filter(
        (car) => !editedStaticCarIds.includes(car.id)
      );
      initialCars = [...initialCars, ...supabaseCars];
    }
  } catch (error) {
    console.error("Error fetching Supabase cars:", error.message);
  }
  allCarsData = initialCars;
  populateFilters(allCarsData);
  renderCars(allCarsData);
}

function renderCars(carsToRender) {
  catalogContainer.innerHTML = "";
  if (carsToRender.length === 0) {
    catalogContainer.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666;"><h3>No cars found.</h3><p>Try adjusting your filters.</p></div>`;
    return;
  }

  // Use DocumentFragment for better performance
  const fragment = document.createDocumentFragment();

  carsToRender.forEach((car) => {
    const card = document.createElement("div");
    card.classList.add("car-card");
    const ugxPrice = `${car.price_ugx.toLocaleString()} UGX`;
    const fuel = car.fuel || "N/A";
    const mileage = car.mileage || "0 km";
    const transmission = car.transmission || "Auto";
    const isSold = car.status === "sold";
    const statusText = isSold ? "Sold" : "Available";
    const statusClass = isSold ? "status-badge sold" : "status-badge";

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
          <span class="type-badge">${car.body_type || car.type || "SUV"}</span>
        </div>
        <div class="card-specs">
          <div class="spec-item"><i class="ri-gas-station-line"></i><span>${fuel}</span></div>
          <div class="spec-item"><i class="ri-road-map-line"></i><span>${mileage}</span></div>
          <div class="spec-item"><i class="ri-settings-3-line"></i><span>${transmission}</span></div>
        </div>
        <a href="details.html?id=${car.id}" class="details-btn">View Details</a>
      </div>
    `;
    fragment.appendChild(card);
  });

  catalogContainer.appendChild(fragment);
}

function populateFilters(carList) {
  const brands = new Set();
  carList.forEach((car) => {
    const brand = car.name.split(" ")[0];
    if (brand) brands.add(brand);
  });
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
  const maxPrice = parseInt(priceRange.value) || Infinity;
  const showFavorites = wishlistFilter.checked;
  const wishlist = JSON.parse(localStorage.getItem("mcvid_wishlist") || "[]");

  const filtered = allCarsData.filter((car) => {
    const matchesSearch =
      car.name.toLowerCase().includes(searchTerm) ||
      (car.type && car.type.toLowerCase().includes(searchTerm));
    const carBrand = car.name.split(" ")[0];
    const matchesBrand = selectedBrand === "" || carBrand === selectedBrand;
    const matchesFuel =
      selectedFuel === "" || (car.fuel && car.fuel.includes(selectedFuel));
    const matchesPrice = car.price_ugx <= maxPrice;
    const matchesWishlist =
      !showFavorites || wishlist.includes(car.id.toString());

    return (
      matchesSearch &&
      matchesBrand &&
      matchesFuel &&
      matchesPrice &&
      matchesWishlist
    );
  });

  renderCars(filtered);
}

if (applyFiltersBtn) {
  applyFiltersBtn.addEventListener("click", filterCars);
}

const inputs = [searchInput];
inputs.forEach((input) => {
  if (input) {
    input.addEventListener("input", debouncedFilter);
  }
});

loadCatalog();
