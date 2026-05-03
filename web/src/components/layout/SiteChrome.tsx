import { Header } from "./Header";
import { Footer } from "./Footer";
import { BottomNav } from "./BottomNav";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main
        id="main"
        className="w-full flex-1 px-4 sm:px-6 lg:px-8 pb-20 md:pb-0"
      >
        {children}
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
