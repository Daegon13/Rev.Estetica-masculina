import type { Servicio } from "@lib/types";

export const demoServices: Servicio[] = [
  {
    id: "corte-masculino",
    nombre: "Corte masculino",
    precio: 690,
    duracion: 45,
    descripcion:
      "Corte personalizado con asesoría de estilo, contornos prolijos y terminación pensada para una imagen masculina actual.",
    popular: true,
    imagen: "/images/services/corte-fade.png",
    alt: "Corte masculino premium con terminación precisa."
  },
  {
    id: "barba-y-perfilado",
    nombre: "Barba y perfilado",
    precio: 590,
    duracion: 35,
    descripcion:
      "Diseño, rebaje y definición de barba para ordenar el rostro y reforzar una presencia cuidada en el día a día.",
    popular: true,
    imagen: "/images/services/barba-toalla.png",
    alt: "Servicio de barba y perfilado con acabado prolijo."
  },
  {
    id: "corte-barba",
    nombre: "Corte + barba",
    precio: 1180,
    duracion: 75,
    descripcion:
      "Sesión integral para renovar cabello y barba en una misma visita, con resultado equilibrado y acabado premium.",
    popular: true,
    imagen: "/images/services/combo-corte-barba.png",
    alt: "Experiencia integral de corte y barba en estudio masculino."
  },
  {
    id: "limpieza-facial-masculina",
    nombre: "Limpieza facial masculina",
    precio: 890,
    duracion: 50,
    descripcion:
      "Rutina de higiene profunda y recuperación de piel para lucir un rostro fresco, prolijo y listo para la semana.",
    popular: false,
    imagen: "/images/services/afeitado-premium.png",
    alt: "Limpieza facial masculina en ambiente premium."
  },
  {
    id: "perfilado-de-cejas",
    nombre: "Perfilado de cejas",
    precio: 390,
    duracion: 20,
    descripcion:
      "Definición sutil y masculina para ordenar la mirada sin perder naturalidad ni expresión.",
    popular: false,
    imagen: "/images/services/perfilado-contorno.png",
    alt: "Perfilado de cejas masculino con resultado natural."
  },
  {
    id: "servicio-express",
    nombre: "Servicio express",
    precio: 490,
    duracion: 25,
    descripcion:
      "Ajuste rápido de contornos y detalles clave para mantener tu imagen prolija entre servicios completos.",
    popular: false,
    imagen: "/images/services/perfilado-contorno.png",
    alt: "Servicio express de mantenimiento estético masculino."
  }
];

