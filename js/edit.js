// edit.js - Car editing functionality

const editGrid = document.getElementById("editGrid");
const searchInput = document.getElementById("searchInput");
const noResults = document.getElementById("noResults");

let allCars = [];

// Load all cars
async function loadAllCars() {
  editGrid.innerHTML =
    "<p style='text-align: center; padding: 40px;'>Loading cars...</p>";

  // Combine static and Supabase cars
  allCars = [...cars];

  try {
    const { data: supabaseCars, error } = await supabase
      .from("cars")
      .select("*");

    if (error) throw error;

    if (supabaseCars) {
      // Get list of original_ids from Supabase
      const editedStaticCarIds = supabaseCars
        .filter((car) => car.original_id)
        .map((car) => car.original_id);

      // Filter out static cars that have been copied
      allCars = allCars.filter((car) => !editedStaticCarIds.includes(car.id));

      // Add Supabase cars
      allCars = [...allCars, ...supabaseCars];
    }
  } catch (error) {
    console.error("Error fetching cars:", error.message);
  }

  renderCars(allCars);
}

// Render cars to grid
function renderCars(carsToRender) {
  editGrid.innerHTML = "";

  if (carsToRender.length === 0) {
    noResults.style.display = "block";
    return;
  }

  noResults.style.display = "none";

  carsToRender.forEach((car) => {
    const card = document.createElement("div");
    card.className = "edit-car-card";
    card.dataset.carId = car.id;

    const ugxPrice = `${car.price_ugx.toLocaleString()} UGX`;
    const fuel = car.fuel || "Petrol";
    const mileage = car.mileage || "0 km";
    const transmission = car.transmission || "Auto";
    const bodyType = car.body_type || car.type || "SUV";

    // Determine availability status
    const isAvailable = car.status !== "sold";
    const statusText = isAvailable ? "Available" : "Sold";
    const statusClass = isAvailable
      ? "edit-status-badge"
      : "edit-status-badge sold";

    card.innerHTML = `
      <div class="edit-card-image">
        <img src="${car.images[0]}" alt="${car.name}" />
        <div class="edit-price-badge">${ugxPrice}</div>
        <div class="edit-year-badge">${car.year}</div>
      </div>

      <div class="edit-card-body">
        <h3 class="edit-car-title">${car.name}</h3>
        
        <div class="edit-badges">
          <span class="${statusClass}">${statusText}</span>
          <span class="edit-type-badge">${bodyType}</span>
        </div>

        <div class="edit-specs">
          <div class="edit-spec-item">
            <i class="ri-gas-station-line"></i>
            <span>${fuel}</span>
          </div>
          <div class="edit-spec-item">
            <i class="ri-road-map-line"></i>
            <span>${mileage}</span>
          </div>
          <div class="edit-spec-item">
            <i class="ri-settings-3-line"></i>
            <span>${transmission}</span>
          </div>
        </div>

        <div class="edit-actions">
          <button class="edit-btn btn-edit" onclick="editCar('${car.id}')">
            Edit
          </button>
          <button class="edit-btn btn-delete" onclick="deleteCar('${
            car.id
          }', '${car.name}')">
            Delete
          </button>
          <button class="edit-btn ${
            isAvailable ? "btn-available" : "btn-sold"
          }" onclick="toggleAvailability('${car.id}', ${!isAvailable})">
            ${statusText}
          </button>
        </div>
      </div>
    `;

    editGrid.appendChild(card);
  });
}

// Search functionality
searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();

  const filtered = allCars.filter((car) => {
    const name = (car.name || "").toLowerCase();
    const brand = (car.brand || "").toLowerCase();
    const year = (car.year || "").toString();
    const color = (car.color || "").toLowerCase();
    const bodyType = (car.body_type || car.type || "").toLowerCase();

    return (
      name.includes(searchTerm) ||
      brand.includes(searchTerm) ||
      year.includes(searchTerm) ||
      color.includes(searchTerm) ||
      bodyType.includes(searchTerm)
    );
  });

  renderCars(filtered);
});

// Edit car function
function editCar(carId) {
  // Redirect to edit-car page with car ID
  window.location.href = `edit-car.html?id=${carId}`;
}

// Delete car function
async function deleteCar(carId, carName) {
  if (!confirm(`Are you sure you want to delete "${carName}"?`)) {
    return;
  }

  try {
    // Check if it's a Supabase car (has UUID format)
    const isSupabaseCar = carId.includes("-");

    if (isSupabaseCar) {
      const { error } = await supabase.from("cars").delete().eq("id", carId);

      if (error) throw error;

      alert("Car deleted successfully!");
      loadAllCars(); // Reload the list
    } else {
      alert("Cannot delete static cars. Only Supabase cars can be deleted.");
    }
  } catch (error) {
    console.error("Error deleting car:", error.message);
    alert("Error deleting car: " + error.message);
  }
}

// Toggle availability function
async function toggleAvailability(carId, makeAvailable) {
  try {
    const newStatus = makeAvailable ? null : "sold";

    const { error } = await supabase
      .from("cars")
      .update({ status: newStatus })
      .eq("id", carId);

    if (error) throw error;

    // Reload the list to show updated status
    loadAllCars();
  } catch (error) {
    console.error("Error updating availability:", error.message);
    alert("Error updating availability: " + error.message);
  }
}

// Initial load
loadAllCars();
