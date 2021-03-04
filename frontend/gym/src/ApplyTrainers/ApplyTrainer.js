import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import React, { useContext, useState } from 'react';
import { Card } from 'react-bootstrap';
import NumericInput from 'react-numeric-input';
import { useHistory } from 'react-router-dom';
import ErrorModal from '../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../shared/context/auth-context';
import { useHttpClient } from '../shared/hooks/http-hook';


const useStyles = makeStyles(theme => ({
	container: {
		display: 'flex',
		flexWrap: 'wrap',
		color:"red",
	},
	textField: {
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		width: 200,
		color:"red",
		'&::placeholder': {
			color: 'white'
		  }
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
						<form onSubmit={searchSubmitHandler}>
							<h4 style={{ margin: '1rem auto' }}>Select Starting time</h4>
							<div style={{backgroundColor:"gray"}} >
							<TextField
								style={{color:"red"}}
								id="time"
	
								label="Starting Time"
								type="time"
								color="white"
								value={temp}
								defaultValue="01:00"
								className={classes.textField}
								InputLabelProps={{
									shrink: true,
									style:{color:"white"}
								}}
								inputProps={{
									step: 300, // 5 min
									style:{color:"white"}
								}}
								style={{
									backgroundColor: 'white',
								}}
								InputProps={{
									style: {
										color: 'white',
									},
								}}
								onChange={StartTimeSubmitHandler}
							/>
							
							<br />
							<h4 style={{ margin: '1rem auto' }}>Select Ending time</h4>
							<TextField
								id="time"
								label="Ending Time"
								value={temp}
								type="time"
								defaultValue="02:00"
								className={classes.textField}
								InputLabelProps={{
									shrink: true,
									style:{color:"white"}
								}}
								inputProps={{
									step: 300, // 5 min
									style:{color:"white"}
								}}
								onChange={EndTimeSubmitHandler}
							/>
							<br />
							<h4 style={{ margin: '1rem auto' }}>Select Your Experience</h4>
							<NumericInput
								style={{
									input: {
										width: '204px',
										background:'none',
										borderTop: '0px',
										borderLeft: '0px',
										borderRight: '0px',
										borderBottom: '1px solid black',
										paddingBottom: '3px',
										paddingTop: '3px',
										backgroundColor: 'black',
										color: 'white',
									},
								}}
								min={0}
								max={100}
								value={0}
								onChange={ExpChangeHandler}
							/>
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
