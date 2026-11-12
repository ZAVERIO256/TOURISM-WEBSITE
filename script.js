/*
 * SAFARI & CITY TOURS
 * Shared website interactions
 *
 * This file is loaded by all HTML pages.
 * It contains the sliders, navigation, package search and filters,
 * booking/contact actions, and destination video controls.
 */

"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const COMPANY_EMAIL = "info@exploresafariandcity.com";
    const WHATSAPP_NUMBER = "256701303855";

    /* ---------------------------------------------------------
       1. MOBILE NAVIGATION
    --------------------------------------------------------- */
    document.querySelectorAll(".menu-icon").forEach(function (menuButton) {
        const header = menuButton.closest("header");
        const navigation = header ? header.querySelector("nav") : null;

        if (!navigation) return;

        menuButton.addEventListener("click", function () {
            const isOpen = navigation.classList.toggle("show");
            menuButton.setAttribute("aria-expanded", String(isOpen));
        });
    });

    /* ---------------------------------------------------------
       2. HOMEPAGE HERO SLIDER
    --------------------------------------------------------- */
    const heroSlides = document.querySelectorAll(".hero .slide");
    const heroTitle = document.getElementById("heroTitle");
    const heroSubtitle = document.getElementById("heroSub");
    const heroNext = document.getElementById("heroNext");
    const heroPrevious = document.getElementById("heroPrev");

    const heroMessages = [
        {
            title: "EXPLORE SAFARI & CITY<br>THE PEARL OF AFRICA",
            subtitle: "Your adventure starts here. Discover gorillas, mountains, culture and the Nile."
        },
        {
            title: "THE PRIMATE CAPITAL<br>OF THE WORLD",
            subtitle: "Meet endangered mountain gorillas in Bwindi Impenetrable Forest."
        },
        {
            title: "THE SOURCE OF<br>THE NILE",
            subtitle: "Rafting, culture and adventure await at every turn."
        }
    ];

    let heroIndex = 0;
    let heroTimer = null;

    function showHeroSlide(nextIndex) {
        if (!heroSlides.length) return;

        heroIndex = (nextIndex + heroSlides.length) % heroSlides.length;

        heroSlides.forEach(function (slide, index) {
            slide.style.display = index === heroIndex ? "block" : "none";
            slide.classList.toggle("active", index === heroIndex);
        });

        if (heroTitle && heroMessages[heroIndex]) {
            heroTitle.innerHTML = heroMessages[heroIndex].title;
        }

        if (heroSubtitle && heroMessages[heroIndex]) {
            heroSubtitle.textContent = heroMessages[heroIndex].subtitle;
        }
    }

    function restartHeroTimer() {
        if (!heroSlides.length) return;

        window.clearInterval(heroTimer);
        heroTimer = window.setInterval(function () {
            showHeroSlide(heroIndex + 1);
        }, 4000);
    }

    if (heroSlides.length) {
        showHeroSlide(0);
        restartHeroTimer();

        if (heroNext) {
            heroNext.addEventListener("click", function () {
                showHeroSlide(heroIndex + 1);
                restartHeroTimer();
            });
        }

        if (heroPrevious) {
            heroPrevious.addEventListener("click", function () {
                showHeroSlide(heroIndex - 1);
                restartHeroTimer();
            });
        }
    }

    /* ---------------------------------------------------------
       3. PACKAGES HERO SLIDER
    --------------------------------------------------------- */
    const packageSlides = document.querySelectorAll(".pkg-slide");
    const packagePrevious = document.querySelector(".packages-hero .pkg-prev");
    const packageNext = document.querySelector(".packages-hero .pkg-next");

    let packageIndex = 0;
    let packageTimer = null;

    function showPackageSlide(nextIndex) {
        if (!packageSlides.length) return;

        packageIndex = (nextIndex + packageSlides.length) % packageSlides.length;

        packageSlides.forEach(function (slide, index) {
            slide.classList.toggle("active", index === packageIndex);
        });
    }

    function restartPackageTimer() {
        if (!packageSlides.length) return;

        window.clearInterval(packageTimer);
        packageTimer = window.setInterval(function () {
            showPackageSlide(packageIndex + 1);
        }, 5000);
    }

    if (packageSlides.length) {
        showPackageSlide(0);
        restartPackageTimer();

        if (packagePrevious) {
            packagePrevious.addEventListener("click", function () {
                showPackageSlide(packageIndex - 1);
                restartPackageTimer();
            });
        }

        if (packageNext) {
            packageNext.addEventListener("click", function () {
                showPackageSlide(packageIndex + 1);
                restartPackageTimer();
            });
        }
    }

    /* ---------------------------------------------------------
       4. PACKAGE SEARCH AND CATEGORY FILTERS
    --------------------------------------------------------- */
    const packageRows = Array.from(document.querySelectorAll(".pkg-table tbody tr"));
    const categoryButtons = Array.from(document.querySelectorAll(".cat-btn"));
    const packageSearch = document.querySelector(
        ".header-search input, .search-bar input"
    );

    let activeCategory = "all";
    let activeSearch = "";

    function filterPackages() {
        if (!packageRows.length) return;

        let visibleCount = 0;

        packageRows.forEach(function (row) {
            const categoryElement = row.querySelector(".pkg-sub");
            const category = categoryElement
                ? categoryElement.textContent.trim().toLowerCase()
                : "";
            const rowText = row.textContent.toLowerCase();

            const matchesCategory =
                activeCategory === "all" || category === activeCategory;
            const matchesSearch = rowText.includes(activeSearch);

            const shouldShow = matchesCategory && matchesSearch;
            row.style.display = shouldShow ? "" : "none";

            if (shouldShow) visibleCount += 1;
        });

        let emptyRow = document.getElementById("noPackageResults");

        if (!visibleCount) {
            if (!emptyRow) {
                emptyRow = document.createElement("tr");
                emptyRow.id = "noPackageResults";

                const cell = document.createElement("td");
                cell.colSpan = 6;
                cell.textContent = "No packages match your search.";
                cell.style.textAlign = "center";
                cell.style.padding = "18px";

                emptyRow.appendChild(cell);
                const tableBody = document.querySelector(".pkg-table tbody");
                if (tableBody) tableBody.appendChild(emptyRow);
            }
            emptyRow.style.display = "";
        } else if (emptyRow) {
            emptyRow.style.display = "none";
        }
    }

    categoryButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            categoryButtons.forEach(function (item) {
                item.classList.remove("active");
            });

            button.classList.add("active");
            activeCategory = button.textContent.trim().toLowerCase();
            filterPackages();
        });
    });

    if (packageSearch) {
        packageSearch.addEventListener("input", function () {
            activeSearch = packageSearch.value.trim().toLowerCase();
            filterPackages();
        });
    }

    const searchParameters = new URLSearchParams(window.location.search);
    const initialSearch = searchParameters.get("search");

    if (initialSearch && packageSearch) {
        packageSearch.value = initialSearch;
        activeSearch = initialSearch.trim().toLowerCase();
        filterPackages();
    }

    /* ---------------------------------------------------------
       5. PACKAGE BOOKING FORM
       Customers can choose WhatsApp or email.
    --------------------------------------------------------- */
    const bookingForm = document.querySelector(".booking-form");

    function openWhatsApp(message) {
        const url = "https://wa.me/" + WHATSAPP_NUMBER +
            "?text=" + encodeURIComponent(message);

        window.open(url, "_blank", "noopener");
    }

    function openEmail(subject, message) {
        const url = "mailto:" + COMPANY_EMAIL +
            "?subject=" + encodeURIComponent(subject) +
            "&body=" + encodeURIComponent(message);

        window.location.href = url;
    }

    if (bookingForm) {
        const bookingButtons = bookingForm.querySelectorAll(
            "[data-booking-channel]"
        );

        bookingButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                if (!bookingForm.reportValidity()) return;

                const fields = bookingForm.querySelectorAll(
                    "input, select, textarea"
                );

                const name = fields[0] ? fields[0].value.trim() : "";
                const phone = fields[1] ? fields[1].value.trim() : "";
                const date = fields[2] ? fields[2].value : "";
                const people = fields[3] ? fields[3].value : "";
                const selectedPackage = fields[4] ? fields[4].value : "";
                const messageDetails = fields[5] ? fields[5].value.trim() : "";

                const message =
                    "Hello Explore Safari & City!\n\n" +
                    "Booking enquiry\n" +
                    "Name: " + name + "\n" +
                    "Phone: " + phone + "\n" +
                    "Travel date: " + date + "\n" +
                    "Number of people: " + people + "\n" +
                    "Package: " + selectedPackage + "\n" +
                    "Additional message: " + (messageDetails || "None") +
                    "\n\nPlease check availability and get back to me.";

                if (button.dataset.bookingChannel === "whatsapp") {
                    openWhatsApp(message);
                } else {
                    openEmail("Safari booking enquiry", message);
                }
            });
        });
    }

    /* ---------------------------------------------------------
       6. CONTACT FORM
       Customers can send the same enquiry by WhatsApp or email.
    --------------------------------------------------------- */
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        contactForm.querySelectorAll("[data-contact-channel]").forEach(
            function (button) {
                button.addEventListener("click", function () {
                    if (!contactForm.reportValidity()) return;

                    const value = function (id) {
                        const field = document.getElementById(id);
                        return field ? field.value.trim() : "";
                    };

                    const message =
                        "Hello Explore Safari & City!\n\n" +
                        "Name: " + value("cName") + "\n" +
                        "Email: " + value("cEmail") + "\n" +
                        "Phone: " + value("cPhone") + "\n" +
                        "Travel date: " + (value("cDate") || "Not specified") + "\n" +
                        "Interested in: " + value("cPackage") + "\n" +
                        "Message: " + value("cMessage");

                    if (button.dataset.contactChannel === "whatsapp") {
                        openWhatsApp(message);
                    } else {
                        openEmail("Website enquiry", message);
                    }
                });
            }
        );
    }

    /* ---------------------------------------------------------
       7. DESTINATIONS VIDEO SOUND CONTROL
    --------------------------------------------------------- */
    const destinationVideo = document.getElementById("heroVideo");
    const soundButton = document.getElementById("soundBtn");

    if (destinationVideo && soundButton) {
        soundButton.addEventListener("click", function () {
            destinationVideo.muted = !destinationVideo.muted;
            soundButton.textContent = destinationVideo.muted ? "🔇" : "🔊";
            soundButton.setAttribute(
                "aria-label",
                destinationVideo.muted ? "Unmute video" : "Mute video"
            );
        });
    }

    /* ---------------------------------------------------------
       8. HOMEPAGE PARTNERS SLIDER CONTROLS
    --------------------------------------------------------- */
    const partnersGrid = document.querySelector(
        ".partners-wrap .partners-grid"
    );
    const partnersPrevious = document.querySelector(
        ".partners-wrap .prev"
    );
    const partnersNext = document.querySelector(
        ".partners-wrap .next"
    );

    if (partnersGrid && partnersNext) {
        partnersNext.addEventListener("click", function () {
            partnersGrid.scrollBy({ left: 140, behavior: "smooth" });
        });
    }

    if (partnersGrid && partnersPrevious) {
        partnersPrevious.addEventListener("click", function () {
            partnersGrid.scrollBy({ left: -140, behavior: "smooth" });
        });
    }

    /* ---------------------------------------------------------
       9. TESTIMONIAL SLIDER
    --------------------------------------------------------- */
    const testimonialTrack = document.getElementById("testiTrack");
    const testimonialPrevious = document.querySelector(".testi-arrow.prev");
    const testimonialNext = document.querySelector(".testi-arrow.next");

    let testimonialPosition = 0;
    let testimonialTimer = null;

    function visibleTestimonials() {
        if (window.innerWidth <= 700) return 1;
        if (window.innerWidth <= 1100) return 2;
        return 3;
    }

    function moveTestimonials(direction) {
        if (!testimonialTrack || !testimonialTrack.children.length) return;

        const cards = Array.from(testimonialTrack.children);
        const visible = Math.min(visibleTestimonials(), cards.length);
        const maximum = Math.max(0, cards.length - visible);

        testimonialPosition += direction;

        if (testimonialPosition > maximum) testimonialPosition = 0;
        if (testimonialPosition < 0) testimonialPosition = maximum;

        const cardWidth = cards[0].getBoundingClientRect().width;
        const trackStyle = window.getComputedStyle(testimonialTrack);
        const gap = parseFloat(trackStyle.columnGap || trackStyle.gap) || 0;

        testimonialTrack.style.transform =
            "translateX(" + (-(testimonialPosition * (cardWidth + gap))) + "px)";
    }

    function restartTestimonialTimer() {
        if (!testimonialTrack || testimonialTrack.children.length <= 1) return;

        window.clearInterval(testimonialTimer);
        testimonialTimer = window.setInterval(function () {
            moveTestimonials(1);
        }, 4000);
    }

    if (testimonialTrack) {
        if (testimonialPrevious) {
            testimonialPrevious.addEventListener("click", function () {
                moveTestimonials(-1);
                restartTestimonialTimer();
            });
        }

        if (testimonialNext) {
            testimonialNext.addEventListener("click", function () {
                moveTestimonials(1);
                restartTestimonialTimer();
            });
        }

        restartTestimonialTimer();

        window.addEventListener("resize", function () {
            testimonialPosition = 0;
            testimonialTrack.style.transform = "translateX(0)";
        });
    }

    /* ---------------------------------------------------------
       10. SMOOTH SCROLL FOR VALID IN-PAGE LINKS
    --------------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener("click", function (event) {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (target) {
                event.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });

    /* ---------------------------------------------------------
       11. PREVENT BOOKING DATES IN THE PAST
    --------------------------------------------------------- */
    const today = new Date();
    const localToday = new Date(
        today.getTime() - today.getTimezoneOffset() * 60000
    ).toISOString().slice(0, 10);

    document.querySelectorAll('input[type="date"]').forEach(function (dateInput) {
        dateInput.min = localToday;
    });
});
