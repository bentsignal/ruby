import type { Doc } from "../_generated/dataModel";

export type UIFile = Omit<Doc<"files">, "uploadToken">;
