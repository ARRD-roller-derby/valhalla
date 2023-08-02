// Bibliothèques externes
import { useMemo } from 'react'

// Bibliothèques internes
import { useEvent } from '@/entities'

export function EventOrgaDetails() {
  // stores
  const { event } = useEvent()

  // const
  const coachAndAssistCoach = useMemo(() => {
    return {
      coach: event.participants.find((part) => part.type === 'coach'),
      assistCoach: event.participants.find((part) => part.type === 'assist-coach'),
    }
  }, [event.participants])

  return (
    <>
      {(coachAndAssistCoach.coach || coachAndAssistCoach.assistCoach) && (
        <div className="flex flex-wrap gap-1 italic text-arrd-text sm:gap-2">
          {coachAndAssistCoach.coach && (
            <div>
              <span className="text-xs">Coach: </span>
              <span className="text-sm font-bold">{coachAndAssistCoach.coach.name}</span>
              {coachAndAssistCoach.coach.status === 'à confirmer' && '?'}
            </div>
          )}
          {coachAndAssistCoach.assistCoach && (
            <div>
              <span className="text-xs">Assit coach: </span>
              <span className="text-sm font-bold">{coachAndAssistCoach.assistCoach.name}</span>
              {coachAndAssistCoach.assistCoach.status === 'à confirmer' && '?'}
            </div>
          )}
        </div>
      )}
    </>
  )
}
