import FormEditor from "./components/formEditor";
import Header from "./components/header";

export default function FormEditorPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-700 flex flex-col">
            <Header />
            <div className="p-8">
                <FormEditor />
            </div>
        </div>
    )
}