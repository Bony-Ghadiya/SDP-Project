import React, { useState, useContext } from 'react';
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
import { TraineeContext } from '../shared/context/trainee-context';
import { TrainerContext } from '../shared/context/trainer-context';
import ImageUpload from '../shared/components/FormElements/ImageUpload';
import './Auth.css';

const Auth = () => {
	const auth = useContext(AuthContext);
	const tec = useContext(TraineeContext);
	const trc = useContext(TrainerContext);
	const [isLoginMode, setIsLoginMode] = useState(true);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [userType, setUserType] = useState('user');
	const history = useHistory();

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
		} else {
			setFormData(
				{
					...formState.inputs,
					name: {
						value: '',
						isValid: false,
					},
					image: {
						value: null,
						isValid: false,
					},
				},
				false
			);
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
					responseData.selected
				);
				// localStorage.setItem('auth', JSON.stringify(responseData));
				tec.setSelection();
				trc.setApproval();
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
				formData.append('image', formState.inputs.image.value);
				formData.append('userType', userType);
				console.log(formState.inputs);
				const responseData = await sendRequest(
					'http://localhost:5000/api/users/signup',
					'POST',
					formData
				);
				console.log('signup');
				auth.login(
					responseData.userId,
					responseData.token,
					responseData.userType,
					responseData.requested,
					responseData.approved,
					responseData.selected
				);

				tec.setSelection();
				trc.setApproval();
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
						<ImageUpload
							center
							id="image"
							onInput={inputHandler}
							errorText="Please provide an image."
						/>
					)}
					{!isLoginMode && (
						<div className="RadioButton">
							<label>Register as a User :</label>
							<input
								type="radio"
								name="type"
								value="user"
								onChange={userChangeHandler}
								checked={userType === 'user'}
							/>
							<br />
							<label>Register as a trainer :</label>
							<input
								type="radio"
								name="type"
								value="trainer"
								onChange={trainerChangeHandler}
							/>
						</div>
					)}
					<br />
					<Button type="submit" disabled={!formState.isValid}>
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
		</React.Fragment>
	);
};

export default Auth;
