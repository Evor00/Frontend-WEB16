import RegisterForm from "./RegisterForm";

export const metadata = {
  title: "Crear cuenta",
  description: "Regístrate como cliente para crear tickets de soporte y dar seguimiento a tus incidencias.",
};

export default function RegisterPage() {
  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">Crea tu cuenta</h1>
      <p className="mt-1 text-sm text-slate-500">
        Regístrate como cliente para empezar a reportar incidencias.
      </p>
      <RegisterForm />
    </div>
  );
}
