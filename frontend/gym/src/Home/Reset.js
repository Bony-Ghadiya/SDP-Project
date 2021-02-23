import React, { useState } from 'react';

import Card from '../shared/components/UIElements/Card';
import MainNavigation from '../shared/components/Navigation/MainNavigation';
import Input from '../shared/components/FormElements/Input';
import Button from '../shared/components/FormElements/Button';
import ErrorModal from '../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';
import { VALIDATOR_EMAIL } from '../shared/util/validators';
import { useForm } from '../shared/hooks/form-hook';
import { useHttpClient } from '../shared/hooks/http-hook';
import './Auth.css';

const Reset = () => {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [isMassage, setIsMassage] = useState(false);

	const [formState, inputHandler] = useForm(
		{
			email: {
				value: '',
				isValid: false,
			},
		},
		false
	);

	const resetSubmitHandler = async event => {
		event.preventDefault();

		try {
			const formData = new FormData();
			formData.append('email', formState.inputs.email.value);
			const responseData = await sendRequest(
				'http://localhost:5000/api/users/reset-password',
				'POST',
				JSON.stringify({
					email: formState.inputs.email.value,
				}),
				{
					'Content-Type': 'application/json',
				}
			);
			console.log(responseData);
			setIsMassage(prevMode => !prevMode);
			console.log(responseData);
		} catch (err) {}
	};

	return (
		<React.Fragment>
			<MainNavigation />
			<ErrorModal error={error} onClear={clearError} />
			<Card className="authentication">
				{isLoading && <LoadingSpinner asOverlay />}
				<form onSubmit={resetSubmitHandler}>
					<h2>Forget password</h2>
					<hr />
					<Input
						element="input"
						id="email"
						type="email"
						label="E-Mail"
						validators={[VALIDATOR_EMAIL()]}
						errorText="Please enter a valid email address."
						onInput={inputHandler}
					/>

					<Button type="submit" disabled={!formState.isValid}>
						Reset password
					</Button>
					{isMassage && <h3>Mail has been sent!</h3>}
				</form>
			</Card>
		</React.Fragment>
	);
};

export default Reset;
