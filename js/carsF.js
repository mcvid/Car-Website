document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("featuredCarsContainer");

  if (!container) {
    console.error("⚠ featuredCarsContainer not found in DOM");
    return;
  }

  const featuredCars = cars.filter((car) => car.featured === true);

  if (featuredCars.length === 0) {
    container.innerHTML = "<p>No featured cars available right now.</p>";
    return;
  }

  featuredCars.forEach((car) => {
    const card = document.createElement("div");
    card.classList.add("car-card");

    card.innerHTML = `
      <img src="${car.image}" alt="${car.name}" class="car-img" />

      <h3>${car.name}</h3>

      <p class="price">
        UGX ${car.priceUGX} <br>
        <span>${car.priceUSD} USD</span>
      </p>

      <a href="details.html?id=${car.id}" class="details-btn">View Details</a>
    `;

    container.appendChild(card);
  });
});
