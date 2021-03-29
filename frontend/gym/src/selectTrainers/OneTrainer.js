import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import { AuthContext } from '../shared/context/auth-context';
import ErrorModal from '../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../shared/hooks/http-hook';
import Modal from '../shared/components/UIElements/Modal';
import Button from '../shared/components/FormElements/Button';
import { Container, Card, Image } from 'react-bootstrap';
import ReactStars from 'react-rating-stars-component';

const OneTrainer = props => {
	const auth = useContext(AuthContext);
	const history = useHistory();
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [trainer, setTrainer] = useState();
	const [flag, setFlag] = useState(false);
	const [feedback, viewFeedback] = useState(false);
	const tid = useParams().tid;

	useEffect(() => {
		const fetchPlaces = async () => {
			try {
				const responseData = await sendRequest(
					`http://localhost:5000/api/selectTrainer/select/${tid}`
				);
				setFlag(true);
				setTrainer(responseData.trainer);
			} catch (err) {}
		};
		fetchPlaces();
	}, [sendRequest, tid]);
	const [acceptModal, setAcceptModal] = useState(false);

	const showAcceptWarningHandler = () => {
		setAcceptModal(true);
	};

	const cancelAccepthandler = () => {
		setAcceptModal(false);
	};

	if (!flag && !isLoading) {
		return (
			<div className="center">
				<Card>
					<h2>No Exercises Found.</h2>
				</Card>
			</div>
		);
	} else {
		return (
			<React.Fragment>
				<ErrorModal error={error} onClear={clearError} />
				{isLoading && (
					<div className="center">
						<LoadingSpinner />
					</div>
				)}
				{!feedback && (
					<div style={{ textAlign: 'center' }}>
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
												width: '200px',
												height: '200px',
												marginBottom: '20px',
												padding: '3px',
												border: '1px solid #4caf50',
												borderRadius: '50%',
											}}
											fluid
										/>
									)}
									{!isLoading && trainer && (
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
													width: '30%',
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
									)}
									<br />
									{!isLoading && trainer && (
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
													width: '30%',
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
									)}
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

									<br></br>
									{!isLoading && trainer && (
										<Card.Footer
											style={{
												marginBottom: '13px',
											}}
										>
											{trainer.feedback.length !== 0 && (
												<input
													type="button"
													className="button"
													value="VIEW FEEDBACK"
													onClick={() => viewFeedback(true)}
												/>
											)}
											{trainer.feedback.length !== 0 && <br></br>}
											{trainer.feedback.length !== 0 && <br></br>}
											<input
												type="button"
												className="button"
												value="SELECT"
												onClick={showAcceptWarningHandler}
											/>
										</Card.Footer>
									)}
									{!isLoading && trainer && (
										<Modal
											show={acceptModal}
											onCancel={cancelAccepthandler}
											header="Are you sure?"
											footerClass="place-item__modal-actions"
											footer={
												<React.Fragment>
													<Button
														style={{ marginLeft: '15px !important' }}
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
															try {
																const responseData = await sendRequest(
																	`http://localhost:5000/api/selectTrainer/select/accept`,
																	'PATCH',
																	JSON.stringify({
																		userid: auth.userId,
																		trainerid: trainer.id,
																	}),
																	{
																		'Content-Type': 'application/json',
																	}
																);
																console.log(responseData);
															} catch (err) {
															} finally {
																console.log(auth.userId);
																setAcceptModal(false);
																auth.setSelection();
																history.push('/');
															}
														}}
													>
														Accept
													</Button>
												</React.Fragment>
											}
										>
											<p>You want to select {trainer.name} as your trainer?</p>
										</Modal>
									)}
								</Card>
							</Container>
						)}
					</div>
				)}
				{feedback && (
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
												onClick={() => viewFeedback(false)}
											/>
										</Card.Footer>
									)}
								</Card>
							</Container>
						)}
					</div>
				)}
			</React.Fragment>
		);
	}
};

export default OneTrainer;
