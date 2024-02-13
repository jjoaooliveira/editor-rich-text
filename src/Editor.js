import { useState } from 'react'

/**
 * [x] resolver problema com posição do ponteiro
 * [x] resolver br nas divs
 * [] tags
 * @returns asdasdad
*/
const letters = ['Control', 'Del', 'Tab', 'Capslock', 'Shift', 'Alt'];
function Editor() {
    const [textPosition, setTextPosition] = useState();

    function insertNode(node, newNode) {
        setTextPosition(getCursorPosition());
        const { next } = siblingsNodes(node);

        if (textPosition === 0) {
            node.parentNode.insertBefore(newNode, node);
        } else {
            next
                ? node.parentNode.insertBefore(newNode, next)
                : node.parentNode.appendChild(newNode);
            newNode.focus();
        }
    }

    // função para criação de nodes
    function createNode(node, content) {
        const div = document.createElement('div');
        div.className = 'text';
        div.setAttribute('contentEditable', 'true');

        if (content) {
            div.textContent = content;
        } else {
            const br = document.createElement('br');
            div.appendChild(br);
        }
        insertNode(node, div);
    }

    function siblingsNodes(node) {
        const siblings = {
            previous: node.previousSibling,
            next: node.nextSibling,
        }
        return siblings
    }

    function getCursorPosition() {
        const pos = window.getSelection();
        const position = pos.focusOffset;

        return position;
    }

    // função que posiciona o cursor
    function setCaret(node, tPos = 0) {
        const range = document.createRange();
        const sel = window.getSelection();

        if (node.textContent) {
            const elementLength = node.textContent.length;
            // console.log(`${tPos} - ${elementLength}`)
            tPos >= elementLength
                ? range.setStart(node.childNodes[0], elementLength)
                : range.setStart(node.childNodes[0], tPos);

            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
        } else {
            node.focus();
        }
    }

    function getPreviousContentToNext(node, pos) {
        const nodeContent = node.textContent;
        const arrayContent = Array.from(nodeContent);

        const nextContent = arrayContent
            .slice(pos, node.textContent.length)
            .join('');

        const replacedNodeContent = nodeContent
            .replace(nextContent, '');

        node.textContent = replacedNodeContent;
        return nextContent;
    }

    function manageContent(node, content) {
        const nodeChilds = Array.from(node.childNodes);
        const br = document.createElement('br');
        const nodeHasBr = nodeChilds.some(element => element.nodeName === 'BR')

        if (content - 1 === 0 && !nodeHasBr) {
            node.appendChild(br);
        }  
    }

    function Tab(node, pos) {
        const nodeContent = node.textContent;
        const arrayContent = Array.from(nodeContent);

        if (pos === nodeContent.length) {
            node.innerHTML += '&emsp;';
        } else {
            const spacedContent = arrayContent
                .splice(pos, nodeContent.length - pos, '&emsp;')
                .join('');

            node.innerHTML = arrayContent.join('') + spacedContent;
        }
    }

    function handleKeyDown(e) {
        const targetNode = e.target;
        const key = e.key;
        const { previous, next } = siblingsNodes(targetNode);

        if (e.ctrlKey && key === 'ArrowLeft') {
            e.preventDefault();
            setCaret(targetNode, 0);
        }

        if (e.ctrlKey && key === 'ArrowRight') {
            e.preventDefault();
            setCaret(targetNode, targetNode.textContent.length);
        }

        switch (key) {
            case 'Enter':
                e.preventDefault();
                if (getCursorPosition() === 0 || getCursorPosition() === targetNode.textContent.length) {
                    createNode(targetNode);
                } else {
                    const content = getPreviousContentToNext(targetNode, textPosition);
                    createNode(targetNode, content);
                }
                setTextPosition(getCursorPosition());
                break;

            case 'Backspace':
                const targetParentNode = targetNode.parentNode;
                const targetNodeTextContent = targetNode.textContent;
                const p = getCursorPosition() - 1
                manageContent(targetNode, targetNodeTextContent.length);

                p <= 0
                    ? setTextPosition(0)
                    : setTextPosition(getCursorPosition() - 1);

                if (previous && textPosition === 0) {
                    e.preventDefault();

                    previous.textContent += targetNodeTextContent || '';
                    setCaret(previous, previous.textContent.length - targetNodeTextContent.length);
                    setTextPosition(getCursorPosition());
                    targetParentNode.removeChild(targetNode);
                }

                break;

            case 'ArrowLeft':
                if (previous && textPosition === 0) {
                    e.preventDefault();
                    setCaret(previous, previous.textContent.length);
                    setTextPosition(getCursorPosition());

                } else {
                    const p = getCursorPosition() - 1
                    p < 0
                        ? setTextPosition(0)
                        : setTextPosition(getCursorPosition() - 1);
                }
                break;

            case 'ArrowRight':
                if (next && textPosition === targetNode.textContent.length) {
                    e.preventDefault();
                    setCaret(next);
                    setTextPosition(getCursorPosition());
                } else {
                    const p = getCursorPosition() + 1
                    p > targetNode.textContent.length
                        ? setTextPosition(targetNode.textContent.length)
                        : setTextPosition(getCursorPosition() + 1);
                }
                break;

            case 'ArrowDown':
                e.preventDefault();
                if (next) {
                    setCaret(next, textPosition);
                    setTextPosition(getCursorPosition());
                } else {
                    setCaret(targetNode, targetNode.textContent.length);
                    setTextPosition(getCursorPosition());
                }
                break;

            case 'ArrowUp':
                e.preventDefault();
                if (previous) {
                    setCaret(previous, textPosition);
                    setTextPosition(getCursorPosition());
                } else {
                    setCaret(targetNode, 0);
                    setTextPosition(getCursorPosition());
                }
                break;

            case 'Tab':
                e.preventDefault();
                Tab(targetNode, textPosition);
                setCaret(targetNode, textPosition + 1);
                break;

            default:
                manageContent(targetNode);
                if (letters.includes(key)) {
                    e.preventDefault();
                    return;
                }
                setTextPosition(getCursorPosition() + 1);
                break;
        }
    }

    return (
        <>
            <div className="body-editor" onKeyDown={(e) => handleKeyDown(e)} onClick={() => setTextPosition(getCursorPosition())}>
                <div className="text" contentEditable="true" suppressContentEditableWarning><br /></div>
            </div>
            <p>{textPosition}</p>
        </>
    );
}

export default Editor