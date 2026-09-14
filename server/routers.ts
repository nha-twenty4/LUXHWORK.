import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { createContactInquiry, createProject, deleteProject, getProjectBySlug, listContactInquiries, listProjects, updateProject } from "./db";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  projects: router({
    list: publicProcedure.query(() => listProjects()),
    bySlug: publicProcedure.input(z.object({ slug: z.string().min(1) })).query(({ input }) => getProjectBySlug(input.slug)),
  }),
  contact: router({
    submit: publicProcedure.input(z.object({
      name: z.string().trim().min(2, "Please enter your full name.").max(160),
      email: z.string().trim().email("Please enter a valid email address.").max(320),
      phone: z.string().trim().max(80).optional(),
      service: z.string().trim().min(1, "Please select a service.").max(120),
      details: z.string().trim().min(20, "Please provide at least 20 characters about the project.").max(5000),
      budget: z.string().trim().max(120).optional(),
      timeline: z.string().trim().max(120).optional(),
    })).mutation(({ input }) => createContactInquiry(input)),
  }),
  admin: router({
    inquiries: adminProcedure.query(() => listContactInquiries()),
    createProject: adminProcedure.input(z.object({
      slug: z.string().trim().min(2).max(120),
      title: z.string().trim().min(2).max(180),
      category: z.string().trim().min(2).max(80),
      imageUrl: z.string().trim().min(1).max(512),
      year: z.string().trim().min(4).max(4),
      location: z.string().trim().min(2).max(220),
      client: z.string().trim().min(2).max(180),
      description: z.string().trim().min(20),
      note: z.string().trim().min(2).max(220),
      floorPlanUrl: z.string().trim().max(512).optional(),
      pdfUrl: z.string().trim().max(512).optional(),
      sortOrder: z.number().int().min(0).default(0),
    })).mutation(({ input }) => createProject(input)),
    updateProject: adminProcedure.input(z.object({
      id: z.number().int().positive(),
      title: z.string().trim().min(2).max(180).optional(),
      category: z.string().trim().min(2).max(80).optional(),
      imageUrl: z.string().trim().min(1).max(512).optional(),
      year: z.string().trim().min(4).max(4).optional(),
      location: z.string().trim().min(2).max(220).optional(),
      client: z.string().trim().min(2).max(180).optional(),
      description: z.string().trim().min(20).optional(),
      note: z.string().trim().min(2).max(220).optional(),
      floorPlanUrl: z.string().trim().max(512).nullable().optional(),
      pdfUrl: z.string().trim().max(512).nullable().optional(),
      sortOrder: z.number().int().min(0).optional(),
    })).mutation(({ input }) => { const { id, ...project } = input; return updateProject(id, project); }),
    deleteProject: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => deleteProject(input.id)),
  }),
});

export type AppRouter = typeof appRouter;
