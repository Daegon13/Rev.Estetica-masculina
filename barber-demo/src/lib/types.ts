export type Horario = {
  dias: string;
  horas: string;
};

export type {
  Service as Servicio,
  Professional as Professional,
  Customer,
  Appointment,
  AutomationRule,
  MessageTemplate
} from "@types/domain";

export type Barbero = {
  nombre: string;
  especialidad: string;
  foto?: string;
  alt?: string;
};

export type Testimonio = {
  nombre: string;
  texto: string;
  rating: number;
};

export type GalleryItem = {
  id: string;
  before: string;
  after: string;
};

export type BarberData = {
  nombre: string;
  ciudad: string;
  direccion: string;
  whatsapp: string;
  horarios: Horario[];
  servicios: import("@types/domain").Service[];
  barberos: Barbero[];
  testimonios: Testimonio[];
  galeria: GalleryItem[];
  media?: {
    og?: string;
    heroDesktop?: string;
    heroMobile?: string;
    overlayTexture?: string;
    testimonialsBg?: string;
    location?: string;
    turnos?: string;
  };
};
