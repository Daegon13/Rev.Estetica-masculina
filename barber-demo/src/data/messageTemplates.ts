export type MessageTemplateVariable = "nombre" | "fecha" | "hora" | "descuento";

export type MessageTemplateChannel = "WhatsApp" | "Email" | "WhatsApp + Email";

export type MessageTemplate = {
  id: string;
  name: string;
  subject: string;
  category: string;
  description: string;
  trigger: string;
  channel: MessageTemplateChannel;
  audience: string;
  active: boolean;
  performance: string;
  body: string;
  variables: MessageTemplateVariable[];
};

export const demoTemplateVariables: Record<MessageTemplateVariable, string> = {
  nombre: "Martín",
  fecha: "jueves 27 de marzo",
  hora: "18:30",
  descuento: "15% OFF"
};

export const demoMessageTemplates: MessageTemplate[] = [
  {
    id: "appointment-confirmation",
    name: "Confirmación de turno",
    subject: "Tu turno ya está confirmado",
    category: "Agenda",
    description: "Se envía apenas entra una reserva para dar seguridad y evitar consultas manuales.",
    trigger: "Inmediatamente después de reservar",
    channel: "WhatsApp",
    audience: "Cada nueva reserva",
    active: true,
    performance: "Reduce dudas previas y mejora la asistencia.",
    variables: ["nombre", "fecha", "hora"],
    body:
      "Hola {nombre}, tu turno en Rev. Estética Masculina quedó confirmado para el {fecha} a las {hora}. Si necesitás reprogramar, respondé este mensaje y te ayudamos."
  },
  {
    id: "appointment-reminder",
    name: "Recordatorio de turno",
    subject: "Recordatorio para tu próxima visita",
    category: "Agenda",
    description: "Recuerda la cita con tiempo para bajar ausencias y ordenar mejor el día del local.",
    trigger: "24 horas antes del turno",
    channel: "WhatsApp + Email",
    audience: "Clientes con reserva confirmada",
    active: true,
    performance: "Protege la facturación diaria y la puntualidad.",
    variables: ["nombre", "fecha", "hora"],
    body:
      "Hola {nombre}, te recordamos tu turno del {fecha} a las {hora}. Si querés moverlo, avisános con anticipación para conservar la mejor opción disponible."
  },
  {
    id: "review-request",
    name: "Pedido de reseña",
    subject: "¿Nos regalás tu reseña?",
    category: "Reputación",
    description: "Invita a dejar una reseña después de la visita para potenciar la prueba social del negocio.",
    trigger: "2 horas después del servicio completado",
    channel: "WhatsApp",
    audience: "Clientes atendidos",
    active: true,
    performance: "Aumenta confianza y conversión de nuevos clientes.",
    variables: ["nombre"],
    body:
      "Gracias por elegirnos hoy, {nombre}. Si disfrutaste la experiencia, ¿nos dejás una reseña? Tu opinión ayuda a que más personas conozcan el nivel del servicio."
  },
  {
    id: "birthday-offer",
    name: "Cumpleaños con 15% OFF",
    subject: "Tu regalo de cumpleaños ya está listo",
    category: "Fidelización",
    description: "Activa una campaña emocional con beneficio comercial para impulsar visitas durante la semana del cumpleaños.",
    trigger: "10:00 del día del cumpleaños",
    channel: "WhatsApp",
    audience: "Clientes con fecha de cumpleaños cargada",
    active: false,
    performance: "Mejora recurrencia y ticket promedio con una oferta oportuna.",
    variables: ["nombre", "descuento"],
    body:
      "¡Feliz cumpleaños, {nombre}! Esta semana tenés {descuento} en tu próximo servicio para celebrarlo con tu mejor versión. Reservá cuando quieras y te lo aplicamos."
  },
  {
    id: "reactivation-inactive",
    name: "Reactivación por inactividad",
    subject: "Te esperamos de vuelta",
    category: "Win-back",
    description: "Detecta clientes sin movimiento reciente y propone volver con un mensaje comercial suave.",
    trigger: "30 días sin visita ni reserva",
    channel: "WhatsApp",
    audience: "Clientes inactivos",
    active: true,
    performance: "Recupera clientes dormidos sin seguimiento manual.",
    variables: ["nombre", "descuento"],
    body:
      "Hola {nombre}, hace un tiempo no te vemos por el local. Si querés volver esta semana, respondé este mensaje y activamos un beneficio especial de {descuento} para tu próxima visita."
  }
];
