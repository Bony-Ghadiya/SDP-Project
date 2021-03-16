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
import Modal from '../shared/components/UIElements/Modal';
import Button from '../shared/components/FormElements/Button';
import './Auth.css';
import { Dialog, DialogOverlay } from '@reach/dialog';
import '@reach/dialog/styles.css';

const Auth = () => {
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
			}
		};
		fetchPlaces();
	}, [sendRequest, auth]);

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
			{trainerMode === 0 && (
				<Card className="authentication">
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
							className="button"
							onClick={() => {
								filePickerRef.current.click();
							}}
							style={{ margin: 'auto 5px', width: '241px' }}
						>
							+ choose another
						</button>
					</Dialog>
				</DialogOverlay>
			</div>

			{trainerMode === 0 && auth.isTrainerSelected === 1 && trainer && (
				<Card className="authentication">
					{isLoading && <LoadingSpinner asOverlay />}
					<h2>TRAINER DETAILS</h2>
					<hr className="style-line" />
					<h4>{trainer.name}</h4>
					<div className="image-upload center">
						<div className="image-upload__preview1">
							<img src={trainer.image} alt="Preview" />
						</div>
					</div>
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
			{trainerMode === 1 && trainer && (
				<Container>
					<Card
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
						<Image
							src={trainer.image}
							alt={trainer.name}
							style={{
								width: '200px',
								height: '200px',
								marginBottom: '20px',
								padding: '3px',
								border: '1px solid black',
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
						{trainer.feedback.length !== 0 && (
							<div>
								<h3>Feedback : </h3>
							</div>
						)}
						{trainer.feedback.map(feed => (
							<li style={{ display: 'list-item', margin: '5px' }}>{feed}</li>
						))}
						<Card.Footer
							style={{
								marginBottom: '13px',
							}}
						>
							<input
								type="button"
								className="button"
								value="BACK"
								onClick={() => setTrainerMode(0)}
							/>
							<button
								style={{ margin: '15px 5px' }}
								onClick={event => {
									showAcceptWarningHandler();
								}}
								className="button"
							>
								REMOVE TRAINER
							</button>
						</Card.Footer>
					</Card>
				</Container>
			)}
			{trainer && (
				<Modal
					show={acceptModal}
					onCancel={cancelAccepthandler}
					header="Are you sure?"
					footerClass="place-item__modal-actions"
					footer={
						<React.Fragment>
							<Button inverse onClick={cancelAccepthandler}>
								CANCEL
							</Button>
							<Button
								danger
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
