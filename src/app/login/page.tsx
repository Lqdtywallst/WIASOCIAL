import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-background">Cargando...</div>}>
      <LoginForm />
    </Suspense>
  );
}
