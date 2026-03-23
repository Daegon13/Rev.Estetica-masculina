import { demoAutomations } from "@data/demoBusiness";
import type { AutomationRule } from "@types/domain";

export async function listAutomationRules(): Promise<AutomationRule[]> {
  return demoAutomations;
}
