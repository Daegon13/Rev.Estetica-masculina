import { demoClients } from "@data/demoBusiness";
import type { Customer } from "@types/domain";

export async function listCustomers(): Promise<Customer[]> {
  return demoClients;
}
