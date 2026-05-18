/* ---------- LENIS SMOOTH SCROLL ---------- */
(() => {
  if (typeof Lenis === "undefined") {
    console.warn("Lenis not found – smooth scrolling disabled");
    return;
  }

  const lenis = new Lenis({
    autoRaf: true,
    smoothWheel: true,
    lerp: 0.1,
    wheelMultiplier: 1,
    touchMultiplier: 1,
    infinite: false,
    overscroll: false,
  });

  window.__lenis = lenis;
})();

/* ---------- LOGO STICKY ON SCROLL/FADE ---------- */

(() => {
  const logo = document.querySelector(".header__brand-logo");
  if (!logo) return;

  const moveUntil = Math.round(window.innerHeight * 0.18); // How long it "travels"
  const hideAt = Math.round(window.innerHeight * 0.25); // When it disappears

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  const onScroll = () => {
    const y = window.scrollY;

    if (y < 10) {
      logo.style.setProperty("--logoY", "0px");
      logo.classList.remove("is-fading", "is-hidden");
      return;
    }

    // Move with scroll, capped so it doesn't keep drifting forever
    const travel = clamp(y, 0, moveUntil);
    logo.style.setProperty("--logoY", `${travel}px`);

    // Start fading once it’s moving
    logo.classList.add("is-fading");

    // Hide before it overlaps content
    if (y >= hideAt) logo.classList.add("is-hidden");
    else logo.classList.remove("is-hidden");
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
})();

/* ---------- BETTER: TYPEWRITER (starts on scroll) ---------- */

(() => {
  const wordEl = document.querySelector(".better__type");
  if (!wordEl) return;

  const words = ["Unique", "Better", "Sharp", "Rare", "Clean", "Precise"];

  const EMPTY_CHAR = "\u200B";

  const typeSpeed = 140;
  const deleteSpeed = 80;
  const holdTime = 1400;
  const betweenTime = 500;

  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;
  let started = false;
  let timerId = null;

  wordEl.textContent = EMPTY_CHAR;
  wordEl.classList.remove("is-ready");

  const stop = () => {
    if (timerId) window.clearTimeout(timerId);
    timerId = null;
  };

  const tick = () => {
    const current = words[wordIndex];

    if (!deleting) {
      charIndex++;
      wordEl.textContent = current.slice(0, charIndex);

      if (charIndex >= current.length) {
        deleting = true;
        timerId = window.setTimeout(tick, holdTime);
        return;
      }

      timerId = window.setTimeout(tick, typeSpeed);
    } else {
      charIndex--;

      if (charIndex <= 0) {
        wordEl.textContent = EMPTY_CHAR;
        charIndex = 0;
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        timerId = window.setTimeout(tick, betweenTime);
        return;
      }

      wordEl.textContent = current.slice(0, charIndex);
      timerId = window.setTimeout(tick, deleteSpeed);
    }
  };

  const start = () => {
    if (started) return;
    started = true;

    wordEl.classList.add("is-ready");
    wordEl.textContent = EMPTY_CHAR;
    wordIndex = 0;
    charIndex = 0;
    deleting = false;

    timerId = window.setTimeout(tick, 0);
  };

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      start();
      observer.disconnect();
    },
    { threshold: 0.6 },
  );

  observer.observe(wordEl);
  window.addEventListener("beforeunload", stop);
})();

/* ---------- SCROLL REVEAL (LESS IS MORE GREEN TEXT) ---------- */

(() => {
  const targets = document.querySelectorAll(".js-rare, .js-reach");
  if (!targets.length) return;

  const fillDistancePx = 150;
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  targets.forEach((target) => {
    target.setAttribute("data-text", target.textContent.trim());
  });

  const update = () => {
    targets.forEach((target) => {
      const rect = target.getBoundingClientRect();

      const startY = target.classList.contains("js-reach")
        ? window.innerHeight * 0.82
        : window.innerHeight * 0.85;

      const progress = clamp((startY - rect.top) / fillDistancePx, 0, 1);

      target.style.setProperty("--reveal", (progress * 100).toFixed(2));
    });
  };

  update();

  let ticking = false;

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;

      ticking = true;

      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    },
    { passive: true },
  );

  window.addEventListener("resize", update);
})();

/* ---------- TOGGLE SWITCH (RESULTS) ---------- */

// Results toggle button -> subtle title colour change
(() => {
  const checkbox = document.getElementById("c3d");
  const resultsSection = document.querySelector(".results");

  if (!checkbox || !resultsSection) return;

  const sync = () => {
    resultsSection.classList.toggle("is-lit", checkbox.checked);
  };

  sync();
  checkbox.addEventListener("change", sync);
})();

/* ---------- FOOTER TITLE REVEAL ON SCROLL ---------- */

(() => {
  const title = document.querySelector(".footer__title");
  if (!title) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      title.classList.add("is-inview");
      observer.disconnect(); // run once
    },
    {
      root: null,
      threshold: 0.25, // triggers when ~25% visible
      rootMargin: "0px 0px -10% 0px", // triggers a touch before fully in view
    },
  );

  observer.observe(title);
})();

/* ---------- CLIENTS TERMINAL ---------- */

const clientsTerminal = (() => {
  const log = document.querySelector(".js-terminal-log");

  if (!log) return null;

  const messages = [
    "running…",
    "loop iteration…",
    "still running…",
    "executing again…",
    "no break condition…",
    "cycle continues…",
  ];

  let count = 0;
  let speed = 400;
  let timerId = null;
  let running = false;

  const reset = () => {
    count = 0;
    speed = 400;

    log.innerHTML = "";

    if (timerId) {
      window.clearTimeout(timerId);
      timerId = null;
    }

    running = false;
  };

  const loop = () => {
    if (!running) return;

    const line = document.createElement("div");

    line.className = "overlay__terminal-line";
    line.textContent = `> ${messages[count % messages.length]}`;

    log.prepend(line);

    if (log.children.length > 12) {
      log.removeChild(log.lastChild);
    }

    count++;

    speed *= 0.95;

    if (speed < 40) {
      speed = 40;
    }

    timerId = window.setTimeout(loop, speed);
  };

  const start = () => {
    reset();

    running = true;

    loop();
  };

  const stop = () => {
    reset();
  };

  return {
    start,
    stop,
  };
})();

/* ---------- FUN OVERLAY IMAGE EFFECT ---------- */

const funOverlayEffect = (() => {
  const image = document.querySelector(".js-fun-image");
  const cursor = document.querySelector(".js-fun-cursor");

  const rotationInfo = document.querySelector(".js-fun-rotation");
  const scaleInfo = document.querySelector(".js-fun-scale");
  const edgesInfo = document.querySelector(".js-fun-edges");

  const shapeButtons = document.querySelectorAll(".overlay__fun-shape");

  if (!image) return null;

  let layers = [];
  let animationFrame = null;

  let mouseX = 0;
  let mouseY = 0;

  let centerX = 0;
  let centerY = 0;

  let isHovered = false;
  let isDragging = false;

  let dragStartY = 0;
  let dragDistance = 0;

  let currentShape = "rectangle";

  const layerTotal = 10;
  const scaleStep = 0.06;

  const updateCenter = () => {
    const rect = image.getBoundingClientRect();

    centerX = rect.left + rect.width / 2;
    centerY = rect.top + rect.height / 2;
  };

  const getShapeClass = () => {
    switch (currentShape) {
      case "triangle":
        return "overlay__fun-shape-triangle";

      case "chevron":
        return "overlay__fun-shape-chevron";

      case "oval":
        return "overlay__fun-shape-oval";

      default:
        return "overlay__fun-shape-rectangle";
    }
  };

  const getEdgeCount = () => {
    switch (currentShape) {
      case "triangle":
        return 3;

      case "chevron":
        return 6;

      case "oval":
        return 0;

      default:
        return 4;
    }
  };

  const createLayers = () => {
    const bgImage = image.style.backgroundImage;

    image.innerHTML = "";

    for (let i = 0; i < layerTotal; i++) {
      const layer = document.createElement("div");

      layer.className = `
        overlay__fun-layer
        ${i === 0 ? "overlay__fun-layer--base" : ""}
        ${i === 0 ? "overlay__fun-shape-rectangle" : getShapeClass()}
      `;

      layer.style.backgroundImage = bgImage;

      image.appendChild(layer);

      layers.push(layer);
    }
  };

  const updateDebug = () => {
    if (rotationInfo) {
      rotationInfo.textContent = `rotation: ${(dragDistance * 0.5).toFixed(1)}`;
    }

    if (scaleInfo) {
      scaleInfo.textContent = `scale: ${(1 + Math.abs(dragDistance) * 0.01).toFixed(1)}`;
    }

    if (edgesInfo) {
      edgesInfo.textContent = `edges: ${getEdgeCount().toFixed(1)}`;
    }
  };

  const updateParallax = () => {
    const deltaX = (mouseX - centerX) / (image.offsetWidth / 2);
    const deltaY = (mouseY - centerY) / (image.offsetHeight / 2);

    layers.forEach((layer, index) => {
      if (index === 0) return;

      const depth = index * 0.25;

      const moveX = deltaX * 20 * depth;
      const moveY = deltaY * 20 * depth;

      const rotation = dragDistance * depth * 0.35;

      const scale = 1 - scaleStep * index;

      gsap.set(layer, {
        x: moveX,
        y: moveY,
        rotationZ: rotation,
        scale,
        transformPerspective: 1000,
      });
    });

    updateDebug();
  };

  const resetTransforms = () => {
    layers.forEach((layer, index) => {
      if (index === 0) return;

      gsap.to(layer, {
        x: 0,
        y: 0,
        rotationZ: 0,
        duration: 0.6,
        ease: "power2.out",
      });
    });

    dragDistance = 0;

    updateDebug();
  };

  const animate = () => {
    if (isHovered) {
      updateParallax();
    }

    animationFrame = requestAnimationFrame(animate);
  };

  const changeShape = (shape) => {
    currentShape = shape;

    layers.forEach((layer, index) => {
      if (index === 0) return;

      layer.classList.remove(
        "overlay__fun-shape-rectangle",
        "overlay__fun-shape-triangle",
        "overlay__fun-shape-chevron",
        "overlay__fun-shape-oval",
      );

      layer.classList.add(getShapeClass());
    });

    shapeButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.shape === shape);
    });

    updateDebug();
  };

  const bindEvents = () => {
    image.addEventListener("mouseenter", () => {
      isHovered = true;

      updateCenter();

      if (cursor) {
        cursor.style.opacity = "1";
      }
    });

    image.addEventListener("mouseleave", () => {
      isHovered = false;

      resetTransforms();

      if (cursor) {
        cursor.style.opacity = "0";
      }
    });

    image.addEventListener("mousemove", (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      if (cursor) {
        cursor.style.left = `${event.clientX}px`;
        cursor.style.top = `${event.clientY}px`;
      }
    });

    image.addEventListener("mousedown", (event) => {
      isDragging = true;

      dragStartY = event.clientY;

      image.classList.add("is-dragging");

      event.preventDefault();
    });

    window.addEventListener("mousemove", (event) => {
      if (!isDragging) return;

      dragDistance = event.clientY - dragStartY;
    });

    window.addEventListener("mouseup", () => {
      isDragging = false;

      image.classList.remove("is-dragging");
    });

    shapeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        changeShape(button.dataset.shape);
      });
    });

    window.addEventListener("resize", updateCenter);
  };

  const start = () => {
    if (typeof gsap === "undefined") {
      console.warn("GSAP missing");
      return;
    }

    if (!layers.length) {
      createLayers();
      bindEvents();
    }

    changeShape("rectangle");

    updateCenter();
    updateDebug();

    if (!animationFrame) {
      animate();
    }
  };

  const stop = () => {
    isHovered = false;
    isDragging = false;

    dragDistance = 0;

    resetTransforms();

    if (cursor) {
      cursor.style.opacity = "0";
    }
  };

  return {
    start,
    stop,
  };
})();

/* ---------- OVERLAYS ---------- */

(() => {
  const openButtons = document.querySelectorAll("[data-overlay-open]");
  const closeButtons = document.querySelectorAll("[data-overlay-close]");

  openButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();

      const overlayName = button.dataset.overlayOpen;

      const overlay = document.querySelector(`.overlay--${overlayName}`);

      if (!overlay) return;

      overlay.classList.add("is-open");

      if (overlayName === "fun" && funOverlayEffect) {
        funOverlayEffect.start();
      }

      if (overlayName === "clients" && clientsTerminal) {
        clientsTerminal.start();
      }
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const overlay = button.closest(".overlay");

      if (!overlay) return;

      overlay.classList.remove("is-open");

      if (overlay.classList.contains("overlay--clients") && clientsTerminal) {
        clientsTerminal.stop();
      }

      if (overlay.classList.contains("overlay--fun") && funOverlayEffect) {
        funOverlayEffect.stop();
      }
    });
  });
})();
