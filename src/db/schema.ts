import {
  pgTable,
  varchar,
  text,
  date,
  timestamp,
  boolean,
  uuid,
  pgEnum,
  jsonb,
  index,
  integer
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/* ================= ENUMS ================= */

export const userRoleEnum = pgEnum("user_role", [
  "ADMIN",
  "HR",
  "STAFF",
  "COORDINATOR",
]);

// Updated for PH Labor Standards
export const employeeStatusEnum = pgEnum("employee_status", [
  "PROBATIONARY",
  "REGULAR",
  "CONTRACTUAL",
  "PROJECT_BASED",
  "ACTIVE", // Legacy support if you have existing data
  "INACTIVE", // Legacy support
  "TERMINATED",
  "RESIGNED",
  "AWOL",
]);

export const auditActionEnum = pgEnum("audit_action", [
  "CREATE_USER",
  "UPDATE_USER",
  "DELETE_USER",
  "RESET_PASSWORD",
  "LOGIN",
  "LOGOUT",
]);

export const genderEnum = pgEnum("gender", ["MALE", "FEMALE"]);
export const civilStatusEnum = pgEnum("civil_status", [
  "SINGLE",
  "MARRIED",
  "WIDOWED",
  "SEPARATED",
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
  role: userRoleEnum("role").default("ADMIN").notNull(),
  isActive: boolean("is_active").default(true),
  image: text("image"), // Added for Avatar URL
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/* ================= EMPLOYEES (201 File) ================= */

export const employees = pgTable(
  "employees",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    // Link to System User (Optional, generic employees might not have login)
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),

    // --- A. IDENTIFIERS ---
    employeeNo: varchar("employee_no", { length: 20 }).unique().notNull(),

    // --- B. PERSONAL INFO ---
    imageUrl: text("image_url"), // Profile Picture URL
    firstName: varchar("first_name", { length: 100 }).notNull(),
    middleName: varchar("middle_name", { length: 100 }), // Made optional as not everyone has one
    lastName: varchar("last_name", { length: 100 }).notNull(),
    suffix: varchar("suffix", { length: 20 }),

    dateOfBirth: date("date_of_birth"),
    gender: genderEnum("gender"),
    civilStatus: civilStatusEnum("civil_status").default("SINGLE"),
    nationality: varchar("nationality", { length: 50 }).default("FILIPINO"),
    bloodType: varchar("blood_type", { length: 10 }),

    // --- C. CONTACT INFO ---
    email: varchar("email", { length: 255 }).unique().notNull(), // Work Email
    personalEmail: varchar("personal_email", { length: 255 }),
    mobileNumber: varchar("mobile_number", { length: 20 }),
    address: text("address"), // Full address

    emergencyContactName: varchar("emergency_contact_name", { length: 100 }),
    emergencyContactPhone: varchar("emergency_contact_phone", { length: 20 }),
    emergencyRelation: varchar("emergency_relation", { length: 50 }),

    // --- D. EMPLOYMENT DETAILS ---
    position: varchar("position", { length: 100 }),
    department: varchar("department", { length: 100 }),
    status: employeeStatusEnum("status").default("PROBATIONARY").notNull(),

    dateHired: date("date_hired").notNull(), // Renamed from hireDate to standard
    dateRegularized: date("date_regularized"), // +6 months usually
    dateResigned: date("date_resigned"), // For clearance

    // --- E. GOVERNMENT IDs (Text to preserve leading zeros) ---
    sssNo: varchar("sss_no", { length: 20 }),
    tinNo: varchar("tin_no", { length: 20 }),
    philHealthNo: varchar("philhealth_no", { length: 20 }),
    pagIbigNo: varchar("pagibig_no", { length: 20 }),

    // --- F. BANKING ---
    bankName: varchar("bank_name", { length: 100 }), // BDO, BPI, etc.
    bankAccountNo: varchar("bank_account_no", { length: 100 }),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),

    // --- G. COMPENSATION (New Section) ---
    basicSalary: integer("basic_salary").default(0), // Store in cents/centavos to avoid rounding errors (e.g., 500.00 -> 50000)
    salaryType: varchar("salary_type", { length: 20 }).default("DAILY"), // DAILY or MONTHLY
    allowance: integer("allowance").default(0), // Non-taxable allowance
  },
  (table) => {
    return [
      index("employee_user_idx").on(table.userId),
      index("employee_status_idx").on(table.status),
    ];
  },
);

/* ================= DOCUMENTS (New) ================= */

export const employeeDocuments = pgTable(
  "employee_documents",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    employeeId: uuid("employee_id")
      .references(() => employees.id, { onDelete: "cascade" })
      .notNull(),

    fileName: varchar("file_name", { length: 255 }).notNull(),
    fileUrl: text("file_url").notNull(), // S3 or UploadThing URL
    documentType: varchar("document_type", { length: 50 }), // CONTRACT, RESUME, MEMO

    uploadedAt: timestamp("uploaded_at").defaultNow(),
  },
  (table) => {
    return [index("documents_employee_idx").on(table.employeeId)];
  },
);

/* ================= ATTENDANCE ================= */

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
    return [index("attendance_employee_idx").on(table.employeeId)];
  },
);

/* ================= LEAVES ================= */

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
    status: varchar("status", { length: 20 }).default("PENDING"), // PENDING, APPROVED, REJECTED
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => {
    return [index("leaves_employee_idx").on(table.employeeId)];
  },
);

/* ================= RELATIONS (For Drizzle Queries) ================= */

export const usersRelations = relations(users, ({ one }) => ({
  employeeProfile: one(employees, {
    fields: [users.id],
    references: [employees.userId],
  }),
}));

export const employeesRelations = relations(employees, ({ one, many }) => ({
  userAccount: one(users, {
    fields: [employees.userId],
    references: [users.id],
  }),
  documents: many(employeeDocuments),
  attendance: many(attendance),
  leaves: many(leaves),
}));

export const documentsRelations = relations(employeeDocuments, ({ one }) => ({
  employee: one(employees, {
    fields: [employeeDocuments.employeeId],
    references: [employees.id],
  }),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  employee: one(employees, {
    fields: [attendance.employeeId],
    references: [employees.id],
  }),
}));

export const leavesRelations = relations(leaves, ({ one }) => ({
  employee: one(employees, {
    fields: [leaves.employeeId],
    references: [employees.id],
  }),
}));
