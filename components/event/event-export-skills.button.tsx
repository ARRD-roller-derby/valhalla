// Bibliothèques internes
import { useEvent, useEvents } from '@/entities'
import { Button } from '@/ui'
import dayjs from 'dayjs'

export function EventExportSkillsBtn() {
  // Stores -----------------------------------------------------------------
  const { exportEventSkills } = useEvents()
  const { event } = useEvent()
  const handleClick = async () => {
    const data = await exportEventSkills(event._id)

    // Créer un objet Blob à partir de la chaîne de caractères CSV
    const blob = new Blob([data], { type: 'text/csv' })

    // Créer une URL pour le Blob
    const url = URL.createObjectURL(blob)

    // Créer un élément <a> pour déclencher le téléchargement
    const link = document.createElement('a')
    link.href = url
    link.download = `${event.title}-${dayjs(event.start).format('DD-MM-YY')}.csv`

    // Simuler un clic sur le lien pour déclencher le téléchargement
    link.click()

    // Libérer la mémoire utilisée par l'URL
    URL.revokeObjectURL(url)
  }

  // Rendu -------------------------------------------------------------
  return <Button onClick={handleClick} text="Exporter les membres présents" />
}
