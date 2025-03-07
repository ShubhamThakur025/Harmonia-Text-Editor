import { useEffect, useState } from "react"
import { FaLink, FaCode } from "react-icons/fa"
import { GrTextAlignLeft, GrTextAlignCenter, GrTextAlignRight, GrTextAlignFull } from "react-icons/gr"
import { GoListOrdered, GoListUnordered } from "react-icons/go"
import { BsBorderOuter } from "react-icons/bs"
import { Transforms, Editor } from "slate"
import { Range } from "slate"
import { ReactEditor } from "slate-react"

import * as Alignment from "../format/Alignment"
import * as Inserts from "../format/Inserts"
import * as Marks from "../format/Marks"
import * as Lists from "../format/Lists"

const ToolBar = ({ editor }) => {
    const [selectedBlock, setSelectedBlock] = useState("paragraph")
    const [formatState, setFormatState] = useState({
        bold: false,
        italic: false,
        underline: false,
        alignment: "",
        numberedList: false,
        bulletedList: false,
    })

    useEffect(() => {
        const updateFormatState = () => {
            setFormatState({
                bold: Marks.isMarkActive(editor, "bold"),
                italic: Marks.isMarkActive(editor, "italic"),
                underline: Marks.isMarkActive(editor, "underline")
            })
        }
        const { onChange } = editor
        editor.onChange = () => {
            updateFormatState()
            if (onChange) onChange()
        }

        return () => {
            editor.onChange = onChange
        }

    }, [editor])

    const handleBlockChange = (event) => {
        const blockType = event.target.value
        setSelectedBlock(blockType)

        switch (blockType) {
            case "heading1":
                Inserts.insertHeading1(editor)
                break
            case "heading2":
                Inserts.insertHeading2(editor)
                break
            case "heading3":
                Inserts.insertHeading3(editor)
                break
            case "paragraph":
                Inserts.insertParagraph(editor)
                break
            default:
                break
        }
    }

    const addCodeBlock = () => {
        Inserts.insertCodeBlock(editor)
    }

    const toggleBorderForBlock = () => {
        if (!editor.selection) return

        const [match] = Editor.nodes(editor, {
            match: (n) => Editor.isBlock(editor, n) && n.type,
            mode: "lowest",
        })

        if (!match) return

        const [node, path] = match
        const showBorders = !!node.showBorders
        console.log("Current Node:", node, "Show Borders:", showBorders)

        Transforms.setNodes(editor, { showBorders: !showBorders }, { at: path })
        ReactEditor.focus(editor)
    }


    return (
        <section id="tool-bar" className="bg-gray-100 p-5 rounded border border-gray-300 shadow-xl">
            <select id="font-selection" className="cursor-pointer bg-white rounded w-full text-left p-1 text-lg border mb-5 border-gray-200 text-slate-800 shadow-lg">
                <option value="Philosopher">Philosopher</option>
            </select>

            <div id="tool-set" className="flex gap-3 justify-center items-center text-white">
                <button className={`cursor-pointer bg-black rounded p-2 w-10 h-10 flex justify-center text-xl items-center ${formatState.bold ? "mark-active" : ""}`} onClick={() => Marks.toggleMark(editor, "bold")}>B</button>
                <button className={`cursor-pointer bg-black rounded p-2 w-10 h-10 flex justify-center text-xl items-center ${formatState.italic ? "mark-active" : ""}`} onClick={() => Marks.toggleMark(editor, "italic")} ><i>i</i></button>
                <button className="cursor-pointer bg-black rounded p-2 w-10 h-10 flex justify-center text-xl items-center"><FaLink /></button>
                <button className={`cursor-pointer bg-black rounded p-2 w-10 h-10 flex justify-center text-xl items-center ${formatState.underline ? "mark-active" : ""}`} onClick={() => Marks.toggleMark(editor, "underline")}><u>U</u></button>

            </div>

            <select
                id="block-selection"
                className="cursor-pointer my-3 bg-white rounded w-full text-left p-1 text-lg border border-gray-200 text-slate-800 shadow-lg"
                value={selectedBlock}
                onChange={handleBlockChange}
            >
                <option value="heading1">Heading 1</option>
                <option value="heading2">Heading 2</option>
                <option value="heading3">Heading 3</option>
                <option value="paragraph">Paragraph</option>
            </select>

            <div id="alignment" className="flex justify-center items-center gap-3">
                <GrTextAlignLeft className="cursor-pointer hover:shadow bg-white shadow-xl p-2 rounded" size={40} onClick={() => Alignment.toggleAlignment(editor, "left")} />
                <GrTextAlignCenter className="cursor-pointer bg-white shadow-xl p-2 rounded" size={40} onClick={() => Alignment.toggleAlignment(editor, "center")} />
                <GrTextAlignRight className="cursor-pointer bg-white shadow-xl p-2 rounded" size={40} onClick={() => Alignment.toggleAlignment(editor, "right")} />
                <GrTextAlignFull className="cursor-pointer bg-white shadow-xl p-2 rounded" size={40} onClick={() => Alignment.toggleAlignment(editor, "justify")} />
            </div>

            <div id="format" className="my-3 flex justify-center items-center">
                <p className="border rounded border-2 p-1 border-slate-700 py-2 mx-2 cursor-pointer" onClick={() => Marks.toggleMark(editor, "highlight")}>
                    <span className="bg-blue-200 rounded">Highlight</span> Text
                </p>
                <p className="border rounded border-2 p-1 border-slate-700 py-2">
                    <span className="font-extrabold italic text-slate-800 text-lg">Aa</span>
                    <span className="text-slate-900 text-base border border-2 bg-white p-1 font-semibold rounded px-2 text-sm">#404040</span>
                </p>
            </div>

            <div id="misc" className="flex justify-center items-center gap-3">
                <div id="list" className="flex justify-center items-center text-white">
                    <button className="cursor-pointer shadow bg-white rounded-lg rounded-r-none p-2 w-10 h-10 flex justify-center text-xl items-center"
                        onClick={() => Lists.toggleList(editor, "numbered-list")}>
                        <GoListOrdered color="black" />
                    </button>
                    <button className="cursor-pointer bg-black rounded-lg rounded-l-none p-2 w-10 h-10 flex justify-center text-xl items-center"
                        onClick={() => Lists.toggleList(editor, "bulleted-list")}>
                        <GoListUnordered color="white" />
                    </button>
                </div>
                <BsBorderOuter size={40} onClick={toggleBorderForBlock} className="bg-white rounded p-2 border border-gray-200 shadow" />
                <FaCode size={40} onClick={addCodeBlock} className="bg-white rounded p-2 border border-gray-200 shadow" />
            </div>
        </section>
    )
}

export default ToolBar
