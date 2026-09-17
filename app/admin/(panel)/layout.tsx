import Image from "next/image";
import Link from "next/link";
import logoMark from "@/public/brand/logo-mark.png";
import AdminSidebar from "../components/AdminSidebar";
import LogoutButton from "../components/LogoutButton";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-bg text-ink">
      <aside className="hidden w-56 shrink-0 border-r border-line px-4 py-6 sm:flex sm:flex-col">
        <Link href="/admin/leads" className="flex items-center gap-2.5 px-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#f4f2ea] p-1.5">
            <Image src={logoMark} alt="" width={24} height={19} className="h-full w-auto" />
          </span>
          <span className="font-display text-base font-semibold tracking-tight">
            Firm<span className="text-signal">Expo</span>
          </span>
        </Link>
        <p className="mt-1 px-3 font-data text-xs text-ink-faint">Admin</p>

        <div className="mt-8">
          <AdminSidebar />
        </div>

        <div className="mt-auto px-3 pt-6">
          <LogoutButton />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-line px-6 py-4 sm:hidden">
          <span className="font-display text-base font-semibold tracking-tight">
            Firm<span className="text-signal">Expo</span> Admin
          </span>
          <LogoutButton />
        </header>
        <main className="flex-1 px-6 py-8 sm:px-10 sm:py-10">{children}</main>
      </div>
    </div>
  );
}
