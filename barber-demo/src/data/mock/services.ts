import type { Service } from "@types/domain";

export const mockServices: Service[] = [
  {
    id: "corte-masculino",
    nombre: "Corte masculino",
    precio: 690,
    duracion: 45,
    descripcion:
      "Corte personalizado con asesoría de forma y terminación precisa para sostener una imagen prolija, actual y profesional.",
    popular: true
  },
  {
    id: "barba-y-perfilado",
    nombre: "Barba y perfilado",
    precio: 590,
    duracion: 35,
    descripcion:
      "Diseño, rebaje y definición de barba para equilibrar facciones y mantener un look limpio entre reuniones, eventos o rutina diaria.",
    popular: true
  },
  {
    id: "corte-barba",
    nombre: "Corte + barba",
    precio: 1180,
    duracion: 75,
    descripcion:
      "Servicio integral para renovar cabello y barba en una sola sesión, con resultado coherente y presencia masculina bien resuelta.",
    popular: true
  },
  {
    id: "limpieza-facial-masculina",
    nombre: "Limpieza facial masculina",
    precio: 930,
    duracion: 50,
    descripcion:
      "Limpieza profunda pensada para piel masculina: descongestiona, mejora textura y deja el rostro listo para la semana o una ocasión especial.",
    popular: false
  },
  {
    id: "perfilado-cejas",
    nombre: "Perfilado de cejas",
    precio: 420,
    duracion: 20,
    descripcion:
      "Corrección sutil para ordenar la mirada sin feminizar el gesto, ideal para completar una imagen cuidada y sobria.",
    popular: false
  },
  {
    id: "servicio-express",
    nombre: "Servicio express",
    precio: 520,
    duracion: 25,
    descripcion:
      "Mantenimiento rápido de contornos, laterales o barba para llegar prolijo a una jornada exigente sin pasar por un servicio completo.",
    popular: false
  }
];
