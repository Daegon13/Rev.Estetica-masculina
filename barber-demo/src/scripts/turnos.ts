type Servicio = {
  nombre: string;
  precio: number;
  duracion: number;
  descripcion: string;
  popular: boolean;
};

function $(sel: string) {
  const el = document.querySelector(sel);
  if (!el) throw new Error(`Missing element: ${sel}`);
  return el as HTMLElement;
}

function encodeWA(phone: string, text: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

function buildMessage(brand: string, servicio?: string, dia?: string, hora?: string) {
  const s = servicio ?? "—";
  const d = dia ?? "—";
  const h = hora ?? "—";
  return `Hola, quiero un turno para ${s} en ${brand}. ¿Tienen disponibilidad el ${d} a las ${h}?`;
}

function genTimes(start = "10:00", end = "19:30") {
  const toMin = (hhmm: string) => {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  };
  const pad = (n: number) => String(n).padStart(2, "0");
  const fmt = (mins: number) => `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`;

  const out: string[] = [];
  for (let t = toMin(start); t <= toMin(end); t += 30) out.push(fmt(t));
  return out;
}

(function init() {
  const cfg = $("#turnosConfig") as HTMLDivElement;

  const brand = cfg.dataset.brand ?? "Barber";
  const phone = cfg.dataset.whatsapp ?? "";
  const services = JSON.parse(cfg.dataset.services ?? "[]") as Servicio[];
  const preselected = (cfg.dataset.preselected ?? "").trim();

  const serviceBtns = Array.from(document.querySelectorAll(".service-btn")) as HTMLButtonElement[];
  const selectedServiceEl = $("#selectedService");
  const selectedDayEl = $("#selectedDay");
  const selectedTimeEl = $("#selectedTime");
  const waCta = $("#waCta") as HTMLAnchorElement;

  const dialog = $("#slotsDialog") as HTMLDialogElement;
  const openSlots = $("#openSlots") as HTMLButtonElement;
  const closeSlots = $("#closeSlots") as HTMLButtonElement;
  const daysList = $("#daysList");
  const timesList = $("#timesList");
  const previewMsg = $("#previewMsg");

  const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const times = genTimes("10:00", "19:30");

  let selectedService: string | undefined;
  let selectedDay: string | undefined;
  let selectedTime: string | undefined;

  function setSelectedService(name: string) {
    selectedService = name;
    selectedServiceEl.textContent = name;

    // styles
    for (const btn of serviceBtns) {
      const is = btn.dataset.service === name;
      btn.classList.toggle("ring-2", is);
      btn.classList.toggle("ring-cyanA-500/40", is);
    }

    refresh();
  }

  function setSelectedDay(day: string) {
    selectedDay = day;
    selectedDayEl.textContent = day;
    refresh();
  }

  function setSelectedTime(time: string) {
    selectedTime = time;
    selectedTimeEl.textContent = time;
    refresh();
  }

  function refresh() {
    const ready = Boolean(selectedService && selectedDay && selectedTime);
    const msg = buildMessage(brand, selectedService, selectedDay, selectedTime);
    previewMsg.textContent = msg;

    if (ready) {
      waCta.href = encodeWA(phone, msg);
      waCta.classList.remove("opacity-60", "pointer-events-none");
    } else {
      waCta.href = "#";
      waCta.classList.add("opacity-60", "pointer-events-none");
    }
  }

  // Populate days
  daysList.innerHTML = "";
  for (const d of days) {
    const b = document.createElement("button");
    b.type = "button";
    b.className =
      "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition text-left";
    b.textContent = d;
    b.addEventListener("click", () => {
      setSelectedDay(d);
      // highlight day buttons
      Array.from(daysList.children).forEach((c) => c.classList.remove("ring-2", "ring-cyanA-500/40"));
      b.classList.add("ring-2", "ring-cyanA-500/40");
    });
    daysList.appendChild(b);
  }

  // Populate times
  timesList.innerHTML = "";
  for (const t of times) {
    const b = document.createElement("button");
    b.type = "button";
    b.className =
      "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition";
    b.textContent = t;
    b.addEventListener("click", () => {
      setSelectedTime(t);
      Array.from(timesList.children).forEach((c) => c.classList.remove("ring-2", "ring-cyanA-500/40"));
      b.classList.add("ring-2", "ring-cyanA-500/40");
    });
    timesList.appendChild(b);
  }

  // Dialog open/close
  openSlots.addEventListener("click", () => dialog.showModal());
  closeSlots.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => {
    const rect = (dialog as any).getBoundingClientRect?.();
    // close if clicked outside content
    if (e.target === dialog) dialog.close();
  });

  // Service button click
  for (const btn of serviceBtns) {
    btn.addEventListener("click", () => {
      const name = btn.dataset.service ?? "";
      if (name) setSelectedService(name);
      dialog.showModal(); // abre directo para que sea “<10s”
    });
  }

  // Preselect
  if (preselected) {
    const exists = services.some((s) => s.nombre.toLowerCase() === preselected.toLowerCase());
    if (exists) setSelectedService(preselected);
  }

  refresh();
})();
