import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
import { useEditor, EditorContent } from "@tiptap/react"
import { BubbleMenu } from "@tiptap/react/menus"
import StarterKit from "@tiptap/starter-kit"
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo, 
  Heading1, 
  Heading2, 
  Link as LinkIcon, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Underline as UnderlineIcon,
  Code,
  Image as ImageIcon
} from "lucide-react"
import * as React from "react"
import MediaSelector from "@/components/admin/media-selector"
import { cn } from "@/lib/utils"
import { FormField } from "./form-field"

interface RichTextEditorProps {
  label?: string
  error?: string
  id?: string
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  minHeight?: string
}

const MenuButton = ({ 
  onClick, 
  active = false, 
  disabled = false, 
  children,
  title
}: { 
  onClick: (e: React.MouseEvent) => void, 
  active?: boolean, 
  disabled?: boolean, 
  children: React.ReactNode,
  title?: string
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={cn(
      "p-2 rounded-md transition-colors hover:bg-muted focus:outline-none",
      active ? "bg-muted text-primary" : "text-muted-foreground",
      disabled && "opacity-50 cursor-not-allowed"
    )}
  >
    {children}
  </button>
)


export function RichTextEditor({
  label,
  error,
  id,
  value,
  onChange,
  placeholder = "Write something...",
  minHeight = "200px",
}: RichTextEditorProps) {
  const [isMediaSelectorOpen, setIsMediaSelectorOpen] = React.useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm dark:prose-invert max-w-none focus:outline-none",
          "min-h-[var(--min-height)]"
        ),
        style: `--min-height: ${minHeight}`,
      },
    },
  })

  // Update editor content if value prop changes from outside
  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '')
    }
  }, [value, editor])

  if (!editor) {
    return null
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const addImage = (mediaId: number, imageUrl: string) => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run()
    }
  }

  return (
    <FormField label={label} error={error} id={id}>
      <div className="rounded-md border border-input bg-background shadow-sm overflow-hidden border-border transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap items-center gap-1 border-b bg-muted/50 p-1 border-border">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive('underline')}
            title="Underline"
          >
            <UnderlineIcon className="h-4 w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            active={editor.isActive('code')}
            title="Code"
          >
            <Code className="h-4 w-4" />
          </MenuButton>

          <div className="w-px h-4 bg-border mx-1" />

          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            active={editor.isActive('heading', { level: 1 })}
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </MenuButton>

          <div className="w-px h-4 bg-border mx-1" />

          <MenuButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive('orderedList')}
            title="Ordered List"
          >
            <ListOrdered className="h-4 w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive('blockquote')}
            title="Blockquote"
          >
            <Quote className="h-4 w-4" />
          </MenuButton>

          <div className="w-px h-4 bg-border mx-1" />

          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            active={editor.isActive({ textAlign: 'left' })}
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            active={editor.isActive({ textAlign: 'center' })}
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            active={editor.isActive({ textAlign: 'right' })}
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </MenuButton>

          <div className="w-px h-4 bg-border mx-1" />

          <MenuButton
            onClick={setLink}
            active={editor.isActive('link')}
            title="Link"
          >
            <LinkIcon className="h-4 w-4" />
          </MenuButton>

          <MenuButton
            onClick={() => setIsMediaSelectorOpen(true)}
            title="Insert Image"
          >
            <ImageIcon className="h-4 w-4" />
          </MenuButton>

          <div className="ml-auto flex items-center gap-1">
            <MenuButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              title="Undo"
            >
              <Undo className="h-4 w-4" />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              title="Redo"
            >
              <Redo className="h-4 w-4" />
            </MenuButton>
          </div>
        </div>

        <EditorContent editor={editor} className="p-4 bg-background" />

        {editor && (
          <BubbleMenu editor={editor}>
            <div className="flex items-center gap-1 rounded-md border bg-popover p-1 shadow-md border-border">
              <MenuButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                active={editor.isActive('bold')}
              >
                <Bold className="h-4 w-4" />
              </MenuButton>
              <MenuButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                active={editor.isActive('italic')}
              >
                <Italic className="h-4 w-4" />
              </MenuButton>
              <MenuButton
                onClick={setLink}
                active={editor.isActive('link')}
              >
                <LinkIcon className="h-4 w-4" />
              </MenuButton>
            </div>
          </BubbleMenu>
        )}

        <MediaSelector
          open={isMediaSelectorOpen}
          onOpenChange={setIsMediaSelectorOpen}
          onSelect={addImage}
        />
      </div>
    </FormField>
  )
}
