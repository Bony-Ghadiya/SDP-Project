import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import Card from '../shared/components/UIElements/Card';
import Input from '../shared/components/FormElements/Input';
import Button from '../shared/components/FormElements/Button';
import ErrorModal from '../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../shared/hooks/http-hook';
import { AuthContext } from '../shared/context/auth-context';
import { VALIDATOR_MINLENGTH } from '../shared/util/validators';
import { useForm } from '../shared/hooks/form-hook';
import ReactStars from 'react-rating-stars-component';

const Auth = () => {
	const auth = useContext(AuthContext);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [rating, setRating] = useState(5);
	const history = useHistory();

	const [formState, inputHandler] = useForm(
		{
			feedback: {
				value: '',
				isValid: false,
			},
		},
		false
	);

	const placeSubmitHandler = async event => {
		event.preventDefault();
		try {
			// formData.append('title', formState.inputs.title.value);
			console.log(rating, formState.inputs.feedback.value);
			await sendRequest(
				'http://localhost:5000/api/viewplan/finalfeedback',
				'PATCH',
				JSON.stringify({
					userid: auth.userId,
					rating: rating,
					feedback: formState.inputs.feedback.value,
				}),
				{
					'Content-Type': 'application/json',
				}
			);
		} catch (err) {
		} finally {
			auth.endThis();
			history.push('/');
		}
	};

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			<Card className="authentication" style={{ textAlign: 'center' }}>
				{isLoading && <LoadingSpinner asOverlay />}
				<h2>Please Provide Feedback.</h2>
				<hr className="style-line" />
				<form className="place-form" onSubmit={placeSubmitHandler}>
					<div
						style={{
							dispaly: 'inline',
							width: '150px',
							margin: 'auto',
						}}
					>
						<ReactStars
							style={{ dispaly: 'inline', textAlign: 'center' }}
							count={5}
							isHalf={true}
							size={36}
							edit={true}
							value={0}
							activeColor="#fbcd0a"
							onChange={newRating => {
								setRating(newRating);
							}}
						/>
					</div>
					<Input
						id="feedback"
						element="textarea"
						label="Feedback"
						validators={[VALIDATOR_MINLENGTH(5)]}
						errorText="Please enter a valid feedback (at least 5 characters)."
						onInput={inputHandler}
					/>
					<Button type="submit" disabled={!formState.isValid}>
						SUBMIT
					</Button>
				</form>
			</Card>
		</React.Fragment>
	);
};

export default Auth;
