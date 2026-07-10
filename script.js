const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLabel = document.querySelector("[data-nav-label]");
const year = document.querySelector("[data-year]");
const mobileNavigation = window.matchMedia("(max-width: 820px)");

if (year) {
  year.textContent = new Date().getFullYear();
}

const syncHeader = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

if (nav && navToggle && header) {
  const navLinks = [...nav.querySelectorAll("a")];

  const setMenuState = (open, { returnFocus = false } = {}) => {
    const isMobile = mobileNavigation.matches;
    const shouldOpen = isMobile && open;

    nav.classList.toggle("is-open", shouldOpen);
    header.classList.toggle("is-open", shouldOpen);
    document.body.classList.toggle("menu-open", shouldOpen);
    navToggle.setAttribute("aria-expanded", String(shouldOpen));

    if (navLabel) {
      navLabel.textContent = shouldOpen ? "メニューを閉じる" : "メニューを開く";
    }

    if (isMobile && !shouldOpen) {
      nav.setAttribute("inert", "");
      nav.setAttribute("aria-hidden", "true");
    } else {
      nav.removeAttribute("inert");
      nav.removeAttribute("aria-hidden");
    }

    if (shouldOpen) {
      navLinks[0]?.focus();
    } else if (returnFocus && isMobile) {
      navToggle.focus();
    }
  };

  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    setMenuState(!isOpen, { returnFocus: isOpen });
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      setMenuState(false);
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
      setMenuState(false, { returnFocus: true });
    }
  });

  mobileNavigation.addEventListener("change", () => setMenuState(false));
  setMenuState(false);
}

const revealTargets = document.querySelectorAll(
  ".section-heading, .audience-card, .service-card, .process-list li, .promise-grid article, .company-list, .faq-list"
);

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  revealTargets.forEach((target) => target.classList.add("reveal"));

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8%" }
  );

  revealTargets.forEach((target, index) => {
    target.style.transitionDelay = `${Math.min(index % 3, 2) * 70}ms`;
    revealObserver.observe(target);
  });
}
