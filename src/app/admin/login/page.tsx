import LoginForm from "@/components/admin/LoginForm";

export const metadata = { title: "Dashboard sign in", robots: { index: false } };

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-5">
      <LoginForm />
    </main>
  );
}
