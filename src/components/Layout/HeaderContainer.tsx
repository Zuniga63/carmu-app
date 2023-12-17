type Props = {
  children: React.ReactNode;
};

export default function HeaderContainer({ children }: Props) {
  return (
    <header className="sticky top-0 z-fixed h-20 bg-neutral-200 text-dark dark:bg-header dark:text-light xl:static">
      <div className="flex h-full items-center justify-between px-4 py-2 md:px-6 xl:py-3">{children}</div>
    </header>
  );
}
