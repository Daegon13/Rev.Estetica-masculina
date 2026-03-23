import { demoAppointments } from "@data/demoBusiness";
import type { Appointment } from "@types/domain";

export type CreateAppointmentInput = Omit<Appointment, "id"> & { id?: Appointment["id"] };

export async function listAppointments(): Promise<Appointment[]> {
  return demoAppointments;
}

export async function createAppointment(input: CreateAppointmentInput): Promise<Appointment> {
  return {
    ...input,
    id: input.id ?? `stub-${input.clienteId}-${input.fecha}-${input.hora}`
  };
}
