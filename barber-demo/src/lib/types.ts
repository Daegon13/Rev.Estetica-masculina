export type Horario = {
  dias: string;
  horas: string;
};

export type Servicio = {
  id: string;
  nombre: string;
  precio: number;
  duracion: number;
  descripcion: string;
  popular: boolean;
  imagen?: string; // ruta en /public
  alt?: string;    // alt accesible
};

export type Barbero = {
  nombre: string;
  especialidad: string;
  foto?: string; // ruta en /public
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
  servicios: Servicio[];
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
