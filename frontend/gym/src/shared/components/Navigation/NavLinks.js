import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import { AuthContext } from '../../context/auth-context';
import './NavLinks.css';

const NavLinks = props => {
	const auth = useContext(AuthContext);

	const logoutSubmitHandler = () => {
		auth.logout();
	};
	return (
		<ul className="nav-links">
			{auth.userType !== 'admin' && (
				<li>
					<NavLink to="/search" exact>
						SEARCH
					</NavLink>
				</li>
			)}
			{auth.isLoggedIn &&
				auth.userType === 'trainer' &&
				!auth.isTrainerApproved && (
					<li>
						<NavLink to="/applytrainer">APPLY TO BECOME TRAINER</NavLink>
					</li>
				)}
			{auth.isLoggedIn &&
				auth.userType === 'trainer' &&
				auth.isTrainerApproved && (
					<li>
						<NavLink to="/">User List</NavLink>
					</li>
				)}
			{auth.isLoggedIn && auth.userType === 'user' && (
				<li>
					<NavLink to={`/${auth.userId}/places`}>MY PLANS</NavLink>
				</li>
			)}
			{auth.isLoggedIn && auth.userType === 'user' && !auth.isTrainerSelected && (
				<li>
					<NavLink to="/selecttrainer">SELECT TRAINER</NavLink>
				</li>
			)}
			{auth.isLoggedIn && auth.userType === 'user' && auth.isTrainerSelected && (
				<li>
					<NavLink to="/">GET PLAN</NavLink>
				</li>
			)}
			{!auth.isLoggedIn && (
				<li>
					<NavLink to="/auth">JOIN US</NavLink>
				</li>
			)}
			{auth.isLoggedIn && auth.userType === 'admin' && (
				<li>
					<NavLink to="/approvetrainer">APPROVE TRAINER</NavLink>
				</li>
			)}
			{auth.isLoggedIn && auth.userType === 'admin' && (
				<li>
					<NavLink to="/approvetrainer">ADD NEW ADMIN</NavLink>
				</li>
			)}
			{auth.isLoggedIn && (
				<li>
					<button onClick={logoutSubmitHandler}>LOGOUT</button>
				</li>
			)}
		</ul>
	);
};

export default NavLinks;
