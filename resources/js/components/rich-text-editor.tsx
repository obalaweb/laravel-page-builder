import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Toggle } from './ui/toggle';
import { 
    Bold, 
    Italic, 
    List, 
    ListOrdered, 
    Quote, 
    Heading2, 
    Heading3, 
    Link as LinkIcon,
    Undo,
    Redo,
    Code
} from 'lucide-react';
import { useCallback } from 'react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-accent underline cursor-pointer',
                },
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[150px] px-3 py-2 border rounded-b-md bg-background',
            },
        },
    });

    const setLink = useCallback(() => {
        const previousUrl = editor?.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        if (url === null) {
            return;
        }

        if (url === '') {
            editor?.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className="flex flex-col w-full">
            <div className="flex flex-wrap gap-1 p-1 border border-b-0 rounded-t-md bg-muted/30">
                <Toggle
                    size="sm"
                    pressed={editor.isActive('bold')}
                    onPressedChange={() => editor.chain().focus().toggleBold().run()}
                >
                    <Bold size={14} />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('italic')}
                    onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                >
                    <Italic size={14} />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('heading', { level: 2 })}
                    onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                >
                    <Heading2 size={14} />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('heading', { level: 3 })}
                    onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                >
                    <Heading3 size={14} />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('bulletList')}
                    onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                >
                    <List size={14} />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('orderedList')}
                    onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                >
                    <ListOrdered size={14} />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('blockquote')}
                    onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                >
                    <Quote size={14} />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('link')}
                    onPressedChange={setLink}
                >
                    <LinkIcon size={14} />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('codeBlock')}
                    onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
                >
                    <Code size={14} />
                </Toggle>
                
                <div className="flex-1" />
                
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
                    <Undo size={14} />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
                    <Redo size={14} />
                </Button>
            </div>
            <EditorContent editor={editor} />
        </div>
    );
}

// Sub-component wrapper to avoid Button conflicts in toolbar
function Button({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string, size?: string }) {
    return (
        <button 
            type="button" 
            className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground disabled:pointer-events-none disabled:opacity-50 ${className}`}
            {...props} 
        />
    );
}
