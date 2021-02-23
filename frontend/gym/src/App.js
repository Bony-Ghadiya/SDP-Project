import React from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from 'react-router-dom';

import MainNavigation from './shared/components/Navigation/MainNavigation';
import Home from './Home/HomePage';
import Auth from './Home/Auth';
import Reset from './Home/Reset';
import NewPassword from './Home/NewPassword';
import Exercises from './Search/Exercises';
import OneExercise from './Search/components/exercise';
import SelectTrainer from './selectTrainers/SelectTrainer';
import OneTrainer from './selectTrainers/OneTrainer';
import ApplyTrainer from './ApplyTrainers/ApplyTrainer';
import ApproveTrainer from './admin/approvetrainer';
import ShowTrainee from './trainer/showtrainee';
import GetData from './getData/getData';
import './App.css';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';
// import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
	const {
		token,
		logout,
		userId,
		login,
		userType,
		req,
		app,
		setApproval,
		setRequested,
		sel,
		setSelection,
	} = useAuth();

	const removeSelection = () => {};

	// const setRequested = () => {
	// 	setrequested(1);
	// 	localStorage.setItem(
	// 		'auth',
	// 		JSON.stringify({
	// 			userId: userId,
	// 			token: token,
	// 			userType: userType,
	// 			requested: 1,
	// 			approved: 0,
	// 			selected: 0,
	// 		})
	// 	);
	// };
	let routes;
	if (userType === 'user') {
		routes = (
			<Switch>
				<Route path="/search" exact>
					<Exercises />
				</Route>
				<Route path="/search/:eid" exact>
					<OneExercise />
				</Route>
				<Route path="/selecttrainer" exact>
					<SelectTrainer />
				</Route>
				<Route path="/selecttrainer/:tid" exact>
					<OneTrainer />
				</Route>
				<Route path="/getdata" exact>
					<GetData />
				</Route>
				<Route path="/" exact>
					<Home />
				</Route>

				<Redirect to="/" />
			</Switch>
		);
	} else if (userType === 'trainer') {
		routes = (
			<Switch>
				<Route path="/" exact>
					<Home />
				</Route>
				<Route path="/search" exact>
					<Exercises />
				</Route>
				<Route path="/search/:eid" exact>
					<OneExercise />
				</Route>
				<Route path="/applytrainer" exact>
					<ApplyTrainer />
				</Route>
				<Route path="/showtrainees" exact>
					<ShowTrainee />
				</Route>
				<Redirect to="/" />
			</Switch>
		);
	} else if (userType === 'admin') {
		routes = (
			<Switch>
				<Route path="/" exact>
					<Home />
				</Route>
				<Route path="/search" exact>
					<Exercises />
				</Route>
				<Route path="/search/:eid" exact>
					<OneExercise />
				</Route>
				<Route path="/approvetrainer" exact>
					<ApproveTrainer />
				</Route>
				<Redirect to="/" />
			</Switch>
		);
	} else {
		routes = (
			<Switch>
				<Route path="/" exact>
					<Home />
				</Route>
				<Route path="/auth" exact>
					<Auth />
				</Route>
				<Route path="/search" exact>
					<Exercises />
				</Route>
				<Route path="/search/:eid" exact>
					<OneExercise />
				</Route>
				<Route exact path="/reset">
					<Reset />
				</Route>
				<Route path="/reset/:token">
					<NewPassword />
				</Route>
				<Route path="/selecttrainer/:tid" exact>
					<OneTrainer />
				</Route>
				<Redirect to="/" />
			</Switch>
		);
	}

	return (
		<AuthContext.Provider
			value={{
				isLoggedIn: !!token,
				token: token,
				userId: userId,
				userType: userType,
				isTrainerApproved: app,
				isTrainerSelected: sel,
				isRequested: req,
				login: login,
				logout: logout,
				setApproval: setApproval,
				setSelection: setSelection,
				removeSelection: removeSelection,
				setRequested: setRequested,
			}}
		>
			<Router>
				<MainNavigation />
				<main>{routes}</main>
			</Router>
		</AuthContext.Provider>
	);
};

export default App;
