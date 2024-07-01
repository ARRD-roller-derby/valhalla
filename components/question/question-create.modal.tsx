// Bibliothèques externes
import { useState } from 'react'

// Bibliothèques internes
import { Question } from '@/models'

import { Button, Checkbox, FooterModal, LabelBlock, ListSelector, Modal, TextInput } from '@/ui'
import { useQuestions } from '@/entities/question.store'

type QuestionCreateModalProps = {
  defaultQuestion?: Question
}

const status = {
  draft: {
    label: 'brouillon',
    value: 'draft',
  },
  published: {
    label: 'publié',
    value: 'published',
  },
}

export function QuestionCreateModal({
  defaultQuestion = {
    question: '',
    answers: [
      {
        answer: '',
        type: 'good',
      },
    ],
    img: '',
    status: 'draft',
  },
}: QuestionCreateModalProps) {
  // Stores -----------------------------------------------------------------------------
  const { loading, error, setError, createQuestion, updateQuestion } = useQuestions()

  // States ------------------------------------------------------------------------------
  const [form, setForm] = useState<Question>(defaultQuestion)

  // Fonctions ---------------------------------------------------------------------------
  const handleSubmit = async (cb: () => void) => {
    setError('')
    if (form.answers.length < 2 || form.answers.filter((a) => a.type === 'good').length === 0) {
      setError('Il faut au moins une bonne réponse et une mauvaise réponse')
    }
    if (defaultQuestion) {
      await updateQuestion(form)
    } else {
      await createQuestion(form)
    }

    if (!error) cb()
  }

  // Render ------------------------------------------------------------------------------

  if (!form) return null
  return (
    <Modal
      button={(onClick) => (
        <Button
          type="secondary"
          onClick={() => {
            setError('')
            onClick()
          }}
          text={defaultQuestion?._id ? 'Modifier' : 'Créer'}
        />
      )}
      footer={(close) => (
        <FooterModal
          closeModal={close}
          loading={loading}
          txtConfirm={defaultQuestion ? 'Modifier' : 'Créer'}
          onConfirmCb={handleSubmit}
        />
      )}
    >
      {() => (
        <div className="flex flex-col gap-2 overflow-auto p-2">
          {error && <div className="text-arrd-textError">{error}</div>}
          <ListSelector
            options={[
              {
                label: 'publié',
                value: 'published',
              },
              {
                label: 'brouillon',
                value: 'draft',
              },
            ]}
            defaultValue={
              status[defaultQuestion?.status as keyof typeof status] || {
                label: 'brouillon',
                value: 'draft',
              }
            }
            onSelect={(status) => setForm((prev) => ({ ...prev, status: status.value as 'draft' | 'published' }))}
          />
          <LabelBlock label="Question">
            <TextInput value={form.question} setValue={(question) => setForm((prev) => ({ ...prev, question }))} />
          </LabelBlock>

          <div className="flex flex-col gap-2">
            {form.answers.map((answer, index) => (
              <div key={index} className="flex flex-col gap-2 border border-arrd-secondary fill-arrd-primary p-2">
                <TextInput
                  value={answer.answer}
                  setValue={(value) => {
                    setForm((prev) => {
                      const newAnswers = [...prev.answers]

                      return {
                        ...prev,
                        answers: newAnswers.map((a, i) => (i === index ? { ...a, answer: value } : a)),
                      }
                    })
                  }}
                />
                <Checkbox
                  checked={answer.type === 'good'}
                  onChange={() => {
                    setForm((prev) => {
                      const newAnswers = [...prev.answers]

                      return {
                        ...prev,
                        answers: newAnswers.map((a, i) =>
                          i === index ? { ...a, type: a.type === 'good' ? 'bad' : 'good' } : a
                        ),
                      }
                    })
                  }}
                  label="Bonne Réponse"
                />
                <Button
                  type="invert-secondary"
                  onClick={() => setForm((prev) => ({ ...prev, answers: prev.answers.filter((_, i) => i !== index) }))}
                  text="Supprimer"
                />
              </div>
            ))}
          </div>
          <Button
            type="secondary"
            text="Ajouter une réponse"
            onClick={() => setForm((prev) => ({ ...prev, answers: [...prev.answers, { answer: '', type: 'good' }] }))}
          />
        </div>
      )}
    </Modal>
  )
}
