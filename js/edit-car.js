// edit-car.js - Load and update specific car (ALL CARS EDITABLE)

const updateForm = document.getElementById("updateForm");
const updateBtn = document.getElementById("updateBtn");
const successAlert = document.getElementById("successAlert");

let currentCarId = null;
let currentCar = null;

// Supabase is already initialized globally in js/supabase.js
// We'll use the global 'supabase' variable directly

// Get car ID from URL
const urlParams = new URLSearchParams(window.location.search);
currentCarId = urlParams.get("id");

if (!currentCarId) {
  alert("No car ID provided!");
  window.location.href = "edit.html";
}

// Load car data
async function loadCarData() {
  if (!supabase) {
    alert("Supabase not initialized. Please refresh the page.");
    return;
  }

  try {
    // First check static cars
    const staticCar = cars.find((car) => car.id === currentCarId);

    if (staticCar) {
      currentCar = staticCar;
      populateForm(staticCar);
      return;
    }

    // Check Supabase
    const { data, error } = await supabase
      .from("cars")
      .select("*")
      .eq("id", currentCarId)
      .single();

    if (error) throw error;

    if (data) {
      currentCar = data;
      populateForm(data);
    } else {
      alert("Car not found!");
      window.location.href = "edit.html";
    }
  } catch (error) {
    console.error("Error loading car:", error.message);
    alert("Error loading car data: " + error.message);
  }
}

// Populate form with car data
function populateForm(car) {
  console.log("populateForm called with:", car);
  console.log("Form elements exist:", {
    carName: !!document.getElementById("carName"),
    brand: !!document.getElementById("brand"),
    priceUsd: !!document.getElementById("priceUsd"),
  });

  document.getElementById("carName").value = car.name || "";
  document.getElementById("brand").value = car.brand || "";
  document.getElementById("priceUsd").value = car.price_usd || "";
  document.getElementById("priceUgx").value = car.price_ugx || "";
  document.getElementById("year").value = car.year || "";
  document.getElementById("engine").value = car.engine || "";
  document.getElementById("horsepower").value = car.horsepower || "";
  document.getElementById("fuel").value = car.fuel || "";
  document.getElementById("consumption").value = car.fuel_consumption || "";
  document.getElementById("transmission").value = car.transmission || "";
  document.getElementById("seats").value = car.seats || "";
  document.getElementById("mileage").value = car.mileage || "";
  document.getElementById("condition").value = car.condition || "";
  document.getElementById("color").value = car.color || "";
  document.getElementById("location").value = car.location || "";
  document.getElementById("bodyType").value = car.body_type || car.type || "";

  // Features
  if (car.features && Array.isArray(car.features)) {
    document.getElementById("features").value = car.features.join(", ");
  }

  // Featured checkbox
  document.getElementById("featured").checked = car.featured || false;
}

// Handle form submission
updateForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  updateBtn.disabled = true;
  updateBtn.textContent = "Updating...";

  try {
    // Collect features
    const features = document
      .getElementById("features")
      .value.split(",")
      .map((f) => f.trim())
      .filter((f) => f !== "");

    // Prepare updated data
    const updatedData = {
      name: document.getElementById("carName").value,
      brand: document.getElementById("brand").value,
      price_usd: parseFloat(document.getElementById("priceUsd").value),
      price_ugx: parseFloat(document.getElementById("priceUgx").value),
      year: parseInt(document.getElementById("year").value),
      engine: document.getElementById("engine").value,
      horsepower: document.getElementById("horsepower").value,
      fuel: document.getElementById("fuel").value,
      fuel_consumption: document.getElementById("consumption").value,
      transmission: document.getElementById("transmission").value,
      seats: parseInt(document.getElementById("seats").value),
      mileage: document.getElementById("mileage").value,
      condition: document.getElementById("condition").value,
      color: document.getElementById("color").value,
      location: document.getElementById("location").value,
      body_type: document.getElementById("bodyType").value,
      owner: currentCar.owner || "Mcvid",
      features: features,
      featured: document.getElementById("featured").checked,
      images: currentCar.images || [],
    };

    // Check if this is a static car (doesn't have UUID format)
    const isStaticCar = !currentCarId.includes("-");

    if (isStaticCar) {
      // For static cars, check if a copy already exists in Supabase
      const { data: existingCopy } = await supabase
        .from("cars")
        .select("*")
        .eq("original_id", currentCarId)
        .single();

      if (existingCopy) {
        // Update the existing copy
        const { error } = await supabase
          .from("cars")
          .update(updatedData)
          .eq("id", existingCopy.id);

        if (error) throw error;
      } else {
        // Create a new copy and mark it with original_id
        const { data, error } = await supabase
          .from("cars")
          .insert([{ ...updatedData, original_id: currentCarId }]);

        if (error) throw error;
      }
    } else {
      // For Supabase cars, just update
      const { error } = await supabase
        .from("cars")
        .update(updatedData)
        .eq("id", currentCarId);

      if (error) throw error;
    }

    // Show success alert
    successAlert.classList.add("show");
    setTimeout(() => {
      successAlert.classList.remove("show");
    }, 3000);

    // Redirect back to edit page after a delay
    setTimeout(() => {
      window.location.href = "edit.html";
    }, 2000);
  } catch (error) {
    console.error("Error updating car:", error.message);
    alert("Error updating car: " + error.message);
  } finally {
    updateBtn.disabled = false;
    updateBtn.textContent = "Update Car Details";
  }
});

// Load car data when page is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadCarData);
} else {
  loadCarData();
}
