export function isProItemTypeId(id: string) {
  // Seeded system ids use `it_*` naming.
  return id === "it_file" || id === "it_image";
}

