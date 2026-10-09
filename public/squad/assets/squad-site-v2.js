(() => {
  const root = document.documentElement;
  root.classList.add("enhanced");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const canObserve = "IntersectionObserver" in window;

  if (canObserve && !reducedMotion.matches) {
    root.classList.add("has-motion");
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    document
      .querySelectorAll(".reveal")
      .forEach((element) => revealObserver.observe(element));
  }

  const tabs = Array.from(document.querySelectorAll("[data-service]"));
  const panels = Array.from(document.querySelectorAll(".service-panel"));
  const stage = document.querySelector(".service-stage");
  const selectService = (tab) => {
    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    panels.forEach((panel) => {
      panel.hidden = panel.id !== tab.getAttribute("aria-controls");
    });
    if (stage) stage.dataset.active = tab.dataset.service;
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectService(tab));
    tab.addEventListener("keydown", (event) => {
      let next;
      if (event.key === "ArrowDown" || event.key === "ArrowRight")
        next = (index + 1) % tabs.length;
      if (event.key === "ArrowUp" || event.key === "ArrowLeft")
        next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      selectService(tabs[next]);
      tabs[next].focus();
    });
  });
  if (tabs.length) selectService(tabs[0]);

  const steps = [
    ["01 / CONTEXTO", "Entender antes de executar."],
    ["02 / PRIORIDADE", "Definir o próximo passo."],
    ["03 / EXECUÇÃO", "Fazer acontecer com direção."],
    ["04 / EVOLUÇÃO", "Aprender com cada entrega."],
  ];
  const stepElements = Array.from(document.querySelectorAll("[data-step]"));
  const visual = document.querySelector(".journey-visual");
  const progress = document.querySelector(".step-progress span");
  const journeyControls = Array.from(
    document.querySelectorAll("[data-journey-select]"),
  );
  const setStep = (index) => {
    if (!steps[index]) return;
    stepElements.forEach((element) =>
      element.classList.toggle(
        "is-active",
        Number(element.dataset.step) === index,
      ),
    );
    if (visual) visual.dataset.step = String(index);
    const cinema = document.querySelector(".journey-fixed");
    if (cinema) cinema.dataset.step = String(index);
    const label = document.getElementById("journey-label");
    const caption = document.getElementById("journey-caption");
    if (label) label.textContent = steps[index][0];
    if (caption) caption.textContent = steps[index][1];
    if (progress) progress.style.width = (index + 1) * 25 + "%";
    journeyControls.forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(Number(button.dataset.journeySelect) === index),
      ),
    );
  };
  journeyControls.forEach((button) =>
    button.addEventListener("click", () => {
      const index = Number(button.dataset.journeySelect);
      stepElements[index]?.scrollIntoView({
        block: "start",
        behavior: reducedMotion.matches ? "auto" : "smooth",
      });
    }),
  );
  if (canObserve) {
    const navLinks = Array.from(
      document.querySelectorAll(".header-inner nav a"),
    );
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) =>
            link.classList.toggle(
              "is-active",
              link.getAttribute("href") === "#" + entry.target.id,
            ),
          );
        });
      },
      { rootMargin: "-15% 0px -50% 0px", threshold: 0 },
    );
    navLinks.forEach((link) => {
      const section = document.getElementById(
        link.getAttribute("href").slice(1),
      );
      if (section) navObserver.observe(section);
    });
  }

  const header = document.querySelector(".site-header");
  const readingProgress = document.querySelector(".reading-progress span");
  const heroPhoto = document.querySelector(".hero-photo");
  let framePending = false;
  const updateScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 30);
    const available = root.scrollHeight - window.innerHeight;
    if (readingProgress)
      readingProgress.style.transform =
        "scaleX(" + (available > 0 ? Math.min(y / available, 1) : 0) + ")";
    if (heroPhoto && !reducedMotion.matches)
      heroPhoto.style.transform =
        "translateY(" + Math.min(y * 0.12, 90) + "px)";
    if (stepElements.length) {
      const focus = window.innerHeight * 0.55;
      let index = 0;
      for (let i = 0; i < stepElements.length; i++) {
        if (stepElements[i].getBoundingClientRect().top <= focus) index = i;
      }
      setStep(index);
    }
    framePending = false;
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!framePending) {
        framePending = true;
        window.requestAnimationFrame(updateScroll);
      }
    },
    { passive: true },
  );
  window.addEventListener("resize", updateScroll);
  updateScroll();

  const form = document.getElementById("quiz");
  if (!form) return;
  const baseMessage =
    "Olá, NEX! Quero conversar sobre o Squad NEX e as demandas de tecnologia da minha empresa.";
  const selectedDemands = () =>
    Array.from(
      form.querySelectorAll('input[name="demand"]:checked'),
      (input) => input.value,
    );
  const updateCount = () => {
    const count = selectedDemands().length;
    const label = document.getElementById("selection-count");
    if (label)
      label.textContent = count
        ? count +
          (count === 1 ? " demanda selecionada" : " demandas selecionadas")
        : "Nenhuma demanda selecionada";
  };
  const updateResult = () => {
    const selected = selectedDemands();
    document.getElementById("result-title").textContent = selected.length
      ? "Um ponto de partida para nossa conversa."
      : "Vamos entender seu cenário.";
    document.getElementById("result-copy").textContent =
      selected.length > 1
        ? "Você identificou diferentes frentes de trabalho. Vamos organizar as prioridades e avaliar se uma operação contínua faz sentido."
        : selected.length === 1
          ? "Vamos entender o escopo dessa demanda e avaliar se ela pede um projeto pontual ou acompanhamento contínuo."
          : "Conte o que precisa avançar na sua empresa. A primeira conversa começa pelo seu contexto.";
    document.getElementById("result-demands").replaceChildren(
      ...selected.map((demand) => {
        const item = document.createElement("li");
        item.textContent = demand;
        return item;
      }),
    );
    const message = selected.length
      ? baseMessage +
        "\n\nHoje, na nossa operação:\n" +
        selected.map((demand) => "• " + demand).join("\n")
      : baseMessage;
    document.getElementById("result-contact").href =
      "https://wa.me/" + (window.NEX_WHATSAPP_NUMBER || "5511953878155") + "?text=" + encodeURIComponent(message);
  };
  const leadIds = () => {
    let visitor = localStorage.getItem("nex_visitor");
    if (!visitor) {
      visitor = crypto.randomUUID();
      localStorage.setItem("nex_visitor", visitor);
    }
    let session = sessionStorage.getItem("nex_session");
    if (!session) {
      session = crypto.randomUUID();
      sessionStorage.setItem("nex_session", session);
    }
    return { visitor, session };
  };
  const sendQuiz = async (payload) => {
    const response = await fetch(
      "/api/leads",
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    if (!response.ok) throw new Error("sync_failed");
  };
  const contactFields = () => {
    const value = (document.getElementById("quiz-contact")?.value || "").trim();
    return /@/.test(value) ? { email: value } : value ? { phone: value } : {};
  };
  const syncQuiz = async (selected) => {
    const status = document.getElementById("quiz-sync");
    const payload = {
      product: "squad",
      source: "squad-diagnostic",
      ...leadIds(),
      status: "submitted",
      consent: true,
      name: (document.getElementById("quiz-name")?.value || "").trim(),
      ...contactFields(),
      answers: { demands: selected.join(" | ") },
    };
    if (status) status.textContent = "Salvando diagnóstico…";
    try {
      await sendQuiz(payload);
      localStorage.removeItem("nex-squad-pending");
      if (status) status.textContent = "Diagnóstico salvo na NEX.";
    } catch {
      localStorage.setItem("nex-squad-pending", JSON.stringify(payload));
      if (status)
        status.textContent =
          "Sem conexão. O diagnóstico será enviado automaticamente quando você reconectar.";
    }
  };
  const flushQuiz = async () => {
    try {
      const raw = localStorage.getItem("nex-squad-pending");
      if (!raw) return;
      await sendQuiz(JSON.parse(raw));
      localStorage.removeItem("nex-squad-pending");
    } catch {
      // Keep the queued diagnostic for the next online event.
    }
  };
  addEventListener("online", flushQuiz);
  flushQuiz();
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const consent = document.getElementById("quiz-consent");
    if (!consent?.checked) {
      consent?.focus();
      return;
    }
    updateCount();
    updateResult();
    window.NEXTracking?.track("squad_quiz_submitted", { selected: selectedDemands().length });
    syncQuiz(selectedDemands());
    const result = document.getElementById("result");
    result.hidden = false;
    result.scrollIntoView({
      block: "nearest",
      behavior: reducedMotion.matches ? "auto" : "smooth",
    });
  });
  let quizStarted = false;
  form.addEventListener("change", () => {
    if (!quizStarted) { quizStarted = true; window.NEXTracking?.track("squad_quiz_started"); }
    window.NEXTracking?.track("squad_quiz_change", { selected: selectedDemands().length });
    updateCount();
    if (!document.getElementById("result").hidden) updateResult();
  });
})();
