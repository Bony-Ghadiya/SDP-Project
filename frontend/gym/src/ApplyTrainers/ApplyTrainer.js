import { makeStyles, withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import React, { useContext, useState } from 'react';
import { Card } from 'react-bootstrap';
import NumericInput from 'react-numeric-input';
import { useHistory } from 'react-router-dom';
import ErrorModal from '../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../shared/context/auth-context';
import { useHttpClient } from '../shared/hooks/http-hook';

const CssTextField = withStyles({
	root: {
		'& .MuiInput-underline:after': {
			borderBottomColor: '#4caf50',
		},
		'& .MuiOutlinedInput-root': {
			'& fieldset': {
				borderColor: 'white',
			},
			'&:hover fieldset': {
				borderColor: 'white',
			},
			'&.Mui-focused fieldset': {
				borderColor: '#4caf50',
			},
		},
		'& .MuiInputLabel-formControl': {
			color: '#4caf50',
		},
	},
})(TextField);

const useStyles = makeStyles(theme => ({
	container: {
		display: 'flex',
		flexWrap: 'wrap',
		color: 'red',
	},
	textField: {
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		width: 200,
		color: 'red',
		'&::placeholder': {
			color: 'white',
		},
	},
	outlinedRoot: {
		'&:hover': {
			border: '1px solid red',
		},
	},
}));

const ApplyTrainer = () => {
	const history = useHistory();
	const auth = useContext(AuthContext);
	let Exp = 0;
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [startTime, setStartTime] = useState('01:00');
	const [endTime, setEndTime] = useState('02:00');
	const classes = useStyles();
	let temp;

	const StartTimeSubmitHandler = event => {
		setStartTime(event.target.value);
	};

	const EndTimeSubmitHandler = event => {
		setEndTime(event.target.value);
	};

	const searchSubmitHandler = async () => {
		console.log(startTime);
		console.log(endTime);
		console.log(Exp);
		let responseData;
		try {
			const formData = new FormData();
			formData.append('userid', auth.userId);
			formData.append('startTime', startTime);
			formData.append('endTime', endTime);
			formData.append('experience', Exp);
			responseData = await sendRequest(
				'http://localhost:5000/api/trainers/approve',
				'POST',
				JSON.stringify({
					userid: auth.userId,
					startTime: startTime,
					endTime: endTime,
					experience: Exp,
				}),
				{
					'Content-Type': 'application/json',
				}
			);
			console.log(responseData);
		} catch (err) {
		} finally {
			if (responseData.existingUser.requested === 1) {
				auth.setRequested();
				console.log(auth.isRequested);
			}

			history.push('/applytrainer');
		}
	};

	const ExpChangeHandler = valueAsNumber => {
		Exp = valueAsNumber;
		console.log(Exp);
	};
	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			{isLoading && <LoadingSpinner asOverlay />}
			{!auth.isRequested && (
				<div style={{ textAlign: 'center', width: '500px', margin: 'auto' }}>
					<Card>
						<h2 style={{}}>Select Data</h2>
						<hr />
						<h4 style={{ margin: '1rem auto' }}>Select Your Experience</h4>
						<NumericInput
							required
							style={{
								wrap: {
									borderRadius: '6px 3px 3px 6px',
									border: '2px solid #4caf50',
								},
								input: {
									border: '1px solid #4caf50',
									width: '204px',
									background: 'transparent',
									color: 'white',
									borderTop: '0px',
									borderLeft: '0px',
									borderRight: '0px',
									borderBottom: '0px',
								},
								'input:focus': {
									border: '1px inset #4caf50',
									outline: 'none',
								},
								'input:active': {
									border: '1px inset #4caf50',
									outline: 'none',
								},
								arrowUp: {
									padding: '0',
									borderBottomColor: '#4caf50',
								},
								arrowDown: {
									borderTopColor: '#4caf50',
								},
							}}
							min={0}
							max={100}
							onChange={ExpChangeHandler}
						/>
						<br />
						<form onSubmit={searchSubmitHandler}>
							<h4 style={{ margin: '1rem auto' }}>Select Starting time</h4>
							<div style={{}}>
								<CssTextField
									style={{
										borderBottom: '1px solid #4caf50',
										filter: ' inverse(1)',
									}}
									id="time"
									value={temp}
									defaultValue="01:00"
									type="time"
									label="Starting Time"
									className={classes.textField}
									InputLabelProps={{
										shrink: true,
										style: { color: '#4caf50' },
									}}
									inputProps={{
										step: 300, // 5 min
										style: { color: 'white' },
									}}
									InputProps={{
										style: {
											color: 'white',
											'&:hover': {
												border: '1px solid red',
											},
										},
										outlinedRoot: {
											'&:hover': {
												border: '1px solid red',
											},
										},
									}}
									onChange={StartTimeSubmitHandler}
								/>

								<br />
								<h4 style={{ margin: '1rem auto' }}>Select Ending time</h4>
								<CssTextField
									style={{ borderBottom: '1px solid #4caf50' }}
									id="time"
									label="Ending Time"
									value={temp}
									type="time"
									defaultValue="02:00"
									className={classes.textField}
									onChange={EndTimeSubmitHandler}
									InputLabelProps={{
										shrink: true,
										style: { color: '#4caf50' },
									}}
									inputProps={{
										step: 300, // 5 min
										style: { color: 'white' },
									}}
									InputProps={{
										style: {
											color: 'white',
											'&:hover': {
												border: '1px solid red',
											},
										},
										outlinedRoot: {
											'&:hover': {
												border: '1px solid red',
											},
										},
									}}
								/>

								<br />

								<br />
								<br />
								<input
									className="button"
									type="button"
									onClick={searchSubmitHandler}
									value="Submit"
								/>
							</div>
						</form>
					</Card>
				</div>
			)}
			{auth.isRequested && 'Please wait your status will be updated soon.'}
		</React.Fragment>
	);
};
export default ApplyTrainer;
/*<TextField
									id="time"
									label="Starting Time"
									type="time"
									value={temp}
									defaultValue="01:00"
									InputLabelProps={{
										shrink: true,
										style: { color: 'white' },
									}}
									inputProps={{
										step: 300, // 5 min
										style: { color: 'white' },
									}}
									InputProps={{
										style: {
											color: 'white',
											'&:hover': {
												border: '1px solid red',
											},
										},
										outlinedRoot: {
											'&:hover': {
												border: '1px solid red',
											},
										},
									}}
									onChange={StartTimeSubmitHandler}
								/>
								<TextField
									id="time"
									label="Ending Time"
									value={temp}
									type="time"
									defaultValue="02:00"
									className={classes.textField}
									InputLabelProps={{
										shrink: true,
										style: { color: 'white' },
									}}
									inputProps={{
										step: 300, // 5 min
										style: { color: 'white' },
									}}
									onChange={EndTimeSubmitHandler}
								/>
*/
