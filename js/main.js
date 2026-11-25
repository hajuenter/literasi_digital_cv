(function () {
  "use strict";

  /* ---------- Mobile navigation ---------- */
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      const willOpen = navMenu.classList.contains("hidden");
      navMenu.classList.toggle("hidden", !willOpen);
      navToggle.setAttribute("aria-expanded", String(willOpen));
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.innerWidth < 1024) {
          navMenu.classList.add("hidden");
          navToggle.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  const hireMeBtn = document.getElementById("hireMeBtn");
  if (hireMeBtn && navMenu && navToggle) {
    hireMeBtn.addEventListener("click", function () {
      if (window.innerWidth < 1024) {
        navMenu.classList.add("hidden");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Anchor scroll tanpa menambahkan hash ke URL ---------- */
  const cleanUrl = function () {
    return window.location.pathname + window.location.search;
  };

  function scrollToHash(hash) {
    const target = hash ? document.querySelector(hash) : null;
    const margin = target ? parseFloat(window.getComputedStyle(target).scrollMarginTop) || 0 : 0;
    const top = target ? target.getBoundingClientRect().top + window.scrollY - margin : 0;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }

  function pushAnchorState(hash) {
    if (!window.history || !window.history.pushState) return;
    try {
      window.history.pushState({ anchor: hash }, "", cleanUrl());
    } catch (_) {
      // Diabaikan jika pushState tidak didukung (mis. file://).
    }
  }

  if (window.location.hash && window.history && window.history.replaceState) {
    try {
      window.history.replaceState({ anchor: window.location.hash }, "", cleanUrl());
    } catch (_) {
      // Diabaikan jika replaceState tidak didukung (mis. file://).
    }
  }

  window.addEventListener("popstate", function (event) {
    scrollToHash(event.state && event.state.anchor ? event.state.anchor : null);
  });

  const anchorLinks = Array.from(document.querySelectorAll('a[href^="#"]')).filter(function (link) {
    const hash = link.getAttribute("href");
    return link.id !== "backToTop" && hash !== "#" && Boolean(document.querySelector(hash));
  });

  anchorLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      const hash = link.getAttribute("href");
      if (!document.querySelector(hash)) return;

      event.preventDefault();
      scrollToHash(hash);
      pushAnchorState(hash);
    });
  });

  /* ---------- Active section in navbar ---------- */
  const sections = navLinks
    .map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);

  let scrollQueued = false;
  window.addEventListener(
    "scroll",
    function () {
      if (scrollQueued) return;
      scrollQueued = true;
      requestAnimationFrame(function () {
        const marker = window.scrollY + 140;
        let current = sections[0];
        sections.forEach(function (section) {
          if (section.offsetTop <= marker) current = section;
        });
        navLinks.forEach(function (link) {
          const active = current && link.getAttribute("href") === "#" + current.id;
          if (active) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
        scrollQueued = false;
      });
    },
    { passive: true }
  );
  window.dispatchEvent(new Event("scroll"));

  /* ---------- Typed hero text ---------- */
  const typedText = document.getElementById("typedText");
  if (typedText) {
    let words = [];
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let generation = 0;

    function readWords() {
      return (typedText.dataset.typed || "")
        .split(",")
        .map(function (word) {
          return word.trim();
        })
        .filter(Boolean);
    }

    function tick(gen) {
      if (gen !== generation) return;
      const word = words[wordIndex];
      charIndex += deleting ? -1 : 1;
      typedText.textContent = word.slice(0, charIndex);

      let delay = deleting ? 45 : 90;
      if (!deleting && charIndex === word.length) {
        deleting = true;
        delay = 1500;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = 350;
      }
      window.setTimeout(function () {
        tick(gen);
      }, delay);
    }

    function restartTyped() {
      generation += 1;
      words = readWords();
      wordIndex = 0;
      charIndex = 0;
      deleting = false;
      typedText.textContent = "";
      if (words.length) tick(generation);
    }

    restartTyped();
    window.addEventListener("portfolio:languagechange", restartTyped);
  }

  /* ---------- Portfolio filter ---------- */
  const filterButtons = Array.from(document.querySelectorAll("#portfolioFilters [data-filter]"));
  const portfolioItems = Array.from(document.querySelectorAll(".portfolio-item"));

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const filter = button.dataset.filter;
      filterButtons.forEach(function (other) {
        other.setAttribute("aria-pressed", String(other === button));
      });
      portfolioItems.forEach(function (item) {
        item.classList.toggle("hidden", filter !== "all" && item.dataset.category !== filter);
      });
    });
  });

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    const lightboxImage = document.getElementById("lightboxImage");
    const lightboxTitle = document.getElementById("lightboxTitle");
    const lightboxCounter = document.getElementById("lightboxCounter");
    const closeButton = document.getElementById("lightboxClose");
    const prevButton = document.getElementById("lightboxPrev");
    const nextButton = document.getElementById("lightboxNext");
    let gallery = [];
    let currentIndex = 0;

    function renderImage() {
      lightboxImage.src = gallery[currentIndex];
      lightboxImage.alt = lightboxTitle.textContent || "Project preview";
      lightboxCounter.textContent =
        String(currentIndex + 1).padStart(2, "0") + " / " + String(gallery.length).padStart(2, "0");
    }

    document.querySelectorAll("[data-preview]").forEach(function (button) {
      button.addEventListener("click", function () {
        gallery = (button.dataset.gallery || button.dataset.preview).split("|").filter(Boolean);
        const start = gallery.indexOf(button.dataset.preview);
        currentIndex = start >= 0 ? start : 0;
        lightboxTitle.textContent = button.dataset.title || "";
        renderImage();
        lightbox.showModal();
      });
    });

    closeButton.addEventListener("click", function () {
      lightbox.close();
    });
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) lightbox.close();
    });
    prevButton.addEventListener("click", function () {
      currentIndex = (currentIndex - 1 + gallery.length) % gallery.length;
      renderImage();
    });
    nextButton.addEventListener("click", function () {
      currentIndex = (currentIndex + 1) % gallery.length;
      renderImage();
    });
  }

  /* ---------- Review slider ---------- */
  const reviewTrack = document.getElementById("reviewTrack");
  const reviewPrev = document.getElementById("reviewPrev");
  const reviewNext = document.getElementById("reviewNext");

  if (reviewTrack && reviewPrev && reviewNext) {
    function scrollReviews(direction) {
      const card = reviewTrack.querySelector("article");
      const distance = card ? card.getBoundingClientRect().width + 24 : reviewTrack.clientWidth;
      reviewTrack.scrollBy({ left: direction * distance, behavior: "smooth" });
    }
    reviewPrev.addEventListener("click", function () {
      scrollReviews(-1);
    });
    reviewNext.addEventListener("click", function () {
      scrollReviews(1);
    });
  }

  /* ---------- Back to top ---------- */
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    window.addEventListener(
      "scroll",
      function () {
        backToTop.classList.toggle("hidden", window.scrollY < 200);
      },
      { passive: true }
    );
    backToTop.addEventListener("click", function (event) {
      event.preventDefault();
      scrollToHash(null);
      pushAnchorState("");
    });
  }
})();
