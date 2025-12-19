// details.js

async function loadCarDetails() {
  const params = new URLSearchParams(window.location.search);
  const carId = params.get("id");

  if (!carId) {
    document.body.innerHTML = "<h1>No Car Specified</h1>";
    return;
  }

  // 1. Try finding in static cars
  let car = cars.find((c) => c.id === carId);

  // 2. If not found, try Supabase
  if (!car) {
    try {
      // Check if it's a UUID (Supabase uses UUIDs by default)
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("id", carId)
        .single();

      if (error) throw error;
      car = data;
    } catch (error) {
      console.error("Error fetching car from Supabase:", error.message);
    }
  }

  if (!car) {
    document.body.innerHTML = "<h1>Car not found</h1>";
    return;
  }

  // Fill Page with Data
  renderCarDetails(car);
}

function renderCarDetails(car) {
  // MAIN IMAGE
  const mainImage = document.getElementById("mainImage");
  mainImage.src = car.images[0];

  // THUMBNAILS
  const thumbContainer = document.getElementById("thumbContainer");
  thumbContainer.innerHTML = "";
  car.images.forEach((img, index) => {
    const thumb = document.createElement("img");
    thumb.src = img;
    thumb.className = "thumb";
    if (index === 0) thumb.classList.add("active-thumb");

    thumb.onclick = function () {
      document.querySelectorAll(".thumb").forEach((t) => {
        t.classList.remove("active-thumb");
        t.classList.remove("pop-anim");
      });
      this.classList.add("active-thumb");
      this.classList.add("pop-anim");

      mainImage.classList.add("fade-out");
      setTimeout(() => {
        mainImage.src = img;
        mainImage.classList.remove("fade-out");
      }, 300);
    };
    thumbContainer.appendChild(thumb);
  });

  // TITLE
  document.getElementById("carName").textContent = car.name;

  // PRICE + TYPE
  document.getElementById(
    "carPrice"
  ).textContent = `UGX ${car.price_ugx.toLocaleString()} (${car.price_usd.toLocaleString()} USD)`;
  document.getElementById("carType").textContent = car.body_type || car.type;

  // SPECIFICATIONS TABLE
  const specTable = document.getElementById("specTable");
  specTable.innerHTML = "";

  const specs = {
    Year: car.year,
    Engine: car.engine,
    Horsepower: car.horsepower,
    Fuel: car.fuel,
    "Fuel Consumption": car.fuel_consumption,
    Transmission: car.transmission,
    Seats: car.seats,
    Mileage: car.mileage,
    Condition: car.condition,
    Color: car.color,
    Owner: car.owner,
    Location: car.location,
  };

  const iconMap = {
    Year: "ri-calendar-line",
    Engine: "ri-settings-3-line",
    Horsepower: "ri-speed-up-line",
    Fuel: "ri-gas-station-line",
    "Fuel Consumption": "ri-drop-line",
    Transmission: "ri-git-merge-fill",
    Seats: "ri-group-line",
    Mileage: "ri-road-map-line",
    Condition: "ri-shield-check-line",
    Color: "ri-palette-line",
    Owner: "ri-user-smile-line",
    Location: "ri-map-pin-line",
  };

  Object.entries(specs).forEach(([key, value]) => {
    if (!value) return;
    const row = document.createElement("tr");
    const iconClass = iconMap[key] || "ri-information-line";
    row.innerHTML = `
      <td><i class="${iconClass}" style="margin-right: 8px; color: #0055ff; font-size: 1.1rem;"></i> ${key}</td>
      <td>${value}</td>
    `;
    specTable.appendChild(row);
  });

  // FEATURES LIST
  const featuresList = document.getElementById("featuresList");
  featuresList.innerHTML = "";
  car.features.forEach((feat) => {
    const li = document.createElement("li");
    li.textContent = feat;
    featuresList.appendChild(li);
  });

  // CONTACT BUTTONS
  const phone = "256700000000";
  const message = `Hello, I'm interested in the ${car.name}.`;

  document.getElementById(
    "waBtn"
  ).href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  document.getElementById("callBtn").href = `tel:${phone}`;
  document.getElementById(
    "emailBtn"
  ).href = `mailto:info@mcvidcars.com?subject=${encodeURIComponent(
    car.name + " Inquiry"
  )}`;

  // Mobile floating bar
  document.getElementById(
    "floatWA"
  ).href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  document.getElementById("floatCall").href = `tel:${phone}`;
  document.getElementById(
    "floatMail"
  ).href = `mailto:info@mcvidcars.com?subject=${encodeURIComponent(
    car.name + " Inquiry"
  )}`;
}

// Start loading
loadCarDetails();
