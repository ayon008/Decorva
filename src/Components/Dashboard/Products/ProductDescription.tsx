"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useEditor, EditorContent, Editor, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Color from '@tiptap/extension-color'
import Image from '@tiptap/extension-image'
import { AlignCenter, AlignLeft, AlignRight, Italic, List, ListOrdered, Quote, Strikethrough, Link as LinkIcon, Minus, Palette, Clipboard, Eraser, Type, IndentDecrease, IndentIncrease, Undo2, Redo2 } from "lucide-react";
import { Indent } from "./Indent";


const MenuBar = ({ editor, pasteAsTextMode, setPasteAsTextMode }: { editor: Editor | null, pasteAsTextMode: boolean, setPasteAsTextMode: (value: boolean) => void }) => {
    const [showColorPicker, setShowColorPicker] = useState(false)
    const [showSpecialChars, setShowSpecialChars] = useState(false)
    const [customColor, setCustomColor] = useState('#000000')
    const colorPickerRef = useRef<HTMLDivElement>(null)
    const specialCharsRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    // Close modals when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
                setShowColorPicker(false)
            }
            if (specialCharsRef.current && !specialCharsRef.current.contains(event.target as Node)) {
                setShowSpecialChars(false)
            }
        }

        if (showColorPicker || showSpecialChars) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [showColorPicker, showSpecialChars])

    const editorState = useEditorState({
        editor,
        selector: ctx => {
            return {
                isBold: ctx?.editor?.isActive('bold') ?? false,
                canBold: ctx?.editor?.can().chain().toggleBold().run() ?? false,
                isItalic: ctx?.editor?.isActive('italic') ?? false,
                canItalic: ctx?.editor?.can().chain().toggleItalic().run() ?? false,
                isStrike: ctx?.editor?.isActive('strike') ?? false,
                canStrike: ctx?.editor?.can().chain().toggleStrike().run() ?? false,
                isCode: ctx?.editor?.isActive('code') ?? false,
                canCode: ctx?.editor?.can().chain().toggleCode().run() ?? false,
                canClearMarks: ctx?.editor?.can().chain().unsetAllMarks().run() ?? false,
                isParagraph: ctx?.editor?.isActive('paragraph') ?? false,
                isHeading1: ctx?.editor?.isActive('heading', { level: 1 }) ?? false,
                isHeading2: ctx?.editor?.isActive('heading', { level: 2 }) ?? false,
                isHeading3: ctx?.editor?.isActive('heading', { level: 3 }) ?? false,
                isHeading4: ctx?.editor?.isActive('heading', { level: 4 }) ?? false,
                isHeading5: ctx?.editor?.isActive('heading', { level: 5 }) ?? false,
                isHeading6: ctx?.editor?.isActive('heading', { level: 6 }) ?? false,
                isBulletList: ctx?.editor?.isActive('bulletList') ?? false,
                isOrderedList: ctx?.editor?.isActive('orderedList') ?? false,
                isCodeBlock: ctx?.editor?.isActive('codeBlock') ?? false,
                isBlockquote: ctx?.editor?.isActive('blockquote') ?? false,
                isAlignLeft: ctx?.editor?.isActive({ textAlign: 'left' }) ?? false,
                isAlignCenter: ctx?.editor?.isActive({ textAlign: 'center' }) ?? false,
                isAlignRight: ctx?.editor?.isActive({ textAlign: 'right' }) ?? false,
                isLink: ctx?.editor?.isActive('link') ?? false,
                currentColor: ctx?.editor?.getAttributes('textStyle').color || null,
                canUndo: ctx?.editor?.can().chain().undo().run() ?? false,
                canRedo: ctx?.editor?.can().chain().redo().run() ?? false,
            }
        },
    })

    // Update custom color when editor color changes - use callback to avoid effect warning
    const currentEditorColor = editorState?.currentColor
    if (currentEditorColor && currentEditorColor !== customColor) {
        // Update synchronously when color changes, this is intentional
        setCustomColor(currentEditorColor)
    }

    const colors = [
        '#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF',
        '#FF0000', '#FF6600', '#FFCC00', '#00FF00', '#0066FF', '#0000FF',
        '#6600FF', '#FF00FF', '#FF0066', '#00FFFF', '#79A206'
    ]

    const specialChars = [
        '©', '®', '™', '€', '£', '¥', '$', '¢', '°', '±', '×', '÷',
        '¼', '½', '¾', '⅓', '⅔', '⅛', '⅜', '⅝', '⅞', '∞', '≈', '≠',
        '≤', '≥', '±', '∑', '∏', '√', '∫', '∆', '∇', 'α', 'β', 'γ',
        'δ', 'ε', 'θ', 'λ', 'μ', 'π', 'σ', 'φ', 'ω', '→', '←', '↑',
        '↓', '↔', '⇒', '⇐', '⇑', '⇓', '•', '○', '●', '▪', '▫', '■',
        '□', '▲', '△', '▼', '▽', '◆', '◇', '★', '☆', '♠', '♣', '♥',
        '♦', '♪', '♫', '☀', '☁', '☂', '☃', '☎', '☐', '☑', '☒', '✓',
        '✗', '✘', '✕', '✖', '✗', '✘', '✕', '✖'
    ]

    const handleSpecialCharClick = (char: string) => {
        editor?.chain().focus().insertContent(char).run()
        setShowSpecialChars(false)
    }

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file || !editor) return

        const reader = new FileReader()
        reader.onload = () => {
            const src = reader.result
            if (typeof src === 'string') {
                editor
                    .chain()
                    .focus()
                    .setImage({ src, alt: file.name })
                    .run()
            }
        }
        reader.readAsDataURL(file)

        // reset input so selecting same file again still triggers change
        event.target.value = ''
    }

    return (
        <div className="control-group border-b border-b-black/30">
            <div className="border-b border-b-black/30 pb-2 px-3 flex items-center gap-2">
                <button
                    type="button"
                    title="Add image from file manager"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-black/50 cursor-pointer border-2 border-primary px-2 h-8 flex items-center justify-center rounded-sm transition-all duration-300 delay-150 text-xs"
                >
                    Add image
                </button>
                <input
                    title="Add image from file manager"
                    placeholder="Add image from file manager"
                    aria-label="Add image from file manager"
                    aria-required="true"
                    aria-describedby="add-image-from-file-manager"
                    aria-invalid="false"
                    aria-hidden="true"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                />
            </div>
            <div className="button-group flex gap-2 flex-wrap px-3 pb-2">
                <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    disabled={!editorState?.canBold}
                    className={`${editorState?.isBold ? 'is-active' : 'text-black/50'} font-bold cursor-pointer border-2 hover:border-primary border-white w-8 h-8 flex items-center justify-center rounded-sm transition-all duration-300 delay-150`}
                >
                    B
                </button>
                <button
                    title="Italic"
                    type="button"
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    disabled={!editorState?.canItalic}
                    className={`${editorState?.isItalic ? 'is-active' : 'text-black/50'} cursor-pointer border-2 hover:border-primary border-white w-8 h-8 flex items-center justify-center rounded-sm transition-all duration-300 delay-150`}
                >
                    <Italic className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    title="Strikethrough"
                    onClick={() => editor?.chain().focus().toggleStrike().run()}
                    disabled={!editorState?.canStrike}
                    className={`${editorState?.isStrike ? 'is-active' : 'text-black/50'} cursor-pointer border-2 hover:border-primary border-white w-8 h-8 flex items-center justify-center rounded-sm transition-all duration-300 delay-150`}
                >
                    <Strikethrough className="w-4 h-4" />
                </button>
                <button
                    title="Bullet list"
                    type="button"
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    className={`${editorState?.isBulletList ? 'is-active' : 'text-black/50'} cursor-pointer border-2 hover:border-primary border-white w-8 h-8 flex items-center justify-center rounded-sm transition-all duration-300 delay-150`}
                >
                    <List className="w-4 h-4" />
                </button>
                <button
                    title="Number list"
                    type="button"
                    onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                    className={`${editorState?.isOrderedList ? 'is-active' : 'text-black/50'} cursor-pointer border-2 hover:border-primary border-white w-8 h-8 flex items-center justify-center rounded-sm transition-all duration-300 delay-150`}
                >
                    <ListOrdered className="w-4 h-4" />
                </button>
                <button
                    title="Blockquote"
                    type="button"
                    onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                    className={`${editorState?.isBlockquote ? 'is-active' : 'text-black/50'} cursor-pointer border-2 hover:border-primary border-white w-8 h-8 flex items-center justify-center rounded-sm transition-all duration-300 delay-150`}
                >
                    <Quote className="w-4 h-4" fill="#000000" />
                </button>
                <button
                    title="Align left"
                    type="button"
                    onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                    className={`${editorState?.isAlignLeft ? 'is-active' : 'text-black/50'} cursor-pointer border-2 hover:border-primary border-white w-8 h-8 flex items-center justify-center rounded-sm transition-all duration-300 delay-150`}
                >
                    <AlignLeft className="w-4 h-4" />
                </button>
                <button
                    title="Align center"
                    type="button"
                    onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                    className={`${editorState?.isAlignCenter ? 'is-active' : 'text-black/50'} cursor-pointer border-2 hover:border-primary border-white w-8 h-8 flex items-center justify-center rounded-sm transition-all duration-300 delay-150`}
                >
                    <AlignCenter className="w-4 h-4" />
                </button>
                <button
                    title="Align right"
                    type="button"
                    onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                    className={`${editorState?.isAlignRight ? 'is-active' : 'text-black/50'} cursor-pointer border-2 hover:border-primary border-white w-8 h-8 flex items-center justify-center rounded-sm transition-all duration-300 delay-150`}
                >
                    <AlignRight className="w-4 h-4" />
                </button>
                <button
                    title="Insert link"
                    type="button"
                    onClick={() => {
                        const previousUrl = editor?.getAttributes('link').href
                        const url = window.prompt('Enter URL:', previousUrl || '')
                        if (url === null) {
                            return
                        }
                        if (url === '') {
                            editor?.chain().focus().extendMarkRange('link').unsetLink().run()
                            return
                        }
                        editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
                    }}
                    className={`${editorState?.isLink ? 'is-active' : 'text-black/50'} cursor-pointer border-2 hover:border-primary border-white w-8 h-8 flex items-center justify-center rounded-sm transition-all duration-300 delay-150`}
                >
                    <LinkIcon className="w-4 h-4" />
                </button>
                <button
                    title="Remove link"
                    type="button"
                    onClick={() => editor?.chain().focus().unsetLink().run()}
                    disabled={!editorState?.isLink}
                    className={`text-black/50 cursor-pointer border-2 hover:border-primary border-white w-8 h-8 flex items-center justify-center rounded-sm transition-all duration-300 delay-150 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    <LinkIcon className="w-4 h-4 rotate-45" />
                </button>
                <button
                    title="Horizontal line"
                    type="button"
                    onClick={() => editor?.chain().focus().setHorizontalRule().run()}
                    className="text-black/50 cursor-pointer border-2 hover:border-primary border-white w-8 h-8 flex items-center justify-center rounded-sm transition-all duration-300 delay-150"
                >
                    <Minus className="w-4 h-4" />
                </button>
                <div className="relative" ref={colorPickerRef}>
                    <button
                        title={`Text color${editorState?.currentColor ? `: ${editorState.currentColor}` : ''}`}
                        type="button"
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        className={`${editorState?.currentColor ? 'is-active' : 'text-black/50'} cursor-pointer border-2 hover:border-primary border-white w-8 h-8 flex items-center justify-center rounded-sm transition-all duration-300 delay-150`}
                    >
                        <Palette
                            className="w-4 h-4"
                            style={editorState?.currentColor ? { color: editorState.currentColor } : undefined}
                        />
                    </button>
                    {showColorPicker && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-black/30 rounded-sm p-2 shadow-lg z-10 min-w-[200px]">
                            <div className="grid grid-cols-6 gap-1">
                                {colors.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => {
                                            editor?.chain().focus().setColor(color).run()
                                            setShowColorPicker(false)
                                        }}
                                        className="w-6 h-6 rounded-sm border border-black/20 hover:border-primary cursor-pointer"
                                        style={{ backgroundColor: color }}
                                        title={color}
                                    />
                                ))}
                            </div>
                            <div className="mt-3 pt-3 border-t border-black/20">
                                <label className="text-xs text-black/70 mb-1 block">Custom Color</label>
                                <div className="flex gap-2 items-center">
                                    <input
                                        title="Custom color"
                                        type="color"
                                        value={customColor}
                                        onChange={(e) => {
                                            setCustomColor(e.target.value)
                                            editor?.chain().focus().setColor(e.target.value).run()
                                        }}
                                        className="w-10 h-8 border border-black/30 rounded-sm cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={customColor}
                                        onChange={(e) => {
                                            const value = e.target.value
                                            if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                                                setCustomColor(value)
                                                if (value.length === 7) {
                                                    editor?.chain().focus().setColor(value).run()
                                                }
                                            }
                                        }}
                                        placeholder="#000000"
                                        className="flex-1 text-xs px-2 py-1 border border-black/30 rounded-sm focus:outline-none focus:border-primary"
                                        maxLength={7}
                                    />
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    editor?.chain().focus().unsetColor().run()
                                    setShowColorPicker(false)
                                }}
                                className="mt-2 w-full text-xs py-1 px-2 border border-black/30 rounded-sm hover:bg-gray-100"
                            >
                                Reset
                            </button>
                        </div>
                    )}
                </div>
                <button
                    title={pasteAsTextMode ? "Paste as text (ON)" : "Paste as text (OFF)"}
                    type="button"
                    onClick={() => setPasteAsTextMode(!pasteAsTextMode)}
                    className={`${pasteAsTextMode ? 'is-active' : 'text-black/50'} cursor-pointer border-2 hover:border-primary border-white w-8 h-8 flex items-center justify-center rounded-sm transition-all duration-300 delay-150`}
                >
                    <Clipboard className="w-4 h-4" />
                </button>
                <button
                    title="Clear formatting"
                    type="button"
                    onClick={() => {
                        editor?.chain().focus().clearNodes().unsetAllMarks().run()
                    }}
                    className="text-black/50 cursor-pointer border-2 hover:border-primary border-white w-8 h-8 flex items-center justify-center rounded-sm transition-all duration-300 delay-150"
                >
                    <Eraser className="w-4 h-4" />
                </button>
                <div className="relative" ref={specialCharsRef}>
                    <button
                        title="Special characters"
                        type="button"
                        onClick={() => setShowSpecialChars(!showSpecialChars)}
                        className="text-black/50 cursor-pointer border-2 hover:border-primary border-white w-8 h-8 flex items-center justify-center rounded-sm transition-all duration-300 delay-150"
                    >
                        <Type className="w-4 h-4" />
                    </button>
                    {showSpecialChars && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-black/30 rounded-sm p-3 shadow-lg z-10 max-h-64 overflow-y-auto w-64">
                            <div className="grid grid-cols-8 gap-1">
                                {specialChars.map((char, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => handleSpecialCharClick(char)}
                                        className="w-8 h-8 flex items-center justify-center border border-black/20 hover:border-primary hover:bg-gray-100 rounded-sm text-sm"
                                    >
                                        {char}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <button title="Increase indent" onClick={() => editor?.chain().focus().indent().run()} className="text-black/50 cursor-pointer border-2 hover:border-primary border-white w-8 h-8 flex items-center justify-center rounded-sm transition-all duration-300 delay-150">
                    <IndentIncrease className="w-4 h-4" />
                </button>

                <button title="Decrease indent" onClick={() => editor?.chain().focus().outdent().run()} className="text-black/50 cursor-pointer border-2 hover:border-primary border-white w-8 h-8 flex items-center justify-center rounded-sm transition-all duration-300 delay-150">
                    <IndentDecrease className="w-4 h-4" />
                </button>
                <button
                    title="Undo"
                    type="button"
                    onClick={() => editor?.chain().focus().undo().run()}
                    disabled={!editorState?.canUndo}
                    className="text-black/50 cursor-pointer border-2 hover:border-primary border-white w-8 h-8 flex items-center justify-center rounded-sm transition-all duration-300 delay-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Undo2 className="w-4 h-4" />
                </button>
                <button
                    title="Redo"
                    type="button"
                    onClick={() => editor?.chain().focus().redo().run()}
                    disabled={!editorState?.canRedo}
                    className="text-black/50 cursor-pointer border-2 hover:border-primary border-white w-8 h-8 flex items-center justify-center rounded-sm transition-all duration-300 delay-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Redo2 className="w-4 h-4" />
                </button>
                <button
                    title="Paragraph"
                    type="button"
                    onClick={() => editor?.chain().focus().setParagraph().run()}
                    className={`${editorState?.isParagraph ? 'is-active' : 'text-black/50'} cursor-pointer border-2 hover:border-primary border-white w-8 h-8 flex items-center justify-center rounded-sm transition-all duration-300 delay-150`}
                >
                    P
                </button>
                <button
                    title="Heading 1"
                    type="button"
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`${editorState?.isHeading1 ? 'is-active' : 'text-black/50'} cursor-pointer border-2 hover:border-primary border-white w-8 h-8 flex items-center justify-center rounded-sm transition-all duration-300 delay-150 font-bold`}
                >
                    H1
                </button>
                <button
                    title="Heading 2"
                    type="button"
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`${editorState?.isHeading2 ? 'is-active' : 'text-black/50'} cursor-pointer border-2 hover:border-primary border-white w-8 h-8 flex items-center justify-center rounded-sm transition-all duration-300 delay-150 font-bold`}
                >
                    H2
                </button>
                <button
                    title="Heading 3"
                    type="button"
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`${editorState?.isHeading3 ? 'is-active' : 'text-black/50'} cursor-pointer border-2 hover:border-primary border-white w-8 h-8 flex items-center justify-center rounded-sm transition-all duration-300 delay-150 font-bold`}
                >
                    H3
                </button>
                <button
                    title="Heading 4"
                    type="button"
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 4 }).run()}
                    className={`${editorState?.isHeading4 ? 'is-active' : 'text-black/50'} cursor-pointer border-2 hover:border-primary border-white w-8 h-8 flex items-center justify-center rounded-sm transition-all duration-300 delay-150 font-bold`}
                >
                    H4
                </button>
                <button
                    title="Heading 5"
                    type="button"
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 5 }).run()}
                    className={`${editorState?.isHeading5 ? 'is-active' : 'text-black/50'} cursor-pointer border-2 hover:border-primary border-white w-8 h-8 flex items-center justify-center rounded-sm transition-all duration-300 delay-150 font-bold`}
                >
                    H5
                </button>
                <button
                    title="Heading 6"
                    type="button"
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 6 }).run()}
                    className={`${editorState?.isHeading6 ? 'is-active' : 'text-black/50'} cursor-pointer border-2 hover:border-primary border-white w-8 h-8 flex items-center justify-center rounded-sm transition-all duration-300 delay-150 font-bold`}
                >
                    H6
                </button>

                {/* <button
                    onClick={() => editor?.chain().focus().toggleCode().run()}
                    disabled={!editorState?.canCode}
                    className={editorState?.isCode ? 'is-active' : ''}
                >
                    Code
                </button>
                <button onClick={() => editor?.chain().focus().unsetAllMarks().run()}>Clear marks</button>
                <button onClick={() => editor?.chain().focus().clearNodes().run()}>Clear nodes</button>
                <button
                    onClick={() => editor?.chain().focus().setParagraph().run()}
                    className={editorState?.isParagraph ? 'is-active' : ''}
                >
                    Paragraph
                </button>
                <button
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={editorState?.isHeading1 ? 'is-active' : ''}
                >
                    H1
                </button>
                <button
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editorState?.isHeading2 ? 'is-active' : ''}
                >
                    H2
                </button>
                <button
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={editorState?.isHeading3 ? 'is-active' : ''}
                >
                    H3
                </button>
              

                <button
                    onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                    className={editorState?.isOrderedList ? 'is-active' : ''}
                >
                    Ordered list
                </button>
                <button
                    onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                    className={editorState?.isCodeBlock ? 'is-active' : ''}
                >
                    Code block
                </button>
                
                <button onClick={() => editor?.chain().focus().setHorizontalRule().run()}>Horizontal rule</button>
                <button onClick={() => editor?.chain().focus().setHardBreak().run()}>Hard break</button>
                <button onClick={() => editor?.chain().focus().undo().run()} disabled={!editorState?.canUndo}>
                    Undo
                </button>
                <button onClick={() => editor?.chain().focus().redo().run()} disabled={!editorState?.canRedo}>
                    Redo
                </button> */}
            </div>
        </div>
    )
}



const ProductDescription = ({
    heading,
    height,
    onChange,
    defaultContent = '',
}: {
    heading: string
    height: string
    onChange?: (data: { productDescription: string; productDescriptionHtml: string }) => void
    defaultContent?: string
}) => {
    const [pasteAsTextMode, setPasteAsTextMode] = useState(false)
    const pasteModeRef = useRef(pasteAsTextMode)
    const initialContentSetRef = useRef(false)
    useEffect(() => {
        pasteModeRef.current = pasteAsTextMode
    }, [pasteAsTextMode])

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3, 4, 5, 6],
                    HTMLAttributes: {
                        class: 'editor-heading',
                    },
                },
            }),
            Indent,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline',
                },
            }),
            Color,
            Image.configure({
                allowBase64: false,
                HTMLAttributes: {
                    class: 'max-w-full h-auto my-4 rounded-sm',
                },
            }),
        ],
        content: defaultContent || '',
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: `p-3 ${height ? `h-[${height}]` : 'h-[400px]'} overflow-y-auto scroll-bar focus:outline-none`
            },
            handlePaste: (view, event) => {
                if (pasteModeRef.current) {
                    event.preventDefault()
                    const text = event.clipboardData?.getData('text/plain') || ''
                    if (text && editor) {
                        editor.chain().focus().insertContent(text).run()
                    }
                    return true
                }
                return false
            },
        },
    })

    // Ref pour stocker le contenu précédent
    const previousContentRef = useRef<string>('')

    // Fonction pour logger les données de l'éditeur seulement si le contenu a changé
    const logEditorData = useCallback(() => {
        if (!editor) {
            console.log('Editor not initialized')
            return
        }

        const htmlContent = editor.getHTML()

        // Ne logger que si le contenu a réellement changé
        if (htmlContent === previousContentRef.current) {
            return
        }

        previousContentRef.current = htmlContent

        const textContent = editor.getText()

        const data = {
            productDescription: textContent,
            productDescriptionHtml: htmlContent,
        }
        onChange?.(data)
        console.log('=== Editor Data Changed ===', data)
    }, [editor, onChange])

    // Sync editor content when defaultContent is set (e.g. product loaded in edit mode)
    useEffect(() => {
        if (!editor || !defaultContent) return
        if (initialContentSetRef.current) return
        initialContentSetRef.current = true
        editor.commands.setContent(defaultContent, { emitUpdate: false })
        previousContentRef.current = defaultContent
    }, [editor, defaultContent])

    // Logger les données quand l'éditeur change (onChange)
    useEffect(() => {
        if (editor) {
            const handleUpdate = () => {
                logEditorData()
            }
            editor.on('update', handleUpdate)
            return () => {
                editor.off('update', handleUpdate)
            }
        }
    }, [editor, logEditorData])

    return (
        <div className="bg-white flex flex-col gap-2 border border-black/30">
            <div className="text-base border-b border-b-black/30 p-3 cursor-pointer">
                {heading}
            </div>
            <MenuBar editor={editor} pasteAsTextMode={pasteAsTextMode} setPasteAsTextMode={setPasteAsTextMode} />
            <div className="prose prose-sm max-w-none">
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}

export default ProductDescription;