import { useState, useCallback, useEffect } from 'react';

export const useAuth = () => {
	const [token, setToken] = useState({});
	const [userId, setUserId] = useState({});
	const [userType, setUserType] = useState({});
	const [req, setReq] = useState(0);
	const [app, setApp] = useState(0);
	const [sel, setSel] = useState(0);
	const [dataG, setDataG] = useState(0);
	const [pCom, setPCom] = useState(0);

	const login = useCallback(
		(uid, token, type, requested, approved, selected, given, complated) => {
			setToken(token);
			setUserId(uid);
			setUserType(type);
			setReq(requested);
			setApp(approved);
			setSel(selected);
			setDataG(given);
			setPCom(complated);
			localStorage.setItem(
				'auth',
				JSON.stringify({
					userId: uid,
					token: token,
					userType: type,
					requested: requested,
					approved: approved,
					selected: selected,
					given: given,
					complated: complated,
				})
			);
		},
		[]
	);

	const setRequested = useCallback(() => {
		setReq(1);
		localStorage.setItem(
			'auth',
			JSON.stringify({
				userId: userId,
				token: token,
				userType: userType,
				requested: 1,
				approved: app,
				selected: sel,
				given: dataG,
				complated: pCom,
			})
		);
	}, [userId, token, userType, app, sel, dataG, pCom]);

	const setApproval = useCallback(() => {
		setApp(1);
		localStorage.setItem(
			'auth',
			JSON.stringify({
				userId: userId,
				token: token,
				userType: userType,
				requested: req,
				approved: 1,
				selected: sel,
				given: dataG,
				complated: pCom,
			})
		);
	}, [userId, token, userType, req, sel, dataG, pCom]);

	const setSelection = useCallback(() => {
		setSel(1);
		localStorage.setItem(
			'auth',
			JSON.stringify({
				userId: userId,
				token: token,
				given: dataG,
				userType: userType,
				requested: req,
				approved: app,
				selected: 1,
				complated: pCom,
			})
		);
	}, [userId, token, userType, req, app, dataG, pCom]);

	const setDataGiven = useCallback(() => {
		setDataG(1);
		localStorage.setItem(
			'auth',
			JSON.stringify({
				userId: userId,
				token: token,
				userType: userType,
				requested: req,
				approved: app,
				selected: sel,
				given: 1,
				complated: pCom,
			})
		);
	}, [userId, token, userType, req, app, sel, pCom]);

	const setPlanComplated = useCallback(() => {
		setPCom(1);
		localStorage.setItem(
			'auth',
			JSON.stringify({
				userId: userId,
				token: token,
				userType: userType,
				requested: req,
				approved: app,
				selected: sel,
				given: dataG,
				complated: 1,
			})
		);
	}, [userId, token, userType, req, app, sel, dataG]);

	const endThis = useCallback(() => {
		setReq(0);
		setApp(0);
		setSel(0);
		setDataG(0);
		setPCom(0);
		localStorage.setItem(
			'auth',
			JSON.stringify({
				userId: userId,
				token: token,
				userType: userType,
				requested: 0,
				approved: 0,
				selected: 0,
				given: 0,
				complated: 0,
			})
		);
		login(userId, token, userType, 0, 0, 0, 0, 0);
	}, [userId, token, userType, login]);

	const logout = useCallback(() => {
		setToken(null);
		setUserId(null);
		setUserType(null);
		setReq(0);
		setApp(0);
		setSel(0);
		setDataG(0);
		setPCom(0);
		localStorage.removeItem('auth');
	}, []);

	useEffect(() => {
		async function func() {
			const storedData = await JSON.parse(localStorage.getItem('auth'));
			if (storedData) {
				login(
					storedData.userId,
					storedData.token,
					storedData.userType,
					storedData.requested,
					storedData.approved,
					storedData.selected,
					storedData.given,
					storedData.complated
				);
				setToken(storedData.token);
				setUserId(storedData.userId);
				setUserType(storedData.userType);
				setReq(storedData.requested);
				setApp(storedData.approved);
				setSel(storedData.selected);
				setDataG(storedData.given);
				setPCom(storedData.complated);
			}
		}
		func();
	}, [login]);

	return {
		token,
		login,
		logout,
		userId,
		userType,
		req,
		app,
		setRequested,
		setApproval,
		sel,
		setSelection,
		dataG,
		setDataGiven,
		pCom,
		setPlanComplated,
		endThis,
	};
};
