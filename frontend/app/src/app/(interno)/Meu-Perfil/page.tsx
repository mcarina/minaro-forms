import FormPerfil from "./components/formPerfil";
import Header from "./components/header";

export default function PerfilPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-700 flex flex-col">
            <Header/>
            <div className="max-w-md mx-auto px-6 py-12">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                    <FormPerfil/>
                </div>
            </div>
        </div>
    )   
}