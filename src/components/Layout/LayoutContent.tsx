import { ScrollArea } from '@mantine/core';

type Props = {
  children: React.ReactNode;
};

export default function LayoutContent({ children }: Props) {
  return (
    <div className="h-[calc(100vh-62px)]">
      <ScrollArea className="h-full">
        <main>{children}</main>
      </ScrollArea>
    </div>
  );
}
