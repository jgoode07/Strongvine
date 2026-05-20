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

  const words = [
    "Bold",
    "Fresh",
    "Smart",
    "Crisp",
    "Sleek",
    "Clear",
    "Exact",
    "Agile",
    "Pure",
  ];

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
    "Giant Tiger",
    "Instapot",
    "Tooth and Nail Brewing",
    "Pilates Space",
    "Ottawa International Hockey Show",
    "Aquaworld Resort",
    "Anytime Fitness",
    "Bar Lupulus",
    "Women In Tech",
    "Mountain Goat Yoga",
    "Ottawa Autoshow",
    "Fuel Bar",
    "The Soundroom",
    "Central Dental",
    "Camcor Canada",
    "Govmatch",
    "Hovey Industries",
    "LuxCarta",
    "United Edge Structural Components",
    "CanvaStands",
    "HEAR Worldwide",
    "Appletree Medical Group",
    "WirelessPSC",
    "Belko",
    "NextGen Datasheet",
    "Groundforce Computers",
    "Billet Precision",
    "Argyle Associates",
    "Medfit Rehab",
    "Cissec Inc",
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
  const overlay = document.querySelector(".overlay--fun");
  if (!overlay) return null;

  const container = overlay.querySelector("[data-fun-image-hover]");
  const shapeControls = overlay.querySelector("[data-fun-shape-controls]");

  if (!container || !shapeControls) return null;

  let initialized = false;
  let layers = [];
  let stackEl = null;
  let timeline = null;

  let isHovered = false;
  let isParallax = false;
  let isRotation = false;
  let isBlur = false;
  let isColor = false;
  let isOpacity = false;
  let is3D = false;

  let rect = null;
  let rafId = null;
  let pendingMouseEvent = null;

  const duration = 0.8;
  const ease = "power2.inOut";
  const scaleInterval = 0.06;
  const opacityInterval = 0.05;
  const rotationInterval = 15;
  const stagger = 0.1;
  const followStrength = 0.15;
  const blurSeq = [0, 0.1, 0.2, 0.3, 0.4, 0.6, 0.8, 1.0, 1.3, 1.6];

  const getScale = (i) => Math.max(1 - scaleInterval * i, 0);

  const getOpacity = (i) => {
    if (!isOpacity) return 1;
    return Math.max(1 - opacityInterval * i, 0.1);
  };

  const getRotation = (i) => {
    if (!isRotation) return 0;
    return rotationInterval * i * (i % 2 === 0 ? 1 : -1);
  };

  const getBlur = (i) => {
    if (!isBlur || i === 0) return 0;
    return blurSeq[Math.min(i, blurSeq.length - 1)];
  };

  const getColour = (i) => {
    if (!isColor) return "none";
    if (i === 0) return "grayscale(1)";

    const colourIndex = Math.min(i * 0.15, 1);
    const saturation = 1 + colourIndex * 0.5;

    return `grayscale(${1 - colourIndex}) saturate(${saturation})`;
  };

  const applyFilters = () => {
    layers.forEach((layer, index) => {
      const blur = getBlur(index);
      const colour = getColour(index);

      let filter = "";

      if (blur > 0) {
        filter += `blur(${blur}px) `;
      }

      if (colour !== "none") {
        filter += colour;
      }

      layer.style.filter = filter.trim() || "none";
    });
  };

  const reset2D = () => {
    gsap.killTweensOf(stackEl);

    gsap.set(layers, {
      scale: (i, target) => (target === layers[0] ? 1 : 0.95),
      opacity: (i, target) => (target === layers[0] ? 1 : 0),
      rotation: 0,
      x: 0,
      y: 0,
      z: 0,
    });

    gsap.set(stackEl, {
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      x: 0,
      y: 0,
      z: 0,
      scale: 1,
    });

    layers.forEach((layer) => {
      layer.style.filter = "none";
    });
  };

  const createTimeline = () => {
    if (timeline) {
      timeline.kill();
    }

    const reversedLayers = [...layers].reverse();

    timeline = gsap.timeline({ paused: true }).to(reversedLayers, {
      scale: (i, target) => {
        const index = layers.indexOf(target);
        return getScale(index);
      },
      opacity: (i, target) => {
        const index = layers.indexOf(target);
        return index === 0 ? 1 : getOpacity(index);
      },
      rotation: (i, target) => {
        const index = layers.indexOf(target);
        return getRotation(index);
      },
      duration,
      ease,
      stagger,
    });

    applyFilters();
  };

  const applyShape = (shape) => {
    layers.forEach((layer, index) => {
      if (index === 0) return;

      layer.classList.remove("rectangle", "circle", "diamond", "hexagon");
      layer.classList.add(shape);
    });
  };

  const centre2D = () => {
    layers.forEach((layer, index) => {
      if (index === 0) return;

      gsap.to(layer, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      });
    });
  };

  const layout3D = () => {
    layers.forEach((layer, index) => {
      const z = index * 36;
      const scale = Math.max(1 - index * 0.07, 0.35);
      const opacity = isOpacity
        ? Math.max(1 - 0.1 * index, 0.1)
        : Math.max(1 - 0.1 * index, 0.25);
      const rotationZ = getRotation(index);

      layer.style.transform = `translateZ(${z}px) scale(${scale}) rotateZ(${rotationZ}deg)`;
      layer.style.opacity = opacity;
    });

    applyFilters();
  };

  const enable3D = () => {
    is3D = true;
    container.classList.add("is-3d");
    if (timeline) timeline.pause(0);
    layout3D();
  };

  const disable3D = () => {
    is3D = false;
    container.classList.remove("is-3d");
    reset2D();
    createTimeline();
  };

  const onEnter = () => {
    isHovered = true;
    rect = container.getBoundingClientRect();

    if (is3D) {
      layout3D();
    } else if (timeline) {
      timeline.play();
    }
  };

  const onLeave = () => {
    isHovered = false;

    if (is3D) {
      gsap.to(stackEl, {
        rotationX: 0,
        rotationY: 0,
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      });
    } else if (timeline && !isParallax) {
      timeline.reverse();
    }

    if (isParallax) {
      centre2D();
    }
  };

  const processMouseMove = () => {
    if (!pendingMouseEvent) {
      rafId = null;
      return;
    }

    const event = pendingMouseEvent;
    pendingMouseEvent = null;
    rafId = null;

    if (!rect) {
      rect = container.getBoundingClientRect();
    }

    if (is3D && isHovered) {
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

      gsap.to(stackEl, {
        rotationY: x * 30,
        rotationX: -y * 30,
        x: x * 45,
        y: y * 45,
        duration: 0.18,
        ease: "power2.out",
      });

      return;
    }

    if (!isParallax || !isHovered) return;

    const rx = (event.clientX - rect.left) / rect.width - 0.5;
    const ry = (event.clientY - rect.top) / rect.height - 0.5;

    layers.forEach((layer, index) => {
      if (index === 0) return;

      const scale = 1 - scaleInterval * index;
      const mult = scale > 0 ? (1 - scale) * 3 + 0.2 : 1;

      gsap.to(layer, {
        x: rx * 2 * rect.width * followStrength * mult,
        y: ry * 2 * rect.height * followStrength * mult,
        duration: 0.6,
        ease: "power3",
      });
    });
  };

  const onMove = (event) => {
    pendingMouseEvent = event;

    if (!rafId) {
      rafId = requestAnimationFrame(processMouseMove);
    }
  };

  const initShapeControls = () => {
    const buttons = shapeControls.querySelectorAll("[data-shape]");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        buttons.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");

        reset2D();
        applyShape(button.dataset.shape);
        createTimeline();

        if (isHovered && timeline) {
          timeline.play();
        }

        if (is3D) {
          layout3D();
        }
      });
    });
  };

  const initToggleControls = () => {
    const toggles = [
      ["[data-rotation-toggle]", "rotation"],
      ["[data-blur-toggle]", "blur"],
      ["[data-color-toggle]", "color"],
      ["[data-opacity-toggle]", "opacity"],
      ["[data-parallax-toggle]", "parallax"],
      ["[data-3d-toggle]", "3d"],
    ];

    toggles.forEach(([selector, name]) => {
      const button = overlay.querySelector(selector);
      if (!button) return;

      button.addEventListener("click", () => {
        button.classList.toggle("active");

        const isActive = button.classList.contains("active");
        button.textContent = isActive ? `${name} on` : name;

        if (name === "rotation") isRotation = isActive;
        if (name === "blur") isBlur = isActive;
        if (name === "color") isColor = isActive;
        if (name === "opacity") isOpacity = isActive;
        if (name === "parallax") isParallax = isActive;

        if (name === "3d") {
          isActive ? enable3D() : disable3D();
          return;
        }

        if (is3D) {
          layout3D();
        } else {
          createTimeline();

          if (isHovered && timeline) {
            timeline.progress(1);
          }
        }
      });
    });
  };

  const init = () => {
    if (initialized) return;

    stackEl = document.createElement("div");
    stackEl.className = "overlay__fun-stack";

    const rawLayers = Array.from(
      container.querySelectorAll(".overlay__fun-layer"),
    );

    container.appendChild(stackEl);
    rawLayers.forEach((layer) => stackEl.appendChild(layer));

    layers = Array.from(stackEl.querySelectorAll(".overlay__fun-layer"));

    rect = container.getBoundingClientRect();

    reset2D();
    createTimeline();

    container.addEventListener("mouseenter", onEnter);
    container.addEventListener("mouseleave", onLeave);
    document.addEventListener("mousemove", onMove);

    window.addEventListener("resize", () => {
      rect = container.getBoundingClientRect();
    });

    initShapeControls();
    initToggleControls();

    initialized = true;
  };

  const start = () => {
    if (typeof gsap === "undefined") {
      console.warn("GSAP missing");
      return;
    }

    init();
    rect = container.getBoundingClientRect();
  };

  const stop = () => {
    isHovered = false;

    if (timeline) {
      timeline.reverse();
    }

    centre2D();
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
