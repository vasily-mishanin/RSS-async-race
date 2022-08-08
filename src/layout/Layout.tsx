import { PropsWithChildren } from 'react';
import MainNavigation from './MainNavigation';

const Layout: React.FC<PropsWithChildren> = (props) => {
  return (
    <section>
      <MainNavigation />
      {props.children}
    </section>
  );
};

export default Layout;
