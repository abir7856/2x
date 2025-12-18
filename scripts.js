// Editable Opening Amount
function makeEditable(pElement) {
  if (!pElement) return;
  pElement.addEventListener("click", () => {
    const currentValue = pElement.innerText;

    const input = document.createElement("input");
    input.type = "text";
    input.value = currentValue;
    input.className = "text-4xl font-semibold text-[#183350]";
    input.style.width = "150px";

    pElement.replaceWith(input);
    input.focus();

    function saveValue() {
      const newValue = input.value.trim() || "0";

      // Save value to localStorage
      localStorage.setItem("openingAmount", newValue);

      const newP = document.createElement("p");
      newP.id = "openingAmount";
      newP.className = "text-4xl font-semibold text-[#183350]";
      newP.style.cursor = "pointer";
      newP.innerText = newValue;

      input.replaceWith(newP);

      // পুনরায় ক্লিক যোগ করা
      makeEditable(newP);
    }

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") saveValue();
    });

    input.addEventListener("blur", saveValue);
  });
}

// পেজ লোড হলে localStorage থেকে value load করা
window.addEventListener("DOMContentLoaded", () => {
  const openingEl = document.getElementById("openingAmount");
  const savedValue = localStorage.getItem("openingAmount");
  if (openingEl && savedValue) {
    openingEl.innerText = savedValue;
  }
  if (openingEl) {
    makeEditable(openingEl);
  }
});

// --- Auth helpers ---
function ensureApproved() {
  const path = (location.pathname.split("/").pop() || "").toLowerCase();
  const isAuthPage = ["login.html", "approve.html", "admin.html"].includes(path);
  if (isAuthPage) return;
  const approved = localStorage.getItem("approved");
  if (approved !== "yes") {
    location.replace("login.html");
  }
}

// Call on load where scripts.js is included
try { ensureApproved(); } catch (e) {}

// 🔰 Initialize variables
const fileInput = document.getElementById("fileInput");
let currentImg = null;
let pressTimer;

// 🚀 Load saved images from localStorage on page load
document.querySelectorAll(".uploadable").forEach((img) => {
  const savedImg = localStorage.getItem(img.dataset.key);
  if (savedImg) {
    img.src = savedImg;
  }

  // 🖱️ Click to upload (same behavior as betDetails.html's displayImage)
  img.addEventListener("click", () => {
    currentImg = img;
    if (fileInput) fileInput.click();
  });

  // 🖱️ Desktop mouse long press
  img.addEventListener("mousedown", () => {
    pressTimer = setTimeout(() => {
      currentImg = img;
      fileInput.click();
    }, 800);
  });
  img.addEventListener("mouseup", () => clearTimeout(pressTimer));
  img.addEventListener("mouseleave", () => clearTimeout(pressTimer));

  // 📱 Mobile touch long press
  img.addEventListener("touchstart", () => {
    pressTimer = setTimeout(() => {
      currentImg = img;
      fileInput.click();
    }, 800);
  });
  img.addEventListener("touchend", () => clearTimeout(pressTimer));
  img.addEventListener("touchcancel", () => clearTimeout(pressTimer));
});

// 📂 When file selected
if (fileInput) fileInput.addEventListener("change", (e) => {
  if (!currentImg || !e.target.files[0]) return;
  const reader = new FileReader();
  reader.onload = function (event) {
    currentImg.src = event.target.result;
    // 💾 Save to localStorage
    localStorage.setItem(currentImg.dataset.key, event.target.result);
  };
  reader.readAsDataURL(e.target.files[0]);
  fileInput.value = "";
});

// Bottom Navigation highlight and normal
const navItems = document.querySelectorAll(".nav-item");

function resetNav() {
  navItems.forEach((item) => {
    const type = item.dataset.type;
    const name = item.dataset.name;
    const text = item.querySelector(".nav-text");
    const icon = item.querySelector(".nav-icon");

    // Text color reset
    text.classList.remove("text-[#488cd2]");
    text.classList.add("text-[#5e809b]");

    // Normal icons reset
    if (type === "normal" && icon) {
      icon.src = `img/Bottom/${name}.png`;
    }

    // Betslip border reset
    if (type === "betslip") {
      const betslipDiv = item.querySelector(".betslip-icon");
      betslipDiv.classList.remove("border-4", "border-white");
      betslipDiv.classList.add("border-transparent");
    }
  });
}

function activateNav(item) {
  const type = item.dataset.type;
  const name = item.dataset.name;
  const text = item.querySelector(".nav-text");
  const icon = item.querySelector(".nav-icon");

  // Text color active
  text.classList.remove("text-[#5e809b]");
  text.classList.add("text-[#488cd2]");

  // Normal icon active image
  if (type === "normal" && icon) {
    icon.src = `img/Bottom/${name}Actv.png`;
  }

  // Betslip border active
  if (type === "betslip") {
    const betslipDiv = item.querySelector(".betslip-icon");
    betslipDiv.classList.remove("border-transparent");
    betslipDiv.classList.add("border-4", "border-white");
  }
}

// Add click event
navItems.forEach((item) => {
  item.addEventListener("click", () => {
    resetNav();
    activateNav(item);
  });
});

// Default active = Popular
resetNav();
const activeItem = document.querySelector(".nav-item.active");
if (activeItem) activateNav(activeItem);
