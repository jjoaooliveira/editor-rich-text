import React, { useCallback, useState } from 'react'
import { createEditor, Editor, Transforms, Element } from 'slate'
import { Slate, Editable, withReact, useSlate } from 'slate-react'
import Code from './Code'
import BlockQuote from './BlockQuote'
import Head from './Head'
import BoldMark from './BoldMark'

const CustomEditor = {
    isHead1BlockActive(editor) {
        const [match] = Editor.nodes(editor, {
            match: n => n.type === 'heading' && n.level === 1 ,
        })
        return !!match
    },

    isDelMarkActive(editor) {
        const marks = Editor.marks(editor)
        return marks ? marks.del === true : false
    },

    isHead2BlockActive(editor) {
        const [match] = Editor.nodes(editor, {
            match: n => n.type === 'heading' && n.level === 2 ,
        })
        return !!match
    },

    isBlockquoteActive(editor) {
        const [match] = Editor.nodes(editor, {
            match: n => n.type === 'quote',
        })

        return !!match
    },

    isUnderlineMarkActive(editor) {
        const marks = Editor.marks(editor)
        return marks ? marks.ins === true : false
    },

    isItalicMarkActive(editor) {
        const marks = Editor.marks(editor)
        return marks ? marks.em === true : false
    },

    isBoldMarkActive(editor) {
        const marks = Editor.marks(editor)
        return marks ? marks.strong === true : false
    },

    isCodeBlockActive(editor) {
        const [match] = Editor.nodes(editor, {
            match: n => n.type === 'code',
        })

        return !!match
    },

    toggleUnderlineMark(editor) {
        const isActive = CustomEditor.isUnderlineMarkActive(editor)
        if (isActive) {
            Editor.removeMark(editor, 'ins')
        } else {
            Editor.addMark(editor, 'ins', true)
        }
    },

    toggleItalicMark(editor) {
        const isActive = CustomEditor.isItalicMarkActive(editor)
        if (isActive) {
            Editor.removeMark(editor, 'em')
        } else {
            Editor.addMark(editor, 'em', true)
        }
    },

    toggleDelMark(editor) {
        const isActive = CustomEditor.isDelMarkActive(editor)
        if (isActive) {
            Editor.removeMark(editor, 'del')
        } else {
            Editor.addMark(editor, 'del', true)
        }
    },

    toggleBoldMark(editor) {
        const isActive = CustomEditor.isBoldMarkActive(editor)
        if (isActive) {
            Editor.removeMark(editor, 'strong')
        } else {
            Editor.addMark(editor, 'strong', true)
        }
    },

    toggleCodeBlock(editor) {
        const isActive = CustomEditor.isCodeBlockActive(editor)
        Transforms.setNodes(
            editor,
            { type: isActive ? null : 'code' },
            { match: n => Element.isElement(n) && Editor.isBlock(editor, n) }
        )
    },

    toggleBlockquoteBlock(editor) {
        const isActive = CustomEditor.isBlockquoteActive(editor)
        Transforms.setNodes(
            editor,
            { type: isActive ? null : 'quote' },
            { match: n => Element.isElement(n) && Editor.isBlock(editor, n) }
        )
    },

    toggleHead1Block(editor) {
        const isActive = CustomEditor.isHead1BlockActive(editor)
        Transforms.setNodes(
            editor,
            {
                type: isActive ? null : 'heading',
                level: 1
            },
            { match: n => Element.isElement(n) && Editor.isBlock(editor, n) }
        )
    },

    toggleHead2Block(editor) {
        const isActive = CustomEditor.isHead2BlockActive(editor)
        Transforms.setNodes(
            editor,
            {
                type: isActive ? null : 'heading',
                level: 2
            },
            { match: n => Element.isElement(n) && Editor.isBlock(editor, n) }
        )
    },
}

const initialValue = [
    {
        type: 'paragraph',
        children: [
            { text: '' }
        ],
    },
]

const TextEditor = () => {
    const [editor] = useState(() => withReact(createEditor()));

    const onKeyDown = (e) => {
        if (!e.ctrlKey) {
            return
        }

        switch (e.key) {
            case 'm': {
                e.preventDefault()
                CustomEditor.toggleCodeBlock(editor)
                break
            }

            case 'b': {
                e.preventDefault()
                CustomEditor.toggleBoldMark(editor)
                break
            }

            case 'i': {
                e.preventDefault()
                CustomEditor.toggleItalicMark(editor)
                break
            }

            case 'u': {
                e.preventDefault()
                CustomEditor.toggleUnderlineMark(editor)
                break
            }

            case 'q': {
                e.preventDefault()
                CustomEditor.toggleBlockquoteBlock(editor)
                break
            }
            case '1': {
                e.preventDefault()
                CustomEditor.toggleHead1Block(editor)
                break
            }
            case '2': {
                e.preventDefault()
                CustomEditor.toggleHead2Block(editor)
                break
            }
            case 'd': {
                e.preventDefault()
                CustomEditor.toggleDelMark(editor)
                break
            }

            default: {
                break;
            }
        }
    }

    const renderElement = useCallback(props => {
        switch (props.element.type) {
            case 'code':
                return <Code {...props} />
            case 'quote':
                return <BlockQuote {...props} />
            case 'heading':
                return <Head {...props} />
            case 'strong':
                return <BoldMark {...props} />
            default:
                return <DefaultElement {...props} />
        }
    }, [])

    const renderLeaf = useCallback(props => {
        return <Leaf {...props} />
    }, [])

    return (
        <Slate editor={editor} initialValue={initialValue}>
            <Toolbar />
            <Editable
                className='texto'
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                onKeyDown={onKeyDown}
                placeholder='digite seu texto aqui...'
            />
        </Slate>
    )
}

const Leaf = props => {
    let c = props.children;

    if (props.leaf.strong) {
        c = <strong>{c}</strong>
    }

    if (props.leaf.em) {
        c = <em>{c}</em>
    }

    if (props.leaf.ins) {
        c = <ins>{c}</ins>
    }
    if (props.leaf.del) {
        c = <del>{c}</del>
    }

    return (
        <span {...props.attributes}>
            {c}
        </span>
    )
}

const DefaultElement = props => {
    return <p {...props.attributes}>{props.children}</p>
}

const Toolbar = () => {
    const editor = useSlate();
    return (
        <div className='toolbar-container'>
            <ul className='format-options'>
                <li
                    style={{color: CustomEditor.isHead1BlockActive(editor) ? '#cc02cc' : ''}} 
                    onMouseDown={() => {CustomEditor.toggleHead1Block(editor)}}
                    >H1
                </li>
                <li 
                    style={{color: CustomEditor.isHead2BlockActive(editor) ? '#cc02cc' : ''}}
                    onMouseDown={() => CustomEditor.toggleHead2Block(editor)}
                    >H2
                </li>
                <li 
                    className='material-symbols-outlined'
                    style={{color: CustomEditor.isBoldMarkActive(editor) ? '#cc02cc' : ''}}
                    onMouseDown={() => CustomEditor.toggleBoldMark(editor)}
                    >format_bold
                </li>
                <li 
                    className='material-symbols-outlined'
                    style={{color: CustomEditor.isItalicMarkActive(editor) ? '#cc02cc' : ''}}
                    onMouseDown={() => CustomEditor.toggleItalicMark(editor)}
                    >format_italic
                </li>
                <li 
                    className='material-symbols-outlined'
                    style={{color: CustomEditor.isUnderlineMarkActive(editor) ? '#cc02cc' : ''}}
                    onMouseDown={() => CustomEditor.toggleUnderlineMark(editor)}
                    >format_underlined
                </li>
                <li 
                    className='material-symbols-outlined'
                    style={{color: CustomEditor.isCodeBlockActive(editor) ? '#cc02cc' : ''}}
                    onMouseDown={() => CustomEditor.toggleCodeBlock(editor)}
                    >code
                </li>
                <li 
                    className='material-symbols-outlined'
                    style={{color: CustomEditor.isBlockquoteActive(editor) ? '#cc02cc' : ''}}
                    onMouseDown={() => CustomEditor.toggleBlockquoteBlock(editor)}
                    >format_quote
                </li>
            </ul>
            <hr />
        </div>
    )
}

export default TextEditor