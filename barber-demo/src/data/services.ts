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
    id: "afeitado-premium",
    nombre: "Afeitado premium con toalla caliente",
    precio: 790,
    duracion: 45,
    descripcion:
      "Ritual clásico con preparación de piel, toalla caliente y acabado suave para clientes que quieren verse impecables sin irritación.",
    popular: false,
    imagen: "/images/services/afeitado-premium.png",
    alt: "Afeitado premium masculino con toalla caliente y acabado prolijo."
  },
  {
    id: "limpieza-facial-masculina",
    nombre: "Limpieza facial masculina",
    precio: 930,
    duracion: 50,
    descripcion:
      "Limpieza profunda y descongestiva pensada para hombres que quieren recuperar la piel después de la semana o antes de un evento.",
    popular: false,
    imagen: "/images/services/afeitado-premium.png",
    alt: "Limpieza facial masculina en cabina premium."
  },
  {
    id: "servicio-express",
    nombre: "Mantenimiento express",
    precio: 520,
    duracion: 25,
    descripcion:
      "Repaso rápido de laterales, nuca o barba para sostener una imagen prolija entre servicios completos.",
    popular: false,
    imagen: "/images/services/perfilado-contorno.png",
    alt: "Servicio express de mantenimiento estético masculino."
  }
];

