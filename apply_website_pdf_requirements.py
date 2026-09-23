from pathlib import Path
import re

p = Path('/home/ubuntu/luxhwork-github/client/src/pages/Home.tsx')
s = p.read_text()

# Contact is a dedicated page; do not point the header at a missing Home anchor.
s = s.replace('''  const headerItems = navItems.map(
    ([label]) =>
      [
        label,
        location === "/" ? `#${sectionIds[label]}` : `/#${sectionIds[label]}`,
      ] as const
  );''', '''  const headerItems = navItems.map(([label]) =>
    [
      label,
      label === "Contact"
        ? "/contact"
        : location === "/"
          ? `#${sectionIds[label]}`
          : `/#${sectionIds[label]}`,
    ] as const
  );''')

# Remove pointer-driven hero image movement; the reference explicitly requests a stable image.
hero_effect = re.compile(r'''\n  useEffect\(\(\) => \{\n    const heroImage = heroImageRef\.current;.*?\n  \}, \[\]\);\n''', re.S)
s, count = hero_effect.subn('\n', s, count=1)
if count != 1:
    raise SystemExit('hero pointer effect not found')
s = s.replace('className="hero-image hero-image-interactive"', 'className="hero-image"', 1)

# Add business taxonomy and the supplied detail copy.
marker = 'type ColorPreset = "auto" | "monochrome" | "cinematic";'
insert = '''type BusinessCategory =
  | "Corporate Office"
  | "Retails"
  | "Commercial"
  | "Food & Beverage (FnB)";

const projectBusinessCategory: Record<string, BusinessCategory> = {
  "house-14": "Corporate Office",
  "visa-branch-office": "Corporate Office",
  "mori-residence": "Commercial",
  "pp-link-broadcast": "Commercial",
  northpoint: "Commercial",
  "frame-house": "Food & Beverage (FnB)",
  "seascape-house": "Food & Beverage (FnB)",
  "davidoff": "Retails",
  "the-hynd-hotel": "Commercial",
  "chj-jewellry-cb1": "Retails",
  "chj-jewellry-cb3": "Retails",
  "chj-jewellry-cb4": "Retails",
  "atelier-common": "Retails",
  "lukfook-sihanouk": "Retails",
  "lukfook-funmall": "Retails",
  "lukfook-chipmong": "Retails",
  "lao-miao-naga-2": "Retails",
  "thailand-lukfook-rama9": "Retails",
  "thailand-zhou-liufu": "Retails",
  "thailand-lukfook-pinklao": "Retails",
  "ratanac-mealea": "Retails",
  "field-notes": "Retails",
  "courtyard-study": "Commercial",
  "fabric-factory": "Commercial",
};

const projectDetailContent: Record<
  string,
  {
    heading: string;
    paragraphs: string[];
    type: string;
    size: string;
    completion: string;
    duration?: string;
    client: string;
  }
> = {
  "house-14": {
    heading: "A Purposely Designed Workplace Designed For Modern Collaboration",
    paragraphs: [
      "Located within Vattanac Capital Tower in Phnom Penh, The VISA Worldwide office was designed as a modern corporate workplace that reflects the company’s global identity while producing a comfortable and efficient environment for their team.",
      "Spanning approximately 136 sqm, the office features a clean, open layout with a contemporary corporate aesthetic. The design maximises the compact footprint, creating a workplace that feels bright, connected, and functional.",
      "Through interior design and fit-out, LUXHWORK translated the concept into a cohesive workplace, carefully coordinating finishes, details, and construction to deliver a refined and professional environment.",
    ],
    type: "Corporate Offices",
    size: "136 sqm",
    completion: "April 2022 · Expansion Feb 2025",
    duration: "9 weeks",
    client: "VISA Worldwide",
  },
  northpoint: {
    heading: "A Refined VIP Lounge for Private Dining and Entertainment",
    paragraphs: [
      "Completed in July 2022, the 170 sqm Golden Tower VIP Lounge in Phnom Penh was designed for VIP entertainment, private dining and special events.",
      "The contemporary luxury interior combines intimate seating, custom joinery, geometric wall panels and a statement bar, enriched by teal accents and layered lighting.",
      "Careful material selection, colour coordination and technical craftsmanship ensured the completed space remained faithful to the approved visual concept.",
    ],
    type: "Hospitality",
    size: "170 sqm",
    completion: "July 2022",
    duration: "6 weeks",
    client: "Golden Group",
  },
  "frame-house": {
    heading: "A Bold and Energetic Fast-Food Experience",
    paragraphs: [
      "Located in Krong TaKhmao, the 377 sqm Lucky Burger restaurant expands the presence of one of Cambodia’s established fast-food chains within a standalone building.",
      "The restaurant brings together indoor and outdoor dining, an efficient service counter and clear customer circulation within a highly visible branded environment.",
      "Completed in September 2023, the project involved the design and complete fit-out of the existing building, including its façade, dining areas, service zones and integrated brand elements.",
    ],
    type: "Hospitality",
    size: "377 sqm",
    completion: "September 2023",
    client: "REAL FOOD AND BEVERAGE Co., LTD",
  },
  "lukfook-sihanouk": {
    heading: "Precision Fit-Out for a Premium Retail Experience",
    paragraphs: [
      "This LUKFOOK Jewellery boutique delivers a refined retail environment designed to showcase fine jewellery with clarity, elegance, and a strong sense of brand identity.",
      "LUXHWORK was appointed to undertake the complete fit-out works and project management, coordinating specialist contractors, suppliers, technical services, and site execution to translate the approved design into a finished retail space.",
      "Particular attention was given to workmanship, material consistency, lighting accuracy, and the precise installation of display fixtures—essential elements in creating a secure and sophisticated jewellery-shopping experience.",
    ],
    type: "Retail",
    size: "355 sqm",
    completion: "July 2026",
    client: "Goldman Jewellery Co., LTD",
  },
  "lukfook-chipmong": {
    heading: "Precision Fit-Out for a Premium Retail Experience",
    paragraphs: [
      "This LUKFOOK Jewellery boutique delivers a refined retail environment designed to showcase fine jewellery with clarity, elegance, and a strong sense of brand identity.",
      "LUXHWORK was appointed to undertake the complete fit-out works and project management, coordinating specialist contractors, suppliers, technical services, and site execution to translate the approved design into a finished retail space.",
      "Particular attention was given to workmanship, material consistency, lighting accuracy, and the precise installation of display fixtures—essential elements in creating a secure and sophisticated jewellery-shopping experience.",
    ],
    type: "Retail",
    size: "75 sqm",
    completion: "July 2026",
    client: "Goldman Jewellery Co., LTD",
  },
  "chj-jewellry-cb1": {
    heading: "Fit-Out Works Within a Compact Retail Space",
    paragraphs: [
      "Located at AEON Mall Phnom Penh in Cambodia, this 58 sqm CHJ Jewellery boutique delivers a bright and highly detailed retail environment within a compact footprint.",
      "LUXHWORK was appointed to undertake the fit-out works and project management, coordinating specialist contractors, suppliers, building services, and on-site execution to translate the approved design into a completed retail space.",
      "Through disciplined site supervision, quality control, and detailed coordination, LUXHWORK completed the boutique in accordance with the brand’s design intent, technical requirements, and retail operating standards.",
    ],
    type: "Retail",
    size: "58 sqm",
    completion: "June 2025",
    duration: "8 weeks",
    client: "Goldman Jewellery Co., LTD",
  },
  "lao-miao-naga-2": {
    heading: "Meticulous Execution, Lasting Impression",
    paragraphs: [
      "Located at NagaWorld 1 in Phnom Penh, Cambodia, this 145 sqm LAOMIAO Jewellery boutique delivers a luxurious retail environment within a compact footprint.",
      "LUXHWORK managed the complete fit-out works and project execution, coordinating specialist contractors, suppliers, MEP services, custom showcases, illuminated displays, detailed joinery, decorative finishes, and branded storefront elements.",
      "Through precise coordination, site supervision, and quality control, the boutique was completed in accordance with the brand’s design intent, technical requirements, and operational standards.",
    ],
    type: "Retail",
    size: "145 sqm",
    completion: "January 2026",
    duration: "7 weeks",
    client: "n/a",
  },
  "seascape-house": {
    heading: "A Dining Experience Shaped by Space and Ritual",
    paragraphs: [
      "Located at The Peak in Phnom Penh, Cambodia, this 330 sqm Ryukou Omakase restaurant was conceived as an immersive Japanese dining environment where architecture, atmosphere, and culinary performance come together.",
      "LUXHWORK was appointed for the interior design scope, developing the spatial planning, material palette, lighting concept, custom joinery, and overall visual direction. The design balances privacy and openness through carefully considered dining zones, creating a natural progression from arrival to the intimate omakase experience.",
      "Warm timber finishes, controlled lighting, textured surfaces, and precise architectural detailing establish a calm and sophisticated atmosphere. Every element was designed to frame the chef’s craft, enhance the guest journey, and express Ryukou Omakase’s identity through a cohesive dining environment.",
    ],
    type: "FnB",
    size: "330 sqm",
    completion: "January 2026",
    client: "-",
  },
  "fabric-factory": {
    heading: "A Purpose-Built Showcase for Fabric and Fashion",
    paragraphs: [
      "Located in Phnom Penh, Cambodia, this 350 sqm space for New Rainbow Fabric Factory was designed as a dedicated fashion display and presentation zone, bringing garments, fabrics, and collections together within an organised and visually engaging environment.",
      "A balanced combination of warm timber finishes, neutral tones, glass partitions, and integrated lighting creates a clear, welcoming setting for presenting clothes and fabric collections.",
      "Every element was considered to strengthen the company’s identity while delivering a functional showcase zone suited to the operational needs of a modern manufacturing business.",
    ],
    type: "Commercial",
    size: "350 sqm",
    completion: "2024",
    client: "-",
  },
  "field-notes": {
    heading: "A Family-Focused Retail Experience Designed for Discovery",
    paragraphs: [
      "The Combi showroom is conceived as a warm, intuitive retail environment where parents can explore, compare and experience products with ease. Natural oak finishes create a calm and welcoming atmosphere, while clean white surfaces and Combi’s signature orange accents reinforce the brand’s Japanese identity.",
      "Products are organised into clearly defined zones, including dedicated stroller displays, child-seat testing areas and central accessory showcases. Integrated lighting highlights each collection without overwhelming the space, while wide circulation paths improve visibility and allow customers to move comfortably with children and strollers.",
    ],
    type: "Retail",
    size: "90 sqm",
    completion: "n/a",
    client: "-",
  },
};

'''
if marker not in s:
    raise SystemExit('type marker not found')
s = s.replace(marker, insert + marker, 1)

# Home shows only the first three projects, with a separate archive page.
s = s.replace('  const visibleProjects = projects;\n', '  const visibleProjects = projects.slice(0, 3);\n', 1)
needle = '''      <div className="selected-work-grid">
        {visibleProjects.map(project => (
          <article
            data-slug={project.slug}
            className={`selected-work-card ${visibleCards.has(project.slug) ? "selected-work-card-visible" : ""}`}
            key={project.slug}
          >
            <Link
              href={`/projects/${project.slug}`}
              className="selected-work-image-link"
            >
              <SafeImage
                src={project.image}
                alt={project.title}
                className={`project-image theme-image ${imagePresetClass(project.category, preset)}`}
              />
            </Link>
            <div className="project-meta selected-work-meta">
              <div>
                <h3>{project.title}</h3>
                <p>
                  {project.category} · {project.year}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>'''
replacement = needle.replace('      </div>\n    </section>', '''      </div>
      <div className="selected-work-more">
        <Link href="/projects" className="button button-dark">
          More projects <ArrowUpRight size={17} />
        </Link>
      </div>
    </section>''')
if needle not in s:
    raise SystemExit('gallery block not found')
s = s.replace(needle, replacement, 1)

# The contact block belongs to the dedicated contact page, not the first Home page.
s = s.replace('''      <ContactContent />
    </PageShell>
  );
}

function AboutInline()''', '''    </PageShell>
  );
}

function AboutInline()''', 1)

# Replace About copy and add the requested vision section.
s = s.replace('''          A commercial interior consultancy and fit-out company serving
          businesses in Cambodia and Thailand.''', '''          Singaporean Led– a commercial interior consultancy and fit-out
          company serving businesses in Cambodia.''', 1)
s = s.replace('''          Our team connects considered design with planning, MEP coordination,
          construction knowledge and hands-on follow-through — helping clients
          reach opening day with clearer decisions and fewer avoidable
          surprises.''', '''          Our team connects considered design with planning, MEP coordination,
          construction knowledge and hands-on follow-through — helping clients
          reach opening day with clearer decisions and fewer avoidable
          surprises.''', 1)
s = s.replace('''      <AboutVisualHero />
      <section className="expertise">''', '''      <AboutVisualHero />
      <section className="vision-section">
        <SectionLabel number="02">Our vision</SectionLabel>
        <div className="vision-copy">
          <h2>To transform spaces into inspiring experiences through innovation, efficiency, and exceptional craftsmanship.</h2>
          <p>While fostering the next generation of leading designers and cultivating a team of talented professionals to drive the future of commercial design.</p>
        </div>
      </section>
      <section className="expertise">''', 1)

# Make Projects a real archive page with the requested side filter.
old_projects = '''export function ProjectsPage() {
  const [, navigate] = useLocation();
  useEffect(() => {
    navigate("/#projects");
  }, [navigate]);
  return null;
}'''
new_projects = '''export function ProjectsPage() {
  const { projects } = usePortfolioProjects();
  const [preset] = useColorPreset();
  const [filter, setFilter] = useState<BusinessCategory | "All">("All");
  const filters: Array<BusinessCategory | "All"> = [
    "All",
    "Corporate Office",
    "Retails",
    "Commercial",
    "Food & Beverage (FnB)",
  ];
  const filteredProjects = projects.filter(project =>
    filter === "All" ? true : projectBusinessCategory[project.slug] === filter
  );
  return (
    <PageShell>
      <section className="projects-archive">
        <div className="projects-archive-head">
          <SectionLabel>Projects / Portfolio</SectionLabel>
          <h1>Spaces shaped around <em>business purpose.</em></h1>
          <p>Explore selected LUXHWORK projects by the type of business they support.</p>
        </div>
        <div className="projects-archive-layout">
          <aside className="projects-filter" aria-label="Filter projects by category">
            <span className="projects-filter-label">Filter by category</span>
            <div className="projects-filter-list" role="list">
              {filters.map(item => (
                <button
                  key={item}
                  type="button"
                  className={filter === item ? "projects-filter-active" : ""}
                  onClick={() => setFilter(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </aside>
          <div className="projects-archive-grid">
            {filteredProjects.map(project => (
              <ProjectCard key={project.slug} project={project} preset={preset} />
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}'''
if old_projects not in s:
    raise SystemExit('old ProjectsPage not found')
s = s.replace(old_projects, new_projects, 1)

# Add supplied detail content into the detail page.
s = s.replace('''  const project =
    portfolioProjects.find(item => item.slug === slug) ?? portfolioProjects[0];
  const projectIndex''', '''  const project =
    portfolioProjects.find(item => item.slug === slug) ?? portfolioProjects[0];
  const detail = projectDetailContent[project.slug];
  const projectIndex''', 1)
s = s.replace('<h1>{project.title}</h1>\n        <div className="project-detail-meta">', '<h1>{project.title}</h1>\n        {detail && (\n          <div className="project-detail-overview">\n            <div className="project-detail-facts">\n              <div><span>Client</span><strong>{detail.client}</strong></div>\n              <div><span>Type</span><strong>{detail.type}</strong></div>\n              <div><span>Size</span><strong>{detail.size}</strong></div>\n              <div><span>Completion</span><strong>{detail.completion}</strong></div>\n              {detail.duration && <div><span>Program duration</span><strong>{detail.duration}</strong></div>}\n            </div>\n            <div className="project-detail-copy">\n              <h2>{detail.heading}</h2>\n              {detail.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}\n            </div>\n          </div>\n        )}\n        <div className="project-detail-meta">', 1)

p.write_text(s)
print('updated Home.tsx from WEBSITE.pdf')

