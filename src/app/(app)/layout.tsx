import { BrandLogo, Header, MainNav, UserAvatar } from '@/components/layouts/app-layout';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header>
        <BrandLogo />
        <MainNav className="mx-6" />
        <UserAvatar />
      </Header>
      <div className="flex-1 p-8 pt-6">{children}</div>
      <footer></footer>
    </div>
  );
}
