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
import ViewData from './trainer/viewData';
import ViewDailyFeedback from './trainer/ViewDailyFeedback';
import GetData from './getData/getData';
import GivePlan from './trainer/GivePlan';
import ViewReporting from './trainer/ViewReporting';
import ViewPlan from './traineePlan/ViewPlan';
import Reporting from './traineePlan/Reporting';
import Feedback from './traineePlan/Feedback';
import UpdateProfile from './Home/UpdateProfile';
import New from './new';
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
		dataG,
		setDataGiven,
		pCom,
		setPlanComplated,
		endThis,
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
				<Route path="/viewplan" exact>
					<ViewPlan />
				</Route>
				<Route path="/reporting" exact>
					<Reporting />
				</Route>
				<Route path="/feedback" exact>
					<Feedback />
				</Route>
				<Route path="/updateprofile" exact>
					<UpdateProfile />
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
				<Route path="/showtrainees/viewdata" exact>
					<ViewData />
				</Route>
				<Route path="/showtrainees/viewfeedback" exact>
					<ViewDailyFeedback />
				</Route>
				<Route path="/showtrainees/viewreporting" exact>
					<ViewReporting />
				</Route>
				<Route path="/showtrainees/giveplan" exact>
					<GivePlan />
				</Route>
				<Route path="/showtrainees" exact>
					<ShowTrainee />
				</Route>
				<Route path="/updateprofile" exact>
					<UpdateProfile />
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
				<Route path="/updateprofile" exact>
					<UpdateProfile />
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
				<Route path="/new">
					<New />
				</Route>
				<Redirect to="/" />
			</Switch>
		);
	}

	//uinrcnn

	return (
		<AuthContext.Provider
			value={{
				isLoggedIn:
					userType === 'user' || userType === 'trainer' || userType === 'admin'
						? true
						: false,
				token: token,
				userId: userId,
				userType: userType,
				isTrainerApproved: app,
				isTrainerSelected: sel,
				isRequested: req,
				isDataGiven: dataG,
				login: login,
				logout: logout,
				setApproval: setApproval,
				setSelection: setSelection,
				removeSelection: removeSelection,
				setRequested: setRequested,
				setDataGiven: setDataGiven,
				planComplated: pCom,
				setPlanComplated: setPlanComplated,
				endThis: endThis,
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
