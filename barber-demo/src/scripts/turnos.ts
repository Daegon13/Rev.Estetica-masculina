type Servicio = {
  id: string;
  nombre: string;
  precio: number;
  duracion: number;
  descripcion: string;
  popular: boolean;
  imagen?: string;
  alt?: string;
};

type Profesional = {
  id: string;
  nombre: string;
  especialidad: string;
  foto?: string;
  alt?: string;
  servicios: string[];
};

type BookingState = {
  serviceId: string;
  professionalId: string;
  dateIso: string;
  time: string;
  name: string;
  phone: string;
  confirmed: boolean;
};

const STORAGE_KEY = "rev-estetica-booking-demo";

const steps = [
  { id: "service", label: "Servicio", helper: "Elegí experiencia" },
  { id: "professional", label: "Profesional", helper: "Quién te atiende" },
  { id: "date", label: "Fecha", helper: "Día disponible" },
  { id: "time", label: "Hora", helper: "Slot sugerido" },
  { id: "details", label: "Datos", helper: "Nombre y teléfono" },
  { id: "confirm", label: "Confirmar", helper: "Resumen final" }
] as const;

function $(sel: string) {
  const el = document.querySelector(sel);
  if (!el) throw new Error(`Missing element: ${sel}`);
  return el as HTMLElement;
}

function encodeWA(phone: string, text: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

function sanitizePhone(value: string) {
  return value.replace(/[^\d+\s-]/g, "").trim();
}

function validateDetails(name: string, phone: string) {
  const errors: string[] = [];
  if (name.trim().length < 3) errors.push("Ingresá un nombre válido de al menos 3 caracteres.");
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 8) errors.push("Ingresá un teléfono válido para continuar.");
  return errors;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency: "UYU",
    maximumFractionDigits: 0
  }).format(value);
}

function formatDateLong(iso: string) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("es-UY", {
    weekday: "long",
    day: "numeric",
    month: "long"
  }).format(new Date(`${iso}T12:00:00`));
}

function buildMessage(brand: string, service: Servicio | undefined, professional: Profesional | undefined, state: BookingState) {
  return [
    `Hola ${brand}, quiero confirmar este turno:`,
    `• Servicio: ${service?.nombre ?? "—"}`,
    `• Profesional: ${professional?.nombre ?? "—"}`,
    `• Fecha: ${formatDateLong(state.dateIso)}`,
    `• Hora: ${state.time || "—"}`,
    `• Cliente: ${state.name || "—"}`,
    `• Teléfono: ${state.phone || "—"}`
  ].join("\n");
}

(function init() {
  const cfg = $("#turnosConfig") as HTMLDivElement;
  const brand = cfg.dataset.brand ?? "Barber";
  const phone = cfg.dataset.whatsapp ?? "";
  const services = JSON.parse(cfg.dataset.services ?? "[]") as Servicio[];
  const professionals = JSON.parse(cfg.dataset.professionals ?? "[]") as Profesional[];
  const dateOffsets = JSON.parse(cfg.dataset.dateOffsets ?? "[]") as number[];
  const timeWindows = JSON.parse(cfg.dataset.timeWindows ?? "[]") as string[];
  const preselected = (cfg.dataset.preselected ?? "").trim().toLowerCase();

  const stepper = $("#bookingStepper");
  const panels = $("#bookingPanels");
  const summary = $("#bookingSummary");
  const nextBtn = $("#bookingNext") as HTMLButtonElement;
  const backBtn = $("#bookingBack") as HTMLButtonElement;
  const resetBtn = $("#bookingReset") as HTMLButtonElement;
  const errorBox = $("#bookingError");
  const progressText = $("#bookingProgressText");
  const progressBar = $("#bookingProgressBar");
  const selectionPills = $("#bookingSelectionPills");

  const initialService = services.find(
    (service) => service.nombre.toLowerCase() === preselected || service.id.toLowerCase() === preselected
  );

  const state: BookingState = {
    serviceId: initialService?.id ?? "",
    professionalId: "",
    dateIso: "",
    time: "",
    name: "",
    phone: "",
    confirmed: false
  };

  let currentStep = initialService ? 1 : 0;

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ state, currentStep }));
  }

  function restoreState() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as { state?: Partial<BookingState>; currentStep?: number };
      Object.assign(state, parsed.state ?? {});
      currentStep = typeof parsed.currentStep === "number" ? Math.min(Math.max(parsed.currentStep, 0), steps.length - 1) : currentStep;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  function getSelectedService() {
    return services.find((service) => service.id === state.serviceId);
  }

  function getAvailableProfessionals() {
    if (!state.serviceId) return professionals;
    return professionals.filter((professional) => professional.servicios.includes(state.serviceId));
  }

  function getSelectedProfessional() {
    return professionals.find((professional) => professional.id === state.professionalId);
  }

  function getAvailableDates() {
    const today = new Date();
    return dateOffsets.map((offset, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + offset);
      const iso = date.toISOString().slice(0, 10);
      const demand = index % 3 === 0 ? "Alta demanda" : index % 2 === 0 ? "Recomendado" : "Disponible";
      return { iso, demand };
    });
  }

  function getAvailableTimes() {
    const professional = getSelectedProfessional();
    if (!state.dateIso) return timeWindows;
    if (professional?.nombre === "Nico") return timeWindows.filter((_, index) => index !== 4 && index !== 8);
    if (professional?.nombre === "Santi") return timeWindows.filter((_, index) => index !== 1 && index !== 7);
    return timeWindows;
  }

  function showError(messages: string[]) {
    if (!messages.length) {
      errorBox.textContent = "";
      errorBox.classList.add("hidden");
      return;
    }

    errorBox.innerHTML = messages.map((message) => `<div>${message}</div>`).join("");
    errorBox.classList.remove("hidden");
  }

  function validateStep(stepIndex: number) {
    switch (steps[stepIndex].id) {
      case "service":
        return state.serviceId ? [] : ["Seleccioná un servicio para avanzar."];
      case "professional":
        return state.professionalId ? [] : ["Elegí un profesional para continuar."];
      case "date":
        return state.dateIso ? [] : ["Elegí una fecha disponible."];
      case "time":
        return state.time ? [] : ["Elegí un horario para reservar."];
      case "details":
        return validateDetails(state.name, state.phone);
      default:
        return [];
    }
  }

  function ensureCompatibility() {
    const availableProfessionals = getAvailableProfessionals();
    if (state.professionalId && !availableProfessionals.some((professional) => professional.id === state.professionalId)) {
      state.professionalId = "";
      state.dateIso = "";
      state.time = "";
    }

    if (state.time && !getAvailableTimes().includes(state.time)) {
      state.time = "";
    }
  }

  function goToStep(stepIndex: number) {
    currentStep = Math.min(Math.max(stepIndex, 0), steps.length - 1);
    state.confirmed = false;
    showError([]);
    render();
  }

  function advanceIfNeeded(targetStep: number) {
    if (currentStep < targetStep) {
      currentStep = targetStep;
      showError([]);
      render();
    }
  }

  function renderStepper() {
    stepper.innerHTML = steps
      .map((step, index) => {
        const active = index === currentStep;
        const done = index < currentStep || (index === steps.length - 1 && state.confirmed);
        return `
          <button type="button" data-step="${index}" class="booking-step rounded-2xl border px-4 py-3 text-left transition ${
            active
              ? "border-[#c8a27c]/45 bg-[#c8a27c]/12"
              : done
                ? "border-emerald-400/25 bg-emerald-500/10"
                : "border-white/10 bg-white/5 hover:bg-white/10"
          }">
            <div class="flex items-center justify-between gap-3">
              <div>
                <div class="text-[11px] uppercase tracking-[0.24em] ${active ? "text-[#e2c3a4]" : "text-zinc-500"}">${String(index + 1).padStart(2, "0")}</div>
                <div class="mt-1 text-sm font-semibold text-white">${step.label}</div>
                <div class="mt-1 text-xs text-zinc-400">${step.helper}</div>
              </div>
              <div class="flex h-9 w-9 items-center justify-center rounded-full border text-xs font-semibold ${done ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200" : active ? "border-[#c8a27c]/40 bg-[#c8a27c]/12 text-white" : "border-white/10 bg-black/20 text-zinc-400"}">
                ${done ? "✓" : index + 1}
              </div>
            </div>
          </button>
        `;
      })
      .join("");

    stepper.querySelectorAll<HTMLButtonElement>("[data-step]").forEach((button) => {
      button.addEventListener("click", () => {
        const target = Number(button.dataset.step);
        if (target <= currentStep) {
          goToStep(target);
        }
      });
    });
  }

  function renderPanels() {
    const service = getSelectedService();
    const selectedProfessional = getSelectedProfessional();
    const availableProfessionals = getAvailableProfessionals();
    const dates = getAvailableDates();
    const times = getAvailableTimes();
    const detailErrors = currentStep === 4 ? validateDetails(state.name, state.phone) : [];

    panels.innerHTML = steps
      .map((step, index) => {
        const hidden = index !== currentStep;
        switch (step.id) {
          case "service":
            return `
              <section class="${hidden ? "hidden" : ""} rounded-[28px] border border-white/10 bg-white/5 p-4 md:p-5">
                <div class="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <div class="text-xs uppercase tracking-[0.24em] text-zinc-500">Paso 1</div>
                    <h3 class="mt-2 text-xl font-semibold text-white">Seleccioná un servicio</h3>
                  </div>
                  <div class="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-zinc-400">Autoadvance activado</div>
                </div>
                <div class="grid gap-3 lg:grid-cols-2">${services
                  .map(
                    (item) => `
                      <button type="button" data-service="${item.id}" class="choice-card rounded-[24px] border p-4 text-left transition ${
                        state.serviceId === item.id
                          ? "border-[#c8a27c]/45 bg-[#c8a27c]/12"
                          : "border-white/10 bg-black/20 hover:bg-white/10"
                      }">
                        <div class="flex items-start justify-between gap-4">
                          <div>
                            <div class="flex flex-wrap items-center gap-2">
                              <div class="text-lg font-semibold text-white">${item.nombre}</div>
                              ${item.popular ? '<span class="rounded-full border border-[#c8a27c]/35 bg-[#c8a27c]/12 px-2 py-1 text-[11px] text-stone-100">Más pedido</span>' : ""}
                            </div>
                            <p class="mt-2 text-sm leading-6 text-zinc-400">${item.descripcion}</p>
                          </div>
                          <div class="text-right">
                            <div class="text-sm text-zinc-400">${item.duracion} min</div>
                            <div class="mt-1 text-base font-semibold text-white">${formatCurrency(item.precio)}</div>
                          </div>
                        </div>
                      </button>
                    `
                  )
                  .join("")}</div>
              </section>
            `;
          case "professional":
            return `
              <section class="${hidden ? "hidden" : ""} rounded-[28px] border border-white/10 bg-white/5 p-4 md:p-5">
                <div class="mb-4">
                  <div class="text-xs uppercase tracking-[0.24em] text-zinc-500">Paso 2</div>
                  <h3 class="mt-2 text-xl font-semibold text-white">Elegí el profesional ideal</h3>
                  <p class="mt-2 text-sm text-zinc-400">Mostramos solo quienes realizan el servicio seleccionado para que el flujo se sienta inteligente.</p>
                </div>
                <div class="grid gap-3 md:grid-cols-2">${availableProfessionals
                  .map(
                    (professional) => `
                      <button type="button" data-professional="${professional.id}" class="choice-card rounded-[24px] border p-4 text-left transition ${
                        state.professionalId === professional.id
                          ? "border-[#c8a27c]/45 bg-[#c8a27c]/12"
                          : "border-white/10 bg-black/20 hover:bg-white/10"
                      }">
                        <div class="flex items-center gap-4">
                          <img src="${professional.foto ?? "/avatar.svg"}" alt="${professional.alt ?? professional.nombre}" class="h-16 w-16 rounded-2xl object-cover" />
                          <div>
                            <div class="text-lg font-semibold text-white">${professional.nombre}</div>
                            <div class="mt-1 text-sm text-zinc-400">${professional.especialidad}</div>
                            <div class="mt-2 text-xs uppercase tracking-[0.2em] text-[#c8a27c]">Disponible para ${service?.nombre ?? "este servicio"}</div>
                          </div>
                        </div>
                      </button>
                    `
                  )
                  .join("")}</div>
              </section>
            `;
          case "date":
            return `
              <section class="${hidden ? "hidden" : ""} rounded-[28px] border border-white/10 bg-white/5 p-4 md:p-5">
                <div class="mb-4">
                  <div class="text-xs uppercase tracking-[0.24em] text-zinc-500">Paso 3</div>
                  <h3 class="mt-2 text-xl font-semibold text-white">Seleccioná una fecha</h3>
                  <p class="mt-2 text-sm text-zinc-400">Slots simulados con etiquetas de demanda para dar sensación de agenda viva.</p>
                </div>
                <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">${dates
                  .map(
                    (date) => `
                      <button type="button" data-date="${date.iso}" class="choice-card rounded-[24px] border p-4 text-left transition ${
                        state.dateIso === date.iso
                          ? "border-[#c8a27c]/45 bg-[#c8a27c]/12"
                          : "border-white/10 bg-black/20 hover:bg-white/10"
                      }">
                        <div class="text-xs uppercase tracking-[0.2em] text-zinc-500">${date.demand}</div>
                        <div class="mt-2 text-lg font-semibold text-white">${formatDateLong(date.iso)}</div>
                        <div class="mt-1 text-sm text-zinc-400">Reserva en menos de 1 minuto</div>
                      </button>
                    `
                  )
                  .join("")}</div>
              </section>
            `;
          case "time":
            return `
              <section class="${hidden ? "hidden" : ""} rounded-[28px] border border-white/10 bg-white/5 p-4 md:p-5">
                <div class="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <div class="text-xs uppercase tracking-[0.24em] text-zinc-500">Paso 4</div>
                    <h3 class="mt-2 text-xl font-semibold text-white">Elegí la hora</h3>
                    <p class="mt-2 text-sm text-zinc-400">Horarios demo con lógica básica por profesional para una experiencia más creíble.</p>
                  </div>
                  <div class="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-right">
                    <div class="text-xs uppercase tracking-[0.2em] text-zinc-500">Fecha</div>
                    <div class="mt-1 text-sm font-semibold text-white">${formatDateLong(state.dateIso)}</div>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">${times
                  .map(
                    (time) => `
                      <button type="button" data-time="${time}" class="choice-card rounded-2xl border px-4 py-4 text-center text-sm font-semibold transition ${
                        state.time === time
                          ? "border-[#c8a27c]/45 bg-[#c8a27c]/12 text-white"
                          : "border-white/10 bg-black/20 text-zinc-200 hover:bg-white/10"
                      }">${time}</button>
                    `
                  )
                  .join("")}</div>
              </section>
            `;
          case "details":
            return `
              <section class="${hidden ? "hidden" : ""} rounded-[28px] border border-white/10 bg-white/5 p-4 md:p-5">
                <div class="mb-4">
                  <div class="text-xs uppercase tracking-[0.24em] text-zinc-500">Paso 5</div>
                  <h3 class="mt-2 text-xl font-semibold text-white">Completá tus datos</h3>
                  <p class="mt-2 text-sm text-zinc-400">Validación básica del lado cliente, persistencia local y estructura lista para migrar después a Supabase o una capa serverless.</p>
                </div>
                <div class="grid gap-4 md:grid-cols-2">
                  <label class="space-y-2 rounded-[24px] border border-white/10 bg-black/20 p-4">
                    <span class="text-xs uppercase tracking-[0.2em] text-zinc-500">Nombre</span>
                    <input id="bookingName" value="${state.name}" placeholder="Ej: Martín Pérez" class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-zinc-500 focus:border-[#c8a27c]/45 focus:outline-none" />
                    <span class="text-xs text-zinc-500">Usamos validación simple para demo y futura integración.</span>
                  </label>
                  <label class="space-y-2 rounded-[24px] border border-white/10 bg-black/20 p-4">
                    <span class="text-xs uppercase tracking-[0.2em] text-zinc-500">Teléfono</span>
                    <input id="bookingPhone" value="${state.phone}" placeholder="Ej: 099 123 456" inputmode="tel" class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-zinc-500 focus:border-[#c8a27c]/45 focus:outline-none" />
                    <span class="text-xs text-zinc-500">Formato libre; normalizamos el input para el CTA final.</span>
                  </label>
                </div>
                ${detailErrors.length ? `<div class="mt-4 rounded-2xl border border-amber-400/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">${detailErrors.join("<br />")}</div>` : ""}
              </section>
            `;
          case "confirm":
            return `
              <section class="${hidden ? "hidden" : ""} rounded-[28px] border border-[#c8a27c]/25 bg-[linear-gradient(180deg,rgba(200,162,124,0.12),rgba(255,255,255,0.03))] p-5 md:p-6">
                <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div class="text-xs uppercase tracking-[0.24em] text-[#e2c3a4]">Paso 6</div>
                    <h3 class="mt-2 text-2xl font-semibold text-white">Confirmá el turno</h3>
                    <p class="mt-2 max-w-2xl text-sm leading-6 text-zinc-200">Pantalla final pensada para demo comercial: resume la reserva, da sensación de estado persistido y ofrece un CTA claro para continuar por WhatsApp.</p>
                  </div>
                  <div class="rounded-2xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">${state.confirmed ? "Turno demo confirmado" : "Listo para confirmar"}</div>
                </div>
                <div class="mt-5 grid gap-3 md:grid-cols-2">
                  ${[
                    ["Servicio", service?.nombre ?? "—"],
                    ["Profesional", selectedProfessional?.nombre ?? "—"],
                    ["Fecha / hora", `${formatDateLong(state.dateIso)} · ${state.time || "—"}`],
                    ["Cliente", state.name || "—"]
                  ]
                    .map(
                      ([label, value]) => `
                        <div class="rounded-2xl border border-white/10 bg-black/20 p-4">
                          <div class="text-xs uppercase tracking-[0.2em] text-zinc-500">${label}</div>
                          <div class="mt-2 text-base font-semibold text-white">${value}</div>
                        </div>
                      `
                    )
                    .join("")}
                </div>
                <div class="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div class="text-xs uppercase tracking-[0.2em] text-zinc-500">Mensaje listo para enviar</div>
                  <pre class="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-200">${buildMessage(brand, service, selectedProfessional, state)}</pre>
                </div>
                <div class="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button type="button" id="confirmBooking" class="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 px-5 text-sm font-semibold text-white transition hover:bg-white/15">Confirmar turno</button>
                  <button type="button" id="editBooking" class="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-transparent px-5 text-sm font-semibold text-zinc-200 transition hover:bg-white/10">Editar datos</button>
                  <a id="bookingWhatsApp" href="${encodeWA(phone, buildMessage(brand, service, selectedProfessional, state))}" target="_blank" rel="noreferrer" class="inline-flex min-h-12 items-center justify-center rounded-2xl border border-[#c8a27c]/40 bg-[#c8a27c]/18 px-5 text-sm font-semibold text-white transition hover:bg-[#c8a27c]/28">Enviar / continuar por WhatsApp</a>
                </div>
              </section>
            `;
          default:
            return "";
        }
      })
      .join("");

    panels.querySelectorAll<HTMLButtonElement>("[data-service]").forEach((button) => {
      button.addEventListener("click", () => {
        state.serviceId = button.dataset.service ?? "";
        state.professionalId = "";
        state.dateIso = "";
        state.time = "";
        ensureCompatibility();
        advanceIfNeeded(1);
      });
    });

    panels.querySelectorAll<HTMLButtonElement>("[data-professional]").forEach((button) => {
      button.addEventListener("click", () => {
        state.professionalId = button.dataset.professional ?? "";
        state.time = "";
        advanceIfNeeded(2);
      });
    });

    panels.querySelectorAll<HTMLButtonElement>("[data-date]").forEach((button) => {
      button.addEventListener("click", () => {
        state.dateIso = button.dataset.date ?? "";
        state.time = "";
        advanceIfNeeded(3);
      });
    });

    panels.querySelectorAll<HTMLButtonElement>("[data-time]").forEach((button) => {
      button.addEventListener("click", () => {
        state.time = button.dataset.time ?? "";
        advanceIfNeeded(4);
      });
    });

    const nameInput = panels.querySelector<HTMLInputElement>("#bookingName");
    const phoneInput = panels.querySelector<HTMLInputElement>("#bookingPhone");
    if (nameInput) {
      nameInput.addEventListener("input", () => {
        state.name = nameInput.value;
        saveState();
        renderSummary();
      });
    }

    if (phoneInput) {
      phoneInput.addEventListener("input", () => {
        phoneInput.value = sanitizePhone(phoneInput.value);
        state.phone = phoneInput.value;
        saveState();
        renderSummary();
      });
    }

    const confirmButton = panels.querySelector<HTMLButtonElement>("#confirmBooking");
    if (confirmButton) {
      confirmButton.addEventListener("click", () => {
        const errors = validateStep(4);
        if (errors.length) {
          currentStep = 4;
          state.confirmed = false;
          showError(errors);
          render();
          return;
        }
        state.confirmed = true;
        showError([]);
        render();
      });
    }

    const editButton = panels.querySelector<HTMLButtonElement>("#editBooking");
    if (editButton) {
      editButton.addEventListener("click", () => goToStep(4));
    }
  }

  function renderSummary() {
    const service = getSelectedService();
    const professional = getSelectedProfessional();
    const summaryItems = [
      ["Servicio", service ? `${service.nombre} · ${formatCurrency(service.precio)}` : "Elegí una opción"],
      ["Profesional", professional?.nombre ?? "Asigná quién te atiende"],
      ["Fecha", state.dateIso ? formatDateLong(state.dateIso) : "Seleccioná un día"],
      ["Hora", state.time || "Elegí un horario"],
      ["Cliente", state.name || "Completá tus datos"],
      ["WhatsApp", state.phone || "Agregá teléfono"]
    ];

    summary.innerHTML = `
      ${summaryItems
        .map(
          ([label, value]) => `
            <div class="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <div class="text-[11px] uppercase tracking-[0.22em] text-zinc-500">${label}</div>
              <div class="mt-2 text-sm font-medium leading-6 text-zinc-100">${value}</div>
            </div>
          `
        )
        .join("")}
      <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
        <div class="text-[11px] uppercase tracking-[0.22em] text-zinc-500">Estado del flujo</div>
        <div class="mt-2 text-sm font-medium text-white">${state.confirmed ? "Demo confirmada y lista para enviar." : `Paso ${currentStep + 1} de ${steps.length}`}</div>
      </div>
    `;
  }

  function renderProgress() {
    const percent = `${((currentStep + 1) / steps.length) * 100}%`;
    progressText.textContent = state.confirmed ? "Reserva demo confirmada" : `Paso ${currentStep + 1} de ${steps.length}`;
    progressBar.style.width = percent;

    const pills = [
      getSelectedService()?.nombre,
      getSelectedProfessional()?.nombre,
      state.dateIso ? formatDateLong(state.dateIso) : "",
      state.time,
      state.name
    ].filter(Boolean) as string[];

    selectionPills.innerHTML = pills.length
      ? pills
          .map(
            (item) => `<span class="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-200">${item}</span>`
          )
          .join("")
      : '<span class="rounded-full border border-dashed border-white/10 px-3 py-1.5 text-xs text-zinc-500">Todavía no hay selección</span>';
  }

  function renderControls() {
    backBtn.disabled = currentStep === 0;
    nextBtn.textContent = currentStep === steps.length - 1 ? (state.confirmed ? "Demo confirmada" : "Validar resumen") : "Continuar";
    nextBtn.disabled = currentStep === steps.length - 1 && state.confirmed;
  }

  function render() {
    ensureCompatibility();
    saveState();
    renderStepper();
    renderPanels();
    renderSummary();
    renderProgress();
    renderControls();
  }

  nextBtn.addEventListener("click", () => {
    if (currentStep === steps.length - 1) {
      const errors = validateStep(4);
      if (errors.length) {
        currentStep = 4;
        state.confirmed = false;
        showError(errors);
        render();
        return;
      }
      state.confirmed = true;
      showError([]);
      render();
      return;
    }

    const errors = validateStep(currentStep);
    if (errors.length) {
      showError(errors);
      return;
    }

    currentStep += 1;
    showError([]);
    render();
  });

  backBtn.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep -= 1;
      state.confirmed = false;
      showError([]);
      render();
    }
  });

  resetBtn.addEventListener("click", () => {
    state.serviceId = initialService?.id ?? "";
    state.professionalId = "";
    state.dateIso = "";
    state.time = "";
    state.name = "";
    state.phone = "";
    state.confirmed = false;
    currentStep = initialService ? 1 : 0;
    localStorage.removeItem(STORAGE_KEY);
    showError([]);
    render();
  });

  restoreState();
  ensureCompatibility();
  render();
})();
