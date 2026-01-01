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
  // Start loading similar cars
  loadSimilarCars(car);

  // Render Video Tour if exists
  if (window.renderVideoTour && car.video_url) {
    window.renderVideoTour(car.video_url, "videoContainer");
  }

  // Init Loan Calculator
  if (window.initLoanCalculator) {
    window.initLoanCalculator(car.price_ugx);
  }

  // SEO: Structured Data
  injectStructuredData(car);
}

function injectStructuredData(car) {
  const script = document.createElement("script");
  script.type = "application/ld+json";
  const json = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: car.name,
    image: car.images[0],
    description: `Buy a ${car.name} at Mcvid Cars. Condition: ${car.condition}, Mileage: ${car.mileage}.`,
    brand: {
      "@type": "Brand",
      name: car.name.split(" ")[0],
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "UGX",
      price: car.price_ugx,
      availability:
        car.status === "sold"
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      url: window.location.href,
    },
    vehicleEngine: {
      "@type": "EngineSpecification",
      engineType: car.engine,
    },
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: car.mileage,
    },
  };
  script.text = JSON.stringify(json);
  document.head.appendChild(script);
}

async function loadSimilarCars(currentCar) {
  const container = document.getElementById("similarCarsContainer");
  if (!container) return;

  // 1. Get all cars (Static + Supabase)
  let allCars = [...cars];

  try {
    const { data: supabaseCars, error } = await supabase
      .from("cars")
      .select("*");

    if (error) throw error;
    if (supabaseCars) {
      // Remove static cars that are edited in Supabase
      const editedIds = supabaseCars
        .filter((c) => c.original_id)
        .map((c) => c.original_id);
      allCars = allCars.filter((c) => !editedIds.includes(c.id));
      allCars = [...allCars, ...supabaseCars];
    }
  } catch (err) {
    console.error("Error fetching similar cars", err);
  }

  // 2. Filter Logic: Same Type OR Same Brand, exclude current ID
  const type = currentCar.body_type || currentCar.type;
  const brand = currentCar.name.split(" ")[0];

  let similar = allCars.filter((c) => {
    if (c.id === currentCar.id) return false; // Exclude self

    const cType = c.body_type || c.type;
    const cBrand = c.name.split(" ")[0];

    // Priority: Same Type
    if (type && cType && type.toLowerCase() === cType.toLowerCase())
      return true;

    // Fallback: Same Brand
    if (brand && cBrand && brand.toLowerCase() === cBrand.toLowerCase())
      return true;

    return false;
  });

  // Limit to 4 cars
  similar = similar.slice(0, 4);

  // 3. Render
  container.innerHTML = "";
  if (similar.length === 0) {
    container.innerHTML = "<p>No similar cars found.</p>";
    return;
  }

  similar.forEach((car) => {
    const card = document.createElement("div");
    card.classList.add("car-card");

    const ugxPrice = `${car.price_ugx.toLocaleString()} UGX`;
    const isSold = car.status === "sold";
    const statusText = isSold ? "Sold" : "Available";
    const statusClass = isSold ? "status-badge sold" : "status-badge";

    card.innerHTML = `
      <div class="card-media">
        <img src="${car.images[0]}" alt="${car.name}" />
         <div class="price-badge">${ugxPrice}</div>
      </div>
      <div class="card-body">
        <h3 class="car-name">${car.name}</h3>
        <div class="badge-row">
            <span class="${statusClass}">${statusText}</span>
        </div>
        <a href="details.html?id=${car.id}" class="details-btn">View Details</a>
      </div>
    `;
    container.appendChild(card);
  });
}

// Start loading
loadCarDetails();
