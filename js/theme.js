/* Tema: light (tampilan default) atau dark (semua gelap) */
(function () {
  "use strict";

  var KEY = "bahrul-portfolio-theme";
  var root = document.documentElement;

  function apply(theme) {
    if (theme !== "dark") theme = "light";
    root.dataset.theme = theme;

    document.querySelectorAll("[data-theme-choice]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-theme-choice") === theme));
    });

    try {
      localStorage.setItem(KEY, theme);
    } catch (e) {
      /* abaikan jika localStorage tidak tersedia */
    }
  }

  document.querySelectorAll("[data-theme-choice]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      apply(btn.getAttribute("data-theme-choice"));
    });
  });

  apply(root.dataset.theme || "light");
})();
