var btn = $("#button");

$(window).scroll(function() {
    if ($(window).scrollTop() > 300) {
        btn.addClass("show");
    } else {
        btn.removeClass("show");
    }
});

btn.on("click", function(e) {
    e.preventDefault();
    $("html, body").animate({ scrollTop: 0 }, "300");
});

("use strict");

$(".modal").on("shown.bs.modal", function() {
    $(this).find("input:visible:first").focus();
});

$(".toggle-password").click(function() {
    $(this).children().toggleClass("flaticon-seen flaticon-hide");
    let input = $(this).prev();
    input.attr("type", input.attr("type") === "password" ? "text" : "password");
});

AOS.init();

(function($) {
    $(document).ready(function() {
        $(".owl-carousel").owlCarousel({
            loop: true,
            autoplay: true,
            autoplayHoverPause: true,
            responsive: {
                // breakpoint from 0 up
                0: {
                    items: 1,
                    stagePadding: 60,
                    margin: 30,
                },
                // breakpoint from 768 up
                768: {
                    items: 2,
                    stagePadding: 60,
                    margin: 30,
                },
                // breakpoint from 768 up
                992: {
                    items: 3,
                    stagePadding: 100,
                    margin: 30,
                    slideBy: 2,
                },

                // breakpoint from 768 up
                1400: {
                    items: 4,
                    margin: 30,
                    stagePadding: 100,
                    slideBy: 3,
                },
            },
        });
    });
})(jQuery);

const popoverTriggerList = document.querySelectorAll(
    '[data-bs-toggle="popover"]'
);
const popoverList = [...popoverTriggerList].map(
    (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl)
);
const popover = new bootstrap.Popover(".popover-dismiss", {
    trigger: "focus",
});