from pathlib import Path
import json

records = json.loads(Path('/home/ubuntu/luxhwork-media-records.json').read_text())
by_folder = {}
for r in records:
    folder = Path(r['file']).parent.name
    by_folder.setdefault(folder, []).append(r['url'])

folder_to_slugs = {
    'VISA WORLDWIDE OFFICE- Vattanac Capital': ['house-14', 'visa-branch-office'],
    'Lao Miao - Naga World 1': ['lao-miao-naga-2'],
    'LUCKY BURGER- TAKMAO': ['frame-house'],
    'Lukfook Jewellery': ['lukfook-funmall'],
    'Lukfook Jewellery (AEON3)': ['atelier-common'],
    'Lukfook Jewellery (Sihanoukville BLVD)': ['lukfook-sihanouk'],
    'Lukfook Jewellery- Chipmong 271': ['lukfook-chipmong'],
    'RYUKOU OMAKASE & DAVIDOFF - THE PEAK': ['seascape-house', 'davidoff', 'courtyard-study', 'the-hynd-hotel'],
    'VIP LOUNGE - GOLDEN TOWER': ['northpoint'],
    'COMBI': ['field-notes'],
    'CHJ JEWELLERY - AEON3': ['chj-jewellry-cb1', 'chj-jewellry-cb3', 'chj-jewellry-cb4'],
}
lines = [
    '// Uploaded project photography from Picture.zip. Grouped by project slug.',
    'export const uploadedProjectMedia: Record<string, string[]> = {',
]
for folder, slugs in folder_to_slugs.items():
    urls = by_folder[folder]
    for slug in slugs:
        lines.append(f'  "{slug}": [')
        for url in urls:
            lines.append(f'    "{url}",')
        lines.append('  ],')
lines.append('};')
Path('/home/ubuntu/luxhwork-github/client/src/uploadedProjectMedia.ts').write_text('\n'.join(lines) + '\n')
print('generated', len(folder_to_slugs), 'folder matches and', sum(len(v) for v in by_folder.values()), 'uploaded media urls')
