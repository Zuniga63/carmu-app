interface Props {
  title: string;
  description: string;
}

export function AuthHeader({ title, description }: Props) {
  return (
    <header className="flex flex-col space-y-2 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="text-sm text-muted-foreground">{description}</p>
    </header>
  );
}
