export default async function AdminPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold text-foreground mb-2">Dashboard</h1>
      <p className="text-sm text-muted mb-10">Manage your portfolio content.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Hero & About", href: "/admin/content",    description: "Edit your headline, bio, and intro" },
          { label: "Projects",    href: "/admin/projects",    description: "Add, edit, or remove projects" },
          { label: "Skills",      href: "/admin/skills",      description: "Manage your skills and proficiency" },
          { label: "Experience",  href: "/admin/experience",  description: "Update your work history" },
          { label: "Contact",     href: "/admin/contact",     description: "Edit contact links and info" },
          { label: "Settings",    href: "/admin/settings",    description: "Change your admin password" },
        ].map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="block p-5 bg-white border border-black/[0.08] rounded-xl hover:border-black/20 hover:shadow-sm transition-all"
          >
            <p className="font-medium text-sm text-foreground mb-1">{item.label}</p>
            <p className="text-xs text-muted">{item.description}</p>
          </a>
        ))}
      </div>
    </>
  );
}
