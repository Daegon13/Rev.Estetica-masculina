import barber from "@data/barber.json";
import { demoServices } from "@data/services";

export const bookingProfessionals = barber.barberos.map((barbero, index) => ({
  id: `pro-${index + 1}`,
  nombre: barbero.nombre,
  especialidad: barbero.especialidad,
  foto: barbero.foto,
  alt: barbero.alt,
  servicios: demoServices
    .filter((service) => {
      if (barbero.nombre === "Nico") {
        return ["corte-masculino", "corte-barba", "servicio-express"].includes(service.id);
      }

      return [
        "barba-y-perfilado",
        "corte-barba",
        "limpieza-facial-masculina",
        "perfilado-de-cejas",
        "servicio-express"
      ].includes(service.id);
    })
    .map((service) => service.id)
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
