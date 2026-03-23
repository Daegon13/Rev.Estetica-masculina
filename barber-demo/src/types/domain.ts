export type AppointmentStatus = "confirmado" | "pendiente" | "completado" | "cancelado";
export type AppointmentChannel = "web" | "whatsapp" | "instagram" | "recepcion";
export type AutomationChannel = "WhatsApp" | "Email" | "WhatsApp + Email";
export type AutomationStatus = "activa" | "programada";
export type MessageTemplateVariable = "nombre" | "fecha" | "hora" | "descuento";

export interface Service {
  id: string;
  nombre: string;
  precio: number;
  duracion: number;
  descripcion: string;
  popular: boolean;
  imagen?: string;
  alt?: string;
}

export interface Professional {
  id: string;
  nombre: string;
  especialidad: string;
  foto?: string;
  alt?: string;
  servicios: Service["id"][];
  agenda: string;
}

export interface Customer {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  barrio: string;
  birthday: string;
  ultimaVisita: string;
  servicioHabitual: Service["id"];
  profesionalPreferido: Professional["id"];
  totalVisitas: number;
  ticketPromedio: number;
  notas: string;
}

export interface Appointment {
  id: string;
  fecha: string;
  hora: string;
  clienteId: Customer["id"];
  servicioId: Service["id"];
  profesionalId: Professional["id"];
  estado: AppointmentStatus;
  canal: AppointmentChannel;
  nota?: string;
}

export interface AutomationRule {
  id: string;
  nombre: string;
  objetivo: string;
  disparador: string;
  audiencia: string;
  canal: AutomationChannel;
  estado: AutomationStatus;
  proximosEnvios: number;
  impacto: string;
  templateId: MessageTemplate["id"];
}

export interface MessageTemplate {
  id: string;
  name: string;
  subject: string;
  category: string;
  description: string;
  trigger: string;
  channel: AutomationChannel;
  audience: string;
  active: boolean;
  performance: string;
  body: string;
  variables: MessageTemplateVariable[];
}
