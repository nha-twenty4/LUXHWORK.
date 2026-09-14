import { asc, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { contactInquiries, InsertContactInquiry, InsertProject, InsertUser, projectAssets, projects, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function listProjects() {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select().from(projects).orderBy(asc(projects.sortOrder));
  const assets = await db.select().from(projectAssets).orderBy(asc(projectAssets.sortOrder));
  return rows.map((project) => ({
    ...project,
    gallery: assets.filter((asset) => asset.projectId === project.id),
  }));
}

export async function getProjectBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
  if (!rows[0]) return undefined;
  const assets = await db.select().from(projectAssets).where(eq(projectAssets.projectId, rows[0].id)).orderBy(asc(projectAssets.sortOrder));
  return { ...rows[0], gallery: assets };
}

export async function createContactInquiry(inquiry: InsertContactInquiry) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(contactInquiries).values(inquiry);
  return { id: Number(result[0].insertId) };
}

export async function listContactInquiries() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contactInquiries).orderBy(desc(contactInquiries.createdAt));
}

export async function createProject(project: InsertProject) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(projects).values(project);
  return { id: Number(result[0].insertId) };
}

export async function updateProject(id: number, project: Partial<InsertProject>) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(projects).set(project).where(eq(projects.id, id));
  return { success: true } as const;
}

export async function deleteProject(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.delete(projects).where(eq(projects.id, id));
  return { success: true } as const;
}
