type Props = {
  children: React.ReactNode;
};

export default function LayoutContent({ children }: Props) {
  return <main className="h-[calc(100vh-80px)] overflow-y-auto">{children}</main>;
}
