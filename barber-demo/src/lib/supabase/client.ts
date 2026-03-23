export type SupabaseClientLike = {
  from: (table: string) => unknown;
};

export function getSupabaseClient(): SupabaseClientLike | null {
  return null;
}
