import React, { useState, useContext, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import { Card, Container, Image } from 'react-bootstrap';
import Input from '../shared/components/FormElements/InputUpdate';
import ErrorModal from '../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';
import { VALIDATOR_EMAIL, VALIDATOR_REQUIRE } from '../shared/util/validators';
import { useForm } from '../shared/hooks/form-hook';
import { useHttpClient } from '../shared/hooks/http-hook';
import { AuthContext } from '../shared/context/auth-context';
import ReactStars from 'react-rating-stars-component';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Modal from '../shared/components/UIElements/Modal';
import Button from '../shared/components/FormElements/Button';
import './Auth.css';
import { Dialog, DialogOverlay } from '@reach/dialog';
import '@reach/dialog/styles.css';

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

const Auth = () => {
	const [startTime, setStartTime] = useState('01:00');
	const [endTime, setEndTime] = useState('02:00');
	const classes = useStyles();
	const auth = useContext(AuthContext);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const history = useHistory();
	const [url, setUrl] = useState('');
	const [showDialog, setShowDialog] = React.useState(false);
	const [showWarning, setShowWarning] = React.useState(false);
	const [email, setEmail] = useState('');
	const [name, setName] = useState('');
	const [trainer, setTrainer] = useState();
	const [trainerMode, setTrainerMode] = useState(0);
	const [feedbackMode, setFeedbackMode] = useState(0);
	const open = () => {
		setShowDialog(true);
		setShowWarning(false);
	};
	const close = () => setShowDialog(false);
	const dismiss = () => setShowWarning(true);
	const filePickerRef = useRef();
	const [formState, inputHandler, setFormData] = useForm(
		{
			email: {
				id: 'email',
				value: { email },
				isValid: true,
			},
			name: {
				value: { name },
				isValid: true,
			},
		},
		true
	);

	const StartTimeSubmitHandler = event => {
		setStartTime(event.target.value);
	};

	const EndTimeSubmitHandler = event => {
		setEndTime(event.target.value);
	};

	useEffect(() => {
		const fetchRequests = async () => {
			try {
				const responseData = await sendRequest(
					`http://localhost:5000/api/users/getprofile/${auth.userId}`
				);
				console.log(responseData);
				setEmail(responseData.email);
				setName(responseData.name);
				setUrl(responseData.image);
				setFormData(
					{
						name: {
							value: responseData.name,
							isValid: true,
						},
						email: {
							value: responseData.email,
							isValid: true,
						},
					},
					true
				);
			} catch (err) {}
		};
		fetchRequests();
	}, [sendRequest, auth.userId, setFormData]);

	useEffect(() => {
		const fetchPlaces = async () => {
			if (auth.userType === 'user' && auth.isTrainerSelected === 1) {
				try {
					const responseData = await sendRequest(
						`http://localhost:5000/api/selectTrainer/showtrainer/${auth.userId}`
					);
					setTrainer(responseData.trainer);
				} catch (err) {}
			} else {
				try {
					const responseData = await sendRequest(
						`http://localhost:5000/api/selectTrainer/showtrainer2/${auth.userId}`
					);
					setTrainer(responseData.trainer);
					console.log(responseData.trainer);
				} catch (err) {}
			}
		};
		fetchPlaces();
	}, [sendRequest, auth]);

	const searchSubmitHandler = async () => {
		console.log(startTime);
		console.log(endTime);
		let responseData;
		try {
			const formData = new FormData();
			formData.append('userid', auth.userId);
			formData.append('startTime', startTime);
			formData.append('endTime', endTime);
			responseData = await sendRequest(
				'http://localhost:5000/api/trainers/update',
				'PATCH',
				JSON.stringify({
					userid: auth.userId,
					startTime: startTime,
					endTime: endTime,
				}),
				{
					'Content-Type': 'application/json',
				}
			);
			console.log(responseData);
		} catch (err) {}
	};
	const authSubmitHandler = async event => {
		event.preventDefault();

		try {
			console.log('update');
			console.log(formState.inputs.email.value);
			console.log(formState.inputs.name.value);
			console.log(url);
			console.log(auth.userId);
			const responseData = await sendRequest(
				'http://localhost:5000/api/users/updateprofile',
				'PATCH',
				JSON.stringify({
					name: formState.inputs.name.value,
					email: formState.inputs.email.value,
					image: url,
					uid: auth.userId,
				}),
				{
					'Content-Type': 'application/json',
				}
			);
			console.log(responseData);
			setEmail(responseData.email);
			setName(responseData.name);
			setUrl(responseData.image);
		} catch (err) {}
	};
	const [acceptModal, setAcceptModal] = useState(false);

	const showAcceptWarningHandler = () => {
		setAcceptModal(true);
	};

	const cancelAccepthandler = () => {
		setAcceptModal(false);
	};
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
	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			{trainerMode === 0 && feedbackMode === 0 && (
				<Card
					className="authentication"
					style={{ maxWidth: '400px', margin: 'auto' }}
				>
					{isLoading && <LoadingSpinner asOverlay />}
					<h2>UPDATE PROFILE </h2>
					<hr className="style-line" />

					<Input
						element="input"
						id="name"
						type="text"
						label="Your Name"
						validators={[VALIDATOR_REQUIRE()]}
						errorText="Please enter a name."
						onInput={inputHandler}
						initialValue={name}
						defaultValue={name}
						initialValid={true}
					/>

					<Input
						element="input"
						id="email"
						type="email"
						label="E-Mail"
						validators={[VALIDATOR_EMAIL()]}
						errorText="Please enter a valid email address."
						onInput={inputHandler}
						initialValue={email}
						defaultValue={email}
						initialValid={true}
					/>
					<br />
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
					<button
						style={{ margin: '15px 0' }}
						onClick={event => authSubmitHandler(event)}
						className="button"
						disabled={!formState.isValid}
					>
						UPDATE
					</button>
				</Card>
			)}
			<div style={{ marginTop: '50px' }}>
				<DialogOverlay
					style={{ background: '' }}
					isOpen={showDialog}
					onDismiss={close}
				>
					<Dialog
						className="dialog"
						isOpen={showDialog}
						onDismiss={dismiss}
						style={{
							maxWidth: '250px',
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
							style={{ margin: 'auto 5px', width: '100%', maxWidth: '250px' }}
							onClick={() => {
								setUrl(
									'https://res.cloudinary.com/gymmie/image/upload/v1615744408/users/ikiszyrh3gk8dcxunh2y.png'
								);
								setShowDialog(false);
							}}
						>
							<img
								style={{ width: '100%', maxWidth: '250px' }}
								src="https://res.cloudinary.com/gymmie/image/upload/v1615744408/users/ikiszyrh3gk8dcxunh2y.png"
								alt="profile  pic"
							/>
						</button>

						<br />
						<br />
						<button
							className="button"
							onClick={() => {
								filePickerRef.current.click();
							}}
							style={{ margin: 'auto 5px', width: '100%', maxWidth: '250px' }}
						>
							+ choose another
						</button>
					</Dialog>
				</DialogOverlay>
			</div>

			{trainerMode === 0 && auth.isTrainerSelected === 1 && trainer && (
				<Card
					className="authentication"
					style={{ maxWidth: '400px', textAlign: 'center', margin: 'auto' }}
				>
					{isLoading && <LoadingSpinner asOverlay />}
					<h2>TRAINER DETAILS</h2>
					<hr className="style-line" />
					<h1
						style={{
							fontSize: '26px',
							paddingTop: '10px',
							textAlign: 'left',
							display: 'inline',
							paddingLeft: '10px',
							marginBottom: '10px',
							color: '#4caf50',
						}}
					>
						{trainer.name}
					</h1>
					<br />
					<br />
					<img
						src={trainer.image}
						alt="Preview"
						style={{
							textAlign: 'center',
							width: '200px',
							height: '200px',
							marginBottom: '20px',
							padding: '3px',
							border: '1px solid #4caf50',
							borderRadius: '50%',
						}}
					/>
					<br />
					<button
						style={{ margin: '15px 5px' }}
						onClick={event => {
							setTrainerMode(1);
						}}
						className="button"
					>
						VIEW PROFILE
					</button>
				</Card>
			)}
			{trainerMode === 0 &&
				feedbackMode === 0 &&
				auth.isTrainerApproved === 1 &&
				trainer && (
					<Card
						className="authentication"
						style={{ maxWidth: '400px', textAlign: 'center', margin: 'auto' }}
					>
						{isLoading && <LoadingSpinner asOverlay />}
						<h2>TRAINER PROFILE</h2>
						<hr className="style-line" />
						{trainer && trainer.trainees.length === 0 && (
							<div>
								<form onSubmit={searchSubmitHandler}>
									<h4 style={{ margin: '1rem auto' }}>Select Starting time</h4>
									<div style={{}}>
										<CssTextField
											style={{
												borderBottom: '1px solid #4caf50',
												filter: ' inverse(1)',
											}}
											id="time"
											defaultValue={trainer.startTime}
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
											type="time"
											defaultValue={trainer.endTime}
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
									</div>
								</form>
							</div>
						)}
						{trainer && trainer.trainees.length !== 0 && (
							<div>
								<h3
									style={{
										paddingTop: '10px',
										textAlign: 'left',
										display: 'inline',
										paddingLeft: '10px',
										fontSize: '16px',
										paddingBotton: '10px',
									}}
								>
									{' '}
									Working time:{' '}
								</h3>
								<p
									style={{
										paddingTop: '10px',
										textAlign: 'left',
										display: 'inline',
										fontSize: '16px',
										paddingBotton: '10px',
									}}
								>
									{trainer.startTime}
									{' to '}
									{trainer.endTime}
								</p>

								<br />
							</div>
						)}
						<h3 style={{ margin: 0 }}>Rating:</h3>
						<div
							style={{
								width: '150px',
								margin: 'auto',
							}}
						>
							<ReactStars
								style={{ dispaly: 'inline' }}
								count={5}
								isHalf={true}
								size={36}
								edit={false}
								value={trainer.rating}
								activeColor="#fbcd0a"
							/>
						</div>
						<Card.Footer
							style={{
								marginBottom: '13px',
							}}
						>
							{trainer.feedback.length !== 0 && (
								<input
									style={{ margin: '15px 5px' }}
									type="button"
									className="button"
									value="VIEW FEEDBACK"
									onClick={() => setFeedbackMode(1)}
								/>
							)}
							{trainer.feedback.length !== 0 && <br></br>}

							{trainer && trainer.trainees.length === 0 && (
								<input
									className="button"
									type="button"
									onClick={searchSubmitHandler}
									value="UPDATE"
								/>
							)}
							<br></br>
						</Card.Footer>
					</Card>
				)}

			{trainerMode === 1 && feedbackMode === 0 && trainer && (
				<Container>
					<Card
						className="authentication"
						style={{
							maxWidth: '500px',
							margin: 'auto',
							color: 'white',
							marginBottom: '50px',
							padding: '0 10px',
						}}
					>
						<Card.Header
							as="h2"
							style={{
								marginTop: '0px',
								borderBottom: '1px solid black',
								padding: '10px 0',
								backgroundColor: 'none',
							}}
						>
							{trainer.name}
						</Card.Header>
						<hr></hr>
						<Image
							src={trainer.image}
							alt={trainer.name}
							style={{
								width: '200px',
								height: '200px',
								marginBottom: '20px',
								padding: '3px',
								border: '1px solid #4caf50',
								borderRadius: '50%',
							}}
							fluid
						/>
						<div>
							<h4
								style={{
									paddingTop: '10px',
									textAlign: 'left',
									display: 'inline',
									paddingLeft: '10px',
									fontSize: '16px',
									paddingBotton: '10px',
									color: '#4caf50',
								}}
							>
								{' '}
								Working time:{' '}
							</h4>
							<p
								style={{
									paddingTop: '10px',
									textAlign: 'left',
									display: 'inline',
									fontSize: '16px',
									paddingBotton: '10px',
								}}
							>
								{trainer.startTime}
								{' to '}
								{trainer.endTime}
							</p>
						</div>
						<br />
						<div>
							<h4
								style={{
									paddingTop: '5px',
									textAlign: 'left',
									display: 'inline',
									paddingLeft: '10px',
									fontSize: '16px',
									paddingBotton: '10px',
									color: '#4caf50',
								}}
							>
								{'Exprience: '}
							</h4>
							<p
								style={{
									paddingTop: '5px',
									textAlign: 'left',
									display: 'inline',
									fontSize: '16px',
									paddingBotton: '10px',
								}}
							>
								{trainer.experience}{' '}
								{trainer.experience === 1 ? 'year' : 'years'}
							</p>
						</div>
						<br />

						<div
							style={{
								dispaly: 'inline',
								width: '150px',
								margin: 'auto',
							}}
						>
							<ReactStars
								style={{ dispaly: 'inline' }}
								count={5}
								isHalf={true}
								size={36}
								edit={false}
								value={trainer.rating}
								activeColor="#fbcd0a"
							/>
						</div>

						<Card.Footer
							style={{
								marginBottom: '13px',
							}}
						>
							{trainer.feedback.length !== 0 && (
								<input
									style={{ margin: '15px 5px' }}
									type="button"
									className="button"
									value="VIEW FEEDBACK"
									onClick={() => setFeedbackMode(1)}
								/>
							)}
							{trainer.feedback.length !== 0 && <br></br>}
							<input
								type="button"
								className="button"
								value="BACK"
								onClick={() => setTrainerMode(0)}
							/>
							<br></br>

							<Button
								danger
								style={{ margin: '15px 5px' }}
								onClick={event => {
									showAcceptWarningHandler();
								}}
								className="button"
							>
								REMOVE TRAINER
							</Button>
						</Card.Footer>
					</Card>
				</Container>
			)}
			{feedbackMode === 1 && (
				<div style={{}}>
					{!isLoading && trainer && (
						<Container>
							<Card
								className="authentication"
								style={{
									maxWidth: '500px',
									margin: 'auto',
									color: 'white',
									marginBottom: '50px',
									padding: '0 10px',
								}}
							>
								{!isLoading && trainer && (
									<Card.Header
										as="h2"
										style={{
											marginTop: '0px',
											borderBottom: '1px solid black',
											padding: '10px 0',
											backgroundColor: 'none',
										}}
									>
										{trainer.name}
									</Card.Header>
								)}

								<hr></hr>

								{!isLoading && trainer && (
									<Image
										src={trainer.image}
										alt={trainer.name}
										style={{
											width: '150px',
											height: '150px',
											marginBottom: '20px',
											padding: '3px',
											border: '1px solid #4caf50',
											borderRadius: '50%',
										}}
										fluid
									/>
								)}

								{!isLoading && trainer && trainer.feedback.length !== 0 && (
									<div style={{ textAlign: 'left' }}>
										<h4
											style={{
												paddingTop: '5px',
												textAlign: 'left',
												display: 'inline',
												paddingLeft: '10px',
												fontSize: '16px',
												paddingBotton: '10px',
												color: '#4caf50',
												width: '30%',
											}}
										>
											Feedback :
										</h4>
									</div>
								)}
								{!isLoading &&
									trainer &&
									trainer.feedback.map(feed => (
										<li
											style={{
												display: 'list-item',
												margin: '5px',
												textAlign: 'left',
											}}
										>
											{feed}
										</li>
									))}
								{!isLoading && trainer && (
									<Card.Footer
										style={{
											marginBottom: '13px',
										}}
									>
										<input
											type="button"
											className="button"
											value="BACK"
											onClick={() => setFeedbackMode(0)}
										/>
									</Card.Footer>
								)}
							</Card>
						</Container>
					)}
				</div>
			)}
			{trainer && (
				<Modal
					show={acceptModal}
					onCancel={cancelAccepthandler}
					header="Are you sure?"
					footerClass="place-item__modal-actions"
					footer={
						<React.Fragment>
							<Button
								style={{ marginLeft: '15px' }}
								danger
								onClick={cancelAccepthandler}
							>
								CANCEL
							</Button>
							<Button
								style={{ marginLeft: '15px' }}
								inverse
								onClick={async e => {
									e.preventDefault();
									history.push('/feedback');
								}}
							>
								Accept
							</Button>
						</React.Fragment>
					}
				>
					<p>You want to remove {trainer.name} ?</p>
				</Modal>
			)}
		</React.Fragment>
	);
};

export default Auth;
