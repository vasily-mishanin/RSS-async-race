import { NavLink } from 'react-router-dom';

import classes from './MainNavigation.module.css';

function MainNavigation() {
  return (
    <div>
      <ul className={classes.mainNavigation}>
        <li>
          <NavLink to='/garage'>Garage</NavLink>
        </li>
        <li>
          <NavLink to='/winners'>Winners</NavLink>
        </li>
      </ul>
    </div>
  );
}

export default MainNavigation;
