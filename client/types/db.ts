import { type InferSelectModel } from "drizzle-orm";
import {
  user,
  session,
  account,
  verification,
  pdf,
  context,
  credit_history,
} from "@/db/schema";

export type User = InferSelectModel<typeof user>;
export type Session = InferSelectModel<typeof session>;
export type Account = InferSelectModel<typeof account>;
export type Verification = InferSelectModel<typeof verification>;
export type Pdf = InferSelectModel<typeof pdf>;
export type Context = InferSelectModel<typeof context>;
export type CreditHistory = InferSelectModel<typeof credit_history>;
