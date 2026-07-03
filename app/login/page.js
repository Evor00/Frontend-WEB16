import LoginForm from "./LoginForm";

export const metadata = {
  title: "Iniciar sesión",
  description: "Ingresa a tu cuenta del Sistema de Mesa de Ayuda para gestionar tus tickets.",
};

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">Inicia sesión</h1>
      <p className="mt-1 text-sm text-slate-500">
        Accede con tu correo y contraseña para continuar.
      </p>
      <LoginForm />
    </div>
  );
}
