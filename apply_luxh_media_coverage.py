from pathlib import Path

media = Path('/home/ubuntu/luxhwork-github/client/src/uploadedProjectMedia.ts')
s = media.read_text()
s = s.replace('export const uploadedProjectMedia: Record<string, string[]> = {', 'const uploadedProjectMediaBase: Record<string, string[]> = {', 1)
if 'export const uploadedProjectMedia = {' not in s:
    s = s.rstrip() + '''

// Every portfolio entry gets a current studio image set. Where the ZIP does not
// contain a named folder, use the closest matching brief/category rather than old profile media.
export const uploadedProjectMedia: Record<string, string[]> = {
  ...uploadedProjectMediaBase,
  "mori-residence": uploadedProjectMediaBase["house-14"],
  "pp-link-broadcast": uploadedProjectMediaBase["house-14"],
  "thailand-lukfook-rama9": uploadedProjectMediaBase["lukfook-funmall"],
  "thailand-zhou-liufu": uploadedProjectMediaBase["lukfook-funmall"],
  "thailand-lukfook-pinklao": uploadedProjectMediaBase["lukfook-funmall"],
  "ratanac-mealea": uploadedProjectMediaBase["chj-jewellry-cb1"],
  "fabric-factory": uploadedProjectMediaBase["northpoint"],
};
'''
media.write_text(s)

home = Path('/home/ubuntu/luxhwork-github/client/src/pages/Home.tsx')
s = home.read_text()
s = s.replace('    const companyGallery = companyProjectImageSets[project.slug];', '    const companyGallery = uploadedProjectMedia[project.slug] ?? companyProjectImageSets[project.slug];', 1)
home.write_text(s)
print('expanded uploaded media coverage and fixed old-gallery override')
