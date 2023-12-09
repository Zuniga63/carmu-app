export default function LayoutBody({ children }: { children: React.ReactNode }) {
  return <div className="relative xl:h-screen xl:overflow-hidden">{children}</div>;
}
