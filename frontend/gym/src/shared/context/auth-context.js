import { createContext } from 'react';

export const AuthContext = createContext({
	isLoggedIn: false,
	userId: null,
	token: null,
	userType: null,
	login: () => {},
	logout: () => {},
	isTrainerApproved: false,
	setApproval: () => {},
	isTrainerSelected: false,
	setSelection: () => {},
	removeSelection: () => {},
	isRequested: false,
	setRequested: () => {},
	isDataGiven: false,
	setDataGiven: () => {},
	planComplated: false,
	setPlanComplated: () => {},
	feedbackGiven: false,
	setFeedbackGiven: () => {},
});
