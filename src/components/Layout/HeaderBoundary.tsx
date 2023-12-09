type Props = {
  children?: React.ReactNode;
};

export default function HeaderBoundary({ children }: Props) {
  return <div className="flex items-center gap-x-2 md:gap-x-4">{children}</div>;
}
