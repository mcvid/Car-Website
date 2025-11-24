// ==============================
// CAR DETAILS LOADER
// ==============================

// Get car ID from URL: details.html?id=prado2020
const params = new URLSearchParams(window.location.search);
const carId = params.get("id");

// Find the car in the cars database
const car = cars.find((c) => c.id === carId);

if (!car) {
  document.body.innerHTML = "<h1>Car not found</h1>";
  throw new Error("Car ID not found in database");
}

// ==============================
// FILL PAGE WITH DATA
// ==============================

// MAIN IMAGE
const mainImage = document.getElementById("mainImage");
mainImage.src = car.images[0];

// THUMBNAILS
const thumbContainer = document.getElementById("thumbContainer");
car.images.forEach((img) => {
  const thumb = document.createElement("img");
  thumb.src = img;
  thumb.className = "thumb";
  thumb.onclick = () => (mainImage.src = img);
  thumbContainer.appendChild(thumb);
});

// TITLE
document.getElementById("carName").textContent = car.name;

// PRICE + TYPE
document.getElementById(
  "carPrice"
).textContent = `UGX ${car.price_ugx.toLocaleString()} (${car.price_usd} USD)`;

document.getElementById("carType").textContent = car.type;

// ==============================
// SPECIFICATIONS TABLE
// ==============================

const specTable = document.getElementById("specTable");

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

Object.entries(specs).forEach(([key, value]) => {
  const row = document.createElement("tr");
  row.innerHTML = `
        <td>${key}</td>
        <td>${value}</td>
      `;
  specTable.appendChild(row);
});

// ==============================
// FEATURES LIST
// ==============================

const featuresList = document.getElementById("featuresList");
car.features.forEach((feat) => {
  const li = document.createElement("li");
  li.textContent = feat;
  featuresList.appendChild(li);
});

// ==============================
// CONTACT BUTTONS
// ==============================

const phone = "256700000000"; // change later to real number

document.getElementById(
  "waBtn"
).href = `https://wa.me/${phone}?text=Hello, I'm interested in the ${car.name}.`;
document.getElementById("callBtn").href = `tel:${phone}`;
document.getElementById(
  "emailBtn"
).href = `mailto:info@mcvidcars.com?subject=${car.name} Inquiry`;

// Mobile floating bar
document.getElementById(
  "floatWA"
).href = `https://wa.me/${phone}?text=Hello, I'm interested in the ${car.name}.`;
document.getElementById("floatCall").href = `tel:${phone}`;
document.getElementById(
  "floatMail"
).href = `mailto:info@mcvidcars.com?subject=${car.name} Inquiry`;
