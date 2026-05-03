import { Header } from "./Header";
import { Footer } from "./Footer";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main
        id="main"
        className="w-full flex-1 px-4 sm:px-6 lg:px-8 pb-[env(safe-area-inset-bottom)]"
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
