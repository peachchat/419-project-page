function copyBibTeX() {
  const bibTexElement = document.querySelector(".bibtex-section pre code");

  if (!bibTexElement) {
    alert("No BibTeX section found.");
    return;
  }

  const bibTexText = bibTexElement.innerText;
  navigator.clipboard.writeText(bibTexText);
  alert("BibTeX citation copied to clipboard!");
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");

  const nav = document.querySelector(".nav");
  if (nav) {
    nav.classList.toggle("dark-mode");
  }
}

window.onscroll = function () {
  const scrollUpBtn = document.getElementById("scrollUpBtn");

  if (!scrollUpBtn) {
    return;
  }

  if (
    document.body.scrollTop > 100 ||
    document.documentElement.scrollTop > 100
  ) {
    scrollUpBtn.style.display = "block";
  } else {
    scrollUpBtn.style.display = "none";
  }
};

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

class Carousel {
  constructor(element, interval = 3000) {
    this.container = element;
    this.track = element.querySelector(".carousel-track");
    this.slides = Array.from(element.querySelectorAll(".carousel-slide"));
    this.indicators = element.querySelector(".carousel-indicators");
    this.prevButton = element.querySelector(".prev");
    this.nextButton = element.querySelector(".next");

    this.currentIndex = 0;
    this.interval = interval;
    this.autoPlayTimer = null;

    if (!this.track || this.slides.length === 0) {
      return;
    }

    this.updateSlidesPerView();
    this.totalSlides = Math.ceil(this.slides.length / this.slidesPerView);

    this.createIndicators();
    this.setupEventListeners();
    this.startAutoPlay();
    this.updateCarousel();
  }

  updateSlidesPerView() {
    const width = window.innerWidth;

    if (width <= 600) {
      this.slidesPerView = 1;
    } else if (width <= 850) {
      this.slidesPerView = 2;
    } else {
      this.slidesPerView = 3;
    }
  }

  createIndicators() {
    if (!this.indicators) {
      return;
    }

    this.indicators.innerHTML = "";

    for (let i = 0; i < this.totalSlides; i++) {
      const button = document.createElement("button");
      button.classList.add("indicator");
      button.setAttribute("aria-label", `Go to slide group ${i + 1}`);

      if (i === 0) {
        button.classList.add("active");
      }

      button.addEventListener("click", () => {
        this.goToSlide(i);
      });

      this.indicators.appendChild(button);
    }
  }

  setupEventListeners() {
    if (this.prevButton) {
      this.prevButton.addEventListener("click", (e) => {
        e.preventDefault();
        this.prevSlide();
      });
    }

    if (this.nextButton) {
      this.nextButton.addEventListener("click", (e) => {
        e.preventDefault();
        this.nextSlide();
      });
    }

    this.container.addEventListener("mouseenter", () => {
      this.stopAutoPlay();
    });

    this.container.addEventListener("mouseleave", () => {
      this.startAutoPlay();
    });

    document.addEventListener("keydown", (e) => {
      if (this.container.matches(":hover")) {
        if (e.key === "ArrowLeft") {
          this.prevSlide();
        } else if (e.key === "ArrowRight") {
          this.nextSlide();
        }
      }
    });

    window.addEventListener("resize", () => {
      const oldSlidesPerView = this.slidesPerView;
      this.updateSlidesPerView();

      if (oldSlidesPerView !== this.slidesPerView) {
        this.totalSlides = Math.ceil(this.slides.length / this.slidesPerView);
        this.currentIndex = Math.min(this.currentIndex, this.totalSlides - 1);
        this.createIndicators();
        this.updateCarousel();
      }
    });

    this.addTouchSupport();
  }

  updateCarousel() {
    const offset = -this.currentIndex * 100;
    this.track.style.transform = `translateX(${offset}%)`;

    if (this.indicators) {
      const indicators = Array.from(this.indicators.children);

      indicators.forEach((indicator, index) => {
        indicator.classList.toggle("active", index === this.currentIndex);
      });
    }
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
    this.updateCarousel();
    this.resetAutoPlay();
  }

  prevSlide() {
    this.currentIndex =
      (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
    this.updateCarousel();
    this.resetAutoPlay();
  }

  goToSlide(index) {
    if (index !== this.currentIndex) {
      this.currentIndex = index;
      this.updateCarousel();
      this.resetAutoPlay();
    }
  }

  startAutoPlay() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
    }

    this.autoPlayTimer = setInterval(() => {
      this.nextSlide();
    }, this.interval);
  }

  stopAutoPlay() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
  }

  resetAutoPlay() {
    this.stopAutoPlay();
    this.startAutoPlay();
  }

  addTouchSupport() {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleSwipe = () => {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          this.nextSlide();
        } else {
          this.prevSlide();
        }
      }
    };

    this.container.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );

    this.container.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      },
      { passive: true }
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const carouselElements = document.querySelectorAll(".carousel-container");

  carouselElements.forEach((carouselElement) => {
    new Carousel(carouselElement, 3000);
  });
});