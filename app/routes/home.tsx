import { useState } from "react";
import Select from "~/components/select";
import Input from "~/components/inputText";
import { Pagination } from "~/components/pagination";
import Loader from "~/components/loader";
import Button from "~/components/button";
import type { Query, Result, Settings } from "~/api";
import searchCode from "~/api";

const queryLanguageOptions: Record<Query['language'], string> = {
  '': '',
  'js': 'Javascript',
  'go': 'Go',
  'rust': 'Rust',
  'c': 'C',
  'c++': 'C++',
  'java': 'Java',
  'python': 'Python',
  'xml': 'XML'
  // 'add more language if needed'
}
const queryInOptions: Record<Query['in'], string> = {
  '': '',
  'file,path': 'File and path',
  'file': 'Only file',
  'path': 'Only path',
}
const queryForkOptions: Record<Query['fork'], string> = {
  '': '',
  'only': 'Only fork',
  'true': 'With fork'
}
const perPageOptions = [30, 40, 50, 60, 70, 80, 100].reduce<Record<string, string>>((acc, v) => {
  acc[v.toString()] = v.toString()
  return acc
}, {})
const queryExtensionOptions = [
  "", "css", "js", "c", "cpp", "java", "py", "html", "xml", "rs", "go"
].reduce((acc, v) => {
  if (v.trim() === '') return { ...acc, [v]: '' };
  return { ...acc, [v]: `.${v}` }
}, {} as Record<Query['extension'], string>)

export default function Home() {
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [result, setResult] = useState<Result>({ items: [], total_count: 0, incomplete_results: false })
  const [query, setQuery] = useState<Query>({
    term: "",
    repo: "",
    language: "",
    in: '',
    label: "",
    fork: '',
    user: '',
    org: '',
    path: '',
    size: '',
    filename: '',
    extension: ''
  });
  const [settings, setSettings] = useState<Settings>({
    sort: "indexed",
    order: 'desc',
    per_page: 30,
    page: 1,
  })

  function updateQuery<K extends keyof Query>(key: K, value: Query[K]) {
    setQuery(query => ({ ...query, [key]: value }))
    setSettings(settings => ({ ...settings, page: 1 }))
  }

  function changePage(i: number) {
    setSettings(prev => ({ ...prev, page: i }))
    search(i)
  }

  async function search(overridePage?: number) {
    try {
      setError(() => "")
      setLoading(() => true)

      let q = query.term;

      for (const [key, value] of Object.entries(query)) {
        if (value.trim() === "") continue
        if (key === 'term') continue
        q = `${q} ${key}:${value}`
      }

      const data = await searchCode({ ...settings, q, page: overridePage || settings.page })
      setResult(() => data);
    } catch (e) {
      setResult(() => ({ incomplete_results: false, items: [], total_count: 0 }))
      setError(() => "Fail to search")
    } finally {
      setLoading(() => false)
    }
  }

  return (
    <main className="flex flex-col items-center justify-center p-6">

      <header className="text-center mb-8">
        <h3 className="text-2xl text-slate-800 font-bold">
          GitHub Search
        </h3>
      </header>

      <div>
        <h4 className="font-bold"> Search </h4>
        <div className="relative space-y-2 flex-wrap grid grid-cols-4 gap-x-4">
          <Input label="Term" value={query.term} onChange={v => updateQuery('term', v)} placeholder="function" />
          <Input label="Repository" value={query.repo} onChange={v => updateQuery('repo', v)} placeholder="linux" />
          <Input label="Label" value={query.label} onChange={v => updateQuery('label', v)} placeholder="progress" />
          <Input label="Username" value={query.user} onChange={v => updateQuery('user', v)} placeholder="andy-d-g" />
          <Input label="Organization" value={query.org} onChange={v => updateQuery('org', v)} placeholder="devlapp" />
          <Input label="Path" value={query.path} onChange={v => updateQuery('path', v)} placeholder="/" />
          <Input label="Size" value={query.size} onChange={v => updateQuery('size', v)} placeholder="2" type='number' />
          <Input label="Filename" value={query.filename} onChange={v => updateQuery('filename', v)} placeholder="index.tsx" />

          <Select options={queryForkOptions} label='Fork' selected={query.fork} onChange={v => updateQuery('fork', v)} />
          <Select options={queryLanguageOptions} label='Language' selected={query.language} onChange={v => updateQuery('language', v)} />
          <Select options={queryExtensionOptions} label='Extension' selected={query.extension} onChange={v => updateQuery('extension', v)} />
          <Select options={queryInOptions} label='In' selected={query.in} onChange={v => updateQuery('in', v)} />
        </div>

        <div>
          <h4 className="font-bold"> Settings </h4>
          <div className="relative flex justify-center">
            <Select className="w-1/2" options={perPageOptions} label='Per page' selected={settings.per_page.toString()} onChange={v => setSettings((settings) => ({ ...settings, per_page: Number(v) }))} />
            <Select className="w-1/2" options={{ 'asc': 'Asc', 'desc': 'Desc' }} label='Order' selected={settings.order} onChange={v => setSettings((settings) => ({ ...settings, order: v }))} />
          </div>
        </div>

        <Button
          disabled={!!(query.term.trim() === "" || loading)}
          onClick={() => search()}
          className="w-full hover:bg-slate-200 mb-8"
        >
          Search
        </Button>
      </div>

      {result.items.length > 0 && (<Pagination
        currentPage={settings.page}
        onChange={e => changePage(e)}
        isComplete={settings.page * settings.per_page >= result.total_count}
      />)}

      <ul className="space-y-2 my-4">
        {loading && (<Loader />)}

        {!loading && error && (
          <li> <p className="text-red-700 font-bold">{error}</p> </li>
        )}

        {!loading && !error && result.items.length === 0 && (<p>No results found.</p>)}

        {!loading && !error && result.items.length > 0 && <>
          <h4> Total items : {result.total_count} </h4>
          {
            result.items.map(({ repository, html_url, name, sha }) => (
              <li key={sha} className="p-2 border">
                <span className="block">Filename: {name}</span>
                <span className="block">Repository: {repository.full_name}</span>
                <span className="block">Author: {repository.owner.login}</span>
                <p> {repository.description || "No description provided."} </p>
                <a
                  className="text-blue-500 block"
                  target="_blank"
                  href={html_url}
                >
                  View Source 🔗
                </a>
              </li>
            ))
          }
        </>}
      </ul>

      {result.items.length && (<Pagination
        currentPage={settings.page}
        onChange={e => changePage(e)}
        isComplete={settings.page * settings.per_page >= result.total_count}
      />)}

    </main>
  )
}
