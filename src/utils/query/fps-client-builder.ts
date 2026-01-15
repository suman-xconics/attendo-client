// hono-core/utils/fps-client.schema.ts
import { z } from "zod";

 const fpsClientSchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  search: z.string().optional(),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
  sort_by: z.string().optional(),
  sort_order: z.enum(["asc", "desc"]).optional(),
  filter: z.record(z.string(), z.any()).optional(),
});

export type FPSClientInput = z.infer<typeof fpsClientSchema>;

export function fpsToQuery(input: FPSClientInput) {
  const query: Record<string, string> = {};

  if (input.page !== undefined) query.page = String(input.page);
  if (input.limit !== undefined) query.limit = String(input.limit);
  if (input.search) query.search = input.search;
  if (input.from_date) query.from_date = input.from_date;
  if (input.to_date) query.to_date = input.to_date;
  if (input.sort_by) query.sort_by = input.sort_by;
  if (input.sort_order) query.sort_order = input.sort_order;

  if (input.filter) {
    query.filter = JSON.stringify(input.filter);
  }

  return query;
}
