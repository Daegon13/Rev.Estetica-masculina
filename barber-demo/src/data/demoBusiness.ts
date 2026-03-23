import { DEMO_BIRTHDAY_WINDOW_END, DEMO_TODAY } from "@config/demo";
import { demoServices } from "@data/services";
import { demoMessageTemplates } from "@data/messageTemplates";
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

export const demoDashboardAppointments = demoAppointments.map((appointment) => ({
  ...appointment,
  cliente: clientById.get(appointment.clienteId),
  servicio: serviceById.get(appointment.servicioId),
  profesional: professionalById.get(appointment.profesionalId)
}));

export const upcomingBirthdays = demoClients.filter(
  (client) => client.birthday >= DEMO_TODAY && client.birthday <= DEMO_BIRTHDAY_WINDOW_END
);

export const inactiveClients = demoClients.filter((client) => {
  const lastVisit = new Date(`${client.ultimaVisita}T00:00:00Z`).getTime();
  const today = new Date(`${DEMO_TODAY}T00:00:00Z`).getTime();
  return Math.floor((today - lastVisit) / (1000 * 60 * 60 * 24)) > 30;
});
