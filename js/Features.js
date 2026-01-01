/* EXTRA FEATURES LOGIC (Optimized) */

document.addEventListener("DOMContentLoaded", () => {
  initWhatsApp();
  initTestDriveModal();
  initThemeToggle();
  initCurrencyConverter();

  // Single optimized observer for all dynamic features
  initGlobalObserver();
});

// 1. WHATSAPP INJECTION (Static)
function initWhatsApp() {
  const phoneNumber = "256708684848";
  const message = encodeURIComponent(
    "Hi Mcvid Cars! I'm interested in one of your vehicles."
  );
  const whatsappBtn = document.createElement("a");
  whatsappBtn.href = `https://wa.me/${phoneNumber}?text=${message}`;
  whatsappBtn.className = "whatsapp-float";
  whatsappBtn.target = "_blank";
  whatsappBtn.innerHTML = '<i class="ri-whatsapp-line"></i>';
  document.body.appendChild(whatsappBtn);
}

// 2. TEST DRIVE MODAL (Static-ish)
function initTestDriveModal() {
  const modalHTML = `
        <div class="modal-overlay" id="testDriveModal" style="display: none;">
            <div class="modal-content">
                <button class="modal-close" id="closeModal">&times;</button>
                <h2 class="modal-title">Book a Test Drive</h2>
                <p style="color: #666; margin-bottom: 20px;">Fill in your details and we'll contact you to confirm.</p>
                <form id="testDriveForm" style="display: flex; flex-direction: column; gap: 15px;">
                    <div style="text-align: left;">
                        <label style="font-size: 0.9rem; color: #555;">Vehicle</label>
                        <input type="text" id="modalVehicleName" readonly style="width:100%; padding:12px; border:1px solid #ddd; border-radius:10px; background:#f9f9f9;">
                    </div>
                    <div style="text-align: left;">
                        <label style="font-size: 0.9rem; color: #555;">Your Name</label>
                        <input type="text" placeholder="Enter your name" required style="width:100%; padding:12px; border:1px solid #ddd; border-radius:10px;">
                    </div>
                    <div style="text-align: left;">
                        <label style="font-size: 0.9rem; color: #555;">Phone Number</label>
                        <input type="tel" placeholder="e.g. 0700 000000" required style="width:100%; padding:12px; border:1px solid #ddd; border-radius:10px;">
                    </div>
                    <button type="submit" style="background:#0055ff; color:white; padding:15px; border:none; border-radius:10px; font-weight:600; cursor:pointer; margin-top:10px;">
                        Request Test Drive
                    </button>
                </form>
            </div>
        </div>
    `;
  const div = document.createElement("div");
  div.innerHTML = modalHTML;
  document.body.appendChild(div);

  const modal = document.getElementById("testDriveModal");
  const closeBtn = document.getElementById("closeModal");
  if (closeBtn)
    closeBtn.onclick = () => {
      modal.classList.remove("active");
      setTimeout(() => {
        modal.style.display = "none";
      }, 300);
    };

  const form = document.getElementById("testDriveForm");
  if (form)
    form.onsubmit = (e) => {
      e.preventDefault();
      alert("Success! We've received your request.");
      modal.classList.remove("active");
      setTimeout(() => {
        modal.style.display = "none";
      }, 300);
    };
}

// 3. GLOBAL OBSERVER (Performance Boost - Fixed)
function initGlobalObserver() {
  // Lightbox container (Static)
  const lbDiv = document.createElement("div");
  lbDiv.innerHTML = `<div class="lightbox-overlay" id="lightbox"><button class="lightbox-close">&times;</button><div class="lightbox-content"><img id="lightboxImg" src="" alt="Zoomed view"></div></div>`;
  document.body.appendChild(lbDiv);

  const lightbox = document.getElementById("lightbox");
  const closeBtn = lbDiv.querySelector(".lightbox-close");
  closeBtn.onclick = () => lightbox.classList.remove("active");
  lightbox.onclick = (e) => {
    if (e.target === lightbox) lightbox.classList.remove("active");
  };

  // Initial run for existing elements
  processNewElements(document.body);

  // Optimized Observer
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          // Element node
          // Directly process the added node if it's a car-card or contains them
          if (node.classList.contains("car-card")) {
            processNewElements(node);
          } else {
            // If it's a container, query inside it
            const cards = node.querySelectorAll
              ? node.querySelectorAll(".car-card")
              : [];
            if (cards.length > 0) processNewElements(node);
          }
        }
      });
    });
  });

  // Observe only childList changes to catch inserted car cards
  observer.observe(document.body, { childList: true, subtree: true });
}

function processNewElements(root) {
  // If root itself is a car-card, wrap it in array to handle consistently
  const cards =
    root.classList && root.classList.contains("car-card")
      ? [root]
      : root.querySelectorAll
      ? root.querySelectorAll(".car-card")
      : [];

  const images =
    root.tagName === "IMG" && root.matches(".main-image, .thumb-img, .car-img")
      ? [root]
      : root.querySelectorAll
      ? root.querySelectorAll(".main-image, .thumb-img, .car-img")
      : [];

  // Process Cards
  cards.forEach((card) => {
    if (!card.classList.contains("has-wishlist")) injectWishlist(card);
    if (!card.classList.contains("has-compare")) injectCompare(card);
  });

  // Process Lightbox
  images.forEach((img) => {
    if (!img.classList.contains("lightbox-ready")) {
      img.classList.add("lightbox-ready");
      img.style.cursor = "zoom-in";
      img.onclick = () => {
        const lightboxImg = document.getElementById("lightboxImg");
        lightboxImg.src = img.src;
        document.getElementById("lightbox").classList.add("active");
      };
    }
  });

  renderCompareFloatingBadge();
}

function injectWishlist(card) {
  const carId = getCarId(card);
  if (!carId) return;
  const wishlist = JSON.parse(localStorage.getItem("mcvid_wishlist") || "[]");
  const isLiked = wishlist.includes(carId);
  const btn = document.createElement("button");
  btn.className = `wishlist-btn ${isLiked ? "active" : ""}`;
  btn.innerHTML = `<i class="${
    isLiked ? "ri-heart-fill" : "ri-heart-line"
  }"></i>`;
  btn.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(carId, btn);
  };
  card.style.position = "relative";
  card.appendChild(btn);
  card.classList.add("has-wishlist");
}

function injectCompare(card) {
  const carId = getCarId(card);
  if (!carId) return;
  const list = JSON.parse(localStorage.getItem("mcvid_compare") || "[]");
  const isAdded = list.includes(carId);
  const wrapper = document.createElement("div");
  wrapper.className = "compare-checkbox-wrapper";
  wrapper.innerHTML = `<input type="checkbox" id="comp-${carId}" ${
    isAdded ? "checked" : ""
  } onclick="event.stopPropagation();"><label for="comp-${carId}">Compare</label>`;
  wrapper.querySelector("input").onchange = () => toggleCompare(carId);
  const body = card.querySelector(".card-body");
  if (body) body.insertBefore(wrapper, body.querySelector(".details-btn"));
  card.classList.add("has-compare");
}

function getCarId(card) {
  const link = card.querySelector("a");
  if (!link) return null;
  try {
    return new URL(link.href, window.location.origin).searchParams.get("id");
  } catch (e) {
    return null;
  }
}

function toggleWishlist(carId, btn) {
  let wishlist = JSON.parse(localStorage.getItem("mcvid_wishlist") || "[]");
  const index = wishlist.indexOf(carId);
  if (index > -1) {
    wishlist.splice(index, 1);
    btn.classList.remove("active");
    btn.innerHTML = '<i class="ri-heart-line"></i>';
  } else {
    wishlist.push(carId);
    btn.classList.add("active");
    btn.innerHTML = '<i class="ri-heart-fill"></i>';
    btn.style.transform = "scale(1.2)";
    setTimeout(() => {
      btn.style.transform = "scale(1)";
    }, 200);
  }
  localStorage.setItem("mcvid_wishlist", JSON.stringify(wishlist));
  window.dispatchEvent(new CustomEvent("wishlistUpdated"));
}

function toggleCompare(carId) {
  let list = JSON.parse(localStorage.getItem("mcvid_compare") || "[]");
  const index = list.indexOf(carId);
  if (index > -1) {
    list.splice(index, 1);
  } else {
    if (list.length >= 3) {
      alert("Max 3 cars.");
      const cb = document.getElementById(`comp-${carId}`);
      if (cb) cb.checked = false;
      return;
    }
    list.push(carId);
  }
  localStorage.setItem("mcvid_compare", JSON.stringify(list));
  renderCompareFloatingBadge();
}

function renderCompareFloatingBadge() {
  const list = JSON.parse(localStorage.getItem("mcvid_compare") || "[]");
  let badge = document.getElementById("compareBadge");
  if (list.length === 0) {
    if (badge) badge.remove();
    return;
  }
  if (!badge) {
    badge = document.createElement("a");
    badge.id = "compareBadge";
    badge.href = "compare.html";
    badge.className = "compare-floating-badge";
    document.body.appendChild(badge);
  }
  badge.innerHTML = `<i class="ri-arrow-left-right-line"></i> Compare (${list.length})`;
}

// 4. THEME & CURRENCY (Self-contained)
function initThemeToggle() {
  const currentTheme = localStorage.getItem("theme") || "light";
  if (currentTheme === "light") document.body.classList.add("light-theme");
  const toggleBtn = document.createElement("button");
  toggleBtn.className = "theme-toggle";
  toggleBtn.innerHTML = `<i class="${
    currentTheme === "light" ? "ri-moon-line" : "ri-sun-line"
  }"></i>`;
  const navbar = document.querySelector(".navbar");
  if (navbar) navbar.appendChild(toggleBtn);
  toggleBtn.onclick = () => {
    const isLight = document.body.classList.toggle("light-theme");
    localStorage.setItem("theme", isLight ? "light" : "dark");
    toggleBtn.innerHTML = `<i class="${
      isLight ? "ri-moon-line" : "ri-sun-line"
    }"></i>`;
  };
}

function initCurrencyConverter() {
  const rate = 3700;
  const currentCurrency = localStorage.getItem("mcvid_currency") || "UGX";
  const toggle = document.createElement("button");
  toggle.className = "currency-toggle";
  toggle.innerHTML = `${currentCurrency}`;
  toggle.title = "Click to switch between UGX and USD";
  const navbar = document.querySelector(".navbar");
  if (navbar) navbar.appendChild(toggle);
  toggle.onclick = () => {
    const newCurrency = toggle.innerText.includes("UGX") ? "USD" : "UGX";
    toggle.innerHTML = `${newCurrency}`;
    localStorage.setItem("mcvid_currency", newCurrency);
    applyCurrencyToPage(newCurrency, rate);
  };
  if (currentCurrency === "USD")
    setTimeout(() => applyCurrencyToPage("USD", rate), 500);
}

function applyCurrencyToPage(currency, rate) {
  document
    .querySelectorAll(".price-badge, .price, #carPrice")
    .forEach((badge) => {
      const text = badge.textContent;
      if (currency === "USD") {
        if (text.includes("UGX")) {
          const ugx = parseInt(text.replace(/[^0-9]/g, ""));
          if (!isNaN(ugx)) {
            badge.setAttribute("data-ugx", text);
            badge.textContent = `$ ${(ugx / rate).toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}`;
          }
        }
      } else {
        const original = badge.getAttribute("data-ugx");
        if (original) badge.textContent = original;
      }
    });
}

// 5. HELPERS
window.initLoanCalculator = function (carPrice) {
  const container = document.getElementById("loanCalculatorContainer");
  if (!container) return;
  container.innerHTML = `
        <div class="calculator-box" style="margin-top: 30px; background: rgba(0, 85, 255, 0.05); padding: 30px; border-radius: 20px;">
            <h3 style="margin-bottom: 20px;"><i class="ri-calculator-line"></i> Financing</h3>
            <div class="calc-grid">
                <div class="calc-group"><label>Down Payment (UGX)</label><input type="number" id="downPayment" value="${Math.round(
                  carPrice * 0.2
                )}" step="1000000"></div>
                <div class="calc-group"><label>Interest (%)</label><input type="number" id="interestRate" value="15"></div>
                <div class="calc-group"><label>Period (Months)</label><select id="loanPeriod"><option value="12">1 Year</option><option value="36" selected>3 Years</option><option value="60">5 Years</option></select></div>
            </div>
            <div style="margin-top: 20px; text-align: center;"><p>Monthly Payment</p><h2 id="monthlyPayment" style="color: #0055ff;">---</h2></div>
        </div>
    `;
  const update = () => {
    const dp = parseFloat(document.getElementById("downPayment").value) || 0;
    const ir =
      parseFloat(document.getElementById("interestRate").value) / 100 / 12;
    const m = parseInt(document.getElementById("loanPeriod").value);
    const p = carPrice - dp;
    if (p <= 0) {
      document.getElementById("monthlyPayment").textContent = "Paid Content";
      return;
    }
    const x = Math.pow(1 + ir, m);
    const monthly = (p * x * ir) / (x - 1);
    document.getElementById("monthlyPayment").textContent = `UGX ${Math.round(
      monthly
    ).toLocaleString()}/mo`;
  };
  ["downPayment", "interestRate", "loanPeriod"].forEach(
    (id) => (document.getElementById(id).oninput = update)
  );
  update();
};

window.renderVideoTour = function (videoUrl, containerId) {
  const container = document.getElementById(containerId);
  if (!container || !videoUrl) return;
  const videoId = videoUrl.includes("v=")
    ? videoUrl.split("v=")[1].split("&")[0]
    : videoUrl.split("/").pop();
  container.innerHTML = `<div style="margin-top:30px;"><h3>Video Tour</h3><div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:15px;background:#000;margin-top:15px;"><iframe src="https://www.youtube.com/embed/${videoId}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allowfullscreen></iframe></div></div>`;
};

window.openTestDriveModal = function (vehicleName) {
  const modal = document.getElementById("testDriveModal");
  const input = document.getElementById("modalVehicleName");
  if (input) input.value = vehicleName;
  modal.style.display = "flex";
  setTimeout(() => modal.classList.add("active"), 10);
};
