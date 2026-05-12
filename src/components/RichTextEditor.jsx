import { useEffect, useRef } from 'react'
import DOMPurify from 'dompurify'

// Configure DOMPurify to allow only safe HTML tags.
const SAFE_CONFIG = {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'a', 'div', 'span'],
  ALLOWED_ATTR: ['href', 'title', 'class', 'id', 'target', 'rel'],
  ALLOW_DATA_ATTR: false,
  ALLOW_UNKNOWN_PROTOCOLS: false,
}

function RichTextEditor({ label, value, onChange }) {
  const editorRef = useRef(null)

  useEffect(() => {
    if (editorRef.current) {
      // Sanitize the input value before displaying.
      const clean = DOMPurify.sanitize(value || '', SAFE_CONFIG)
      if (editorRef.current.innerHTML !== clean) {
        editorRef.current.innerHTML = clean
      }
    }
  }, [value])

  const applyCommand = (command, arg = null) => {
    editorRef.current?.focus()
    document.execCommand(command, false, arg)
    const html = editorRef.current?.innerHTML || ''
    // Sanitize before emitting to parent.
    const clean = DOMPurify.sanitize(html, SAFE_CONFIG)
    onChange(clean)
  }

  const handleInput = (event) => {
    const html = event.currentTarget.innerHTML
    // Sanitize before emitting to parent.
    const clean = DOMPurify.sanitize(html, SAFE_CONFIG)
    onChange(clean)
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
        onInput={handleInput}
      />
    </div>
  )
}

export default RichTextEditor
