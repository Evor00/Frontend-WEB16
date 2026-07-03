export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
      <p>
        Sistema de Mesa de Ayuda (Help Desk) &middot; Proyecto académico Tecsup &middot;{" "}
        {new Date().getFullYear()}
      </p>
    </footer>
  );
}
