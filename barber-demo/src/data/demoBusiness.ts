import { DEMO_BIRTHDAY_WINDOW_END, DEMO_TODAY, DEMO_TODAY_LABEL } from "@config/demo";
import { demoServices } from "@data/services";
import type { Appointment, AppointmentStatus, AutomationRule, Customer, Professional } from "@types/domain";

export type DemoProfessional = Professional;
export type DemoClient = Customer;
export type DemoAppointment = Appointment;
export type DemoAutomation = AutomationRule;
export type { AppointmentStatus } from "@types/domain";

export { demoProfessionals, demoClients, demoAppointments, demoAutomations } from "@data/mock/demoBusiness";
import {
  demoProfessionals,
  demoClients,
  demoAppointments,
  demoAutomations
} from "@data/mock/demoBusiness";

const serviceById = new Map(demoServices.map((service) => [service.id, service]));
const clientById = new Map(demoClients.map((client) => [client.id, client]));
const professionalById = new Map(demoProfessionals.map((professional) => [professional.id, professional]));

const todayDate = new Date(`${DEMO_TODAY}T00:00:00Z`);
const todayTime = todayDate.getTime();

const diffDaysFromToday = (date: string) => {
  const dateTime = new Date(`${date}T00:00:00Z`).getTime();
  return Math.floor((todayTime - dateTime) / (1000 * 60 * 60 * 24));
};

const formatDate = (date: string, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("es-UY", { timeZone: "UTC", ...options }).format(new Date(`${date}T00:00:00Z`));

export const demoDashboardAppointments = demoAppointments.map((appointment) => ({
  ...appointment,
  cliente: clientById.get(appointment.clienteId),
  servicio: serviceById.get(appointment.servicioId),
  profesional: professionalById.get(appointment.profesionalId)
}));

export const upcomingBirthdays = demoClients.filter(
  (client) => client.birthday >= DEMO_TODAY && client.birthday <= DEMO_BIRTHDAY_WINDOW_END
);

export const inactiveClients = demoClients.filter((client) => diffDaysFromToday(client.ultimaVisita) > 30);

const clientsThisMonth = demoClients.filter((client) => client.ultimaVisita.startsWith(DEMO_TODAY.slice(0, 7)));
const todayAppointments = demoDashboardAppointments.filter((appointment) => appointment.fecha === DEMO_TODAY);
const activeCampaigns = demoAutomations.filter((automation) => automation.estado === "activa");
const scheduledReminders = demoAutomations.reduce((total, automation) => total + automation.proximosEnvios, 0);
const todayCompleted = todayAppointments.filter((appointment) => appointment.estado === "completado").length;
const todayPending = todayAppointments.filter((appointment) => appointment.estado === "pendiente").length;
const todayConfirmed = todayAppointments.filter((appointment) => appointment.estado === "confirmado").length;

const agendaTimeline = todayAppointments.map((appointment) => {
  const cliente = appointment.cliente;
  const servicio = appointment.servicio;
  const profesional = appointment.profesional;

  return {
    id: appointment.id,
    hora: appointment.hora,
    cliente: cliente?.nombre ?? "Cliente demo",
    servicio: servicio?.nombre ?? "Servicio demo",
    profesional: profesional?.nombre ?? "Profesional demo",
    estado: appointment.estado,
    canal: appointment.origen,
    ticket: servicio?.precio ?? 0,
    nota: appointment.nota ?? cliente?.notas ?? "Seguimiento comercial disponible desde el perfil del cliente."
  };
});

export const clientListRows = demoClients.map((client) => {
  const preferredProfessional = professionalById.get(client.profesionalPreferido);
  const favoriteService = serviceById.get(client.servicioHabitual);
  const daysInactive = diffDaysFromToday(client.ultimaVisita);

  let segment = "Activo";
  let nextAction = "Pedir reseña después de la próxima visita";

  if (daysInactive > 45) {
    segment = "Win-back";
    nextAction = "Recuperar con combo premium y horario preferido";
  } else if (daysInactive > 30) {
    segment = "En riesgo";
    nextAction = "Recordar última visita y ofrecer nuevo turno";
  } else if (upcomingBirthdays.some((birthdayClient) => birthdayClient.id === client.id)) {
    segment = "Cumple pronto";
    nextAction = "Enviar beneficio de cumpleaños 48 hs antes";
  }

  return {
    id: client.id,
    nombre: client.nombre,
    telefono: client.telefono,
    barrio: client.barrio,
    ultimaVisita: formatDate(client.ultimaVisita, { day: "2-digit", month: "short" }),
    servicioHabitual: favoriteService?.nombre ?? "Servicio demo",
    profesional: preferredProfessional?.nombre ?? "Profesional demo",
    valor: `UYU ${client.ticketPromedio.toLocaleString("es-UY")}`,
    segmento: segment,
    siguienteAccion: nextAction,
    notas: client.notas
  };
});

export const adminDemoMetrics = {
  todayLabel: DEMO_TODAY_LABEL,
  todayAppointments: todayAppointments.length,
  clientsThisMonth: clientsThisMonth.length,
  scheduledReminders,
  activeCampaigns: activeCampaigns.length,
  todayCompleted,
  todayPending,
  todayConfirmed,
  occupancyRate: Math.round((todayAppointments.length / 12) * 100),
  estimatedRevenue: todayAppointments.reduce((total, appointment) => total + (serviceById.get(appointment.servicioId)?.precio ?? 0), 0),
  reactivationPoolValue: inactiveClients.reduce((total, client) => total + client.ticketPromedio, 0),
  birthdayOpportunities: upcomingBirthdays.length
};

export const adminDemoSummaryCards = [
  {
    id: "turnos",
    label: "Turnos de hoy",
    value: String(adminDemoMetrics.todayAppointments),
    supporting: `${adminDemoMetrics.todayConfirmed} confirmados · ${adminDemoMetrics.todayPending} pendientes`,
    detail: `${adminDemoMetrics.todayCompleted} ya atendidos · ocupación estimada ${adminDemoMetrics.occupancyRate}%`,
    accent: "from-emerald-400/18 via-emerald-300/8 to-transparent",
    icon: "calendar"
  },
  {
    id: "clientes",
    label: "Clientes del mes",
    value: String(adminDemoMetrics.clientsThisMonth),
    supporting: `${demoClients.length} en la base demo`,
    detail: `${adminDemoMetrics.birthdayOpportunities} con cumpleaños cercano para activar recurrencia`,
    accent: "from-sky-400/18 via-sky-300/8 to-transparent",
    icon: "users"
  },
  {
    id: "recordatorios",
    label: "Recordatorios programados",
    value: String(adminDemoMetrics.scheduledReminders),
    supporting: `${demoAutomations.length} automatizaciones configuradas`,
    detail: "WhatsApp y seguimiento comercial listos para ejecutarse sin trabajo manual.",
    accent: "from-amber-300/18 via-amber-200/8 to-transparent",
    icon: "bell"
  },
  {
    id: "campanas",
    label: "Campañas activas",
    value: String(adminDemoMetrics.activeCampaigns),
    supporting: `Bolsa win-back: UYU ${adminDemoMetrics.reactivationPoolValue.toLocaleString("es-UY")}`,
    detail: "Campañas de cumpleaños, reactivación y reseñas visibles como parte del producto.",
    accent: "from-fuchsia-400/18 via-fuchsia-300/8 to-transparent",
    icon: "spark"
  }
] as const;

export const adminDemoHighlights = [
  {
    label: "Ingreso estimado del día",
    value: `UYU ${adminDemoMetrics.estimatedRevenue.toLocaleString("es-UY")}`,
    note: "Ticket proyectado según agenda demo"
  },
  {
    label: "Clientes a reactivar",
    value: String(inactiveClients.length),
    note: "Listos para secuencia win-back"
  },
  {
    label: "Cumpleaños próximos",
    value: String(adminDemoMetrics.birthdayOpportunities),
    note: "Oportunidades de mensaje + beneficio"
  }
] as const;

export const adminAgendaTimeline = agendaTimeline;

export const adminCampaignFeed = demoAutomations.map((automation) => ({
  id: automation.id,
  nombre: automation.nombre,
  objetivo: automation.objetivo,
  estado: automation.estado,
  disparador: automation.disparador,
  audiencia: automation.audiencia,
  proximosEnvios: automation.proximosEnvios,
  impacto: automation.impacto
}));
