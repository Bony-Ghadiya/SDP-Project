import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import Card from '../shared/components/UIElements/Card';
import Input from '../shared/components/FormElements/Input';
import Button from '../shared/components/FormElements/Button';
import ErrorModal from '../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';
import { VALIDATOR_MINLENGTH } from '../shared/util/validators';
import { useForm } from '../shared/hooks/form-hook';
import { useHttpClient } from '../shared/hooks/http-hook';

import './Auth.css';

const NewPassword = () => {
	const [isMassage, setIsMassage] = useState(false);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const history = useHistory();
	const { token } = useParams();

	const [formState, inputHandler] = useForm(
		{
			password: {
				value: '',
				isValid: false,
			},
		},
		false
	);

	const newPasswordSubmitHandler = async event => {
		event.preventDefault();

		try {
			const formData = new FormData();
			formData.append('password', formState.inputs.password.value);
			const responseData = await sendRequest(
				'http://localhost:5000/api/users/new-password',
				'POST',
				JSON.stringify({
					password: formState.inputs.password.value,
					token,
				}),
				{
					'Content-Type': 'application/json',
				}
			);
			console.log(responseData);
			setIsMassage(prevMode => !prevMode);
			history.push('/auth');
		} catch (err) {}
	};

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			<Card
				className="authentication"
				style={{ maxWidth: '400px', margin: 'auto' }}
			>
				{isLoading && <LoadingSpinner asOverlay />}
				<form onSubmit={newPasswordSubmitHandler}>
					<h2>Reset password</h2>
					<hr />
					<Input
						element="input"
						id="password"
						type="password"
						label="Password"
						validators={[VALIDATOR_MINLENGTH(6)]}
						errorText="Please enter a valid password, at least 6 characters."
						onInput={inputHandler}
					/>
					<Button type="submit" disabled={!formState.isValid}>
						Reset password
					</Button>
					{isMassage && <h3>Password reset successful!</h3>}
				</form>
			</Card>
		</React.Fragment>
	);
};

export default NewPassword;
