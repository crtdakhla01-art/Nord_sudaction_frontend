import { useEffect, useRef } from 'react'

function RichTextEditor({ label, value, onChange }) {
  const editorRef = useRef(null)

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || ''
    }
  }, [value])

  const applyCommand = (command, arg = null) => {
    editorRef.current?.focus()
    document.execCommand(command, false, arg)
    onChange(editorRef.current?.innerHTML || '')
  }

  return (
    <div className="space-y-2">
      {label ? <label className="block text-sm font-medium text-primary-500">{label}</label> : null}

      <div className="flex flex-wrap gap-2 rounded-xl border border-secondary-100 bg-secondary-50 p-2">
        <button type="button" className="cursor-pointer rounded-md bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-500 hover:bg-secondary-100" onClick={() => applyCommand('bold')}>
          Bold
        </button>
        <button type="button" className="cursor-pointer rounded-md bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-500 hover:bg-secondary-100" onClick={() => applyCommand('italic')}>
          Italic
        </button>
        <button type="button" className="cursor-pointer rounded-md bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-500 hover:bg-secondary-100" onClick={() => applyCommand('insertUnorderedList')}>
          List
        </button>
        <button type="button" className="cursor-pointer rounded-md bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-500 hover:bg-secondary-100" onClick={() => applyCommand('createLink', prompt('Enter URL') || '')}>
          Link
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        className="min-h-44 w-full rounded-xl border border-secondary-100 bg-primary-50 px-4 py-3 text-sm text-primary-500 shadow-sm outline-none transition focus:border-secondary-400 focus:ring-2 focus:ring-secondary-500/20"
        onInput={(event) => onChange(event.currentTarget.innerHTML)}
      />
    </div>
  )
}

export default RichTextEditor
