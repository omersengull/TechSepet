import { Suspense } from "react";

export default function VerifyLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Yükleniyor...</div>}>
      {children}
    </Suspense>
  );
}
