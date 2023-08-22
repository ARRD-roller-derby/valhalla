// Bibliothèques internes
import { useEvent, useEvents } from '@/entities'
import { Button } from '@/ui'

export function EventSExportIcsBtn() {
  // Stores -----------------------------------------------------------------
  const { exportEventsIcs } = useEvents()
  const { event } = useEvent()
  const handleClick = async () => {
    const data = await exportEventsIcs()
    const filename = 'valhalla.ics'

    // Créer un objet Blob à partir de la chaîne de caractères CSV
    const file = new File([data], filename, { type: 'text/calendar' })

    // Créer une URL pour le Blob
    const url = URL.createObjectURL(file)

    // Créer un élément <a> pour déclencher le téléchargement
    const link = document.createElement('a')
    link.href = url
    link.download = filename

    // Simuler un clic sur le lien pour déclencher le téléchargement
    link.click()

    // Libérer la mémoire utilisée par l'URL
    URL.revokeObjectURL(url)
  }

  // Rendu -------------------------------------------------------------
  return <Button onClick={handleClick} text="Synchroniser avec mon agenda" />
}
