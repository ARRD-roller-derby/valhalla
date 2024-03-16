import { useCards } from '@/entities'
import { Button, Loader } from '@/ui'
import { dc } from '@/utils'
import { useEffect, useState } from 'react'
import validator from 'validator'

export function CardFlashRevisionMode() {
  const { flashCard, loadingRevision, getFlashCard, setRevisionMode, submitAnswer } = useCards()
  const [response, setResponse] = useState<string | undefined>() // id
  const [readyForNextCard, setReadyForNextCard] = useState(false)

  useEffect(() => {
    if (!!flashCard) return
    getFlashCard()
  }, [])

  const handleSubmit = async (answer: string) => {
    if (!flashCard) return
    setResponse(answer)
    await submitAnswer(flashCard._id.toString(), answer)
    setReadyForNextCard(true)
  }

  const handleNext = () => {
    setReadyForNextCard(false)
    setResponse(undefined)
    getFlashCard()
  }

  const handleQuit = async () => {
    await getFlashCard()
    setRevisionMode(false)
  }

  return (
    <div className="grid h-full w-full grid-rows-[1fr_auto] gap-4">
      <div className="flex-1">
        {loadingRevision && !flashCard ? (
          <div className="flex h-full items-center justify-center">
            <Loader />
          </div>
        ) : (
          <div className="relative h-full w-full">
            <div className="absolute inset-0 flex flex-col gap-2 overflow-y-auto ">
              <div className="text-lg">{validator.unescape(flashCard?.question || '')}</div>
              {flashCard?.img && (
                <img src={flashCard.img} alt={flashCard.question || 'card'} className="h-96 w-full object-cover" />
              )}

              <div className="mt-6 flex flex-col gap-4">
                {flashCard?.answers &&
                  flashCard?.answers.map((answer) => (
                    <button
                      key={answer.answer}
                      onClick={() => handleSubmit(answer.answer)}
                      className={dc(
                        'input border-2  p-4',
                        [answer.type === 'good', 'bg-arrd-primary text-white'],
                        [answer.answer === response, 'border-arrd-highlight', 'border-arrd-bgLight'],
                        [answer.answer === response && answer.type === 'bad', 'border-arrd-textError']
                      )}
                    >
                      {validator.unescape(answer.answer)}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex w-full justify-between gap-2">
        <Button text="Quitter" type="primary" onClick={handleQuit} />
        <Button
          text="Suivant"
          type="secondary"
          onClick={handleNext}
          loading={loadingRevision}
          disabled={!readyForNextCard}
        />
      </div>
    </div>
  )
}
