import NavBar from "@/components/home/navbar";
import SideBar from "@/components/home/sidebar";
import { Toaster } from "@/components/ui/toaster";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="md:sticky md:top-0 md:h-screen">
        <SideBar />
      </div>
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <div className="flex-1 overflow-y-auto">
          <Toaster />
          {children}
        </div>
      </div>
    </div>
  );
}
