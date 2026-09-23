from pathlib import Path
p = Path('/home/ubuntu/luxhwork-github/client/src/pages/Home.tsx')
s = p.read_text()

s = s.replace('''    completion: string;
    duration?: string;
    client: string;''', '''    completion: string;
    firstCompletion?: string;
    secondCompletion?: string;
    duration?: string;
    client: string;''', 1)
s = s.replace('heading: "A Purposely Designed Workplace Designed For Modern Collaboration"', 'heading: "A Purposely Designed Workplace for Modern Collaboration"', 1)
s = s.replace('''    completion: "April 2022 · Expansion Feb 2025",
    duration: "9 weeks",''', '''    completion: "April 2022 · Expansion Feb 2025",
    firstCompletion: "April 2022",
    secondCompletion: "February 2025 (Expansion)",
    duration: "9 weeks",''', 1)
s = s.replace('''      "Spanning approximately 136 sqm, the office features a clean, open layout with a contemporary corporate aesthetic. The design maximises the compact footprint, creating a workplace that feels bright, connected, and functional.",''', '''      "Spanning approximately 136 sqm, the office features a clean, open layout with a refined corporate aesthetic. The design maximises the compact footprint, creating a workplace that feels bright, connected, and functional.",''', 1)
s = s.replace('''      "Located in Krong TaKhmao, the 377 sqm Lucky Burger restaurant expands the presence of one of Cambodia’s established fast-food chains within a standalone building.",''', '''      "Located in Krong TaKhmao, the 376 sqm Lucky Burger restaurant expands the presence of one of Cambodia’s established fast-food chains within a standalone building.",''', 1)
s = s.replace('''    size: "377 sqm",
    completion: "September 2023",''', '''    size: "377 sqm",
    completion: "September 2023",''', 1)
s = s.replace('''      "This LUKFOOK Jewellery boutique delivers a refined retail environment designed to showcase fine jewellery with clarity, elegance, and a strong sense of brand identity.",
      "LUXHWORK was appointed to undertake the complete fit-out works and project management, coordinating specialist contractors, suppliers, technical services, and site execution to translate the approved design into a finished retail space.",
      "Particular attention was given to workmanship, material consistency, lighting accuracy, and the precise installation of display fixtures—essential elements in creating a secure and sophisticated jewellery-shopping experience.",''', '''      "This LUKFOOK Jewellery boutique delivers a refined retail environment designed to showcase fine jewellery with clarity, elegance, and a strong sense of brand identity.",
      "LUXHWORK was appointed to undertake the complete fit-out works and project management, coordinating specialist contractors, suppliers, technical services, and site execution to translate the approved design into a finished retail space. The works included the storefront, illuminated display showcases, custom joinery, architectural finishes, lighting integration, and associated MEP coordination.",
      "Particular attention was given to workmanship, material consistency, lighting accuracy, and the precise installation of display fixtures—essential elements in creating a secure and sophisticated jewellery-shopping experience.",
      "Through disciplined site supervision and quality control, LUXHWORK successfully delivered the boutique in accordance with the brand’s design intent and operational requirements.",''', 2)
s = s.replace('''      "Located at AEON Mall Phnom Penh in Cambodia, this 58 sqm CHJ Jewellery boutique delivers a bright and highly detailed retail environment within a compact footprint.",
      "LUXHWORK was appointed to undertake the fit-out works and project management, coordinating specialist contractors, suppliers, building services, and on-site execution to translate the approved design into a completed retail space.",
      "Through disciplined site supervision, quality control, and detailed coordination, LUXHWORK completed the boutique in accordance with the brand’s design intent, technical requirements, and retail operating standards.",''', '''      "Located at AEON Mall Phnom Penh in Cambodia, this 58 sqm CHJ Jewellery boutique delivers a bright and highly detailed retail environment within a compact footprint.",
      "LUXHWORK was appointed to undertake the fit-out works and project management, coordinating specialist contractors, suppliers, building services, and on-site execution to translate the approved design into a completed retail space.",
      "The project involved the installation of custom jewellery showcases, illuminated display shelving, decorative metal screens, integrated lighting, branded storefront elements, architectural finishes, and associated MEP services. Careful coordination was required to accommodate the extensive display system while maintaining clear circulation and a comfortable customer experience.",
      "Through disciplined site supervision, quality control, and detailed coordination, LUXHWORK completed the boutique in accordance with the brand’s design intent, technical requirements, and retail operating standards.",''', 1)
s = s.replace('''      "Located at NagaWorld 1 in Phnom Penh, Cambodia, this 145 sqm LAOMIAO Jewellery boutique delivers a luxurious retail environment within a compact footprint.",''', '''      "Located at NagaWorld 1 in Phnom Penh, Cambodia, this 44 sqm LAOMIAO Jewellery boutique delivers a luxurious retail environment within a compact footprint.",''', 1)
s = s.replace('''    size: "145 sqm",
    completion: "January 2026",''', '''    size: "145 sqm",
    completion: "January 2026",''', 1)
s = s.replace('''      "Located in Phnom Penh, Cambodia, this 350 sqm space for New Rainbow Fabric Factory was designed as a dedicated fashion display and presentation zone, bringing garments, fabrics, and collections together within an organised and visually engaging environment.",
      "A balanced combination of warm timber finishes, neutral tones, glass partitions, and integrated lighting creates a clear, welcoming setting for presenting clothes and fabric collections.",
      "Every element was considered to strengthen the company’s identity while delivering a functional showcase zone suited to the operational needs of a modern manufacturing business.",''', '''      "Located in Phnom Penh, Cambodia, this 350 sqm space for New Rainbow Fabric Factory was designed as a dedicated clothing and fabric showcase zone, bringing garments, materials, and collections together within an organised and visually engaging environment.",
      "A balanced combination of warm timber finishes, neutral tones, glass partitions, and integrated lighting creates a professional yet welcoming setting for presenting clothes and fabric collections.",
      "Every element was considered to strengthen the company’s identity while delivering a practical showcase zone suited to the operational needs of a modern manufacturing and fashion business.",''', 1)
s = s.replace('''      "Products are organised into clearly defined zones, including dedicated stroller displays, child-seat testing areas and central accessory showcases. Integrated lighting highlights each collection without overwhelming the space, while wide circulation paths improve visibility and allow customers to move comfortably with children and strollers.",''', '''      "Products are organised into clearly defined zones, including dedicated stroller displays, child-seat testing areas and central accessory showcases. Integrated lighting highlights each collection without overwhelming the space, while wide circulation paths improve visibility and allow customers to move comfortably with children and strollers.",
      "The result is a functional, brand-led showroom that balances product presentation, customer interaction and an approachable family-focused experience.",''', 1)

old = '''              <div><span>Completion</span><strong>{detail.completion}</strong></div>
              {detail.duration && <div><span>Program duration</span><strong>{detail.duration}</strong></div>}'''
new = '''              {detail.firstCompletion ? (
                <>
                  <div><span>First Completion</span><strong>{detail.firstCompletion}</strong></div>
                  <div><span>Second Completion / Expansion</span><strong>{detail.secondCompletion}</strong></div>
                </>
              ) : (
                <div><span>Completion</span><strong>{detail.completion}</strong></div>
              )}
              {detail.duration && <div><span>Program duration</span><strong>{detail.duration}</strong></div>}'''
if old not in s:
    raise SystemExit('detail facts completion block not found')
s = s.replace(old, new, 1)
p.write_text(s)
print('updated pasted project detail content')
