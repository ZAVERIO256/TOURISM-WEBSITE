<script>
// ===== SAFARI & CITY - FIXED - ONE SCRIPT FOR ALL PAGES =====
document.addEventListener("DOMContentLoaded", function () {

  /* ===== FIX 1: HOME HERO SLIDER - AUTO + BUTTONS - WAS MISSING ===== */
  const heroSlides = document.querySelectorAll('.hero .slide, .slider .slide');
  const heroPrev = document.querySelector('.hero .prev, .slider .prev');
  const heroNext = document.querySelector('.hero .next, .slider .next');
  let heroIndex = 0;
  let heroTimer;

  function showHero(n) {
    if (heroSlides.length === 0) return;
    if (n >= heroSlides.length) heroIndex = 0;
    else if (n < 0) heroIndex = heroSlides.length - 1;
    else heroIndex = n;
    heroSlides.forEach((s, i) => {
      s.style.display = (i === heroIndex) ? 'block' : 'none';
    });
  }
  function startHeroAuto() {
    clearInterval(heroTimer);
    heroTimer = setInterval(() => showHero(heroIndex + 1), 4000);
  }

  if (heroSlides.length > 0) {
    showHero(0);
    startHeroAuto();
    if (heroNext) heroNext.addEventListener('click', () => { showHero(heroIndex + 1); startHeroAuto(); });
    if (heroPrev) heroPrev.addEventListener('click', () => { showHero(heroIndex - 1); startHeroAuto(); });
  }

  /* ===== SECTION 2: PACKAGES SLIDER - AUTO EVERY 4 SECONDS ===== */
  const pkgSlides = document.querySelectorAll('.pkg-slide');
  if (pkgSlides.length > 0) {
    let pkgIndex = 0;
    setInterval(() => {
      pkgSlides[pkgIndex].classList.remove('active');
      pkgIndex = (pkgIndex + 1) % pkgSlides.length;
      pkgSlides[pkgIndex].classList.add('active');
    }, 4000);
  }

  /* ===== SECTION 3: CATEGORY PILLS - CLICK TO HIGHLIGHT ===== */
  const catBtns = document.querySelectorAll('.cat-btn');
  catBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      catBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });

  /* ===== SECTION 5: BOOKING FORM - CHECK AVAILABILITY ===== */
  const bookingForm = document.querySelector('.booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = bookingForm.querySelector('input[type="text"]').value;
      const phone = bookingForm.querySelector('input[type="tel"]').value;
      const date = bookingForm.querySelector('input[type="date"]').value;
      const people = bookingForm.querySelectorAll('select')[0].value;
      const pkg = bookingForm.querySelectorAll('select')[1].value;

      if (!name || !phone || !date || !people || !pkg) {
        alert('Please fill Name, Phone, Date, People and Package.');
        return;
      }

      const message = "Hello Explore Safari & City!%0A%0AName: " + encodeURIComponent(name) +
        "%0APhone: " + encodeURIComponent(phone) +
        "%0ADate: " + encodeURIComponent(date) +
        "%0APeople: " + encodeURIComponent(people) +
        "%0APackage: " + encodeURIComponent(pkg) +
        "%0A%0AI want to check availability.";
      window.open("https://wa.me/256701303855?text=" + message, "_blank");
    });
  }

  /* ===== SEARCH BOX - FILTER TABLE - FIXED SELECTOR ===== */
  const searchInput = document.querySelector('.search-bar input, .header-search input');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const text = this.value.toLowerCase();
      const rows = document.querySelectorAll('.pkg-table tbody tr');
      rows.forEach(row => {
        const rowText = row.textContent.toLowerCase();
        row.style.display = rowText.includes(text) ? '' : 'none';
      });
    });
  }

  /* ===== MOBILE MENU - WAS MISSING ===== */
  const menuIcon = document.querySelector('.menu-icon');
  const nav = document.querySelector('nav');
  if (menuIcon && nav) {
    menuIcon.addEventListener('click', () => nav.classList.toggle('show'));
  }

  /* ===== DESTINATIONS VIDEO SOUND BUTTON ===== */
  const heroVideo = document.getElementById('heroVideo');
  const soundBtn = document.getElementById('soundBtn');
  if (heroVideo && soundBtn) {
    soundBtn.addEventListener('click', () => {
      heroVideo.muted = !heroVideo.muted;
      soundBtn.textContent = heroVideo.muted ? '🔇' : '🔊';
    });
  }

  /* ===== SMOOTH SCROLL FOR LINKS ===== */
  const allLinks = document.querySelectorAll('a[href^="#"]');
  allLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = link.getAttribute('href');
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

});

/* ===== SECTION 7: TESTIMONIALS SLIDER - 10 PEOPLE - MUST BE OUTSIDE ===== */
let testiPos = 0;

function moveTesti(dir) {
  const track = document.getElementById('testiTrack');
  if (!track) return;
  const cards = track.children.length;
  const visible = window.innerWidth <= 900 ? 1 : (window.innerWidth <= 1100 ? 2 : 3);
  const maxPos = cards - visible;

  testiPos += dir;
  if (testiPos < 0) testiPos = maxPos;
  if (testiPos > maxPos) testiPos = 0;

  const cardWidth = track.children[0].offsetWidth + 18;
  track.style.transform = 'translateX(' + (-testiPos * cardWidth) + 'px)';
}

// Auto-slide testimonials every 4 seconds
setInterval(() => { moveTesti(1); }, 4000);

// Fix slider when window resizes
window.addEventListener('resize', function() {
  const track = document.getElementById('testiTrack');
  if (track) {
    track.style.transform = 'translateX(0px)';
    testiPos = 0;
  }
});
</script>