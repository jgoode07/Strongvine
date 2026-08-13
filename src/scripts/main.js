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

/* ---------- HERO SPECIALIZING WORD ROLL ---------- */

(() => {
  const wordEl = document.querySelector(".js-specializing-word");
  if (!wordEl) return;

  const words = [
    "Website Creation",
    "Brand Identity",
    "Video Storytelling",
    "Print Media",
    "Creative Design",
    "Evocative Marketing",
    "Building Perception",
  ];
  const intervalTime = 2000;
  const animationTime = 900;

  let currentIndex = 0;
  let timerId = null;

  const createWord = (word, modifierClass) => {
    const line = document.createElement("span");
    line.className = `header__specializing-word-line ${modifierClass}`;

    for (let i = 0; i < word.length; i++) {
      const char = document.createElement("span");
      char.className = "header__specializing-char";
      char.textContent = word.charAt(i) === " " ? "\u00A0" : word.charAt(i);
      line.appendChild(char);
    }

    return line;
  };

  const renderWords = (currentWord, nextWord) => {
    wordEl.innerHTML = "";

    const clip = document.createElement("span");
    clip.className = "header__specializing-clip";
    clip.setAttribute("aria-hidden", "true");

    clip.appendChild(
      createWord(currentWord, "header__specializing-word-line--current"),
    );

    clip.appendChild(
      createWord(nextWord, "header__specializing-word-line--next"),
    );

    wordEl.appendChild(clip);
    wordEl.setAttribute("aria-label", currentWord);
  };

  const rollToNext = () => {
    const currentWord = words[currentIndex];
    const nextIndex = (currentIndex + 1) % words.length;
    const nextWord = words[nextIndex];

    renderWords(currentWord, nextWord);

    requestAnimationFrame(() => {
      wordEl.offsetHeight;
      wordEl.classList.add("is-rolling");
    });

    window.setTimeout(() => {
      currentIndex = nextIndex;
      wordEl.classList.remove("is-rolling");

      const followingIndex = (currentIndex + 1) % words.length;
      renderWords(words[currentIndex], words[followingIndex]);
    }, animationTime);
  };

  renderWords(words[currentIndex], words[1]);

  timerId = window.setInterval(rollToNext, intervalTime);

  window.addEventListener("beforeunload", () => {
    if (timerId) window.clearInterval(timerId);
  });
})();

/* ---------- VIDEO LIGHTBOX ---------- */

(() => {
  const openers = document.querySelectorAll("[data-open-video]");
  const popup = document.querySelector(".video-popup");

  if (!openers.length || !popup) return;

  const closeBtn = popup.querySelector(".video-close");
  const iframe = popup.querySelector(".video-popup__iframe");

  const videoUrl = "https://www.youtube.com/embed/_cj6TJfLYVI?autoplay=1";

  const open = () => {
    popup.classList.add("is-open");
    popup.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("is-video-open");

    if (iframe) {
      iframe.src = videoUrl;
    }

    if (window.__lenis) {
      window.__lenis.stop();
    }
  };

  const close = () => {
    popup.classList.remove("is-open");
    popup.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("is-video-open");

    if (iframe) {
      iframe.src = "";
    }

    if (window.__lenis) {
      window.__lenis.start();
    }
  };

  openers.forEach((button) => {
    button.addEventListener("click", open);
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", close);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && popup.classList.contains("is-open")) {
      close();
    }
  });

  popup.addEventListener("click", (event) => {
    if (event.target === popup) {
      close();
    }
  });
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

/* ---------- RESULTS MORPH SVG ---------- */

(() => {
  const section = document.querySelector(".results-morph");
  const svg = document.querySelector(".results-morph__svg");
  const image = document.querySelector(".js-results-morph-image");
  const shape = document.querySelector(".js-results-morph-shape");
  const background = document.querySelector(".js-results-morph-bg");
  const maskBackground = document.querySelector(".js-results-morph-mask-bg");

  if (!section || !svg || !image || !shape || !background || !maskBackground) {
    return;
  }

  const desktopCanvas = {
    x: -20,
    y: -20,
    width: 1087,
    height: 653,
  };

  const mobileCanvas = {
    x: -20,
    y: -20,
    width: 653,
    height: 1087,
  };

  const sourceHeight = 614;
  const mobileMedia = window.matchMedia("(max-width: 640px)");

  const states = [
    {
      img: "https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?q=80&w=2340&auto=format&fit=crop",
      points:
        "0.5,496.237 0.5,350.195 84.903,350.195 84.903,82.23 195.431,82.23 195.431,0.5 387.012,0.5 387.012,157.93 525.675,157.93 525.675,247.699 689.792,247.699 689.792,112.376 881.373,112.376 881.373,32.656 938.312,32.656 938.312,112.376 993.241,112.376 993.241,223.582 1047.5,223.582 1047.5,332.778 993.241,332.778 993.241,388.381 938.312,388.381 938.312,443.314 881.373,443.314 881.373,388.381 689.792,388.381 689.792,550.5 495.531,550.5 495.531,388.381 303.949,388.381 303.949,496.237",
    },
    {
      img: "https://images.unsplash.com/photo-1609869644293-6714a930d4f4?q=80&w=1837&auto=format&fit=crop",
      points:
        "0.5,392 0.5,235 92,235 92,53 359,53 359,235 508,235 508,165.5 735.5,165.5 735.5,0.5 809.5,0.5 809.5,215.5 1047.5,215.5 1047.5,335 957,335 957,428 747,428 747,281.5 645,281.5 645,550 397.5,550 397.5,335 256,335 256,451 148,451 148,392",
    },
    {
      img: "https://images.unsplash.com/photo-1527576539890-dfa815648363?q=80&w=1365&auto=format&fit=crop",
      points:
        "0.5,399.622 0.5,186.328 329.039,186.328 329.039,0.5 492.724,0.5 492.724,121.464 747.021,121.464 747.021,246.518 1047.5,246.518 1047.5,341.185 954.55,341.185 954.55,613.5 640.041,613.5 640.041,341.185 534.815,341.185 534.815,553.31 256.55,553.31 256.55,341.185 133.786,341.185 133.786,399.622",
    },
    {
      img: "https://images.unsplash.com/photo-1531591022136-eb8b0da1e6d0?q=80&w=2012&auto=format&fit=crop",
      points:
        "0.5,293.497 0.5,61.474 54.953,61.474 54.953,31.257 164.936,31.257 164.936,132.699 415.095,132.699 415.095,242.776 440.434,242.776 440.434,71.726 494.348,71.726 494.348,0.5 604.331,0.5 604.331,132.699 580.609,132.699 580.609,242.776 658.784,242.776 658.784,112.195 773.619,112.195 773.619,242.776 939.134,242.776 939.134,323.714 1047.5,323.714 1047.5,403.573 1017.31,403.573 1017.31,491.526 962.856,491.526 962.856,552.5 793.567,552.5 793.567,403.573 658.784,403.573 658.784,530.377 330.451,530.377 330.451,467.784 494.348,467.784 494.348,403.573 550.418,403.573 550.418,323.714 294.868,323.714 294.868,242.776 190.275,242.776 190.275,351.233 78.675,351.233 78.675,293.497",
    },
    {
      img: "https://images.unsplash.com/photo-1598818384697-62330d600309?q=80&w=987&auto=format&fit=crop",
      points:
        "0.5,369.446 0.5,207.288 329.408,207.288 329.408,0.5 522.14,0.5 522.14,300.268 615.901,300.268 615.901,69.677 784.076,69.677 784.076,272.002 848.816,272.002 848.816,170.84 944.809,170.84 944.809,136.623 1047.5,136.623 1047.5,369.446 944.809,369.446 944.809,604.5 784.076,604.5 784.076,529.372 615.901,529.372 615.901,466.889 423.169,466.889 423.169,604.5 256.483,604.5 256.483,466.889 96.494,466.889 96.494,369.446",
    },
  ];

  const parsePoints = (points) =>
    points.split(" ").map((point) => point.split(",").map(Number));

  const buildPoints = (points) =>
    points.map(([x, y]) => `${x.toFixed(3)},${y.toFixed(3)}`).join(" ");

  const normalisePoints = (fromPoints, toPoints) => {
    const maxLength = Math.max(fromPoints.length, toPoints.length);

    const stretch = (points) => {
      const stretched = [...points];

      while (stretched.length < maxLength) {
        stretched.push(stretched[stretched.length - 1]);
      }

      return stretched;
    };

    return [stretch(fromPoints), stretch(toPoints)];
  };

  const easeInOut = (t) => {
    if (t === 0 || t === 1) return t;

    return t < 0.5
      ? Math.pow(2, 20 * t - 10) / 2
      : (2 - Math.pow(2, -20 * t + 10)) / 2;
  };

  const getBounds = (points) =>
    points.reduce(
      (bounds, [x, y]) => ({
        minX: Math.min(bounds.minX, x),
        maxX: Math.max(bounds.maxX, x),
        minY: Math.min(bounds.minY, y),
        maxY: Math.max(bounds.maxY, y),
      }),
      {
        minX: Infinity,
        maxX: -Infinity,
        minY: Infinity,
        maxY: -Infinity,
      },
    );

  const rotatePointsForMobile = (points) => {
    const rotatedPoints = points.map(([x, y]) => [sourceHeight - y, x]);
    const bounds = getBounds(rotatedPoints);
    const shapeWidth = bounds.maxX - bounds.minX;
    const xOffset = (sourceHeight - shapeWidth) / 2 - bounds.minX;

    return rotatedPoints.map(([x, y]) => [x + xOffset, y]);
  };

  states.forEach((state) => {
    const preload = new Image();
    preload.src = state.img;
    state.desktopPoints = parsePoints(state.points);
    state.mobilePoints = rotatePointsForMobile(state.desktopPoints);
  });

  let currentIndex = 0;
  let isMobileLayout = mobileMedia.matches;
  let currentPoints = isMobileLayout
    ? states[0].mobilePoints
    : states[0].desktopPoints;
  let frameId = null;
  let intervalId = null;
  let isVisible = false;

  const getLoopDelay = () => (isMobileLayout ? 3000 : 3500);

  const setSvgCanvas = () => {
    const canvas = isMobileLayout ? mobileCanvas : desktopCanvas;
    const viewBox = `${canvas.x} ${canvas.y} ${canvas.width} ${canvas.height}`;

    svg.setAttribute("viewBox", viewBox);

    [background, maskBackground, image].forEach((element) => {
      element.setAttribute("x", canvas.x);
      element.setAttribute("y", canvas.y);
      element.setAttribute("width", canvas.width);
      element.setAttribute("height", canvas.height);
    });
  };

  const getStatePoints = (state) =>
    isMobileLayout ? state.mobilePoints : state.desktopPoints;

  const setShape = (points) => {
    const value = buildPoints(points);
    shape.setAttribute("points", value);
  };

  const fadeToImage = (src) => {
    image.style.transition = "none";
    image.classList.add("is-changing");
    image.setAttribute("href", src);
    void image.getBoundingClientRect();
    image.style.removeProperty("transition");

    requestAnimationFrame(() => {
      image.classList.remove("is-changing");
    });
  };

  const morphTo = (nextState) => {
    const nextPoints = getStatePoints(nextState);
    const [fromPoints, toPoints] = normalisePoints(currentPoints, nextPoints);

    const duration = 1300;
    const start = performance.now();
    let imageChanged = false;

    const animate = (now) => {
      const elapsed = now - start;
      const rawProgress = Math.min(elapsed / duration, 1);
      const progress = easeInOut(rawProgress);

      const interpolated = fromPoints.map(([fromX, fromY], index) => {
        const [toX, toY] = toPoints[index];

        return [
          fromX + (toX - fromX) * progress,
          fromY + (toY - fromY) * progress,
        ];
      });

      setShape(interpolated);

      if (!imageChanged && elapsed >= 750) {
        imageChanged = true;
        fadeToImage(nextState.img);
      }

      if (rawProgress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        currentPoints = nextPoints;
      }
    };

    if (frameId) {
      cancelAnimationFrame(frameId);
    }

    frameId = requestAnimationFrame(animate);
  };

  setSvgCanvas();
  image.setAttribute("href", states[0].img);
  setShape(currentPoints);

  const syncLayout = () => {
    const nextIsMobileLayout = mobileMedia.matches;

    if (nextIsMobileLayout === isMobileLayout) return;

    if (frameId) {
      cancelAnimationFrame(frameId);
      frameId = null;
    }

    isMobileLayout = nextIsMobileLayout;
    currentPoints = getStatePoints(states[currentIndex]);

    setSvgCanvas();
    setShape(currentPoints);

    if (isVisible) {
      stopLoop();
      startLoop();
    }
  };

  if (typeof mobileMedia.addEventListener === "function") {
    mobileMedia.addEventListener("change", syncLayout);
  } else {
    mobileMedia.addListener(syncLayout);
  }

  const loop = () => {
    currentIndex = (currentIndex + 1) % states.length;
    morphTo(states[currentIndex]);
  };

  const startLoop = () => {
    if (intervalId) return;

    loop();
    intervalId = window.setInterval(loop, getLoopDelay());
  };

  const stopLoop = () => {
    if (intervalId) {
      window.clearInterval(intervalId);
      intervalId = null;
    }

    if (frameId) {
      cancelAnimationFrame(frameId);
      frameId = null;
    }
  };

  if (typeof IntersectionObserver !== "undefined") {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;

        if (isVisible) {
          startLoop();
          return;
        }

        stopLoop();
      },
      {
        root: null,
        threshold: 0,
      },
    );

    observer.observe(section);

    window.addEventListener("beforeunload", () => {
      observer.disconnect();
    });
  } else {
    isVisible = true;
    startLoop();
  }

  window.addEventListener("beforeunload", () => {
    stopLoop();

    if (typeof mobileMedia.removeEventListener === "function") {
      mobileMedia.removeEventListener("change", syncLayout);
    } else {
      mobileMedia.removeListener(syncLayout);
    }
  });
})();

/* ---------- INDUSTRIES MARQUEE ---------- */

(() => {
  const marquee = document.querySelector(".industries-marquee");
  const track = document.querySelector(".industries-marquee__track");
  const group = track?.querySelector(".industries-marquee__group");

  if (!marquee || !track || !group) return;

  const clone = group.cloneNode(true);
  clone.setAttribute("aria-hidden", "true");
  track.appendChild(clone);

  let currentDistance = 0;

  const setDistance = () => {
    const distance = Math.round(group.getBoundingClientRect().width);

    if (distance === currentDistance) return;

    currentDistance = distance;
    track.style.setProperty("--industries-marquee-distance", `-${distance}px`);
    track.classList.add("is-ready");
  };

  setDistance();

  if (document.fonts?.ready) {
    document.fonts.ready.then(setDistance);
  }

  if (typeof ResizeObserver !== "undefined") {
    const observer = new ResizeObserver(setDistance);
    observer.observe(group);

    window.addEventListener("beforeunload", () => {
      observer.disconnect();
    });
  } else {
    window.addEventListener("resize", setDistance);
  }

  if (typeof IntersectionObserver !== "undefined") {
    const observer = new IntersectionObserver(
      ([entry]) => {
        track.classList.toggle("is-visible", entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: "20% 0px",
        threshold: 0,
      },
    );

    observer.observe(marquee);

    window.addEventListener("beforeunload", () => {
      observer.disconnect();
    });
  } else {
    track.classList.add("is-visible");
  }
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
    "Insta Pot",
    "Giant Tiger Canada",
    "Camcor Industries",
    "Anytime Fitness",
    "Pilates Space",
    "Tooth & Nail Brewing",
    "Adidas Canada",
    "Blair Gable",
    "Living With Motion",
    "Osgoode Sand & Gravel",
    "Graham-Ward",
    "Hovey Industries",
    "Excel Precision",
    "TNT Panels",
    "IPmart",
    "Makigiarniq (YWCA)",
    "Formations Inc.",
    "Mayson Realestate",
    "Edmundo Roa",
    "DiSC 4 All",
    "PLAN Accounting",
    "Loudmouth Printing",
    "Ontario Fire Fighters",
    "Belko Auto Body",
    "Ottawa Auto Show",
    "Cody Nicoll",
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
