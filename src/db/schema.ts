import {
  pgTable,
  serial,
  varchar,
  text,
  date,
  timestamp,
  integer,
  boolean,
  uuid,
  pgEnum,
  jsonb,
  index,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["ADMIN", "HR", "STAFF"]);
export const employeeStatusEnum = pgEnum("employee_status", [
  "ACTIVE",
  "INACTIVE",
  "TERMINATED",
  "RESIGNED",
]);
export const auditActionEnum = pgEnum("audit_action", [
  "CREATE_USER",
  "UPDATE_USER",
  "DELETE_USER",
  "RESET_PASSWORD",
  "LOGIN",
  "LOGOUT",
]);

/* ================= AUDIT LOGS ================= */

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  actorId: uuid("actor_id").notNull(),
  action: auditActionEnum("action").notNull(),
  targetId: uuid("target_id"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

/* ================= USERS ================= */

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  // role: varchar("role", { length: 50 }).default("admin"), // admin, hr, staff
  role: userRoleEnum("role").default("ADMIN").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

/* ================= EMPLOYEES ================= */

// export const employees = pgTable("employees", {
//   id: uuid("id").defaultRandom().primaryKey(),

//   userId: uuid("user_id")
//     .references(() => users.id, { onDelete: "set null" }),

//   employeeNo: varchar("employee_no", { length: 20 }).unique().notNull(),
//   firstName: varchar("first_name", { length: 100 }).notNull(),
//   lastName: varchar("last_name", { length: 100 }).notNull(),
//   email: varchar("email", { length: 255 }).unique().notNull(),

//   position: varchar("position", { length: 100 }),
//   department: varchar("department", { length: 100 }),

//   hireDate: date("hire_date").notNull(),
//   status: varchar("status", { length: 50 }).default("Active"),

//   createdAt: timestamp("created_at").defaultNow(),
// });
export const employees = pgTable(
  "employees",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    // Just define the column here (remove .index())
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),

    employeeNo: varchar("employee_no", { length: 20 }).unique().notNull(),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    position: varchar("position", { length: 100 }),
    department: varchar("department", { length: 100 }),
    hireDate: date("hire_date").notNull(),
    status: employeeStatusEnum("status").default("ACTIVE").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => {
    return [
      // 👇 Define Index Here
      index("employee_user_idx").on(table.userId),
    ];
  },
);

/* ================= ATTENDANCE ================= */

// export const attendance = pgTable("attendance", {
//   id: uuid("id").defaultRandom().primaryKey(),

//   employeeId: uuid("employee_id")
//     .references(() => employees.id, { onDelete: "cascade" })
//     .notNull(),

//   date: date("date").notNull(),
//   timeIn: timestamp("time_in"),
//   timeOut: timestamp("time_out"),

//   createdAt: timestamp("created_at").defaultNow(),
// });
export const attendance = pgTable(
  "attendance",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    employeeId: uuid("employee_id")
      .references(() => employees.id, { onDelete: "cascade" })
      .notNull(),

    date: date("date").notNull(),
    timeIn: timestamp("time_in"),
    timeOut: timestamp("time_out"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => {
    return [
      // 👇 Define Index Here
      index("attendance_employee_idx").on(table.employeeId),
    ];
  },
);

/* ================= LEAVES ================= */

// export const leaves = pgTable("leaves", {
//   id: uuid("id").defaultRandom().primaryKey(),

//   employeeId: uuid("employee_id")
//     .references(() => employees.id, { onDelete: "cascade" })
//     .notNull(),

//   type: varchar("type", { length: 50 }).notNull(),
//   startDate: date("start_date").notNull(),
//   endDate: date("end_date").notNull(),
//   reason: text("reason"),

//   createdAt: timestamp("created_at").defaultNow(),
// });
export const leaves = pgTable(
  "leaves",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    employeeId: uuid("employee_id")
      .references(() => employees.id, { onDelete: "cascade" })
      .notNull(),

    type: varchar("type", { length: 50 }).notNull(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    reason: text("reason"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => {
    return [
      // 👇 Define Index Here
      index("leaves_employee_idx").on(table.employeeId),
    ];
  },
);
