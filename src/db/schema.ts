import {
  pgTable,
  serial,
  varchar,
  text,
  date,
  timestamp,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

/* ================= USERS ================= */

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 50 }).notNull(), // Admin / HR / Employee
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});


/* ================= EMPLOYEES ================= */

export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),

  userId: integer("user_id").references(() => users.id), // nullable

  employeeNo: varchar("employee_no", { length: 20 }).unique().notNull(),

  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),

  email: varchar("email", { length: 255 }).unique().notNull(),

  position: varchar("position", { length: 100 }),
  department: varchar("department", { length: 100 }),

  hireDate: date("hire_date").notNull(),
  status: varchar("status", { length: 50 }).default("Active"),

  createdAt: timestamp("created_at").defaultNow(),
});


/* ================= ATTENDANCE ================= */

export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),

  employeeId: integer("employee_id")
    .references(() => employees.id)
    .notNull(),

  date: date("date").notNull(),
  timeIn: timestamp("time_in"),
  timeOut: timestamp("time_out"),

  createdAt: timestamp("created_at").defaultNow(),
});


/* ================= LEAVES ================= */

export const leaves = pgTable("leaves", {
  id: serial("id").primaryKey(),

  employeeId: integer("employee_id")
    .references(() => employees.id)
    .notNull(),

  type: varchar("type", { length: 50 }), // Sick, Vacation, etc.
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),

  reason: text("reason"),
  status: varchar("status", { length: 50 }).default("Pending"),

  createdAt: timestamp("created_at").defaultNow(),
});
