import React from 'react';

interface Props {
  children?: React.ReactNode;
}
const DrawerBody = ({ children }: Props) => {
  return <div className="relative h-full overflow-y-auto bg-defaul-body pt-8 pb-40 text-light">{children}</div>;
};

export default DrawerBody;
