import { QuestionCreateModal } from '@/components/question'
import { useQuestions } from '@/entities/question.store'
import { AuthLayout } from '@/layout'
import { Button, Loader, Modal } from '@/ui'
import { dc } from '@/utils'
import { useEffect } from 'react'
import validator from 'validator'

export function Questions() {
  const { questions, loading, getQuestions, deleteQuestion } = useQuestions()

  useEffect(() => {
    getQuestions()
  }, [getQuestions])

  return (
    <AuthLayout title="Questions">
      {loading && (
        <div className="flex h-full  items-center justify-center">
          <Loader />
        </div>
      )}
      <div className="grid h-full grid-rows-[auto_1fr]  gap-2">
        <div className="flex w-full justify-end px-4">
          <QuestionCreateModal />
        </div>

        <div className="relative  h-full">
          <div className="absolute inset-0 ">
            <div className="mx-auto flex max-w-[500px] flex-col gap-2 overflow-y-auto p-3">
              {questions.map((question) => (
                <div key={question?._id?.toString()} className="flex flex-col gap-1  rounded bg-arrd-bgDark p-4">
                  <div className="flex justify-end">
                    {question.status === 'draft' && (
                      <div className="rounded-sm border border-arrd-accent p-2 text-xs text-arrd-accent">
                        En attente de validation
                      </div>
                    )}
                  </div>
                  <div className="mb-3 text-lg text-arrd-highlight">{validator.unescape(question.question)}</div>
                  {question?.img && <img src={question.img} alt={question.question} className="h-auto w-full p-4" />}
                  <ul className="flex flex-col gap-2">
                    {question.answers.map((answer) => (
                      <li key={answer?._id?.toString()} className="ml-3 flex items-center gap-1">
                        <div className={dc([answer.type === 'good', 'bold text-arrd-primary', 'text-arrd-textError'])}>
                          {validator.unescape(answer.answer)}
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-between">
                    <Modal
                      button={(openModal) => <Button text="Supprimer" type="invert-secondary" onClick={openModal} />}
                      footer={(closeModal) => (
                        <div className="flex justify-between gap-2  p-4">
                          <Button text="Annuler" type="invert-secondary" onClick={closeModal} />
                          <Button
                            text="Supprimer"
                            type="secondary"
                            onClick={() => {
                              closeModal()
                              // @ts-ignore
                              deleteQuestion(question._id)
                            }}
                          />
                        </div>
                      )}
                    >
                      {() => (
                        <div className="m-2 flex flex-col gap-2">
                          <div className="text-center- text-arrd-primary">
                            Êtes-vous sûr de vouloir supprimer cette question ? <span className="text-arrd-textError">{question.question}</span>
                          </div>
                        </div>
                      )}
                    </Modal>
                    <QuestionCreateModal
                      defaultQuestion={{
                        ...question,
                        status: question.status || 'published',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}
