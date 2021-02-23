import React from 'react';
import { Link } from 'react-router-dom';

import MainHeader from './MainHeader';
import NavLink from './Navlink';
import './MainNavigation.css';

const MainNavigation = props => {
	return (
		<MainHeader>
			<h1 className="main-navigation__title">
				<Link to="/">Gym Exerscise Planner</Link>
			</h1>
			<nav className="main-navigation__header-nav">
				<NavLink />
			</nav>
		</MainHeader>
	);
};

export default MainNavigation;
