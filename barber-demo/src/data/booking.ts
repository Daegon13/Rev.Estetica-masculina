import { demoProfessionals } from "@data/demoBusiness";

export const bookingProfessionals = demoProfessionals.map((professional) => ({
  id: professional.id,
  nombre: professional.nombre,
  especialidad: professional.especialidad,
  foto: professional.foto,
  alt: professional.alt,
  servicios: professional.servicios
}));

export const bookingDateOffsets = [1, 2, 3, 4, 5, 6, 8, 9];

export const bookingTimeWindows = [
  "10:00",
  "10:45",
  "11:30",
  "12:15",
  "13:00",
  "15:00",
  "15:45",
  "16:30",
  "17:15",
  "18:00",
  "18:45"
];
