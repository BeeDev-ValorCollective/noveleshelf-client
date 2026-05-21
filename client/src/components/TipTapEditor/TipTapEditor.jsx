import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Typography from '@tiptap/extension-typography'
import './tipTap.css'

export default function TipTapEditor({ content, onChange, disabled }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Typography,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content,
        editable: !disabled,
        onUpdate({ editor }) {
            onChange(editor.getHTML())
        },
    })

    return (
        <div className={`tiptap-wrapper${disabled ? ' tiptap-disabled' : ''}`}>
            <div className="tiptap-toolbar">
                {/* Text style */}
                <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor?.isActive('bold') ? 'active' : ''}>B</button>
                <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor?.isActive('italic') ? 'active' : ''}>I</button>
                <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor?.isActive('underline') ? 'active' : ''}>U</button>
                <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={editor?.isActive('strike') ? 'active' : ''}>S</button>

                <span className="tiptap-divider" />

                {/* Headings */}
                <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor?.isActive('heading', { level: 2 }) ? 'active' : ''}>H2</button>
                <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor?.isActive('heading', { level: 3 }) ? 'active' : ''}>H3</button>

                <span className="tiptap-divider" />

                {/* Alignment */}
                <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor?.isActive({ textAlign: 'left' }) ? 'active' : ''}>⬅</button>
                <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor?.isActive({ textAlign: 'center' }) ? 'active' : ''}>↔</button>
                <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor?.isActive({ textAlign: 'right' }) ? 'active' : ''}>➡</button>

                <span className="tiptap-divider" />

                {/* Blocks */}
                <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor?.isActive('bulletList') ? 'active' : ''}>• List</button>
                <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor?.isActive('blockquote') ? 'active' : ''}>" Quote</button>
                <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()}>― Rule</button>

                <span className="tiptap-divider" />

                {/* History */}
                <button type="button" onClick={() => editor.chain().focus().undo().run()}>↩</button>
                <button type="button" onClick={() => editor.chain().focus().redo().run()}>↪</button>
            </div>
            <EditorContent editor={editor} className="tiptap-content" />
        </div>
    )
}