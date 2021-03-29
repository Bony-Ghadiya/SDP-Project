import { makeStyles, withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import React, { useContext, useState } from 'react';
import { Card } from 'react-bootstrap';
import Card1 from '../shared/components/UIElements/Card';
import NumericInput from 'react-numeric-input';
import { useHistory } from 'react-router-dom';
import ErrorModal from '../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../shared/context/auth-context';
import { useHttpClient } from '../shared/hooks/http-hook';
import Countdown from 'react-countdown';

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
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [startTime, setStartTime] = useState('01:00');
	const [endTime, setEndTime] = useState('02:00');
	const [exp, setExp] = useState(0);
	const [ctime, setCtime] = useState(10000);
	const classes = useStyles();
	let temp;

	const waiting = ({ hours, minutes, seconds, completed }) => {
		if (completed) {
			return <div style={{ display: 'none' }}></div>;
		} else {
			if (seconds % 10 === 0) {
				fetch('http://localhost:5000/api/counter/trainers', {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						userid: auth.userId,
					}),
				})
					.then(res => res.json())
					.then(data => {
						if (data.approved === 0) {
							setCtime(ctime + 1000);
						} else if (data.approved === 1) {
							auth.setApproval();
							history.push('/');
						} else if (data.approved === 999) {
							auth.logout();
							history.push('/');
						}
					})
					.catch(err => {
						console.log(err);
					});
			}
			return (
				<div>
					<h3 style={{ margin: '5px 0px', fontSize: '40px', display: 'none' }}>
						{seconds}...
					</h3>
				</div>
			);
		}
	};

	const StartTimeSubmitHandler = event => {
		setStartTime(event.target.value);
	};

	const EndTimeSubmitHandler = event => {
		setEndTime(event.target.value);
	};

	const searchSubmitHandler = async () => {
		console.log(startTime);
		console.log(endTime);
		console.log(exp);
		let responseData;
		try {
			const formData = new FormData();
			formData.append('userid', auth.userId);
			formData.append('startTime', startTime);
			formData.append('endTime', endTime);
			formData.append('experience', exp);
			responseData = await sendRequest(
				'http://localhost:5000/api/trainers/approve',
				'POST',
				JSON.stringify({
					userid: auth.userId,
					startTime: startTime,
					endTime: endTime,
					experience: exp,
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
		setExp(valueAsNumber);
	};
	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			{isLoading && <LoadingSpinner asOverlay />}
			{auth.isRequested === 0 && (
				<div style={{ textAlign: 'center', margin: 'auto' }}>
					<Card
						className="authentication"
						style={{ maxWidth: '400px', margin: 'auto' }}
					>
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
			{auth.isRequested === 1 && (
				<Card1
					className="authentication"
					style={{ margin: 'auto', maxWidth: '33%' }}
				>
					Please wait your status will be updated soon.
					<Countdown date={Date.now() + ctime + 1000} renderer={waiting} />
				</Card1>
			)}
		</React.Fragment>
	);
};
export default ApplyTrainer;
