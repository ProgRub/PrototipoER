(function ($) {
  "use strict";

  var fullHeight = function () {
    $(".js-fullheight").css("height", $(window).height());
    $(window).resize(function () {
      $(".js-fullheight").css("height", $(window).height());
    });
  };
  fullHeight();

  $("#sidebarCollapse").on("click", function () {
    $("#sidebar").toggleClass("active");
  });
})(jQuery);

/*function teste() {
  if (document.getElementById("sidebar").getAttribute("class") === "active") {
    document.getElementById("sidebar").setAttribute("class", "");
  } else {
    document.getElementById("sidebar").setAttribute("class", "active");
  }
}*/

function teste() {
  if (
    document.getElementById("btnDir").getAttribute("class") ===
    "btn btn-dark d-inline-block d-lg-none ml-auto"
  ) {
    document
      .getElementById("btnDir")
      .setAttribute(
        "class",
        "btn btn-dark d-inline-block d-lg-none ml-auto collapsed"
      );
    document.getElementById("btnDir").setAttribute("aria-expanded", "false");
    document
      .getElementById("navbarSupportedContent")
      .setAttribute("class", "navbar-collapse collapse");
  } else {
    document
      .getElementById("btnDir")
      .setAttribute("class", "btn btn-dark d-inline-block d-lg-none ml-auto");
    document.getElementById("btnDir").setAttribute("aria-expanded", "true");
    document
      .getElementById("navbarSupportedContent")
      .setAttribute("class", "navbar-collapse collapse show");
  }
}
