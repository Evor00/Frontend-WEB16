import ProtectedRoute from "@/components/ProtectedRoute";

export const metadata = {
  title: "Panel",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</div>
    </ProtectedRoute>
  );
}
