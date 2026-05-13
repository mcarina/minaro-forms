import Filter from "./components/filter";
import Header from "./components/header";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-700">
        <Header />
        <div className="p-8">
          <Filter />
        </div>
    </div>
  );
}