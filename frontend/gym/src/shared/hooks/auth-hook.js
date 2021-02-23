import { useState, useCallback, useEffect } from 'react';

export const useAuth = () => {
	const [token, setToken] = useState({});
	const [userId, setUserId] = useState({});
	const [userType, setUserType] = useState({});
	const [req, setReq] = useState(0);
	const [app, setApp] = useState(0);
	const [sel, setSel] = useState(0);

	const login = useCallback(
		(uid, token, type, requested, approved, selected) => {
			setToken(token);
			setUserId(uid);
			setUserType(type);
			setReq(requested);
			setApp(approved);
			setSel(selected);
			localStorage.setItem(
				'auth',
				JSON.stringify({
					userId: uid,
					token: token,
					userType: type,
					requested: requested,
					approved: approved,
					selected: selected,
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
			})
		);
	}, [userId, token, userType, app, sel]);

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
			})
		);
	}, [userId, token, userType, req, sel]);

	const setSelection = useCallback(() => {
		setSel(1);
		localStorage.setItem(
			'auth',
			JSON.stringify({
				userId: userId,
				token: token,
				userType: userType,
				requested: req,
				approved: app,
				selected: 1,
			})
		);
	}, [userId, token, userType, req, app]);

	const logout = useCallback(() => {
		setToken(null);
		setUserId(null);
		setUserType(null);
		setReq(0);
		setApp(0);
		setSel(0);
		localStorage.removeItem('auth');
	}, []);

	useEffect(() => {
		async function func() {
			const storedData = await JSON.parse(localStorage.getItem('auth'));
			if (storedData) {
				setReq(storedData.requested);
				login(
					storedData.userId,
					storedData.token,
					storedData.userType,
					storedData.requested,
					storedData.approved,
					storedData.selected
				);
				setToken(storedData.token);
				setUserId(storedData.userId);
				setUserType(storedData.userType);
				setReq(storedData.requested);
				setApp(storedData.approved);
				setSel(storedData.selected);
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
	};
};
