export function hexToTailwind(intColor: number): string {
  let hexColor = '#' + intColor.toString(16).padStart(6, '0').toUpperCase()

  // Vérifier si la chaîne hexColor est un code hexadécimal valide
  if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hexColor)) {
    throw new Error('Invalid hex color format. Please provide a valid hex color code.')
  }

  // Si la couleur est en format court (#RGB), la convertir en format complet (#RRGGBB)
  if (hexColor.length === 4) {
    hexColor = `#${hexColor[1]}${hexColor[1]}${hexColor[2]}${hexColor[2]}${hexColor[3]}${hexColor[3]}`
  }

  return `${hexColor.toLocaleLowerCase()}`
}
