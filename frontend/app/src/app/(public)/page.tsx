import LoginPage from "./Auth/login";

export default function PublicPage() {

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-700">
      <LoginPage/>
    </div>
  );
}
