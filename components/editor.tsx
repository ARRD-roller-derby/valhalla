import {
  BoldIcon,
  EditorMenuBtn,
  HeaderIcon,
  HeaderThreeIcon,
  HeaderTwoIcon,
  ItalicIcon,
  PipeIcon,
  StrikeIcon,
  UnderlineIcon,
  EditorMenuGroup,
  CodeIcon,
  LinkIcon,
  ListIcon,
} from '@/ui'
import { dc } from '@/utils'

// TipTap
import Underline from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'

interface MenuBarProps {
  editor: any | null
}

export function MenuBar({ editor }: MenuBarProps) {
  if (!editor) return null

  const headerOpts = [
    {
      name: 'h1',
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isDisabled: () => !editor.can().toggleBold(),
      icon: <HeaderIcon />,
    },
    {
      name: 'h2',
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isDisabled: () => !editor.can().toggleBold(),
      icon: <HeaderTwoIcon />,
    },
    {
      name: 'h3',
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isDisabled: () => !editor.can().toggleBold(),
      icon: <HeaderThreeIcon />,
    },
  ]

  const txtOpts = [
    {
      name: 'bold',
      onClick: () => editor.chain().focus().toggleBold().run(),
      isDisabled: () => !editor.can().toggleBold(),
      icon: <BoldIcon />,
    },
    {
      name: 'italic',
      onClick: () => editor.chain().focus().toggleItalic().run(),
      isDisabled: () => !editor.can().toggleItalic(),
      icon: <ItalicIcon />,
    },
    {
      name: 'underline',
      onClick: () => editor.chain().focus().toggleUnderline().run(),
      isDisabled: () => !editor.can().toggleUnderline(),
      icon: <UnderlineIcon />,
    },
    {
      name: 'strike',
      onClick: () => editor.chain().focus().toggleStrike().run(),
      isDisabled: () => !editor.can().toggleStrike(),
      icon: <StrikeIcon />,
    },
    {
      name: 'link',
      onClick: () => editor.chain().focus().toggleLink().run(),
      isDisabled: () => !editor.can().toggleLink(),
      icon: <LinkIcon />,
    },
  ]

  const layoutOpts = [
    {
      name: 'list',
      onClick: () => editor.chain().focus().toggleStrike().run(),
      isDisabled: () => !editor.can().toggleStrike(),
      icon: <ListIcon />,
    },
    {
      name: 'code',
      onClick: () => editor.chain().focus().toggleCode().run(),
      isDisabled: () => !editor.can().toggleCode(),
      icon: <CodeIcon />,
    },
  ]

  return (
    <div className="sticky top-0 flex flex-wrap items-center gap-2 bg-arrd-bgDark fill-arrd-bg p-1">
      <EditorMenuGroup>
        {txtOpts.map((option) => (
          <EditorMenuBtn key={option.name} {...option} editor={editor} />
        ))}
      </EditorMenuGroup>

      <PipeIcon />

      <EditorMenuGroup>
        {headerOpts.map((option) => (
          <EditorMenuBtn key={option.name} {...option} editor={editor} />
        ))}
      </EditorMenuGroup>
      <PipeIcon />

      <EditorMenuGroup>
        {layoutOpts.map((option) => (
          <EditorMenuBtn key={option.name} {...option} editor={editor} />
        ))}
      </EditorMenuGroup>
    </div>
  )
}

interface EditorProps {
  content: Object
  onChange: (value: Object) => void
}
export function Editor({ content, onChange }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noreferrer',
          target: '_blank',
        },
      }),
    ],
    onUpdate(props) {
      onChange(props.editor.getJSON())
    },
    content,
  })

  return (
    <div className="bg-arrd-bgDark text-arrd-text">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="max-h-40 overflow-auto p-3 outline-none" />
    </div>
  )
}

export function ReadEditor({ content, fullHeight }: { content: Object; fullHeight?: boolean }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noreferrer',
          target: '_blank',
        },
      }),
    ],
    content,
    editable: false,
  })
  return <EditorContent editor={editor} className={dc('p-1 outline-none', [!fullHeight, 'max-h-40  overflow-auto'])} />
}
