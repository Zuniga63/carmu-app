export function ConfigFormFooter({ children }: { children: React.ReactNode }) {
  return (
    <footer className="items-center justify-end gap-x-2 rounded-br-md bg-gray-dark px-4 py-3 text-right shadow shadow-gray-800 sm:flex sm:rounded-bl-md sm:px-6">
      {children}
    </footer>
  );
}
