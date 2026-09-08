import { decimal, date, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const propertyTypes = mysqlTable("tipos_imovel", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("nome", { length: 120 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const saleTypes = mysqlTable("tipos_venda", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("nome", { length: 120 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const agents = mysqlTable("agentes", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("nome", { length: 160 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("telefone", { length: 30 }).notNull(),
  photo: varchar("foto", { length: 500 }),
  bio: text("bio"),
  defaultCommission: decimal("comissao_padrao", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const properties = mysqlTable("imoveis", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("titulo", { length: 180 }).notNull(),
  subtitle: varchar("subtitulo", { length: 240 }),
  description: text("descricao").notNull(),
  location: varchar("localizacao", { length: 240 }),
  propertyTypeId: int("tipo_imovel_id").notNull(),
  saleTypeId: int("tipo_venda_id").notNull(),
  priceCents: int("valor_centavos").notNull(),
  totalQuantity: int("quantidade_total"),
  availableQuantity: int("quantidade_disponivel"),
  status: mysqlEnum("status", ["disponivel", "vendido", "reservado"]).default("disponivel").notNull(),
  agentId: int("agente_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const propertyMedia = mysqlTable("midias_imovel", {
  id: int("id").autoincrement().primaryKey(),
  propertyId: int("imovel_id").notNull(),
  type: mysqlEnum("tipo", ["imagem", "video"]).notNull(),
  filePath: varchar("caminho_arquivo", { length: 700 }).notNull(),
  sortOrder: int("ordem").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const clients = mysqlTable("clientes", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("nome", { length: 160 }).notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  phone: varchar("telefone", { length: 30 }),
  cpf: varchar("cpf", { length: 20 }),
  address: varchar("endereco", { length: 400 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const testimonials = mysqlTable("depoimentos", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("cliente_id").notNull(),
  title: varchar("titulo", { length: 180 }).notNull(),
  subtitle: varchar("subtitulo", { length: 240 }),
  description: text("descricao").notNull(),
  testimonialDate: date("data").notNull(),
  photo: varchar("foto", { length: 700 }),
  status: mysqlEnum("status", ["ativo", "inativo"]).default("ativo").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sales = mysqlTable("vendas", {
  id: int("id").autoincrement().primaryKey(),
  propertyId: int("imovel_id").notNull(),
  clientId: int("cliente_id").notNull(),
  agentId: int("agente_id"),
  saleDate: date("data_venda").notNull(),
  salePriceCents: int("valor_venda_centavos").notNull(),
  quantitySold: int("quantidade_vendida").default(1).notNull(),
  notes: text("observacoes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Property = typeof properties.$inferSelect;
export type InsertProperty = typeof properties.$inferInsert;
export type Agent = typeof agents.$inferSelect;
export type Client = typeof clients.$inferSelect;
export type Sale = typeof sales.$inferSelect;
