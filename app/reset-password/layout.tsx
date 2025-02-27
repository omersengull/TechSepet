import { Suspense } from "react";

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div>Yükleniyor...</div>}>{children}</Suspense>;
}
