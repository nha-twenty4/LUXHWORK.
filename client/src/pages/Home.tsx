import {
  FormEvent,
  ImgHTMLAttributes,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, useLocation, useParams } from "wouter";
import {
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  ChevronLeft,
  ChevronRight,
  Menu,
  MoveRight,
  Moon,
  Palette,
  Plus,
  ScanLine,
  Sparkles,
  Sun,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useTheme } from "@/contexts/ThemeContext";
import { profileProjectMedia } from "@/projectMedia";
import { uploadedProjectMedia } from "@/uploadedProjectMedia";

const storageBaseUrl = (import.meta.env.VITE_STORAGE_BASE_URL || "").replace(
  /\/$/,
  ""
);

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function makePlaceholderSvg(label: string, seed = 0) {
  const safeLabel =
    (label || "LUXH Works")
      .replace(/&/g, "and")
      .replace(/[^a-zA-Z0-9 _-]/g, " ")
      .trim() || "LUXH Works";
  const palette = [
    ["#d8d0c4", "#b46f52", "#4b564d"],
    ["#e9dcc4", "#9d7d5d", "#44534a"],
    ["#d7d9d6", "#a05b41", "#2f352f"],
    ["#efe4d5", "#cf7a4d", "#4d4c47"],
  ];
  const [bg, accent, dark] = palette[seed % palette.length];
  const line = safeLabel.length > 22 ? `${safeLabel.slice(0, 22)}…` : safeLabel;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${bg}"/>
          <stop offset="100%" stop-color="${dark}"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="900" fill="url(#bg)"/>
      <circle cx="925" cy="250" r="210" fill="${accent}" opacity="0.9"/>
      <rect x="120" y="520" width="520" height="210" rx="18" fill="${accent}" opacity="0.55"/>
      <rect x="680" y="600" width="330" height="120" rx="12" fill="#fff" opacity="0.18"/>
      <path d="M0 820C180 760 270 710 420 690C620 665 770 745 1200 680V900H0Z" fill="#f3efe9" opacity="0.18"/>
      <text x="120" y="300" fill="#f6f1ea" font-family="Arial, Helvetica, sans-serif" font-size="68" font-weight="700" letter-spacing="6">LUXH WORKS</text>
      <text x="120" y="380" fill="#f6f1ea" font-family="Arial, Helvetica, sans-serif" font-size="30" letter-spacing="3">${line}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function resolveImageSource(source: string | undefined | null) {
  if (!source) return makePlaceholderSvg("LUXH Works");
  if (source.startsWith("data:image/")) return source;
  if (source.startsWith("http://") || source.startsWith("https://")) {
    const resolved = source.replace(/\/$/, "");
    if (
      resolved.includes("manus.space") ||
      resolved.includes("manuspre.computer") ||
      resolved.includes("manuscomputer.ai") ||
      resolved.includes("manusvm.computer")
    ) {
      const key = resolved.split("/").pop() ?? "LUXH Works";
      return makePlaceholderSvg(key.replace(/\.[^.]+$/, ""), hashString(key));
    }
    return resolved;
  }
  if (source.startsWith("/manus-storage/")) {
    const base =
      storageBaseUrl ||
      (typeof window !== "undefined" ? window.location.origin : "");
    return `${base}${source}`;
  }
  return source;
}

const storageUrl = (path: string) => {
  return resolveImageSource(path);
};

const profileImage = (name: string) =>
  profileProjectMedia[name] ?? makePlaceholderSvg(name);

// Use hosted media URLs so the permanent site does not depend on another project's storage namespace.
const companyImages = {
  bar: profileImage("image87.png"),
  jewellery: profileImage("image88.jpeg"),
  jewelleryWide: profileImage("image89.jpeg"),
  retailPanels: profileImage("image90.jpeg"),
  visaOffice: profileImage("image37.jpeg"),
  visaReception: profileImage("image38.png"),
  visaDetail: profileImage("image39.jpeg"),
  warmInterior: profileImage("image42.jpeg"),
  warmDining: profileImage("image56.jpeg"),
  warmLounge: profileImage("image57.jpeg"),
  restaurant: profileImage("image58.jpeg"),
  restaurantDetail: profileImage("image59.jpeg"),
  fnb: profileImage("image60.jpeg"),
  retailStore: profileImage("image92.jpeg"),
  retailFront: profileImage("image93.jpeg"),
  retailInterior: profileImage("image94.jpeg"),
  residence: profileImage("image137.png"),
  residenceExterior: profileImage("image138.png"),
  residenceLounge: profileImage("image139.png"),
  residenceKitchen: profileImage("image140.png"),
};

const images = {
  hero: companyImages.bar,
  villa: companyImages.residence,
  office: companyImages.visaOffice,
  interior: companyImages.warmDining,
  coastal: companyImages.residenceExterior,
  modern: companyImages.retailPanels,
  moriDetail: companyImages.warmInterior,
  warmDetail: companyImages.restaurantDetail,
  duskDetail: companyImages.jewellery,
};

const homeHeroImage = "/luxhwork-home-bar.png";

const companyProjectImageSets: Record<string, string[]> = {
  "house-14": [
    "image37.jpeg",
    "image38.png",
    "image9.png",
    "image39.jpeg",
    "image40.jpeg",
    "image41.jpeg",
  ].map(profileImage),
  "mori-residence": ["image44.jpeg", "image45.jpeg"].map(profileImage),
  "pp-link-broadcast": ["image42.jpeg", "image43.jpeg"].map(profileImage),
  northpoint: [
    "image51.png",
    "image1.jpeg",
    "image52.jpeg",
    "image53.jpeg",
    "image54.png",
    "image55.jpeg",
  ].map(profileImage),
  "seascape-house": [
    "image56.jpeg",
    "image57.jpeg",
    "image32.jpeg",
    "image58.jpeg",
    "image59.jpeg",
    "image60.jpeg",
    "image61.jpeg",
  ].map(profileImage),
  "frame-house": [
    "image11.png",
    "image66.jpeg",
    "image67.jpeg",
    "image68.jpeg",
    "image69.jpeg",
  ].map(profileImage),
  "field-notes": [
    "image27.png",
    "image74.png",
    "image75.png",
    "image76.png",
  ].map(profileImage),
  "ratanac-mealea": [
    "image26.png",
    "image77.png",
    "image78.png",
    "image79.png",
    "image80.png",
  ].map(profileImage),
  "atelier-common": [
    "image81.png",
    "image82.jpeg",
    "image83.jpeg",
    "image84.jpeg",
    "image85.jpeg",
    "image86.jpeg",
  ].map(profileImage),
  "lukfook-sihanouk": [
    "image87.png",
    "image88.jpeg",
    "image89.jpeg",
    "image90.jpeg",
    "image91.jpeg",
  ].map(profileImage),
  "lukfook-funmall": [
    "image92.jpeg",
    "image93.jpeg",
    "image94.jpeg",
    "image95.jpeg",
  ].map(profileImage),
  "courtyard-study": [
    "image100.png",
    "image97.png",
    "image98.png",
    "image99.png",
    "image100.png",
  ].map(profileImage),
  davidoff: [
    "image33.jpeg",
    "image62.jpeg",
    "image63.jpeg",
    "image64.png",
    "image65.jpeg",
  ].map(profileImage),
  "the-hynd-hotel": [
    "image101.png",
    "image102.png",
    "image103.png",
    "image104.png",
    "image105.png",
  ].map(profileImage),
  "chj-jewellry-cb1": [
    "image106.png",
    "image107.png",
    "image108.png",
    "image109.png",
    "image110.png",
    "image111.png",
  ].map(profileImage),
  "chj-jewellry-cb3": [
    "image112.png",
    "image113.png",
    "image114.png",
    "image115.png",
    "image116.png",
  ].map(profileImage),
  "lukfook-chipmong": [
    "image117.png",
    "image118.png",
    "image119.png",
    "image120.png",
    "image121.png",
  ].map(profileImage),
  "lao-miao-naga-2": [
    "image122.png",
    "image123.jpeg",
    "image124.png",
    "image125.png",
    "image126.png",
  ].map(profileImage),
  "chj-jewellry-cb4": [
    "image127.png",
    "image128.jpeg",
    "image129.jpeg",
    "image130.jpeg",
    "image113.png",
  ].map(profileImage),
  "fabric-factory": [
    "image70.jpeg",
    "image3.jpeg",
    "image71.jpeg",
    "image36.jpeg",
    "image72.jpeg",
    "image73.jpeg",
  ].map(profileImage),
  "thailand-lukfook-rama9": [
    "image147.jpeg",
    "image148.jpeg",
    "image149.jpeg",
    "image150.jpeg",
    "image151.jpeg",
  ].map(profileImage),
  "thailand-zhou-liufu": [
    "image152.jpeg",
    "image146.jpeg",
    "image4.jpeg",
    "image22.jpeg",
    "image153.jpeg",
  ].map(profileImage),
  "thailand-lukfook-pinklao": [
    "image145.png",
    "image154.png",
    "image155.png",
    "image156.png",
    "image157.png",
  ].map(profileImage),
};

// The supplied VIP lounge photograph is the approved Golden Group cover image.
companyProjectImageSets.northpoint = ["/golden-group-vip-lounge.png"];

const companyProjectDetails: Record<
  string,
  {
    title: string;
    category: Project["category"];
    location: string;
    client: string;
    description: string;
    note: string;
    budget?: string;
  }
> = {
  "house-14": {
    title: "VISA WORLDWIDE BRANCH OFFICE EXPANSION (PHNOM PENH)",
    category: "Interior",
    location: "Phnom Penh, Cambodia",
    client: "Visa Worldwide",
    description:
      "To propose corporate interior design and fit-out works for the Visa Phnom Penh office relocation.",
    note: "Corporate office space · 135 SQM",
  },
  "mori-residence": {
    title: "PP LINK SECURITY OFFICE (PHNOM PENH)",
    category: "Interior",
    location: "Phnom Penh, Cambodia",
    client: "PP Link Security",
    description:
      "To propose an interior design concept for the PP Link Security office and broadcast station.",
    note: "Security office · Interior design concept",
  },
  northpoint: {
    title: "GOLDEN GROUP (PHNOM PENH)",
    category: "Interior",
    location: "Phnom Penh, Cambodia",
    client: "Golden Group",
    description:
      "To propose corporate interior design and fit-out works for the Golden Group private lounge.",
    note: "Corporate private lounge · 170 SQM",
  },
  "seascape-house": {
    title: "RYUKO OMAKASE (PHNOM PENH)",
    category: "Interior",
    location: "Phnom Penh, Cambodia",
    client: "Ryuko Omakase",
    description:
      "Interior design and fit-out works for Ryuko Omakase, shaped around a warm hospitality experience.",
    note: "Hospitality / F&B",
  },
  "frame-house": {
    title: "LUCKY BURGER TAKMAO",
    category: "Interior",
    location: "Takmao, Cambodia",
    client: "Lucky Burger",
    description:
      "Interior and facade fit-out work for the Lucky Burger Takmao restaurant.",
    note: "Restaurant / F&B · Interior and facade fit-out",
  },
  "field-notes": {
    title: "COMBI (PHNOM PENH)",
    category: "Interior",
    location: "Phnom Penh, Cambodia",
    client: "Combi",
    description:
      "To propose interior design and fit-out works for the Combi retail store relocation.",
    note: "Retail shop · Outlet 1 & 2 · 130 SQM",
  },
  "atelier-common": {
    title: "LUK FOOK JEWELLERY AEON 3",
    category: "Interior",
    location: "Phnom Penh, Cambodia",
    client: "LUK FOOK Jewellery",
    description:
      "To propose fit-out works for the LUK FOOK Jewellery store at AEON 3. LUXHWORK exclusive.",
    note: "Retail jewellery · Fit-out works",
  },
  "courtyard-study": {
    title: "ONE OASIS WELLNESS SPA (PHNOM PENH)",
    category: "Interior",
    location: "Phnom Penh, Cambodia",
    client: "One Oasis Wellness Spa",
    description:
      "To propose interior design and fit-out works for One Oasis Wellness Spa.",
    note: "Hospitality / leisure · 150 SQM",
  },
  davidoff: {
    title: "DAVIDOFF OF GENEVA (PHNOM PENH)",
    category: "Interior",
    location: "Phnom Penh, Cambodia",
    client: "Davidoff of Geneva",
    description:
      "Interior design and fit-out work for the Davidoff of Geneva project in Phnom Penh.",
    note: "Retail / hospitality interior",
  },
  "the-hynd-hotel": {
    title: "SH HOTEL (PHNOM PENH)",
    category: "Interior",
    location: "Phnom Penh, Cambodia",
    client: "SH Hotel",
    description:
      "Hospitality interiors shaped around a calm, practical guest experience in Phnom Penh.",
    note: "Hospitality · 12 floors · 750 SQM",
  },
  "chj-jewellry-cb1": {
    title: "CHJ JEWELLRY CB1 AEON MALL 1",
    category: "Interior",
    location: "Phnom Penh, Cambodia",
    client: "CHJ Jewellery",
    description:
      "To propose fit-out works for the CHJ Jewellery store at AEON Mall 1.",
    note: "Retail jewellery · 58 SQM",
  },
};

type Project = {
  slug: string;
  title: string;
  category:
    | "Architecture"
    | "Interior"
    | "3D Visualization"
    | "Graphic Design"
    | "Branding";
  image: string;
  year: string;
  location: string;
  client: string;
  description: string;
  note: string;
  size: "wide" | "tall" | "standard";
  gallery: string[];
  floorPlan: string;
  pdf: string;
};

type BusinessCategory =
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
    firstCompletion?: string;
    secondCompletion?: string;
    duration?: string;
    client: string;
  }
> = {
  "house-14": {
    heading: "A Purposely Designed Workplace for Modern Collaboration",
    paragraphs: [
      "Located within Vattanac Capital Tower in Phnom Penh, The VISA Worldwide office was designed as a modern corporate workplace that reflects the company’s global identity while producing a comfortable and efficient environment for their team.",
      "Spanning approximately 136 sqm, the office features a clean, open layout with a refined corporate aesthetic. The design maximises the compact footprint, creating a workplace that feels bright, connected, and functional.",
      "Through interior design and fit-out, LUXHWORK translated the concept into a cohesive workplace, carefully coordinating finishes, details, and construction to deliver a refined and professional environment.",
    ],
    type: "Corporate Offices",
    size: "136 sqm",
    completion: "April 2022 · Expansion Feb 2025",
    firstCompletion: "April 2022",
    secondCompletion: "February 2025 (Expansion)",
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
      "Located in Krong TaKhmao, the 376 sqm Lucky Burger restaurant expands the presence of one of Cambodia’s established fast-food chains within a standalone building.",
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
      "LUXHWORK was appointed to undertake the complete fit-out works and project management, coordinating specialist contractors, suppliers, technical services, and site execution to translate the approved design into a finished retail space. The works included the storefront, illuminated display showcases, custom joinery, architectural finishes, lighting integration, and associated MEP coordination.",
      "Particular attention was given to workmanship, material consistency, lighting accuracy, and the precise installation of display fixtures—essential elements in creating a secure and sophisticated jewellery-shopping experience.",
      "Through disciplined site supervision and quality control, LUXHWORK successfully delivered the boutique in accordance with the brand’s design intent and operational requirements.",
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
      "LUXHWORK was appointed to undertake the complete fit-out works and project management, coordinating specialist contractors, suppliers, technical services, and site execution to translate the approved design into a finished retail space. The works included the storefront, illuminated display showcases, custom joinery, architectural finishes, lighting integration, and associated MEP coordination.",
      "Particular attention was given to workmanship, material consistency, lighting accuracy, and the precise installation of display fixtures—essential elements in creating a secure and sophisticated jewellery-shopping experience.",
      "Through disciplined site supervision and quality control, LUXHWORK successfully delivered the boutique in accordance with the brand’s design intent and operational requirements.",
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
      "The project involved the installation of custom jewellery showcases, illuminated display shelving, decorative metal screens, integrated lighting, branded storefront elements, architectural finishes, and associated MEP services. Careful coordination was required to accommodate the extensive display system while maintaining clear circulation and a comfortable customer experience.",
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
      "Located in Phnom Penh, Cambodia, this 350 sqm space for New Rainbow Fabric Factory was designed as a dedicated clothing and fabric showcase zone, bringing garments, materials, and collections together within an organised and visually engaging environment.",
      "A balanced combination of warm timber finishes, neutral tones, glass partitions, and integrated lighting creates a professional yet welcoming setting for presenting clothes and fabric collections.",
      "Every element was considered to strengthen the company’s identity while delivering a practical showcase zone suited to the operational needs of a modern manufacturing and fashion business.",
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
      "The result is a functional, brand-led showroom that balances product presentation, customer interaction and an approachable family-focused experience.",
    ],
    type: "Retail",
    size: "90 sqm",
    completion: "n/a",
    client: "-",
  },
};

type ColorPreset = "auto" | "monochrome" | "cinematic";

function useColorPreset() {
  const [preset, setPreset] = useState<ColorPreset>(() => {
    if (typeof window === "undefined") return "auto";
    const stored = window.localStorage.getItem("luxh-color-preset");
    return stored === "monochrome" || stored === "cinematic" ? stored : "auto";
  });
  useEffect(
    () => window.localStorage.setItem("luxh-color-preset", preset),
    [preset]
  );
  return [preset, setPreset] as const;
}

function imagePresetClass(
  category: Project["category"],
  preset: ColorPreset = "auto"
) {
  if (preset !== "auto") return `image-preset-${preset}`;
  if (category === "Architecture") return "image-preset-architecture";
  if (category === "Interior") return "image-preset-interior";
  if (category === "3D Visualization") return "image-preset-visualization";
  if (category === "Graphic Design") return "image-preset-graphic";
  if (category === "Branding") return "image-preset-branding";
  return "image-preset-neutral";
}

function ColorPresetControls({
  preset,
  onChange,
}: {
  preset: ColorPreset;
  onChange: (value: ColorPreset) => void;
}) {
  const options: Array<[ColorPreset, string]> = [
    ["auto", "By discipline"],
    ["monochrome", "Monochrome"],
    ["cinematic", "Cinematic"],
  ];
  return (
    <div
      className="color-preset-controls"
      role="group"
      aria-label="Choose image color preset"
    >
      {options.map(([value, label]) => (
        <button
          key={value}
          type="button"
          className={preset === value ? "color-preset-active" : ""}
          onClick={() => onChange(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

const baseProjects: Project[] = [
  {
    slug: "house-14",
    title: "VISA WORLDWIDE BRANCH OFFICE EXPANSION (PHNOM PENH)",
    category: "Interior",
    image: images.villa,
    year: "2024",
    location: "Phnom Penh, Cambodia",
    client: "Visa Worldwide",
    description:
      "To propose corporate interior design and fit-out works for the Visa Phnom Penh office relocation.",
    note: "Corporate office space · 135 SQM",
    size: "wide",
    gallery: [images.villa, images.modern, images.coastal],
    floorPlan: "/manus-storage/house-14-floor-plan_05ca90c2.svg",
    pdf: "/manus-storage/house-14-project_ec10947f.pdf",
  },
  {
    slug: "mori-residence",
    title: "PP LINK SECURITY OFFICE (PHNOM PENH)",
    category: "Interior",
    image: images.interior,
    year: "2024",
    location: "Phnom Penh, Cambodia",
    client: "PP Link Security",
    description:
      "To propose an interior design concept for the PP Link Security office and broadcast station.",
    note: "Security office · Interior design concept",
    size: "tall",
    gallery: [images.interior, images.moriDetail, images.warmDetail],
    floorPlan: "/manus-storage/mori-residence-floor-plan_57bfcfc8.svg",
    pdf: "/manus-storage/mori-residence-project_87783d74.pdf",
  },
  {
    slug: "northpoint",
    title: "GOLDEN GROUP (PHNOM PENH)",
    category: "Interior",
    image: images.office,
    year: "2023",
    location: "Phnom Penh, Cambodia",
    client: "Golden Group",
    description:
      "To propose corporate interior design and fit-out works for the Golden Group private lounge.",
    note: "Corporate private lounge · 170 SQM",
    size: "standard",
    gallery: [images.office, images.duskDetail, images.modern],
    floorPlan: "/manus-storage/northpoint-floor-plan_af0cdc34.svg",
    pdf: "/manus-storage/northpoint-project_2e1cfef3.pdf",
  },
  {
    slug: "seascape-house",
    title: "RYUKO OMAKASE (PHNOM PENH)",
    category: "Interior",
    image: images.coastal,
    year: "2023",
    location: "Phnom Penh, Cambodia",
    client: "Ryuko Omakase",
    description:
      "Interior design and fit-out works for Ryuko Omakase, shaped around a warm hospitality experience.",
    note: "Hospitality / F&B",
    size: "tall",
    gallery: [images.coastal, images.villa, images.warmDetail],
    floorPlan: "/manus-storage/seascape-house-floor-plan_ae136de4.svg",
    pdf: "/manus-storage/seascape-house-project_a2e250e4.pdf",
  },
  {
    slug: "frame-house",
    title: "LUCKY BURGER TAKMAO",
    category: "Interior",
    image: images.modern,
    year: "2022",
    location: "Takmao, Cambodia",
    client: "Lucky Burger",
    description:
      "Interior and facade fit-out work for the Lucky Burger Takmao restaurant.",
    note: "Restaurant / F&B · Interior and facade fit-out",
    size: "standard",
    gallery: [images.modern, images.villa, images.coastal],
    floorPlan: "/manus-storage/frame-house-floor-plan_20d4b933.svg",
    pdf: "/manus-storage/frame-house-project_2667e720.pdf",
  },
  {
    slug: "field-notes",
    title: "COMBI (PHNOM PENH)",
    category: "Interior",
    image: images.interior,
    year: "2024",
    location: "Phnom Penh, Cambodia",
    client: "Combi",
    description:
      "To propose interior design and fit-out works for the Combi retail store relocation.",
    note: "Retail shop · Outlet 1 & 2 · 130 SQM",
    size: "wide",
    gallery: [images.interior, images.moriDetail, images.duskDetail],
    floorPlan: "/manus-storage/field-notes-floor-plan_f62b0fb1.svg",
    pdf: "/manus-storage/field-notes-project_bc210007.pdf",
  },
  {
    slug: "atelier-common",
    title: "LUK FOOK JEWELLERY AEON 3",
    category: "Interior",
    image: images.duskDetail,
    year: "2024",
    location: "Phnom Penh, Cambodia",
    client: "LUK FOOK Jewellery",
    description:
      "To propose fit-out works for the LUK FOOK Jewellery store at AEON 3. LUXHWORK exclusive.",
    note: "Retail jewellery · Fit-out works",
    size: "standard",
    gallery: [images.duskDetail, images.warmDetail, images.interior],
    floorPlan: "",
    pdf: "",
  },
  {
    slug: "courtyard-study",
    title: "ONE OASIS WELLNESS SPA (PHNOM PENH)",
    category: "Interior",
    image: images.warmDetail,
    year: "2023",
    location: "Phnom Penh, Cambodia",
    client: "One Oasis Wellness Spa",
    description:
      "To propose interior design and fit-out works for One Oasis Wellness Spa.",
    note: "Hospitality / leisure · 150 SQM",
    size: "wide",
    gallery: [images.warmDetail, images.interior, images.villa],
    floorPlan: "",
    pdf: "",
  },
  {
    slug: "davidoff",
    title: "DAVIDOFF OF GENEVA (PHNOM PENH)",
    category: "Interior",
    image: companyImages.jewelleryWide,
    year: "2026",
    location: "Phnom Penh, Cambodia",
    client: "Davidoff of Geneva",
    description:
      "Interior design and fit-out work for the Davidoff of Geneva project in Phnom Penh.",
    note: "Retail / hospitality interior",
    size: "wide",
    gallery: [
      companyImages.jewelleryWide,
      companyImages.jewellery,
      companyImages.retailInterior,
    ],
    floorPlan: "",
    pdf: "",
  },
  {
    slug: "the-hynd-hotel",
    title: "SH HOTEL (PHNOM PENH)",
    category: "Interior",
    image: companyImages.warmLounge,
    year: "2026",
    location: "Phnom Penh, Cambodia",
    client: "SH Hotel",
    description:
      "Hospitality interiors shaped around a calm, practical guest experience in Phnom Penh.",
    note: "Hospitality · 12 floors · 750 SQM",
    size: "tall",
    gallery: [
      companyImages.warmLounge,
      companyImages.restaurant,
      companyImages.warmDining,
    ],
    floorPlan: "",
    pdf: "",
  },
  {
    slug: "chj-jewellry-cb1",
    title: "CHJ JEWELLRY CB1 AEON MALL 1",
    category: "Interior",
    image: companyImages.retailPanels,
    year: "2026",
    location: "Phnom Penh, Cambodia",
    client: "CHJ Jewellery",
    description:
      "To propose fit-out works for the CHJ Jewellery store at AEON Mall 1.",
    note: "Retail jewellery · 58 SQM",
    size: "standard",
    gallery: [
      companyImages.retailPanels,
      companyImages.retailFront,
      companyImages.jewellery,
    ],
    floorPlan: "",
    pdf: "",
  },
  {
    slug: "visa-branch-office",
    title: "VISA WORLDWIDE BRANCH OFFICE (PHNOM PENH)",
    category: "Interior",
    image: profileImage("image40.jpeg"),
    year: "Not listed",
    location: "Phnom Penh, Cambodia",
    client: "Visa Worldwide",
    description:
      "Corporate interior design and fit-out works for the Visa Phnom Penh branch office.",
    note: "Corporate office space",
    size: "wide",
    gallery: [
      "image40.jpeg",
      "image46.jpeg",
      "image47.jpeg",
      "image48.jpeg",
      "image49.jpeg",
      "image50.jpeg",
    ].map(profileImage),
    floorPlan: "",
    pdf: "",
  },
  {
    slug: "pp-link-broadcast",
    title: "PP LINK SECURITY BROADCAST STATION (PHNOM PENH)",
    category: "Interior",
    image: companyProjectImageSets["pp-link-broadcast"][0],
    year: "Not listed",
    location: "Phnom Penh, Cambodia",
    client: "PP Link Security",
    description:
      "Interior design concept for the PP Link Security broadcast station.",
    note: "Broadcast station · Interior design concept",
    size: "standard",
    gallery: companyProjectImageSets["pp-link-broadcast"],
    floorPlan: "",
    pdf: "",
  },
  {
    slug: "lukfook-sihanouk",
    title: "LUK FOOK JEWELLERY PREAH SIHANOUK BLVD",
    category: "Interior",
    image: companyProjectImageSets["lukfook-sihanouk"][0],
    year: "Not listed",
    location: "Phnom Penh, Cambodia",
    client: "LUK FOOK Jewellery",
    description:
      "Fit-out works for the LUK FOOK Jewellery store at Preah Sihanouk Boulevard.",
    note: "Retail jewellery · LUXHWORK exclusive",
    size: "wide",
    gallery: companyProjectImageSets["lukfook-sihanouk"],
    floorPlan: "",
    pdf: "",
  },
  {
    slug: "lukfook-funmall",
    title: "LUK FOOK JEWELLERY FUNMALL TK",
    category: "Interior",
    image: companyProjectImageSets["lukfook-funmall"][0],
    year: "Not listed",
    location: "Phnom Penh, Cambodia",
    client: "LUK FOOK Jewellery",
    description:
      "Fit-out works for the LUK FOOK Jewellery store at Funmall TK.",
    note: "Retail jewellery · LUXHWORK exclusive",
    size: "standard",
    gallery: companyProjectImageSets["lukfook-funmall"],
    floorPlan: "",
    pdf: "",
  },
  {
    slug: "chj-jewellry-cb3",
    title: "CHJ JEWELLRY CB3 AEON MALL 2",
    category: "Interior",
    image: companyProjectImageSets["chj-jewellry-cb3"][0],
    year: "Not listed",
    location: "Phnom Penh, Cambodia",
    client: "CHJ Jewellery",
    description: "Fit-out works for the CHJ Jewellery store at AEON Mall 2.",
    note: "Retail jewellery · 110 SQM",
    size: "tall",
    gallery: companyProjectImageSets["chj-jewellry-cb3"],
    floorPlan: "",
    pdf: "",
  },
  {
    slug: "lukfook-chipmong",
    title: "LUK FOOK JEWELLERY CHIPMONG MEGA MALL 271",
    category: "Interior",
    image: companyProjectImageSets["lukfook-chipmong"][0],
    year: "Not listed",
    location: "Phnom Penh, Cambodia",
    client: "LUK FOOK Jewellery",
    description:
      "Fit-out works for the LUK FOOK Jewellery store at Chipmong Mega Mall 271.",
    note: "Retail jewellery · LUXHWORK exclusive",
    size: "wide",
    gallery: companyProjectImageSets["lukfook-chipmong"],
    floorPlan: "",
    pdf: "",
  },
  {
    slug: "lao-miao-naga-2",
    title: "LAO MIAO CBF-NAGA 2",
    category: "Interior",
    image: companyProjectImageSets["lao-miao-naga-2"][0],
    year: "Not listed",
    location: "Phnom Penh, Cambodia",
    client: "Lao Miao",
    description:
      "Fit-out works for the Lao Miao Jewellery store at CBF-Naga 2.",
    note: "Retail jewellery · 43 SQM",
    size: "standard",
    gallery: companyProjectImageSets["lao-miao-naga-2"],
    floorPlan: "",
    pdf: "",
  },
  {
    slug: "chj-jewellry-cb4",
    title: "CHJ JEWELLRY CB4 AEON MALL 3",
    category: "Interior",
    image: companyProjectImageSets["chj-jewellry-cb4"][0],
    year: "Not listed",
    location: "Phnom Penh, Cambodia",
    client: "CHJ Jewellery",
    description: "Fit-out works for the CHJ Jewellery store at AEON Mall 3.",
    note: "Retail jewellery · 150 SQM",
    size: "tall",
    gallery: companyProjectImageSets["chj-jewellry-cb4"],
    floorPlan: "",
    pdf: "",
  },
  {
    slug: "thailand-lukfook-rama9",
    title: "LUKFOOK JEWELRY (BANGKOK) @ CENTRAL-RAMA9",
    category: "Interior",
    image: companyProjectImageSets["thailand-lukfook-rama9"][0],
    year: "Not listed",
    location: "Bangkok, Thailand",
    client: "LUKFOOK Jewelry",
    description:
      "Fit-out works for the LUKFOOK Jewellery store at Central-Rama9.",
    note: "Thailand project · Retail jewellery",
    size: "wide",
    gallery: companyProjectImageSets["thailand-lukfook-rama9"],
    floorPlan: "",
    pdf: "",
  },
  {
    slug: "thailand-zhou-liufu",
    title: "ZHOU LIUFU JEWELRY (BANGKOK) @ CENTRAL RAMA 9",
    category: "Interior",
    image: companyProjectImageSets["thailand-zhou-liufu"][0],
    year: "Not listed",
    location: "Bangkok, Thailand",
    client: "Zhou Liufu Jewelry",
    description:
      "Fit-out works for the Zhou Liufu Jewelry store at Central Rama 9.",
    note: "Thailand project · Retail jewellery",
    size: "standard",
    gallery: companyProjectImageSets["thailand-zhou-liufu"],
    floorPlan: "",
    pdf: "",
  },
  {
    slug: "thailand-lukfook-pinklao",
    title: "LUKFOOK JEWELRY (BANGKOK) @ CENTRAL-PINKLAO",
    category: "Interior",
    image: companyProjectImageSets["thailand-lukfook-pinklao"][0],
    year: "Not listed",
    location: "Bangkok, Thailand",
    client: "LUKFOOK Jewelry",
    description:
      "Fit-out works for the LUKFOOK Jewellery store at Central-Pinklao.",
    note: "Thailand project · Retail jewellery",
    size: "tall",
    gallery: companyProjectImageSets["thailand-lukfook-pinklao"],
    floorPlan: "",
    pdf: "",
  },
  {
    slug: "ratanac-mealea",
    title: "RATANAC MEALEA PHNOM PENH & SIHANOUKVILLE",
    category: "Interior",
    image: companyProjectImageSets["ratanac-mealea"][0],
    year: "Not listed",
    location: "Phnom Penh & Sihanoukville, Cambodia",
    client: "Ratanac Mealea",
    description:
      "Interior design and fit-out works for the Ratanac Mealea jewellery retail stores.",
    note: "Jewellery retail store · Outlets 1 & 2 · 35–50 SQM · LUXHWORK exclusive",
    size: "wide",
    gallery: companyProjectImageSets["ratanac-mealea"],
    floorPlan: "",
    pdf: "",
  },
  {
    slug: "fabric-factory",
    title: "FABRIC FACTORY (PHNOM PENH)",
    category: "Interior",
    image: companyImages.warmLounge,
    year: "Not listed",
    location: "Phnom Penh, Cambodia",
    client: "Fabric Factory",
    description:
      "Commercial interior design for the Fabric Factory project in Phnom Penh.",
    note: "Commercial interior · 330 SQM",
    size: "wide",
    gallery: companyProjectImageSets["fabric-factory"],
    floorPlan: "",
    pdf: "",
  },
];

// Prefer the project-specific photography supplied by the studio over generic/profile media.
// This single normalization keeps the Projects index and every project detail page in sync.
const projects: Project[] = baseProjects.map((project) => {
  const uploaded = uploadedProjectMedia[project.slug];
  if (!uploaded?.length) return project;
  return {
    ...project,
    image: uploaded[0],
    gallery: uploaded,
  };
});

type PersistedProject = {
  slug: string;
  title: string;
  category: string;
  imageUrl: string;
  year: string;
  location: string;
  client: string;
  description: string;
  note: string;
  sortOrder: number;
  floorPlanUrl: string | null;
  pdfUrl: string | null;
  gallery: Array<{ kind: string; url: string }>;
};

function mapPersistedProject(item: PersistedProject): Project {
  const companyGallery =
    item.slug === "northpoint"
      ? ["/golden-group-vip-lounge.png"]
      : uploadedProjectMedia[item.slug] ?? companyProjectImageSets[item.slug];
  const details = companyProjectDetails[item.slug];
  const gallery =
    companyGallery ??
    item.gallery
      .filter(asset => asset.kind === "gallery")
      .map(asset => asset.url);
  const coverImage = companyGallery?.[0] ?? storageUrl(item.imageUrl);
  return {
    slug: item.slug,
    title: details?.title ?? item.title,
    category: details?.category ?? (item.category as Project["category"]),
    image: coverImage,
    year: item.year,
    location: details?.location ?? item.location,
    client: details?.client ?? item.client,
    description: details?.description ?? item.description,
    note: details?.note ?? item.note,
    size:
      item.sortOrder % 3 === 2
        ? "tall"
        : item.sortOrder % 3 === 0
          ? "standard"
          : "wide",
    gallery: gallery.length ? gallery.map(storageUrl) : [coverImage],
    floorPlan: storageUrl(item.floorPlanUrl ?? ""),
    pdf: storageUrl(item.pdfUrl ?? ""),
  };
}

function SafeImage({
  src,
  fallbackSrc = images.villa,
  alt,
  loading,
  ...props
}: ImgHTMLAttributes<HTMLImageElement> & { fallbackSrc?: string }) {
  const [currentSrc, setCurrentSrc] = useState(() => resolveImageSource(src));
  const [isLoaded, setIsLoaded] = useState(false);
  const { className, onLoad, ...imageProps } = props;
  useEffect(() => setCurrentSrc(resolveImageSource(src)), [src]);
  useEffect(() => setIsLoaded(false), [currentSrc]);
  return (
    <img
      {...imageProps}
      loading={loading ?? "lazy"}
      decoding="async"
      fetchPriority={loading === "eager" ? "high" : "auto"}
      className={`${className ?? ""} image-loading${isLoaded ? " image-loaded" : ""}`}
      src={currentSrc}
      alt={alt}
      onLoad={event => {
        setIsLoaded(true);
        onLoad?.(event);
      }}
      onError={() => {
        const next = resolveImageSource(fallbackSrc);
        if (currentSrc !== next) setCurrentSrc(next);
        setIsLoaded(true);
      }}
    />
  );
}

function usePortfolioProjects() {
  const query = trpc.projects.list.useQuery(undefined, { retry: 1 });
  const persistedProjects = query.data?.map(mapPersistedProject) ?? [];
  const persistedSlugs = new Set(
    persistedProjects.map(project => project.slug)
  );
  const correctedStaticProjects = projects.map(project => {
    const companyGallery = companyProjectImageSets[project.slug];
    return companyGallery
      ? { ...project, image: companyGallery[0], gallery: companyGallery }
      : project;
  });
  const mergedProjects = persistedProjects.length
    ? [
        ...persistedProjects,
        ...correctedStaticProjects.filter(
          project => !persistedSlugs.has(project.slug)
        ),
      ]
    : correctedStaticProjects;
  return { ...query, projects: mergedProjects };
}

const services = [
  {
    number: "01",
    title: "Interior Design & Consultancy",
    icon: Building2,
    items: ["Spatial Direction", "Design Development", "Technical & Cost"],
    text: "Tailored interior solutions that bring together refined design, functionality, and purpose — thoughtfully shaped around each client’s identity, needs, and way of working.",
  },
  {
    number: "02",
    title: "Fit-Out Works",
    icon: Palette,
    items: ["Interior Fit-Out", "MEP & Technical Works", "Site Delivery"],
    text: "End-to-end fit-out solutions that bring your interior from design to completion, with careful coordination of workmanship, materials, and technical requirements.",
  },
  {
    number: "03",
    title: "Project Management",
    icon: ScanLine,
    items: [
      "Planning & Coordination",
      "Quality & Cost Control",
      "Programmed & Delivery",
    ],
    text: "Coordinated project delivery from planning to completion, ensuring every detail, timeline, and team remains aligned for a smooth and well-executed outcome.",
  },
  {
    number: "04",
    title: "MEP Coordination",
    icon: Building2,
    items: [
      "MEP Planning",
      "Technical Coordination",
      "Performance & Efficiency",
    ],
    text: "Integrated MEP solutions carefully coordinated with the design and built environment to ensure reliable performance, efficient operation, and seamless execution.",
  },
  {
    number: "05",
    title: "Feasibility Studies",
    icon: Sparkles,
    items: [
      "Site & Space Assessment",
      "Design & Technical Feasibility",
      "Cost & Development Planning",
    ],
    text: "Assessing site conditions, design potential, technical requirements, and cost considerations to determine practical solutions and provide a clear foundation for informed project decisions.",
  },
];

const serviceReferenceFallback = companyImages.jewelleryWide;
const serviceReferenceImages: Record<string, string> = {
  "interior-design-and-consultancy": "/VIPlounge-02.png",
  "fit-out-works": companyImages.retailPanels,
  "project-management": companyImages.visaOffice,
  "mep-coordination": "/mep-coordination.png",
  "feasibility-studies": "/feasibility-study.png",
};
const serviceDetailCopy: Record<
  string,
  { headline: string; body: string; tags: string; scope?: string[] }
> = {
  "interior-design-and-consultancy": {
    headline: "Spaces shaped with clarity.",
    body: "Tailored interior solutions that bring together refined design, functionality, and purpose — thoughtfully shaped around each client’s identity, needs, and way of working.",
    tags: "SPATIAL DIRECTION / DESIGN DEVELOPMENT / TECHNICAL & COST",
    scope: [
      "We develop efficient space plans and layouts, establish a clear design concept and direction, and integrate the brand identity into the overall space.",
      "Carefully considered materials, finishes, furniture, joinery, lighting, and detailed documentation bring the design together into a cohesive and buildable solution.",
      "We coordinate technical requirements, buildability, and cost considerations to ensure the design is practical to deliver.",
    ],
  },
  "fit-out-works": {
    headline: "Built with control. Delivered business-ready.",
    body: "End-to-end fit-out solutions that bring your interior from design to completion, with careful coordination of workmanship, materials, and technical requirements.",
    tags: "INTERIOR FIT-OUT / TECHNICAL WORKS / SITE DELIVERY",
    scope: [
      "From partitions and ceilings to flooring, joinery, and finishes, every element is carefully executed to bring the design into the built environment.",
      "Integrated electrical, mechanical, plumbing, and other technical systems are coordinated to support the functionality and performance of the space.",
      "Coordinated site execution, quality control, and project management ensure the work is delivered efficiently, accurately, and to the required standard.",
    ],
  },
  "project-management": {
    headline: "Every decision, clearly coordinated.",
    body: "Coordinated project delivery from planning to completion, ensuring every detail, timeline, and team remains aligned for a smooth and well-executed outcome.",
    tags: "PLANNING / COST CONTROL / PROGRAMME & DELIVERY",
    scope: [
      "Clear planning and coordination across design, procurement, contractors, and site activities to keep every stage aligned.",
      "Close oversight of workmanship, materials, budget, and project requirements to maintain quality and value.",
      "Structured programmed management and site supervision to keep the project progressing efficiently towards timely completion.",
    ],
  },
  "mep-coordination": {
    headline: "Technical systems that support the experience.",
    body: "Integrated MEP solutions carefully coordinated with the design and built environment to ensure reliable performance, efficient operation, and seamless execution.",
    tags: "MEP PLANNING / TECHNICAL COORDINATION / PERFORMANCE & EFFICIENCY",
    scope: [
      "Integrated mechanical, electrical, and plumbing systems planned around the design, operational needs, and spatial requirements.",
      "Close coordination between MEP systems, architectural elements, and other site works to minimize clashes and ensure seamless integration.",
      "Practical MEP solutions focused on reliable performance, efficient operation, and long-term maintainability.",
    ],
  },
  "feasibility-studies": {
    headline: "Make the right commitment early.",
    body: "Assessing site conditions, design potential, technical requirements, and cost considerations to determine practical solutions and provide a clear foundation for informed project decisions.",
    tags: "SITE ASSESSMENT / TECHNICAL FEASIBILITY / COST PLANNING",
    scope: [
      "Evaluate site conditions, spatial potential, and project requirements to establish a clear foundation for the development.",
      "Assess design concepts, technical requirements, and practical constraints to determine viable solutions.",
      "Review budget considerations, project scope, and development requirements to support informed planning and decision-making.",
    ],
  },
};
const serviceSlug = (title: string) =>
  title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const navItems = [
  ["Home", "/"],
  ["About", "/about"],
  ["Projects", "/projects"],
  ["Services", "/services"],
  ["Contact", "/contact"],
] as const;

const faqItems = [
  [
    "What types of commercial projects does LUXHWORK undertake?",
    "Offices, retail, F&B, hospitality, showrooms, jewellery stores, kiosks and commercial renovations.",
  ],
  [
    "Can you provide design consultancy without construction?",
    "Yes. We can support design and consultancy as a standalone scope, or continue through fit-out and delivery when the project requires it.",
  ],
  [
    "Can LUXHWORK manage the complete design-and-fit-out process?",
    "Yes. Our capabilities cover design, cost direction, fit-out coordination, project management, MEP coordination and handover support.",
  ],
  [
    "How early should we engage you before opening?",
    "As early as possible. An initial brief or feasibility review helps clarify the site, programme, budget and approvals before major commitments are made.",
  ],
  [
    "How is the project budget developed and controlled?",
    "We establish the brief and scope first, then develop design, cost direction and a priced BOQ. Programme, cost and reporting are reviewed through delivery.",
  ],
  [
    "Do you work in Thailand as well as Cambodia?",
    "Yes. LUXHWORK is presented as serving Cambodia and Thailand, with local execution and regional standards.",
  ],
  [
    "What happens after I send an enquiry?",
    "We review the location, approximate area, target opening date and business need, then recommend the right next step: a site visit, feasibility review or design proposal.",
  ],
  [
    "Do you work with an existing landlord, consultant or contractor team?",
    "Yes. The project scope can be shaped around the existing team, with LUXHWORK coordinating the design, fit-out, reporting or specialist layers that are needed.",
  ],
  [
    "Can you support a project after opening?",
    "Yes. Aftercare and continued operational support are part of the stated process, including repair, alteration and support for the space.",
  ],
  [
    "What information should I prepare before our first conversation?",
    "Please share the location, approximate area, target opening date, project type and what the business needs the space to achieve. An approximate budget is also helpful.",
  ],
] as const;

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <section className="faq-section" id="faq">
      <div className="faq-heading">
        <SectionLabel number="03">Project questions</SectionLabel>
        <h2>
          Questions worth answering
          <br />
          <em>before building.</em>
        </h2>
      </div>
      <div className="faq-list">
        {faqItems.map(([question, answer], index) => (
          <div
            className={`faq-item${openIndex === index ? " faq-item-open" : ""}`}
            key={question}
          >
            <button
              type="button"
              className="faq-question"
              aria-expanded={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span>{question}</span>
              <strong>{openIndex === index ? "−" : "+"}</strong>
            </button>
            <div className="faq-answer">
              <p>{answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CookieConsent() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(localStorage.getItem("luxh-cookie-consent") === null);
  }, []);
  const choose = (value: "accepted" | "declined") => {
    localStorage.setItem("luxh-cookie-consent", value);
    setVisible(false);
    window.dispatchEvent(
      new CustomEvent("luxh-cookie-consent", { detail: value })
    );
  };
  if (!visible) return null;
  return (
    <aside className="cookie-consent" role="dialog" aria-label="Cookie consent">
      <div>
        <strong>Cookies, with care.</strong>
        <p>
          Necessary cookies keep this site working. Optional analytics only
          starts when you accept.
        </p>
      </div>
      <div className="cookie-actions">
        <button type="button" onClick={() => choose("declined")}>
          Decline
        </button>
        <button type="button" onClick={() => choose("accepted")}>
          Accept analytics
        </button>
      </div>
    </aside>
  );
}


export function PageShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  useEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);
  useEffect(() => {
    const targetId = window.location.hash.slice(1);
    const target = targetId ? document.getElementById(targetId) : null;
    if (target) {
      const frame = window.requestAnimationFrame(() =>
        target.scrollIntoView({ behavior: "auto", block: "start" })
      );
      return () => {
        window.cancelAnimationFrame(frame);
      };
    }
    const restoreScroll = () =>
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    restoreScroll();
    const frame = window.requestAnimationFrame(() =>
      window.requestAnimationFrame(restoreScroll)
    );
    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [location]);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const buttons = Array.from(
      document.querySelectorAll<HTMLElement>(".button")
    );
    const cleanups = buttons.map(button => {
      const onMove = (event: PointerEvent) => {
        const bounds = button.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 10;
        const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 8;
        button.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      };
      const onLeave = () => {
        button.style.transform = "translate3d(0, 0, 0)";
      };
      button.addEventListener("pointermove", onMove);
      button.addEventListener("pointerleave", onLeave);
      return () => {
        button.removeEventListener("pointermove", onMove);
        button.removeEventListener("pointerleave", onLeave);
      };
    });
    return () => cleanups.forEach(cleanup => cleanup());
  }, [location]);
  useEffect(() => {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID as
      | string
      | undefined;
    if (
      !measurementId ||
      localStorage.getItem("luxh-cookie-consent") !== "accepted"
    )
      return;
    if (document.querySelector("script[data-luxh-ga]")) return;
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.dataset.luxhGa = "true";
    document.head.appendChild(script);
    const dataLayer = ((
      window as unknown as { dataLayer?: unknown[] }
    ).dataLayer ??= []);
    const gtag = (...args: unknown[]) => dataLayer.push(args);
    gtag("js", new Date());
    gtag("config", measurementId, { anonymize_ip: true });
  }, []);
  return (
    <div className="site-shell">
      <Header />
      <main
        key={location}
        className={`page-transition ${location.startsWith("/projects/") ? "project-detail-transition" : ""}`}
      >
        {children}
      </main>
      <Footer />
      <CookieConsent />
    </div>
  );
}

function Header() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const sectionIds: Record<string, string> = {
    Home: "hero",
    About: "about",
    Projects: "projects",
    Services: "services",
    Contact: "contact",
  };
  const headerItems = navItems.map(([label]) =>
    [
      label,
      label === "Contact"
        ? location === "/"
          ? "#contact"
          : "/#contact"
        : location === "/"
          ? `#${sectionIds[label]}`
          : `/#${sectionIds[label]}`,
    ] as const
  );
  const [activeSection, setActiveSection] = useState(
    location === "/" ? "hero" : ""
  );
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isHomeTop = location === "/" && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (location !== "/") {
      setActiveSection("");
      return;
    }
    const sectionEntries = Object.values(sectionIds)
      .map(id => [id, document.getElementById(id)] as const)
      .filter((entry): entry is readonly [string, HTMLElement] =>
        Boolean(entry[1])
      );
    const updateActiveSection = () => {
      const marker = window.scrollY + 120;
      let current = "hero";
      sectionEntries.forEach(([id, element]) => {
        if (element.offsetTop <= marker) current = id;
      });
      setActiveSection(current);
    };
    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [location]);

  useEffect(() => setOpen(false), [location]);
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header
      className={`site-header ${isHomeTop ? "header-on-hero" : "header-solid"} ${scrolled ? "header-scrolled" : ""} theme-${theme}`}
    >
      <div className="header-inner">
        <a
          href="/"
          className="brand"
          aria-label="LUXH Works home"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <span
            className="brand-wordmark"
            style={{ fontFamily: "MOMCAKE", fontSize: "40px" }}
          >
            LUXHWORK
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {headerItems.map(([label, href]) => (
            <a
              key={href}
              href={href}
              onClick={() =>
                location === "/" && setActiveSection(sectionIds[label])
              }
              className={
                activeSection === sectionIds[label] ? "nav-active" : ""
              }
            >
              {label}
            </a>
          ))}
        </nav>
        <a
          className="nav-whatsapp"
          href="https://wa.me/85589900300"
          target="_blank"
          rel="noreferrer"
        >
          <span aria-hidden="true" /> WhatsApp
        </a>
        <button
          type="button"
          className="theme-toggle"
          onClick={() => toggleTheme?.()}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
        </button>
        <button
          className="menu-toggle"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          {open ? <X size={21} /> : <Menu size={23} />}
        </button>
      </div>
      <div
        id="mobile-navigation"
        className={`mobile-nav ${open ? "mobile-nav-open" : ""}`}
        role="dialog"
        aria-label="Mobile navigation"
        aria-hidden={!open}
      >
        {headerItems.map(([label, href], index) => (
          <a
            key={href}
            href={href}
            className={`mobile-link${activeSection === sectionIds[label] ? " mobile-link-active" : ""}`}
            onClick={() => {
              setOpen(false);
              if (location === "/") setActiveSection(sectionIds[label]);
            }}
            style={{ transitionDelay: `${index * 45}ms` }}
          >
            <span>0{index + 1}</span>
            {label}
            <ArrowUpRight size={20} />
          </a>
        ))}
        <button
          type="button"
          className="mobile-theme-toggle"
          onClick={() => toggleTheme?.()}
        >
          {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}{" "}
          {theme === "light" ? "Dark mode" : "Light mode"}
        </button>
        <a
          className="mobile-whatsapp"
          href="https://wa.me/85589900300"
          target="_blank"
          rel="noreferrer"
        >
          <span aria-hidden="true" /> WhatsApp us
        </a>

        <div className="mobile-nav-footer">
          ADMIN@LUXHWORK.COM
          <br />
          +855 89 900 300
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand-block">
          <Link
            href="/"
            className="footer-wordmark"
            aria-label="LUXHWORK home"
            style={{ fontFamily: "MOMCAKE" }}
          >
            LUXHWORK
          </Link>
          <p>
            A commercial interior consultancy and fit-out company serving
            businesses in Cambodia and Thailand.
          </p>
        </div>
        <div className="footer-links">
          <span className="footer-kicker">Contact</span>
          <a className="footer-contact" href="tel:+85589900300">
            +855 89 900 300 <ArrowUpRight size={13} />
          </a>
          <a className="footer-contact" href="mailto:ADMIN@LUXHWORK.COM">
            ADMIN@LUXHWORK.COM <ArrowUpRight size={13} />
          </a>
        </div>
        <div className="footer-links">
          <span className="footer-kicker">Connect</span>
          <a
            className="footer-contact"
            href="https://t.me/+85589900300"
            target="_blank"
            rel="noreferrer"
          >
            Telegram <ArrowUpRight size={13} />
          </a>
          <a
            className="footer-contact"
            href="https://wa.me/85589900300"
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp <ArrowUpRight size={13} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">
            Instagram <ArrowUpRight size={13} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer">
            LinkedIn <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
      <div className="footer-nap">
        <div>
          <span className="footer-kicker">Studio</span>
          <strong style={{ fontFamily: "MOMCAKE", fontSize: "16px" }}>
            LUXHWORK
          </strong>
          <a
            className="footer-address"
            href="https://maps.app.goo.gl/LBirY3B6T78iRpFeA?g_st=ic"
            target="_blank"
            rel="noreferrer"
          >
            #MF, No. 112G E0, Preah Ang Yukanthor Street (19), Sangkat Phsar
            Kandal 2, Khan Daun Penh, Phnom Penh 12205, Cambodia{" "}
            <ArrowUpRight size={12} />
          </a>
        </div>
        <div>
          <span className="footer-kicker">Direct</span>
          <a href="tel:+85589900300" style={{ fontSize: "13px" }}>
            +855 89 900 300
          </a>
          <a href="mailto:admin@luxhwork.com" style={{ fontSize: "13px" }}>
            admin@luxhwork.com
          </a>
        </div>
        <div>
          <span className="footer-kicker">Hours</span>
          <p style={{ fontSize: "12px" }}>
            Monday–Friday 08:30–17:30
            <br />
            Saturday 08:30–13:00
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 LUXHWORK</span>
        <span>Phnom Penh City, Cambodia</span>
        <Link href="/privacy">Privacy policy</Link>
      </div>
    </footer>
  );
}

function SectionLabel({
  number,
  children,
  dark = false,
}: {
  number?: string;
  children?: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div className={`section-label ${dark ? "section-label-dark" : ""}`}>
      {number && <span>{number}</span>}
      <div />
      <p>{children}</p>
    </div>
  );
}

function ProjectCard({
  project,
  featured = false,
  preset = "auto",
}: {
  project: Project;
  featured?: boolean;
  preset?: ColorPreset;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.16, rootMargin: "0px 0px -8%" }
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  return (
    <Link
      ref={cardRef}
      href={`/projects/${project.slug}`}
      className={`project-card project-card-reveal ${isVisible ? "project-card-visible" : ""} ${featured ? "project-card-featured" : ""}`}
    >
      <div className="project-image-wrap">
        <SafeImage
          src={project.image}
          alt={project.title}
          className={`project-image theme-image ${imagePresetClass(project.category, preset)}`}
        />
      </div>
      <div className="project-meta">
        <div>
          <h3>{project.title}</h3>
          <p>{project.note}</p>
        </div>
      </div>
    </Link>
  );
}

function GallerySection() {
  const { projects } = usePortfolioProjects();
  const [preset] = useColorPreset();
  const visibleProjects = projects.slice(0, 3);
  const galleryRef = useRef<HTMLElement>(null);
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());

  useEffect(() => {
    const section = galleryRef.current;
    if (!section) return;
    const cards = Array.from(
      section.querySelectorAll<HTMLElement>(".selected-work-card")
    );
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      setVisibleCards(new Set(cards.map(card => card.dataset.slug || "")));
      return;
    }
    const observer = new IntersectionObserver(
      entries => {
        setVisibleCards(current => {
          const next = new Set(current);
          entries.forEach(entry => {
            if (entry.isIntersecting)
              next.add((entry.target as HTMLElement).dataset.slug || "");
          });
          return next;
        });
        entries.forEach(entry => {
          if (entry.isIntersecting) observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8%" }
    );
    cards.forEach(card => observer.observe(card));
    return () => observer.disconnect();
  }, [projects.length]);

  return (
    <section ref={galleryRef} className="visual-gallery" id="projects">
      <div className="visual-gallery-head">
        <div className="selected-work-heading">
          <SectionLabel>Projects / Portfolio</SectionLabel>
          <h2>
            Spaces shaped around
            <br />
            <em>business purpose.</em>
          </h2>
        </div>
        <p className="selected-work-intro">
          From regional offices to jewellery, hospitality and F&amp;B, our work
          connects commercial goals with a disciplined delivery process. All
          selected projects with distinct imagery.
        </p>
      </div>
      <div className="selected-work-grid">
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
      <div className="selected-work-more">
        <span>Explore the full portfolio</span>
        <Link href="/projects" className="button button-dark">
          More projects <ArrowUpRight size={17} />
        </Link>
      </div>
    </section>
  );
}

export function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!["#projects", "#services"].includes(window.location.hash)) return;
    const scrollToSection = () =>
      document
        .getElementById(window.location.hash.slice(1))
        ?.scrollIntoView({ behavior: "auto", block: "start" });
    const frame = window.requestAnimationFrame(scrollToSection);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    let frame = 0;
    const updateScrollProgress = () => {
      frame = 0;
      const progress = Math.min(
        1,
        Math.max(
          0,
          -hero.getBoundingClientRect().top /
            Math.max(1, hero.offsetHeight * 0.72)
        )
      );
      hero.style.setProperty("--hero-scroll-progress", progress.toFixed(3));
    };
    const handleScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateScrollProgress);
    };
    updateScrollProgress();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const revealTargets = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".text-reveal, .service-row-reveal"
      )
    );
    if (!("IntersectionObserver" in window)) {
      revealTargets.forEach(target => target.classList.add("is-revealed"));
      return;
    }
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10%" }
    );
    revealTargets.forEach(target => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return (
    <PageShell>
      <section className="hero" id="hero" ref={heroRef}>
        <div className="hero-noise" />
        <div className="hero-copy">
          <p className="eyebrow eyebrow-light">
            PHNOM PENH · CAMBODIA &amp; THAILAND · SINCE 2019
          </p>
          <h1
            className="hero-title"
            aria-label="Commercial spaces designed to perform."
          >
            <span className="hero-title-line">
              <span>Commercial spaces</span>
            </span>
            <span className="hero-title-line">
              <span>
                <em>designed to perform.</em>
              </span>
            </span>
          </h1>
          <div className="hero-bottom">
            <div className="hero-bottom-copy">
              <p>
                Interior consultancy, design, fit-out and post-completion
                support for offices, retail, hospitality and F&amp;B.
              </p>
              <div className="hero-mobile-meta">
                <a href="#about">
                  Scroll to explore <ArrowDownRight size={14} />
                </a>
                <span>SINCE 2019</span>
              </div>
            </div>
            <div className="hero-actions">
              <Link href="/#contact" className="button button-light">
                Discuss Your Project <MoveRight size={17} />
              </Link>
              <a href="#projects" className="button button-outline-light">
                View selected work <ArrowUpRight size={17} />
              </a>
            </div>
          </div>
        </div>
        <div className="hero-image" ref={heroImageRef}>
          <SafeImage
            src={homeHeroImage}
            alt="Hospitality bar interior designed and fitted out by LUXH Works"
            loading="eager"
            fetchPriority="high"
            sizes="(max-width: 760px) 100vw, 43vw"
          />
          <div className="hero-image-caption">
            <span>PHNOM PENH</span>
          </div>
        </div>
        <div className="hero-footer-strip">
          <span>SINCE 2019</span>
          <span>CAMBODIA • THAILAND</span>
          <span>DESIGN TO AFTERCARE</span>
        </div>
        <a href="#about" className="hero-scroll">
          Scroll to explore <ArrowDownRight size={16} />
        </a>
      </section>
      <AboutInline />

      <GallerySection />

      <section className="services-preview" id="services">
        <SectionLabel>Services / What we do</SectionLabel>
        <div className="service-rows">
          {services.map(service => (
            <Link
              href={`/services/${serviceSlug(service.title)}`}
              className="service-row service-row-reveal"
              key={service.number}
            >
              <span>{service.number}</span>
              <h3 className="text-reveal">
                <span>{service.title}</span>
              </h3>
              <p>{service.items.join(" · ")}</p>
              <ArrowUpRight size={20} />
            </Link>
          ))}
        </div>
      </section>

      <section className="manifesto" id="process">
        <SectionLabel dark>How we work / Process</SectionLabel>
        <div className="v2-process-header">
          <p className="manifesto-kicker">HOW WE WORK</p>
          <h2>
            From business need to
            <br />
            <em>operational space.</em>
          </h2>
          <p className="manifesto-copy">
            Each stage closes a different risk before it reaches your budget.
          </p>
        </div>
        <div className="v2-process-layout">
          <div className="v2-process-steps">
            <div>
              <span>01</span>
              <strong>BRIEF &amp; CONSULT</strong>
              <p>Define users, operation, priorities and constraints.</p>
            </div>
            <div>
              <span>02</span>
              <strong>DESIGN &amp; COST</strong>
              <p>Develop concept, technical drawings and priced BOQ.</p>
            </div>
            <div>
              <span>03</span>
              <strong>BUILD &amp; MANAGE</strong>
              <p>
                Coordinate site works, contractors, inspections and reporting.
              </p>
            </div>
            <div>
              <span>04</span>
              <strong>HANDOVER &amp; CARE</strong>
              <p>Commission, inspect, hand over and support the space.</p>
            </div>
            <div>
              <span>05</span>
              <strong>MAINTAIN</strong>
              <p>Repair, alter and support continued operation.</p>
            </div>
          </div>
        </div>
      </section>

      <ContactContent />
    </PageShell>
  );
}

function AboutInline() {
  return (
    <section className="home-about" id="about">
      <AboutVisualHero compact />
    </section>
  );
}

function AboutVisualHero({ compact = false }: { compact?: boolean }) {
  const aboutRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const section = aboutRef.current;
    if (
      !section ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const reveal = () => section.classList.add("about-is-visible");
    if (!("IntersectionObserver" in window)) {
      reveal();
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          observer.disconnect();
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -8%" }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);
  return (
    <section
      ref={aboutRef}
      className={`about-visual-hero${compact ? " about-visual-hero-compact" : ""}`}
    >
      <div className="about-visual-slideshow" aria-hidden="true">
        <SafeImage
          src={companyImages.warmDining}
          className="about-slide-active"
          loading="eager"
          alt=""
        />
      </div>
      <div className="about-visual-heading">
        <p className="eyebrow eyebrow-light">ABOUT LUXHWORK</p>
        <h1>
          Local execution,
          <br />
          regional standards,
          <br />
          since 2019.
        </h1>
      </div>
      <div className="about-visual-card">
        <h2>
          Singaporean Led– a commercial interior consultancy and fit-out
          company serving businesses in Cambodia.
        </h2>
        <p>
          Our team connects considered design with planning, MEP coordination,
          construction knowledge and hands-on follow-through — helping clients
          reach opening day with clearer decisions and fewer avoidable
          surprises.
        </p>
        <div className="about-visual-stats">
          <div>
            <strong>2019</strong>
            <span>Founded</span>
          </div>
          <div>
            <strong>05</strong>
            <span>Core services</span>
          </div>
          <div>
            <strong>02</strong>
            <span>Countries</span>
          </div>
        </div>
      </div>
    </section>
  );
}
function CTA({ id }: { id?: string } = {}) {
  return (
    <section className="cta" id={id}>
      <p>Have a project in mind?</p>
      <h2>
        Let's create
        <br />
        <em>something great.</em>
      </h2>
      <Link href="/#contact" className="button button-light">
        Start a conversation <ArrowUpRight size={17} />
      </Link>
      <div className="cta-mark">LW</div>
    </section>
  );
}

export function AboutPage() {
  return (
    <PageShell>
      <AboutVisualHero />
      <section className="vision-section">
        <SectionLabel number="02">Our vision</SectionLabel>
        <div className="vision-copy">
          <h2>To transform spaces into inspiring experiences through innovation, efficiency, and exceptional craftsmanship.</h2>
          <p>While fostering the next generation of leading designers and cultivating a team of talented professionals to drive the future of commercial design.</p>
        </div>
      </section>
      <section className="expertise">
        <SectionLabel number="03">Skills / How we think and make</SectionLabel>
        <div className="expertise-grid">
          <div>
            <span>01</span>
            <h3>Spatial thinking</h3>
            <p>Architecture, interiors, material, proportion, light.</p>
          </div>
          <div>
            <span>02</span>
            <h3>Visual narrative</h3>
            <p>Art direction, visualization, image making, storytelling.</p>
          </div>
          <div>
            <span>03</span>
            <h3>Identity systems</h3>
            <p>Brand strategy, visual identity, editorial, digital.</p>
          </div>
        </div>
      </section>
      <CTA />
    </PageShell>
  );
}

export function ProjectsPage() {
  const { projects } = usePortfolioProjects();
  const [preset] = useColorPreset();
  const [filter, setFilter] = useState<BusinessCategory | "All">("All");
  const homeProjectSlugs = new Set([
    "house-14",
    "mori-residence",
    "northpoint",
  ]);
  const filters: Array<BusinessCategory | "All"> = [
    "All",
    "Corporate Office",
    "Retails",
    "Commercial",
    "Food & Beverage (FnB)",
  ];
  const archiveProjects = projects.filter(
    project => !homeProjectSlugs.has(project.slug)
  );
  const filteredProjects = archiveProjects.filter(project =>
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
}

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const { projects: portfolioProjects } = usePortfolioProjects();
  const [preset, setPreset] = useColorPreset();
  const project =
    portfolioProjects.find(item => item.slug === slug) ?? portfolioProjects[0];
  const detail =
    projectDetailContent[project.slug] ?? {
      heading: "A considered space designed around the way the business works",
      paragraphs: [
        project.description,
        "LUXHWORK brought together planning, design coordination and delivery to create a clear, functional environment shaped around the project brief.",
      ],
      type: project.category,
      size: project.note,
      completion: project.year,
      client: project.client,
    };
  const projectIndex = Math.max(
    0,
    portfolioProjects.findIndex(item => item.slug === project.slug)
  );
  const previousProject =
    portfolioProjects[
      (projectIndex - 1 + portfolioProjects.length) % portfolioProjects.length
    ];
  const nextProject =
    portfolioProjects[(projectIndex + 1) % portfolioProjects.length];
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const navigateToProject = (targetSlug: string) => {
    navigate(`/projects/${targetSlug}`);
  };
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      )
        return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        navigateToProject(previousProject.slug);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        navigateToProject(nextProject.slug);
      }
    };
    const onTouchStart = (event: TouchEvent) => {
      const touch = event.changedTouches[0];
      touchStart.current = touch
        ? { x: touch.clientX, y: touch.clientY }
        : null;
    };
    const onTouchEnd = (event: TouchEvent) => {
      if (touchStart.current === null) return;
      const touch = event.changedTouches[0];
      const deltaX =
        (touch?.clientX ?? touchStart.current.x) - touchStart.current.x;
      const deltaY =
        (touch?.clientY ?? touchStart.current.y) - touchStart.current.y;
      touchStart.current = null;
      const isHorizontalSwipe =
        Math.abs(deltaX) >= 60 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25;
      if (isHorizontalSwipe)
        navigateToProject(deltaX > 0 ? previousProject.slug : nextProject.slug);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [nextProject.slug, previousProject.slug]);
  return (
    <PageShell>
      <section className="project-detail-hero">
        <a href="/#projects" className="back-link">
          <ChevronLeft size={17} /> Projects / Portfolio
        </a>
        <p className="eyebrow">
          {project.category} / {project.year}
        </p>
        <h1>{project.title}</h1>
        {detail && (
          <div className="project-detail-overview">
            <div className="project-detail-facts">
              <div><span>Client</span><strong>{detail.client}</strong></div>
              <div><span>Type</span><strong>{detail.type}</strong></div>
              <div><span>Size</span><strong>{detail.size}</strong></div>
              {detail.firstCompletion ? (
                <>
                  <div><span>First Completion</span><strong>{detail.firstCompletion}</strong></div>
                  <div><span>Second Completion / Expansion</span><strong>{detail.secondCompletion}</strong></div>
                </>
              ) : (
                <div><span>Completion</span><strong>{detail.completion}</strong></div>
              )}
              {detail.duration && <div><span>Program duration</span><strong>{detail.duration}</strong></div>}
            </div>
            <div className="project-detail-copy">
              <h2>{detail.heading}</h2>
              {detail.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>
        )}
      </section>
      <section
        className={`project-detail-image project-main-image project-main-image-${project.slug}`}
      >
        <ColorPresetControls preset={preset} onChange={setPreset} />
        <SafeImage
          src={project.image}
          alt={project.title}
          loading="eager"
          className={`theme-image ${imagePresetClass(project.category, preset)}`}
        />
      </section>
      <section className="project-detail-gallery">
        {project.gallery.map((image, index) => (
          <figure
            key={`${image}-${index}`}
            className={index === 0 ? "project-detail-gallery-featured" : ""}
          >
            <SafeImage
              src={image}
              alt={`${project.title} detail ${index + 1}`}
              className={`theme-image ${imagePresetClass(project.category, preset)}`}
            />
          </figure>
        ))}
      </section>
      <nav className="project-pagination" aria-label="Project navigation">
        <Link
          href={`/projects/${previousProject.slug}`}
          onClick={() => navigateToProject(previousProject.slug)}
          className="project-pagination-link"
        >
          <span>Previous project · ←</span>
          <strong>{previousProject.title}</strong>
        </Link>
        <Link
          href={`/projects/${nextProject.slug}`}
          onClick={() => navigateToProject(nextProject.slug)}
          className="project-pagination-link project-pagination-next"
        >
          <span>Next project · →</span>
          <strong>{nextProject.title}</strong>
        </Link>
      </nav>
    </PageShell>
  );
}

export function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const service =
    services.find(item => serviceSlug(item.title) === slug) ?? services[0];
  const copy =
    serviceDetailCopy[serviceSlug(service.title)] ??
    serviceDetailCopy["fit-out-works"];
  const ServiceIcon = service.icon;
  const serviceImage =
    serviceReferenceImages[serviceSlug(service.title)] ??
    serviceReferenceFallback;
  return (
    <PageShell>
      <section className="service-detail">
        <div className="service-detail-image">
          <SafeImage
            src={serviceImage}
            fallbackSrc={serviceReferenceFallback}
            alt={`${service.title} — LUXHWORK service`}
          />
        </div>
        <div className="service-detail-copy">
          <a href="/#services" className="back-link">
            ← What we do / Current services
          </a>
          <p className="eyebrow eyebrow-light">{service.title}</p>
          <h1>{copy.headline}</h1>
          <p className="service-detail-body">{copy.body}</p>
          <Link href="/#contact" className="button button-service">
            Discuss your project <ArrowUpRight size={17} />
          </Link>
          <div className="service-detail-tags">{copy.tags}</div>
          <div className="service-detail-icon">
            <ServiceIcon size={34} strokeWidth={1.2} />
          </div>
        </div>
      </section>
      <section className="service-detail-scope">
        <SectionLabel>What we bring / Three connected stages</SectionLabel>
        <div className="service-detail-scope-grid">
          {service.items.map((item, index) => (
            <div key={item}>
              <span>0{index + 1}</span>
              <h2>{item}</h2>
              <p>{copy.scope?.[index] ?? service.text}</p>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

export function ServicesPage() {
  useEffect(() => {
    const cards = Array.from(
      document.querySelectorAll<HTMLElement>(".services-page-card")
    );
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      cards.forEach(card => card.classList.add("services-page-card-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("services-page-card-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8%" }
    );
    cards.forEach(card => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <PageShell>
      <section className="page-hero services-page-hero">
        <p className="eyebrow">Services / A full creative practice</p>
        <h1>
          Shape the idea
          <br />
          <em>into a place.</em>
        </h1>
        <p className="page-hero-copy">
          Five connected capabilities, brought together with care from first
          thought to final frame.
        </p>
      </section>
      <section className="services-page-list" id="capabilities">
        <SectionLabel number="01 – 05">
          Capabilities / One partner across every project layer.
        </SectionLabel>
        <div className="services-page-grid">
          {services.map(service => {
            const ServiceIcon = service.icon;
            return (
              <article className="services-page-card" key={service.number}>
                <div className="services-page-card-top">
                  <span>{service.number}</span>
                  <span>Available for new projects</span>
                </div>
                <div className="services-page-marker" aria-hidden="true">
                  <ServiceIcon size={24} strokeWidth={1.4} />
                </div>
                <h2>{service.title}</h2>
                <p>{service.text}</p>
                <ul>
                  {service.items.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <Link
                  href={`/services/${serviceSlug(service.title)}`}
                  className="text-link"
                >
                  View <ArrowUpRight size={16} />
                </Link>
              </article>
            );
          })}
        </div>
      </section>
      <section className="services-process" id="process">
        <SectionLabel number="02">
          Process / From first thought to final frame
        </SectionLabel>
        <div className="services-process-grid">
          <div>
            <span>01</span>
            <h3>Listen &amp; define</h3>
            <p>
              Brief, site, business objectives and the decisions that matter
              most.
            </p>
          </div>
          <div>
            <span>02</span>
            <h3>Design &amp; test</h3>
            <p>
              Concept, material direction, technical thinking and cost control.
            </p>
          </div>
          <div>
            <span>03</span>
            <h3>Build &amp; coordinate</h3>
            <p>
              Fit-out, MEP, suppliers and programme brought into one clear
              rhythm.
            </p>
          </div>
          <div>
            <span>04</span>
            <h3>Open &amp; support</h3>
            <p>
              Handover, aftercare and continued support once the space is
              working.
            </p>
          </div>
        </div>
        <Link href="/#contact" className="text-link">
          Read the 10 project FAQs <ArrowUpRight size={16} />
        </Link>
      </section>
      <section className="services-page-cta">
        <p>Have a brief in mind?</p>
        <h2>
          Let’s find the
          <br />
          <em>right starting point.</em>
        </h2>
        <Link href="/#contact" className="button button-light">
          Start a conversation <ArrowUpRight size={17} />
        </Link>
      </section>
    </PageShell>
  );
}

export function ContactPage() {
  const [, navigate] = useLocation();
  useEffect(() => {
    navigate("/#contact");
  }, [navigate]);
  return null;
}

function ContactContent() {
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const name = String(values.get("name") ?? "").trim();
    const email = String(values.get("email") ?? "").trim();
    const service = String(values.get("service") ?? "").trim();
    const details = String(values.get("details") ?? "").trim();
    const bookingType = String(values.get("bookingType") ?? "").trim();
    const contactWindow = String(values.get("contactWindow") ?? "").trim();
    if (name.length < 2) {
      setFormError("Please enter your full name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError("Please enter a valid email address.");
      return;
    }
    if (!service) {
      setFormError("Please select a service.");
      return;
    }
    if (details.length < 20) {
      setFormError(
        "Please tell us a little more about the project (at least 20 characters)."
      );
      return;
    }
    setFormError("");
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: String(values.get("phone") ?? "") || undefined,
          service,
          details: [
            details,
            bookingType && `Preferred consultation: ${bookingType}`,
            contactWindow && `Preferred contact window: ${contactWindow}`,
          ]
            .filter(Boolean)
            .join("\n\n"),
          budget: String(values.get("budget") ?? "") || undefined,
          timeline: String(values.get("timeline") ?? "") || undefined,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          result.error ?? "We could not save your inquiry. Please try again."
        );
      }
      form.reset();
      toast.success("Thank you — we’ll be in touch shortly.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "We could not save your inquiry. Please try again.";
      setFormError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <section className="contact-main" id="contact">
        <div className="contact-details contact-details-centered">
          <SectionLabel number="01">
            Get in touch / Visit by appointment
          </SectionLabel>
          <div className="contact-detail-block">
            <span>Phone</span>
            <a href="tel:+85589900300">+855 89 900 300</a>
          </div>
          <div className="contact-detail-block">
            <span>Studio</span>
            <p style={{ fontSize: "22px" }}>
              #MF, NO. 112G EO, STREET 19, SANGKAT PHSAR KANDAL 2, KHAN DAUN
              PENH, PHNOM PENH, KINGDOM OF CAMBODIA
            </p>
          </div>
          <div className="contact-detail-block">
            <span>Email</span>
            <a href="mailto:ADMIN@LUXHWORK.COM">ADMIN@LUXHWORK.COM</a>
          </div>
          <div className="contact-detail-block">
            <span>Quick contact</span>
            <div className="social-row">
              <a
                href="https://t.me/+85589900300"
                target="_blank"
                rel="noreferrer"
              >
                Telegram <ArrowUpRight size={13} />
              </a>
              <a
                href="https://wa.me/85589900300"
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp <ArrowUpRight size={13} />
              </a>
            </div>
          </div>
          <div className="contact-detail-block">
            <span>Elsewhere</span>
            <div className="social-row">
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                Instagram <ArrowUpRight size={13} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer">
                Facebook <ArrowUpRight size={13} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                LinkedIn <ArrowUpRight size={13} />
              </a>
            </div>
          </div>
          <div className="map-embed">
            <iframe
              src="https://www.google.com/maps?q=LUXHWORK%20CO.%2C%20LTD%2C%20MF%2C%20No.112G%20E0%2C%20Preah%20Ang%20Yukanthor%20Street%20(19)%2C%20Phnom%20Penh%2C%20Cambodia&output=embed"
              width="600"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="LUXHWORK CO., LTD map"
            />
          </div>
        </div>
        <form
          className="contact-form contact-enquiry-form"
          id="booking"
          onSubmit={submitForm}
        >
          <div className="form-intro">
            <span>02</span>
            <h2>Book a project consultation</h2>
            <p>
              Share the brief and we’ll arrange a practical first conversation
              about scope, timing and next steps.
            </p>
          </div>
          <div className="form-split">
            <label>
              Name *<input name="name" required placeholder="Your name" />
            </label>
            <label>
              Company
              <input name="company" placeholder="Company name" />
            </label>
            <label>
              Email *
              <input
                name="email"
                type="email"
                required
                placeholder="you@company.com"
              />
            </label>
            <label>
              Phone or WhatsApp *
              <input name="phone" required placeholder="+855 ..." />
            </label>
            <label>
              Project type *
              <select name="service" required defaultValue="">
                <option value="" disabled>
                  Select a service
                </option>
                {services.map(service => (
                  <option value={service.title} key={service.number}>
                    {service.title}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Location *
              <input name="location" required placeholder="City / country" />
            </label>
            <label>
              Approximate area (sqm)
              <input name="area" inputMode="numeric" placeholder="e.g. 300" />
            </label>
            <label>
              Target opening date
              <input name="opening" placeholder="Month / year" />
            </label>
            <label>
              Preferred consultation
              <select name="bookingType" defaultValue="">
                <option value="">Choose an option</option>
                <option value="Video call">Video call</option>
                <option value="Studio meeting">Studio meeting</option>
                <option value="Site visit">Site visit</option>
              </select>
            </label>
            <label>
              Preferred contact window
              <input name="contactWindow" placeholder="e.g. weekday mornings" />
            </label>
          </div>
          <label>
            What does the space need to achieve? *
            <textarea
              name="details"
              required
              minLength={20}
              rows={5}
              placeholder="Tell us about the business, space or brief..."
            />
          </label>
          {formError && (
            <p className="form-error" role="alert">
              {formError}
            </p>
          )}
          <p className="privacy-consent">
            By submitting this form you agree that LUXHWORK may contact you
            about your enquiry. See our Privacy Policy.
          </p>
          <button
            type="submit"
            className="button button-dark"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending…" : "Request consultation"}{" "}
            <ArrowUpRight size={17} />
          </button>
        </form>
      </section>
      <FAQSection />
    </>
  );
}
