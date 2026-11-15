(() => {
  const duration = 2000; // Animation length in milliseconds
  const selector = "#metrics-grid .metric-value";

  const motionPreference = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const activeAnimations = new Map();

  // Accept numbers such as 42, 12345, 12,345, or 123.45.
  // Leave placeholders and non-numeric text unchanged.
  function parseValue(text) {
    const cleaned = text.trim().replace(/,/g, "");

    if (!/^\d+(?:\.\d+)?$/.test(cleaned)) {
      return null;
    }

    const value = Number(cleaned);

    if (!Number.isFinite(value)) {
      return null;
    }

    const decimals = Math.min(
      (cleaned.split(".")[1] || "").length,
      6
    );

    return { value, decimals };
  }

  function animateCounter(element, target, finalText) {
    if (motionPreference.matches || target.value === 0) {
      element.textContent = finalText;
      return;
    }

    const formatter = new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: target.decimals,
      maximumFractionDigits: target.decimals
    });

    let startTime = null;

    function frame(timestamp) {
      if (startTime === null) {
        startTime = timestamp;
      }

      const progress = Math.min(
        (timestamp - startTime) / duration,
        1
      );

      // Starts quickly and slows gently near the final value.
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      element.textContent = formatter.format(
        target.value * easedProgress
      );

      if (progress < 1) {
        const id = requestAnimationFrame(frame);

        activeAnimations.set(element, {
          id,
          finalText
        });
      } else {
        // Restore exactly what was originally entered.
        element.textContent = finalText;
        activeAnimations.delete(element);
      }
    }

    element.textContent = formatter.format(0);

    const id = requestAnimationFrame(frame);

    activeAnimations.set(element, {
      id,
      finalText
    });
  }

  const viewportObserver =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;

              const element = entry.target;

              // Trigger only once per page load.
              viewportObserver.unobserve(element);

              const finalText = element.textContent.trim();
              const target = parseValue(finalText);

              if (target) {
                animateCounter(element, target, finalText);
              }
            });
          },
          { threshold: 0.5 }
        )
      : null;

  function registerCounters() {
    document.querySelectorAll(selector).forEach((element) => {
      if (element.dataset.counterReady) return;

      const finalText = element.textContent.trim();
      const target = parseValue(finalText);

      if (!target) return;

      element.dataset.counterReady = "true";

      // Keep the final value available to assistive technology.
      element.setAttribute("role", "img");
      element.setAttribute("aria-label", finalText);

      if (viewportObserver && !motionPreference.matches) {
        viewportObserver.observe(element);
      }
    });
  }

  // Your existing script loads metrics asynchronously from JSON.
  // Watch for those elements rather than assuming they already exist.
  const grid = document.querySelector("#metrics-grid");

  if (!grid) return;

  registerCounters();

  const contentObserver = new MutationObserver(registerCounters);

  contentObserver.observe(grid, {
    childList: true,
    subtree: true
  });

  // If reduced motion is enabled during an animation,
  // immediately display the final value.
  motionPreference.addEventListener("change", (event) => {
    if (!event.matches) return;

    activeAnimations.forEach(({ id, finalText }, element) => {
      cancelAnimationFrame(id);
      element.textContent = finalText;
    });

    activeAnimations.clear();

    if (viewportObserver) {
      viewportObserver.disconnect();
    }
  });
})();