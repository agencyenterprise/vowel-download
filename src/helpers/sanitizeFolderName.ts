export function sanitizeFolderName(folderName: string) {
  return folderName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}
