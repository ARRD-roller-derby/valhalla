import { useDebounce } from '@/hooks'
import { CardUI, Loader, TextInput } from '@/ui'
import { URL_API_DERBY_FRANCE } from '@/utils'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export function RulesList() {
  const [loading, setLoading] = useState(false)
  const [rules, setRules] = useState<{ chapter: string; description: string; title: string }[]>([])
  const { query } = useRouter()
  const [search, setSearch] = useState(query.search as string)
  const debouncedSearch = useDebounce(search, 500)

  const handleFetch = async () => {
    const params = new URLSearchParams(window.location.search)
    params.set('search', search)
    window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`)
    setLoading(true)
    const url = search ? `${URL_API_DERBY_FRANCE}rules/search/${search}` : `${URL_API_DERBY_FRANCE}rules`
    try {
      const res = await fetch(url)
      const data = await res.json()
      setRules(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleFetch()
  }, [debouncedSearch])

  console.log('rules', rules)
  return (
    <div className="mx-auto flex max-w-[500px] flex-col gap-4">
      <TextInput value={search} setValue={setSearch} placeholder="Rechercher un règle" />
      <div className="flex flex-col gap-3">
        {loading && !search ? (
          <Loader />
        ) : (
          rules.map((rule) => (
            <CardUI key={rule.chapter}>
              <div>
                <header className="flex items-baseline gap-2">
                  <div className="text-xl font-bold text-arrd-highlight">{rule.chapter}</div>
                  <div className="text-arrd-primary first-letter:uppercase">{rule.title}</div>
                </header>
                <div className="p-2 text-sm">{rule.description}</div>
              </div>
            </CardUI>
          ))
        )}
      </div>
    </div>
  )
}
