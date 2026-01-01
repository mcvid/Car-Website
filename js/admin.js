// admin.js

const carForm = document.getElementById("carForm");
const imageFileInput = document.getElementById("imageFileInput");
const imagePreviewGrid = document.getElementById("imagePreviewGrid");
const successAlert = document.getElementById("successAlert");

let selectedFiles = [];

// Handle Image Selection and Preview
imageFileInput.addEventListener("change", (e) => {
  const files = Array.from(e.target.files);

  if (selectedFiles.length + files.length > 10) {
    alert("You can only upload up to 10 images.");
    return;
  }

  files.forEach((file) => {
    selectedFiles.push(file);
    const reader = new FileReader();

    reader.onload = (event) => {
      const previewItem = document.createElement("div");
      previewItem.className = "image-preview-item";
      previewItem.innerHTML = `
        <img src="${event.target.result}" alt="Preview">
        <button type="button" class="remove-img" data-name="${file.name}">×</button>
      `;
      imagePreviewGrid.appendChild(previewItem);

      // Handle removal
      previewItem.querySelector(".remove-img").addEventListener("click", () => {
        selectedFiles = selectedFiles.filter((f) => f.name !== file.name);
        previewItem.remove();
      });
    };
    reader.readAsDataURL(file);
  });
});

// Upload Files to Supabase Storage
async function uploadImages(files) {
  const imageUrls = [];

  for (const file of files) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()
      .toString(36)
      .substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from("car-images")
      .upload(filePath, file);

    if (error) {
      console.error("Upload error:", error.message);
      continue;
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("car-images")
      .getPublicUrl(filePath);

    imageUrls.push(publicUrlData.publicUrl);
  }

  return imageUrls;
}

// Form Submission
carForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const submitBtn = document.getElementById("submitBtn");
  submitBtn.disabled = true;
  submitBtn.textContent = "Uploading & Saving...";

  try {
    // 1. Upload images if any
    let imageUrls = [];
    if (selectedFiles.length > 0) {
      imageUrls = await uploadImages(selectedFiles);
    }

    // 2. Collect features
    const features = document
      .getElementById("featuresInput")
      .value.split(",")
      .map((f) => f.trim())
      .filter((f) => f !== "");

    // 3. Prepare data
    const carData = {
      name: document.getElementById("carNameInput").value,
      brand: document.getElementById("brandSelect").value,
      price_usd: parseFloat(document.getElementById("priceUsd").value),
      price_ugx: parseFloat(document.getElementById("priceUgx").value),
      year: parseInt(document.getElementById("yearInput").value),
      engine: document.getElementById("engineInput").value,
      horsepower: document.getElementById("horsepowerInput").value,
      fuel: document.getElementById("fuelSelect").value,
      fuel_consumption: document.getElementById("consumptionInput").value,
      transmission: document.getElementById("transmissionSelect").value,
      seats: parseInt(document.getElementById("seatsInput").value),
      mileage: document.getElementById("mileageInput").value,
      condition: document.getElementById("conditionSelect").value,
      color: document.getElementById("colorInput").value,
      location: document.getElementById("locationInput").value,
      body_type: document.getElementById("bodyTypeSelect").value,
      video_url: document.getElementById("videoUrlInput").value,
      owner: "Mcvid",
      features: features,
      images: imageUrls,
      featured: document.getElementById("featuredInput").checked, // Correctly booleans
    };

    // 4. Insert into Supabase
    const { data, error } = await supabase.from("cars").insert([carData]);

    if (error) throw error;

    // 5. Success
    showSuccessAlert();
    carForm.reset();
    imagePreviewGrid.innerHTML = "";
    selectedFiles = [];
  } catch (error) {
    console.error("Error adding car:", error.message);
    alert("Error adding car: " + error.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Publish Vehicle";
  }
});

function showSuccessAlert() {
  successAlert.classList.add("show");
  setTimeout(() => {
    successAlert.classList.remove("show");
  }, 4000);
}
