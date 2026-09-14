import { FormEvent, useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ExternalLink, FileText, FolderPlus, Inbox, LogOut, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

const emptyProject = {
  slug: "",
  title: "",
  category: "Interior",
  imageUrl: "",
  year: new Date().getFullYear().toString(),
  location: "Phnom Penh, Cambodia",
  client: "",
  description: "",
  note: "",
  floorPlanUrl: "",
  pdfUrl: "",
  sortOrder: 0,
};

type ProjectDraft = typeof emptyProject;

export default function AdminPage() {
  const { user, loading, logout } = useAuth();
  const [tab, setTab] = useState<"projects" | "inquiries">("projects");
  const [draft, setDraft] = useState<ProjectDraft>(emptyProject);
  const projectsQuery = trpc.projects.list.useQuery(undefined, { enabled: Boolean(user) });
  const inquiriesQuery = trpc.admin.inquiries.useQuery(undefined, { enabled: Boolean(user && user.role === "admin") });
  const utils = trpc.useUtils();
  const createProject = trpc.admin.createProject.useMutation({
    onSuccess: async () => {
      setDraft(emptyProject);
      await utils.projects.list.invalidate();
      toast.success("Project added to the portfolio");
    },
    onError: (error) => toast.error(error.message),
  });
  const deleteProject = trpc.admin.deleteProject.useMutation({
    onSuccess: async () => {
      await utils.projects.list.invalidate();
      toast.success("Project removed");
    },
    onError: (error) => toast.error(error.message),
  });
  const visibleProjects = useMemo(() => (projectsQuery.data ?? []).filter((project) => project.id), [projectsQuery.data]);

  if (loading) return <div className="admin-loading">Checking access…</div>;
  if (!user) return <div className="admin-gate"><p className="eyebrow">LUXHWORK / ADMIN</p><h1>Sign in to manage<br /><em>the portfolio.</em></h1><p>Only authorised LUXHWORK administrators can access project and enquiry tools.</p><button className="button button-dark" type="button" onClick={() => startLogin()}>Sign in <ExternalLink size={16} /></button><Link href="/" className="text-link">Return to website <ArrowLeft size={15} /></Link></div>;
  if (user.role !== "admin") return <div className="admin-gate"><p className="eyebrow">ACCESS RESTRICTED</p><h1>This space is<br /><em>for the studio.</em></h1><p>Your account is signed in, but it does not have administrator permissions.</p><Link href="/" className="button button-dark">Return to website <ArrowLeft size={16} /></Link></div>;

  function submitProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    createProject.mutate({ ...draft, floorPlanUrl: draft.floorPlanUrl || undefined, pdfUrl: draft.pdfUrl || undefined });
  }

  return <div className="admin-shell">
    <header className="admin-header"><div><Link href="/" className="admin-wordmark">LUXHWORK</Link><span className="admin-kicker">Studio control room</span></div><div className="admin-header-actions"><span className="admin-user">{user.name || user.email || "Admin"}</span><button type="button" className="admin-logout" onClick={() => logout().catch((error) => toast.error(error.message))}><LogOut size={15} /> Sign out</button></div></header>
    <main className="admin-content">
      <div className="admin-intro"><div><p className="eyebrow">ADMIN / OVERVIEW</p><h1>Keep the work<br /><em>moving.</em></h1></div><Link href="/" className="text-link">View live site <ExternalLink size={15} /></Link></div>
      <div className="admin-tabs" role="tablist"><button type="button" className={tab === "projects" ? "admin-tab active" : "admin-tab"} onClick={() => setTab("projects")}><FileText size={16} /> Projects <span>{visibleProjects.length}</span></button><button type="button" className={tab === "inquiries" ? "admin-tab active" : "admin-tab"} onClick={() => setTab("inquiries")}><Inbox size={16} /> Enquiries <span>{inquiriesQuery.data?.length ?? 0}</span></button></div>
      {tab === "projects" ? <section className="admin-grid"><div className="admin-panel"><div className="admin-panel-heading"><div><p className="eyebrow">PORTFOLIO</p><h2>Published projects</h2></div><FolderPlus size={22} /></div>{projectsQuery.isLoading ? <p className="admin-muted">Loading projects…</p> : visibleProjects.length === 0 ? <p className="admin-empty">No database-managed projects yet. Add the first one using the form.</p> : <div className="admin-project-list">{visibleProjects.map((project) => <article className="admin-project-row" key={project.id}><div><strong>{project.title}</strong><span>{project.location} · {project.category}</span></div><div className="admin-row-actions"><Link href={`/projects/${project.slug}`} aria-label={`View ${project.title}`}><ExternalLink size={15} /></Link><button type="button" aria-label={`Delete ${project.title}`} onClick={() => { if (window.confirm(`Delete ${project.title}?`)) deleteProject.mutate({ id: project.id }); }}><Trash2 size={15} /></button></div></article>)}</div>}</div><form className="admin-panel admin-form" onSubmit={submitProject}><div className="admin-panel-heading"><div><p className="eyebrow">NEW ENTRY</p><h2>Add project</h2></div><FolderPlus size={22} /></div><div className="admin-form-grid">{([ ["slug", "Slug", "house-15"], ["title", "Title", "PROJECT TITLE"], ["client", "Client", "Client name"], ["imageUrl", "Cover image URL", "/manus-storage/image.jpeg"], ["location", "Location", "Phnom Penh, Cambodia"], ["year", "Year", "2026"], ["note", "Short note", "Retail · 120 SQM"], ["floorPlanUrl", "Floor plan URL", "Optional"], ["pdfUrl", "PDF URL", "Optional"] ] as const).map(([field, label, placeholder]) => <label key={field}>{label}<input value={draft[field]} placeholder={placeholder} required={!['floorPlanUrl', 'pdfUrl'].includes(field)} onChange={(event) => setDraft({ ...draft, [field]: event.target.value })} /></label>)}</div><label>Description<textarea required minLength={20} value={draft.description} placeholder="What was the brief and what did LUXHWORK deliver?" onChange={(event) => setDraft({ ...draft, description: event.target.value })} /></label><button className="button button-dark" type="submit" disabled={createProject.isPending}>{createProject.isPending ? "Saving…" : "Save project"} <ExternalLink size={15} /></button></form></section> : <section className="admin-panel"><div className="admin-panel-heading"><div><p className="eyebrow">INBOX</p><h2>Client enquiries</h2></div><Inbox size={22} /></div>{inquiriesQuery.isLoading ? <p className="admin-muted">Loading enquiries…</p> : inquiriesQuery.data?.length ? <div className="admin-inquiry-list">{inquiriesQuery.data.map((inquiry) => <article className="admin-inquiry" key={inquiry.id}><div className="admin-inquiry-top"><strong>{inquiry.name}</strong><time>{new Date(inquiry.createdAt).toLocaleDateString()}</time></div><a href={`mailto:${inquiry.email}`}>{inquiry.email}</a>{inquiry.phone && <span>{inquiry.phone}</span>}<p><b>{inquiry.service}</b>{inquiry.budget ? ` · ${inquiry.budget}` : ""}{inquiry.timeline ? ` · ${inquiry.timeline}` : ""}</p><div className="admin-inquiry-details">{inquiry.details}</div></article>)}</div> : <p className="admin-empty">No enquiries yet. New contact form submissions will appear here.</p>}</section>}
    </main>
  </div>;
}
