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
			{!auth.isLoggedIn && (
				<li>
					<NavLink to="/auth">JOIN US</NavLink>
				</li>
			)}
			{auth.isLoggedIn && (
				<li>
					<NavLink to="/updateprofile">UPDATE PROFILE</NavLink>
				</li>
			)}
			{auth.isLoggedIn && auth.userType === 'admin' && (
				<li>
					<NavLink to="/approvetrainer">APPROVE TRAINER</NavLink>
				</li>
			)}
			{auth.isLoggedIn && auth.userType === 'admin' && (
				<li>
					<NavLink to="/">ADD NEW ADMIN</NavLink>
				</li>
			)}
			{auth.isLoggedIn &&
				auth.userType === 'trainer' &&
				auth.isTrainerApproved === 0 && (
					<li>
						<NavLink to="/applytrainer">APPLY TO BECOME TRAINER</NavLink>
					</li>
				)}
			{auth.isLoggedIn &&
				auth.isTrainerApproved === 1 &&
				auth.userType === 'trainer' && (
					<li>
						<NavLink to="/showtrainees">USER LISTS</NavLink>
					</li>
				)}
			{auth.isLoggedIn &&
				auth.userType === 'user' &&
				auth.isTrainerSelected === 0 && (
					<li>
						<NavLink to="/selecttrainer">SELECT TRAINER</NavLink>
					</li>
				)}
			{auth.isLoggedIn &&
				auth.userType === 'user' &&
				auth.isTrainerSelected === 1 &&
				auth.isDataGiven === 0 && (
					<li>
						<NavLink to="/getdata">GET PLAN</NavLink>
					</li>
				)}
			{auth.isLoggedIn &&
				auth.userType === 'user' &&
				auth.isTrainerSelected === 1 &&
				auth.isDataGiven === 1 &&
				auth.planComplated === 0 && (
					<li>
						<NavLink to="/viewplan">VIEW PLAN</NavLink>
					</li>
				)}
			{auth.isLoggedIn &&
				auth.userType === 'user' &&
				auth.isTrainerSelected === 1 &&
				auth.isDataGiven === 1 &&
				auth.planComplated === 1 && (
					<li>
						<NavLink to="/feedback">FEEDBACK</NavLink>
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
