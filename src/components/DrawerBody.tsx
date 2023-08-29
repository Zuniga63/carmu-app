import React from 'react';

interface Props {
  children?: React.ReactNode;
}
const DrawerBody = ({ children }: Props) => {
  return (
    <div className="relative h-full overflow-y-auto bg-light pb-40 pt-8 text-dark dark:bg-defaul-body dark:text-light">
      {children}
    </div>
  );
};

export default DrawerBody;
