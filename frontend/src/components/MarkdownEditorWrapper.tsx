import { useMemo } from "react";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

const MarkdownEditorWrapper = ({ value = "", onChange, placeholder = "Write here..." }: {
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
}) => {
    const memoizedOptions = useMemo(() => ({
        spellChecker: true,
        placeholder,
        status: false,
        imageUpload: false,
        imageUploadFunction: undefined,
    }), [placeholder]);

    return (
        <div className="text-black">
            <SimpleMDE
                defaultValue={value}
                onChange={onChange}
                options={memoizedOptions}
            />
        </div>
    );
};

export default MarkdownEditorWrapper;
