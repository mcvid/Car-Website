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
// Image State
let currentImages = []; // URLs
let newImageFiles = []; // File objects

// Populate form with car data
function populateForm(car) {
  // ... existing fields ...
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

  // Video URL
  document.getElementById("videoUrl").value = car.video_url || "";

  // Features
  if (car.features && Array.isArray(car.features)) {
    document.getElementById("features").value = car.features.join(", ");
  }

  // Featured checkbox
  document.getElementById("featured").checked = car.featured || false;

  // Images
  currentImages = car.images || [];
  renderImagePreviews();
}

// Render Images (Existing + New)
function renderImagePreviews() {
  const container = document.getElementById("imagePreviewContainer");
  container.innerHTML = "";

  // 1. Existing Images
  currentImages.forEach((url, index) => {
    const div = document.createElement("div");
    div.style.position = "relative";
    div.style.width = "100px";
    div.style.height = "80px";

    // Check if it's a URL or base64 (for simplicity we assume URL)
    div.innerHTML = `
      <img src="${url}" style="width:100%; height:100%; object-fit:cover; border-radius:8px; border:1px solid #ddd;">
      <button type="button" onclick="removeExistingImage(${index})" style="position:absolute; top:-5px; right:-5px; background:red; color:white; border:none; border-radius:50%; width:20px; height:20px; cursor:pointer;">&times;</button>
    `;
    container.appendChild(div);
  });

  // 2. New Files (Preview)
  newImageFiles.forEach((file, index) => {
    const div = document.createElement("div");
    div.style.position = "relative";
    div.style.width = "100px";
    div.style.height = "80px";

    const reader = new FileReader();
    reader.onload = (e) => {
      div.innerHTML = `
          <img src="${e.target.result}" style="width:100%; height:100%; object-fit:cover; border-radius:8px; border:2px solid #0055ff;">
          <button type="button" onclick="removeNewFile(${index})" style="position:absolute; top:-5px; right:-5px; background:red; color:white; border:none; border-radius:50%; width:20px; height:20px; cursor:pointer;">&times;</button>
        `;
    };
    reader.readAsDataURL(file);
    container.appendChild(div);
  });
}

// Global functions for inline onclick
window.removeExistingImage = function (index) {
  currentImages.splice(index, 1);
  renderImagePreviews();
};

window.removeNewFile = function (index) {
  newImageFiles.splice(index, 1);
  renderImagePreviews();
};

// Handle File Selection
const imageInput = document.getElementById("imageInput");
if (imageInput) {
  imageInput.addEventListener("change", (e) => {
    const files = Array.from(e.target.files);
    newImageFiles = [...newImageFiles, ...files];
    renderImagePreviews();
    imageInput.value = ""; // Reset input so same file can be selected again
  });
}

// UPLOAD FUNCTION
async function uploadImagesToSupabase() {
  const uploadedUrls = [];
  if (newImageFiles.length === 0) return [];

  for (const file of newImageFiles) {
    const fileName = `uploads/${Date.now()}_${file.name.replace(/\s+/g, "-")}`;
    const { data, error } = await supabase.storage
      .from("car-images")
      .upload(fileName, file);

    if (error) {
      console.error("Upload error:", error);
      alert(`Failed to upload ${file.name}`);
      continue;
    }

    // Get Public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("car-images").getPublicUrl(fileName);

    uploadedUrls.push(publicUrl);
  }
  return uploadedUrls;
}

// Handle form submission
updateForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  updateBtn.disabled = true;
  updateBtn.textContent = "Updating...";

  try {
    // 1. Upload NEW images (if any)
    const newUrls = await uploadImagesToSupabase();

    // 2. Combine with remaining existing images
    const finalImages = [...currentImages, ...newUrls];

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
      video_url: document.getElementById("videoUrl").value, // NEW
      owner: currentCar.owner || "Mcvid",
      features: features,
      featured: document.getElementById("featured").checked,
      images: finalImages, // UPDATED
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

    // Redirect
    setTimeout(() => {
      window.location.href = "edit.html";
    }, 2000);
  } catch (error) {
    console.error("Error updating car:", error.message);
    alert("Error: " + error.message);
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
