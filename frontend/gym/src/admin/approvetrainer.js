import React, { useState, useEffect, useContext } from 'react';
import ErrorModal from '../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';
import Modal from '../shared/components/UIElements/Modal';
import Button from '../shared/components/FormElements/Button';
import Card1 from '../shared/components/UIElements/Card';
import { useHttpClient } from '../shared/hooks/http-hook';
import { AuthContext } from '../shared/context/auth-context';
import Countdown from 'react-countdown';

import { Container, Card, Image } from 'react-bootstrap';

import './TrainerList.css';

const Home = () => {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const auth = useContext(AuthContext);
	const [ctime, setCtime] = useState(15000);
	const [acceptModal, setAcceptModal] = useState(false);
	const [showConfirmModal, setShowConfirmModal] = useState(false);

	const [trainer, setTrainer] = useState();
	useEffect(() => {
		const fetchRequests = async () => {
			try {
				const responseData = await sendRequest(
					`http://localhost:5000/api/admin/approvetrainers`
				);

				setTrainer(responseData.trainers);
			} catch (err) {}
		};
		fetchRequests();
	}, [sendRequest]);

	const waiting = ({ hours, minutes, seconds, completed }) => {
		if (completed) {
			return <div style={{ display: 'none' }}></div>;
		} else {
			if (seconds === 10) {
				fetch('http://localhost:5000/api/admin/approvetrainers', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				})
					.then(res => res.json())
					.then(data => {
						setTrainer(data.trainers);
					})
					.catch(err => {
						setCtime(15000);
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
	const showAcceptWarningHandler = () => {
		setAcceptModal(true);
	};

	const cancelAccepthandler = () => {
		setAcceptModal(false);
	};

	const showDeleteWarningHandler = () => {
		setShowConfirmModal(true);
	};

	const cancelDeleteHandler = () => {
		setShowConfirmModal(false);
	};

	if (trainer && trainer.length === 0 && !isLoading) {
		return (
			<div className="center">
				<Card1>
					<h2>No Requests Found.</h2>
				</Card1>
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
				{!isLoading && trainer && (
					<ul
						className="users-list"
						style={{ paddingLeft: ' 30px', paddingRight: ' 30px' }}
					>
						{trainer.map(t => (
							<Container>
								<Countdown
									date={Date.now() + ctime + 2000}
									renderer={waiting}
								/>
								<Card
									border="primary"
									style={{
										maxWidth: '18rem',
										padding: '0px',
										margin: 'auto ',
										color: 'white',
										maxheight: '40rem',
									}}
								>
									<Card.Header
										as="h3"
										style={{
											marginTop: '0px',
											padding: '5px 0',
											background: 'none',
										}}
									>
										{t.name}
									</Card.Header>
									<Card.Body style={{ padding: '10px 0' }}>
										<Image
											src={t.image}
											alt={t.name}
											style={{
												width: '200px',
												height: '200px',
												borderRadius: '50%',
												border: '1px solid #4caf50',
											}}
											fluid
										/>
										<br />
										<br />
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
											{t.startTime}
											{' to '}
											{t.endTime}
										</p>

										<br />
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
											{t.experience}
										</p>

										<br />
									</Card.Body>
									<Card.Footer style={{ padding: '5px 0', margin: '10px' }}>
										<Modal
											show={acceptModal}
											onCancel={cancelAccepthandler}
											header="Are you sure?"
											footerClass="place-item__modal-actions"
											footer={
												<React.Fragment>
													<div
														style={{
															marginRight: '10px',
															display: 'inline',
														}}
													>
														<Button
															className="btn1"
															danger
															onClick={cancelAccepthandler}
														>
															CANCEL
														</Button>
													</div>
													<Button
														className="btn1"
														inverse
														onClick={async e => {
															e.preventDefault();
															try {
																await sendRequest(
																	`http://localhost:5000/api/admin/approvetrainers`,
																	'PATCH',
																	JSON.stringify({
																		userid: t.id,
																		approved: '0',
																	}),
																	{
																		'Content-Type': 'application/json',
																	}
																);
															} catch (err) {
															} finally {
																setTrainer(
																	trainer.filter(tx => tx.id !== t.id)
																);
																setAcceptModal(false);
																auth.setApproval();
															}
														}}
													>
														Accept
													</Button>
												</React.Fragment>
											}
										>
											<p>You want to accept {t.name} as trainer?</p>
										</Modal>
										<Modal
											show={showConfirmModal}
											onCancel={cancelAccepthandler}
											header="Are you sure?"
											footerClass="place-item__modal-actions"
											footer={
												<React.Fragment>
													<div
														style={{ marginRight: '10px', display: 'inline' }}
													>
														<Button
															className="btn1"
															danger
															onClick={cancelDeleteHandler}
														>
															CANCEL
														</Button>
													</div>
													<Button
														className="btn1"
														inverse
														onClick={async e => {
															e.preventDefault();
															try {
																console.log(t.id);
																await sendRequest(
																	`http://localhost:5000/api/admin/approvetrainers`,
																	'DELETE',
																	JSON.stringify({
																		userid: t.id,
																	}),
																	{
																		'Content-Type': 'application/json',
																	}
																);
															} catch (err) {
															} finally {
																setTrainer(
																	trainer.filter(tx => tx.id !== t.id)
																);
																setShowConfirmModal(false);
															}
														}}
													>
														DELETE
													</Button>
												</React.Fragment>
											}
										>
											<p>
												You want to delete request of <b> {t.name} </b>
											</p>
										</Modal>
										<div
											style={{
												padding: '0 7px',
												display: 'inline',
												width: '100px',
												margin: '0px !important',
											}}
										>
											<input
												style={{
													margin: '10px',
													width: '100px',
													fontSize: '14px',
												}}
												type="button"
												className="button"
												value="ACCEPT"
												onClick={showAcceptWarningHandler}
											/>
										</div>
										<div
											style={{
												padding: '0 7px',
												display: 'inline',
												width: '100px !important',
											}}
										>
											<input
												style={{
													margin: '10px',
													width: '100px',
													fontSize: '14px',
												}}
												type="button"
												className="button"
												value="REJECT"
												onClick={showDeleteWarningHandler}
											/>
										</div>
									</Card.Footer>
								</Card>
							</Container>
						))}
					</ul>
				)}
			</React.Fragment>
		);
	}
};

export default Home;
