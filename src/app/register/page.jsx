import "../../styles/auth.css";

import BrandPanel from "../../components/auth/BrandPanel";
import RegisterForm from "../../components/auth/RegisterForm";

export default function Register() {
  return (
    <main className="auth flex min-h-screen flex-col md:flex-row">
      <BrandPanel />
      <RegisterForm />
    </main>
  );
}
