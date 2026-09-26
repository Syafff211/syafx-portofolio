import { useEffect, useState } from 'react'
import { api } from '../../services/api'
import type { SiteSettings } from '../../types/portfolio'

const fields = [
  'siteTitle', 'siteDescription', 'metaTitle', 'metaDescription',
  'favicon', 'logo', 'ogImage', 'email', 'whatsapp', 'location',
  'primaryColor', 'accentColor',
] as const

type TextField = (typeof fields)[number]

export default function Settings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true
    api.settings()
      .then((data) => { if (active) setSettings(data) })
      .catch((error: unknown) => {
        if (active) setMessage(error instanceof Error ? error.message : 'Gagal memuat settings.')
      })
    return () => { active = false }
  }, [])

  function updateField(field: TextField, value: string) {
    setSettings((current) => current ? { ...current, [field]: value } : current)
  }

  async function save() {
    if (!settings) return
    setSaving(true)
    setMessage('')
    try {
      await api.saveSettings(settings)
      setMessage('Settings berhasil disimpan.')
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : 'Gagal menyimpan settings.')
    } finally {
      setSaving(false)
    }
  }

  if (!settings) return <div className="p-6">{message || 'Loading...'}</div>

  return (
    <div>
      <h1 className="text-3xl font-bold">Settings</h1>
      <p className="mt-2 text-white/45">General, appearance, SEO and contact configuration.</p>

      <div className="mt-8 grid max-w-3xl gap-4">
        {fields.map((field) => (
          <label key={field} className="text-sm text-white/60">
            {field}
            <input
              value={settings[field] ?? ''}
              onChange={(event) => updateField(field, event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/[.03] p-3 text-white outline-none focus:border-white/30"
            />
          </label>
        ))}

        <button
          type="button"
          disabled={saving}
          onClick={save}
          className="w-fit rounded-xl bg-white px-5 py-3 font-semibold text-black disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>

        {message && <p className="text-sm text-white/60">{message}</p>}
      </div>
    </div>
  )
}
