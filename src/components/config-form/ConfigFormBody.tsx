export function ConfigFormBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-foreground dark:bg-muted px-4 py-5 shadow shadow-neutral-900 sm:rounded-tl-md sm:rounded-tr-md">
      {children}
    </div>
  );
}
