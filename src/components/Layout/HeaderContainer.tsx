type Props = {
  children: React.ReactNode;
};

export default function HeaderContainer({ children }: Props) {
  return (
    <header
      className="sticky top-0 z-fixed bg-neutral-200 text-dark dark:bg-header dark:text-light xl:static"
      id="layout-header"
    >
      <div className="flex items-center justify-between px-4 py-2 md:px-6 xl:py-3">{children}</div>
    </header>
  );
}
