interface Props {
  children?: React.ReactNode;
}

export function AuthContainer({ children }: Props) {
  return (
    <div className="lg:p-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">{children}</div>
    </div>
  );
}
