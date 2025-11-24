// catalog.js

const catalogContainer = document.getElementById("catalogContainer");

cars.forEach((car) => {
  const card = document.createElement("div");
  card.classList.add("car-card");

  card.innerHTML = `
    <img src="${car.images[0]}" alt="${car.name}">
    <h3>${car.name}</h3>
    <p class="price">UGX ${car.price_ugx.toLocaleString()}</p>
    <p class="price-usd">USD ${car.price_usd.toLocaleString()}</p>

    <a href="details.html?id=${car.id}" class="view-details">View Details</a>
  `;

  catalogContainer.appendChild(card);
});
