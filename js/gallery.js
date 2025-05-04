document.addEventListener("DOMContentLoaded", function () {
  // Initialize all galleries on the page
  const galleries = document.querySelectorAll(".gallery-container");

  galleries.forEach((gallery) => {
    // Determine if this is the bar menu (9 pages) or room service (8 pages)
    const isBarMenu = gallery.classList.contains("bar-gallery");
    const totalPages = isBarMenu ? 9 : 8;
    const folder = isBarMenu ? "bar" : "room-service";

    // Create gallery elements
    const viewer = gallery.querySelector(".gallery-viewer");
    const prevBtn = gallery.querySelector(".prev");
    const nextBtn = gallery.querySelector(".next");
    const indicator = gallery.querySelector(".page-indicator");

    let currentIndex = 0;

    // Load images into the gallery
    function loadImages() {
      viewer.innerHTML = "";

      for (let i = 1; i <= totalPages; i++) {
        // Main image
        const img = document.createElement("img");
        img.src = `img/${folder}/full-${i}.jpg`;
        img.alt = `${isBarMenu ? "Bar" : "Room Service"} Menu Page ${i}`;
        img.loading = i > 1 ? "lazy" : "eager";
        viewer.appendChild(img);
      }
    }

    // Update gallery display
    function updateGallery() {
      const images = viewer.querySelectorAll("img");
      images.forEach((img) => img.classList.remove("active"));
      images[currentIndex].classList.add("active");
      indicator.textContent = `${currentIndex + 1}/${totalPages}`;
    }

    // Navigation controls
    prevBtn.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + totalPages) % totalPages;
      updateGallery();
    });

    nextBtn.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % totalPages;
      updateGallery();
    });

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        currentIndex = (currentIndex - 1 + totalPages) % totalPages;
        updateGallery();
      } else if (e.key === "ArrowRight") {
        currentIndex = (currentIndex + 1) % totalPages;
        updateGallery();
      }
    });

    // Initialize
    loadImages();
    updateGallery();
  });
});
