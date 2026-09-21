/* ---------- RESULTS MORPH SVG ---------- */

(async () => {
  // Temporary quality comparison: set to false to use the optimized WebPs again.
  const USE_ORIGINAL_IMAGES = true;

  const scriptUrl = document.currentScript.src;
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

  const shapeStates = [
    {
      points:
        "0.5,496.237 0.5,350.195 84.903,350.195 84.903,82.23 195.431,82.23 195.431,0.5 387.012,0.5 387.012,157.93 525.675,157.93 525.675,247.699 689.792,247.699 689.792,112.376 881.373,112.376 881.373,32.656 938.312,32.656 938.312,112.376 993.241,112.376 993.241,223.582 1047.5,223.582 1047.5,332.778 993.241,332.778 993.241,388.381 938.312,388.381 938.312,443.314 881.373,443.314 881.373,388.381 689.792,388.381 689.792,550.5 495.531,550.5 495.531,388.381 303.949,388.381 303.949,496.237",
    },
    {
      points:
        "0.5,392 0.5,235 92,235 92,53 359,53 359,235 508,235 508,165.5 735.5,165.5 735.5,0.5 809.5,0.5 809.5,215.5 1047.5,215.5 1047.5,335 957,335 957,428 747,428 747,281.5 645,281.5 645,550 397.5,550 397.5,335 256,335 256,451 148,451 148,392",
    },
    {
      points:
        "0.5,399.622 0.5,186.328 329.039,186.328 329.039,0.5 492.724,0.5 492.724,121.464 747.021,121.464 747.021,246.518 1047.5,246.518 1047.5,341.185 954.55,341.185 954.55,613.5 640.041,613.5 640.041,341.185 534.815,341.185 534.815,553.31 256.55,553.31 256.55,341.185 133.786,341.185 133.786,399.622",
    },
    {
      points:
        "0.5,293.497 0.5,61.474 54.953,61.474 54.953,31.257 164.936,31.257 164.936,132.699 415.095,132.699 415.095,242.776 440.434,242.776 440.434,71.726 494.348,71.726 494.348,0.5 604.331,0.5 604.331,132.699 580.609,132.699 580.609,242.776 658.784,242.776 658.784,112.195 773.619,112.195 773.619,242.776 939.134,242.776 939.134,323.714 1047.5,323.714 1047.5,403.573 1017.31,403.573 1017.31,491.526 962.856,491.526 962.856,552.5 793.567,552.5 793.567,403.573 658.784,403.573 658.784,530.377 330.451,530.377 330.451,467.784 494.348,467.784 494.348,403.573 550.418,403.573 550.418,323.714 294.868,323.714 294.868,242.776 190.275,242.776 190.275,351.233 78.675,351.233 78.675,293.497",
    },
    {
      points:
        "0.5,369.446 0.5,207.288 329.408,207.288 329.408,0.5 522.14,0.5 522.14,300.268 615.901,300.268 615.901,69.677 784.076,69.677 784.076,272.002 848.816,272.002 848.816,170.84 944.809,170.84 944.809,136.623 1047.5,136.623 1047.5,369.446 944.809,369.446 944.809,604.5 784.076,604.5 784.076,529.372 615.901,529.372 615.901,466.889 423.169,466.889 423.169,604.5 256.483,604.5 256.483,466.889 96.494,466.889 96.494,369.446",
    },
  ];

  let slides;
  try {
    const response = await fetch(new URL("../data/gallery.json", scriptUrl));
    if (!response.ok) return;
    slides = await response.json();
  } catch {
    return;
  }
  if (!Array.isArray(slides) || !slides.length) return;
  const imageBase = new URL("../assets/img/gallery/", scriptUrl);
  const states = slides.map((slide, index) => ({
    points: shapeStates[index % shapeStates.length].points,
    img: new URL(`${slide.slug}-1440.webp`, imageBase).href,
    mobileImg: new URL(`${slide.slug}-960.webp`, imageBase).href,
    originalImg: new URL(slide.source, imageBase).href,
    alt: slide.alt,
  }));
  const getImageSource = (state) => {
    if (USE_ORIGINAL_IMAGES) return state.originalImg;
    return mobileMedia.matches || navigator.connection?.saveData
      ? state.mobileImg
      : state.img;
  };
  const preloadState = (state) => {
    const preload = new Image();
    preload.decoding = "async";
    preload.fetchPriority = "low";
    preload.src = getImageSource(state);
  };

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

  const fadeToImage = (src, alt) => {
    image.style.transition = "none";
    image.classList.add("is-changing");
    image.setAttribute("href", src);
    svg.setAttribute("aria-label", alt);
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
        fadeToImage(getImageSource(nextState), nextState.alt);
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
  image.setAttribute("href", getImageSource(states[0]));
  svg.setAttribute("aria-label", states[0].alt);
  preloadState(states[1 % states.length]);
  setShape(currentPoints);

  const syncLayout = () => {
    const nextIsMobileLayout = mobileMedia.matches;

    if (nextIsMobileLayout === isMobileLayout) return;

    if (frameId) {
      cancelAnimationFrame(frameId);
      frameId = null;
    }

    isMobileLayout = nextIsMobileLayout;
    image.setAttribute("href", getImageSource(states[currentIndex]));
    preloadState(states[(currentIndex + 1) % states.length]);
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
    preloadState(states[(currentIndex + 1) % states.length]);
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
