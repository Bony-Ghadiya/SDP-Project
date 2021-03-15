import React, { useRef, useState, useContext } from 'react';
import { useHistory, Link } from 'react-router-dom';

import Card from '../shared/components/UIElements/Card';
import Input from '../shared/components/FormElements/Input';
import Button from '../shared/components/FormElements/Button';
import ErrorModal from '../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';
import {
	VALIDATOR_EMAIL,
	VALIDATOR_MINLENGTH,
	VALIDATOR_REQUIRE,
} from '../shared/util/validators';
import { useForm } from '../shared/hooks/form-hook';
import { useHttpClient } from '../shared/hooks/http-hook';
import { AuthContext } from '../shared/context/auth-context';
import './Auth.css';
import { Dialog, DialogOverlay } from '@reach/dialog';
import '@reach/dialog/styles.css';

const Auth = () => {
	const auth = useContext(AuthContext);
	const [showDialog, setShowDialog] = React.useState(false);
	const [showWarning, setShowWarning] = React.useState(false);
	const open = () => {
		setShowDialog(true);
		setShowWarning(false);
	};
	const close = () => setShowDialog(false);
	const dismiss = () => setShowWarning(true);
	const [isLoginMode, setIsLoginMode] = useState(true);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [userType, setUserType] = useState('user');
	const [url, setUrl] = useState('a');
	const history = useHistory();
	const filePickerRef = useRef();
	const [formState, inputHandler, setFormData] = useForm(
		{
			email: {
				value: '',
				isValid: false,
			},
			password: {
				value: '',
				isValid: false,
			},
		},
		false
	);

	const postDetails = async e => {
		const data = new FormData();
		data.append('file', e.target.files[0]);
		data.append('upload_preset', 'home-exercise-planner');
		data.append('cloud_name', 'gymmie');

		let responseData;
		try {
			responseData = await sendRequest(
				'https://api.cloudinary.com/v1_1/gymmie/image/upload',
				'POST',
				data
			);
			console.log(responseData);
		} catch (err) {
		} finally {
			console.log(responseData.url);
			setUrl(responseData.url);
			setShowDialog(false);
		}
	};

	const switchModeHandler = () => {
		if (!isLoginMode) {
			setFormData(
				{
					...formState.inputs,
					name: undefined,
					image: undefined,
				},
				formState.inputs.email.isValid && formState.inputs.password.isValid
			);

			setUrl('a');
		} else {
			setFormData(
				{
					...formState.inputs,
					name: {
						value: '',
						isValid: false,
					},
				},
				false
			);
			setUrl('');
		}
		setIsLoginMode(prevMode => !prevMode);
	};

	const userChangeHandler = event => {
		setUserType('user');
	};

	const trainerChangeHandler = event => {
		setUserType('trainer');
	};
	const authSubmitHandler = async event => {
		event.preventDefault();

		if (isLoginMode) {
			try {
				const responseData = await sendRequest(
					'http://localhost:5000/api/users/login',
					'POST',
					JSON.stringify({
						email: formState.inputs.email.value,
						password: formState.inputs.password.value,
					}),
					{
						'Content-Type': 'application/json',
					}
				);
				console.log(responseData);
				auth.login(
					responseData.userId,
					responseData.token,
					responseData.userType,
					responseData.requested,
					responseData.approved,
					responseData.selected,
					responseData.given,
					responseData.complated
				);
				if (userType === 'user') {
					history.push('/homeuser');
				} else {
					history.push('/hometrainer');
				}
			} catch (err) {}
		} else {
			try {
				const formData = new FormData();
				formData.append('email', formState.inputs.email.value);
				formData.append('name', formState.inputs.name.value);
				formData.append('password', formState.inputs.password.value);
				formData.append('image', url);
				formData.append('userType', userType);
				const responseData = await sendRequest(
					'http://localhost:5000/api/users/signup',
					'POST',
					formData
				);
				console.log(responseData);
				auth.login(
					responseData.userId,
					responseData.token,
					responseData.userType,
					responseData.requested,
					responseData.approved,
					responseData.selected,
					responseData.given,
					responseData.complated
				);
				if (userType === 'user') {
					history.push('/homeuser');
				} else {
					history.push('/hometrainer');
				}
			} catch (err) {}
		}
	};

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			<Card className="authentication">
				{isLoading && <LoadingSpinner asOverlay />}
				<h2>{!isLoginMode ? 'SIGNUP' : 'LOGIN'}</h2>
				<hr className="style-line" />
				<form onSubmit={authSubmitHandler}>
					{!isLoginMode && (
						<Input
							element="input"
							id="name"
							type="text"
							label="Your Name"
							validators={[VALIDATOR_REQUIRE()]}
							errorText="Please enter a name."
							onInput={inputHandler}
						/>
					)}
					<Input
						element="input"
						id="email"
						type="email"
						label="E-Mail"
						validators={[VALIDATOR_EMAIL()]}
						errorText="Please enter a valid email address."
						onInput={inputHandler}
					/>
					<Input
						element="input"
						id="password"
						type="password"
						label="Password"
						validators={[VALIDATOR_MINLENGTH(6)]}
						errorText="Please enter a valid password, at least 6 characters."
						onInput={inputHandler}
					/>
					{!isLoginMode && (
						<div style={{ margin: '0' }}>
							<div style={{ margin: '0' }}>
								<input
									ref={filePickerRef}
									style={{ display: 'none' }}
									type="file"
									accept=".jpg,.png,.jpeg"
									onChange={e => {
										postDetails(e);
									}}
								/>
							</div>
							<div className="image-upload center">
								<div className="image-upload__preview1">
									{!url && <p>Please pick an image.</p>}
									{url && <img src={url} alt="Preview" />}
								</div>
							</div>
							<button
								className="button"
								style={{ margin: '0' }}
								onClick={e => {
									e.preventDefault();
									open();
								}}
							>
								PICK IMAGE
							</button>
							{!url && <p>Please provide an image.</p>}
						</div>
					)}
					{!isLoginMode && (
						<div className="RadioButton">
							<label className="RadioBu">
								Register as a TRAINEE
								<input
									type="radio"
									name="type"
									value="user"
									onChange={userChangeHandler}
									checked={userType === 'user'}
								/>
								<span className="checkmark"></span>
							</label>

							<label className="RadioBu">
								{' '}
								Register as a TRAINER
								<input
									type="radio"
									name="type"
									value="trainer"
									onChange={trainerChangeHandler}
								/>
								<span className="checkmark"></span>
							</label>
						</div>
					)}

					<br />
					<Button type="submit" disabled={!formState.isValid || !url}>
						{isLoginMode ? 'LOGIN' : 'SIGNUP'}
					</Button>
				</form>

				<Button inverse onClick={switchModeHandler}>
					SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
				</Button>
				<br />
				<br />
				{isLoginMode && (
					<h4>
						<Link style={{ textDecoration: 'none' }} to="/reset">
							Forgot password ?
						</Link>
					</h4>
				)}
			</Card>
			<div style={{ marginTop: '50px' }}>
				<DialogOverlay
					style={{ background: '' }}
					isOpen={showDialog}
					onDismiss={close}
				>
					<Dialog
						isOpen={showDialog}
						onDismiss={dismiss}
						style={{
							width: '40%',
							marginTop: '50px !important',
							background: 'black',
							textAlign: 'center',
						}}
					>
						{showWarning && (
							<p style={{ color: 'red' }}>You must make a choice, sorry :(</p>
						)}
						<h4 style={{ color: 'white' }}>Please choose profile pic</h4>
						<hr />
						<button
							className="default-pic"
							style={{ margin: 'auto 5px', width: '150px' }}
							onClick={() => {
								setUrl(
									'https://res.cloudinary.com/gymmie/image/upload/v1615744408/users/ikiszyrh3gk8dcxunh2y.png'
								);
								setShowDialog(false);
							}}
						>
							<img
								src="https://res.cloudinary.com/gymmie/image/upload/v1615744408/users/ikiszyrh3gk8dcxunh2y.png"
								alt="profile  pic"
							/>
						</button>

						<br />
						<br />
						<button
							className="default-pic-addanother"
							onClick={() => {
								filePickerRef.current.click();
							}}
							style={{ margin: 'auto 5px', width: '150px' }}
						>
							+ choose another
						</button>
					</Dialog>
				</DialogOverlay>
			</div>
		</React.Fragment>
	);
};

export default Auth;
