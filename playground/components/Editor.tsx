
import Editor, { useMonaco } from "@monaco-editor/react";
import { languages } from "monaco-editor";
import { useEffect } from "react";
import { CompilerOptions, Markers } from "../utils/transpile";


export function TextEditor(props: {
    onChange: (code: string|undefined) => void
    code: string|undefined
}) {
    const monaco = useMonaco();

    useEffect(() => {
        if (!monaco) return;
        monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
            ...CompilerOptions as unknown as languages.typescript.CompilerOptions,
            allowNonTsExtensions: true
        });
        const filename = "ts:filename/facts.d.ts";
        monaco.languages.typescript.javascriptDefaults.addExtraLib(Markers, filename);
        monaco.editor.createModel(Markers, "typescript", monaco.Uri.parse(filename));
    }, [monaco]);

    return <Editor height="95vh" width="50%" language="typescript" theme="vs-dark" value={props.code} onChange={props.onChange}>

    </Editor>;
}