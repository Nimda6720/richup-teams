import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
export const rooms=sqliteTable("rooms",{id:text("id").primaryKey(),version:integer("version").notNull(),data:text("data").notNull(),expires:integer("expires").notNull()});
