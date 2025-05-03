(function ($) {
  "use strict";
  $(document).on("click", function (event) {
    var clickover = $(event.target);
    var _opened = $(".navbar-collapse").hasClass("show");

    if (
      _opened === true &&
      !clickover.hasClass("navbar-toggler") &&
      !clickover.closest(".navbar-collapse").length
    ) {
      $(".navbar-collapse").collapse("hide");
    }
  });

  // Smooth scrolling on the navbar links
  $(".navbar-nav a").on("click", function (event) {
    if (this.hash !== "") {
      event.preventDefault();

      var target = $(this.hash);
      var navbarOpen = $(".navbar-collapse").hasClass("show");

      // Pertama tutup navbar jika terbuka
      if (navbarOpen) {
        $(".navbar-collapse").collapse("hide");

        // Beri sedikit waktu untuk transition navbar menutup
        setTimeout(function () {
          // Kemudian lakukan scroll dengan offset yang tepat
          $("html, body").animate(
            {
              scrollTop: target.offset().top - 30,
            },
            1500,
            "easeInOutExpo"
          );
        }, 300); // Waktu tunggu untuk transisi navbar
      } else {
        // Jika navbar tidak terbuka, langsung scroll
        $("html, body").animate(
          {
            scrollTop: target.offset().top - 30,
          },
          1500,
          "easeInOutExpo"
        );
      }

      if ($(this).parents(".navbar-nav").length) {
        $(".navbar-nav .active").removeClass("active");
        $(this).closest("a").addClass("active");
      }
    }
  });
  
  // Typed Initiate
  if ($(".header h2").length == 1) {
    var typed_strings = $(".header .typed-text").text();
    var typed = new Typed(".header h2", {
      strings: typed_strings.split(", "),
      typeSpeed: 100,
      backSpeed: 20,
      smartBackspace: false,
      loop: true,
    });
  }

  // Skills
  $(".skills").waypoint(
    function () {
      $(".progress .progress-bar").each(function () {
        $(this).css("width", $(this).attr("aria-valuenow") + "%");
      });
    },
    { offset: "80%" }
  );

  // Porfolio isotope and filter
  var portfolioIsotope = $(".portfolio-container").isotope({
    itemSelector: ".portfolio-item",
    layoutMode: "fitRows",
  });

  $("#portfolio-flters li").on("click", function () {
    $("#portfolio-flters li").removeClass("filter-active");
    $(this).addClass("filter-active");

    portfolioIsotope.isotope({ filter: $(this).data("filter") });
  });

  // Review slider
  $(".review-slider").slick({
    autoplay: true,
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  });

  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $(".back-to-top").fadeIn("slow");
    } else {
      $(".back-to-top").fadeOut("slow");
    }
  });
  $(".back-to-top").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
    return false;
  });
})(jQuery);
