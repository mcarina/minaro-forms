import Header from "../Meu-Perfil/components/header";
import ThemePage from "./components/theme";
import ZonaPerigoPage from "./components/zonaPerigo";

export default function ConfiguracoesPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-700">
        <Header />
        <ThemePage />
        <ZonaPerigoPage />
    </div>
  );
}
