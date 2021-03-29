import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Card, Image, Container } from 'react-bootstrap';
import ErrorModal from '../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../shared/hooks/http-hook';
import { AuthContext } from '../shared/context/auth-context';
import Exercise from './exercise';
import { Dialog, DialogOverlay } from '@reach/dialog';
import '@reach/dialog/styles.css';
import Countdown from 'react-countdown';
// ani CSS :- giveplan.css

export var weekNo = 0;
const ViewPlan = () => {
	const history = useHistory();
	const auth = useContext(AuthContext);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [trainerPlan, setTrainerPlan] = useState();
	const [isDays, setIsDays] = useState(true);
	const [exer, setExer] = useState(false);
	const [ctime, setCtime] = useState(15000);
	const [oneexer, setOneExer] = useState(false);
	const [selectedDay, setSelectedDay] = useState(0);
	const [category, setcategory] = useState();
	const [videoLink, setVideoLink] = useState();
	const [desc, setDesc] = useState();
	const [ename, setEname] = useState();
	const [flag, setFlag] = useState(false);
	const [day, setDay] = useState(0);

	const completeHandler = async (dayNo, feedback) => {
		setIsDays(true);
		let responseData;
		try {
			console.log(dayNo, feedback);
			responseData = await sendRequest(
				`http://localhost:5000/api/viewplan/zerocomplete`,
				'PATCH',
				JSON.stringify({
					tuid: auth.userId,
					fb: feedback,
					day: dayNo,
				}),
				{
					'Content-Type': 'application/json',
				}
			);
			setTrainerPlan(responseData.defaultexercise);
		} catch (err) {
			console.log(err);
		} finally {
			setShowDialog(false);
		}
	};
	const waiting = ({ hours, minutes, seconds, completed }) => {
		if (completed) {
			return <div style={{ display: 'none' }}></div>;
		} else {
			if (seconds === 10) {
				fetch(
					`http://localhost:5000/api/viewplan/viewdefaultplan/${auth.userId}`,
					{
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
						},
					}
				)
					.then(res => res.json())
					.then(data => {
						setCtime(ctime + 2000);
						setTrainerPlan(data.defaultexercise);
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

	useEffect(() => {
		const fetchRequests = async () => {
			try {
				const responseData = await sendRequest(
					`http://localhost:5000/api/viewplan/viewdefaultplan/${auth.userId}`
				);
				setTrainerPlan(responseData.defaultexercise);
			} catch (err) {}
		};
		fetchRequests();
	}, [sendRequest, auth.userId]);

	const [showDialog, setShowDialog] = React.useState(false);
	const [showWarning, setShowWarning] = React.useState(false);
	const open = () => {
		setShowDialog(true);
		setShowWarning(false);
	};
	const close = () => setShowDialog(false);
	const dismiss = () => setShowWarning(true);

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			{isLoading && (
				<div className="center">
					<LoadingSpinner />
				</div>
			)}
			{!isLoading && !trainerPlan && (
				<Card style={{ margin: 'auto', maxWidth: '34vw' }}>
					<h1>Please Wait.</h1>
					<Countdown date={Date.now() + ctime + 2000} renderer={waiting} />
				</Card>
			)}
			{!isLoading && trainerPlan && (
				<div className="header1">
					<h1> Your Fitness Plan</h1>
				</div>
			)}

			{!isLoading && trainerPlan && (
				<div className="card1">
					{!oneexer && (
						<div className="card1">
							<div
								style={{
									width: 'auto',
									margin: 'auto',
									background: 'none',
									border: '0px',
								}}
							>
								{isDays && !exer && !oneexer && (
									<div className="viewgrid">
										{true && (
											<Card style={{ maxWidth: '250px' }}>
												<h3 className="week-header">WEEK 1 </h3>
												<hr />
												<div className="dayGrid">
													{trainerPlan.plan.map(p => (
														<div
															className="mh"
															id={p.dayNo}
															style={{
																width: 'auto',
																padding: 'auto',
																display: 'inline',
															}}
														>
															{p.dayComplated !== 1 &&
																p.dayNo >= 1 &&
																p.dayNo <= 7 && (
																	<button
																		style={{ margin: '10px' }}
																		className="daysButton--notsaved"
																		disabled={!p.previousDayComplated}
																		onClick={() => {
																			setDay(p.dayNo);
																			setIsDays(false);
																		}}
																	>
																		Day {p.dayNo}
																	</button>
																)}
															{p.dayComplated === 1 &&
																p.dayNo >= 1 &&
																p.dayNo <= 7 && (
																	<button
																		style={{ margin: '10px' }}
																		className="daysButton--saved"
																		onClick={() => {
																			setDay(p.dayNo);
																			setIsDays(false);
																		}}
																	>
																		Day {p.dayNo}
																	</button>
																)}
															{!(p.dayNo >= 1 && p.dayNo <= 7) && (
																<div style={{ display: 'none' }}>hello</div>
															)}
														</div>
													))}
												</div>
												{isDays && !exer && !oneexer && (
													<Card>
														<input
															className="button"
															type="button"
															value="REPORTING"
															disabled={
																trainerPlan.week1Submitted === 1 ||
																trainerPlan.plan[0].dayComplated === 0
															}
															onClick={e => {
																e.preventDefault();
																weekNo = 1;
																history.push('/reporting');
															}}
															style={{ margin: '5px', width: 'auto' }}
														></input>
													</Card>
												)}
											</Card>
										)}
										{trainerPlan.week1Submitted === 1 && (
											<Card style={{ maxWidth: '250px' }}>
												<h3 className="week-header">WEEK 2 </h3>
												<hr />
												<div className="dayGrid">
													{trainerPlan.plan.map(p => (
														<div
															className="mh"
															id={p.dayNo}
															style={{
																width: 'auto',
																padding: 'auto',
																display: 'inline',
															}}
														>
															{p.dayComplated !== 1 &&
																p.dayNo >= 8 &&
																p.dayNo <= 14 && (
																	<button
																		style={{ margin: '10px' }}
																		className="daysButton--notsaved"
																		disabled={!p.previousDayComplated}
																		onClick={() => {
																			setDay(p.dayNo);
																			setIsDays(false);
																		}}
																	>
																		Day {p.dayNo}
																	</button>
																)}
															{p.dayComplated === 1 &&
																p.dayNo >= 8 &&
																p.dayNo <= 14 && (
																	<button
																		style={{ margin: '10px' }}
																		className="daysButton--saved"
																		onClick={() => {
																			setDay(p.dayNo);
																			setIsDays(false);
																		}}
																	>
																		Day {p.dayNo}
																	</button>
																)}
															{!(p.dayNo >= 8 && p.dayNo <= 14) && (
																<div style={{ display: 'none' }}>hello</div>
															)}
														</div>
													))}
												</div>
												{isDays && !exer && !oneexer && (
													<Card>
														<input
															class="button"
															type="button"
															value="REPORTING"
															disabled={
																trainerPlan.week2Submitted === 1 ||
																trainerPlan.plan[7].dayComplated === 0
															}
															onClick={e => {
																e.preventDefault();
																weekNo = 2;
																history.push('/reporting');
															}}
															style={{ margin: '5px' }}
														></input>
													</Card>
												)}
											</Card>
										)}
										{trainerPlan.week2Submitted === 1 && (
											<Card style={{ maxWidth: '250px' }}>
												<h3 className="week-header">WEEK 3 </h3>
												<hr />
												<div className="dayGrid">
													{trainerPlan.plan.map(p => (
														<div
															className="mh"
															id={p.dayNo}
															style={{
																width: 'auto',
																padding: 'auto',
																display: 'inline',
															}}
														>
															{p.dayComplated !== 1 &&
																p.dayNo >= 15 &&
																p.dayNo <= 21 && (
																	<button
																		style={{ margin: '10px' }}
																		className="daysButton--notsaved"
																		disabled={!p.previousDayComplated}
																		onClick={() => {
																			setDay(p.dayNo);
																			setIsDays(false);
																		}}
																	>
																		Day {p.dayNo}
																	</button>
																)}
															{p.dayComplated === 1 &&
																p.dayNo >= 15 &&
																p.dayNo <= 21 && (
																	<button
																		style={{ margin: '10px' }}
																		className="daysButton--saved"
																		onClick={() => {
																			setDay(p.dayNo);
																			setIsDays(false);
																		}}
																	>
																		Day {p.dayNo}
																	</button>
																)}
															{!(p.dayNo >= 15 && p.dayNo <= 21) && (
																<div style={{ display: 'none' }}>hello</div>
															)}
														</div>
													))}
												</div>
												{isDays && !exer && !oneexer && (
													<Card>
														<input
															class="button"
															type="button"
															value="REPORTING"
															disabled={
																trainerPlan.week3Submitted === 1 ||
																trainerPlan.plan[14].dayComplated === 0
															}
															onClick={e => {
																e.preventDefault();
																weekNo = 3;
																history.push('/reporting');
															}}
															style={{ margin: '5px' }}
														></input>
													</Card>
												)}
											</Card>
										)}
										{trainerPlan.week3Submitted === 1 && (
											<Card style={{ maxWidth: '250px', margin: 'auto' }}>
												<h3 className="week-header">WEEK 4 </h3>
												<hr />
												<div className="dayGrid">
													{trainerPlan.plan.map(p => (
														<div
															className="mh"
															id={p.dayNo}
															style={{
																width: 'auto',
																padding: 'auto',
																display: 'inline',
															}}
														>
															{p.dayComplated !== 1 &&
																p.dayNo >= 22 &&
																p.dayNo <= 28 && (
																	<button
																		style={{ margin: '10px' }}
																		className="daysButton--notsaved"
																		disabled={!p.previousDayComplated}
																		onClick={() => {
																			setDay(p.dayNo);
																			setIsDays(false);
																		}}
																	>
																		Day {p.dayNo}
																	</button>
																)}
															{p.dayComplated === 1 &&
																p.dayNo >= 22 &&
																p.dayNo <= 28 && (
																	<button
																		style={{ margin: '10px' }}
																		className="daysButton--saved"
																		onClick={() => {
																			setDay(p.dayNo);
																			setIsDays(false);
																		}}
																	>
																		Day {p.dayNo}
																	</button>
																)}
															{!(p.dayNo >= 22 && p.dayNo <= 28) && (
																<div style={{ display: 'none' }}>hello</div>
															)}
														</div>
													))}
												</div>
												{isDays && !exer && !oneexer && (
													<Card>
														<input
															class="button"
															type="button"
															value="REPORTING"
															disabled={
																trainerPlan.week4Submitted === 1 ||
																trainerPlan.plan[21].dayComplated === 0
															}
															onClick={e => {
																e.preventDefault();
																weekNo = 4;
																history.push('/reporting');
															}}
															style={{ margin: '5px' }}
														></input>
													</Card>
												)}
											</Card>
										)}
									</div>
								)}

								{!isDays && !exer && !oneexer && (
									<Card
										className="bc"
										style={{ maxWidth: '500px', margin: 'auto ' }}
									>
										<div>
											<div style={{ padding: '5px' }}>
												{trainerPlan.plan.map(p1 => (
													<div>
														{p1.dayNo === day && p1.exercises.length === 0 && (
															<div>
																<h3>No Exercise Today...</h3>
																<button
																	className="button"
																	style={{ margin: 'auto 5px' }}
																	onClick={() => {
																		setIsDays(true);
																		setDay(0);
																	}}
																>
																	BACK
																</button>
																<button
																	className="button"
																	style={{ margin: 'auto 5px' }}
																	onClick={async () => {
																		setIsDays(true);
																		let responseData;
																		try {
																			responseData = await sendRequest(
																				`http://localhost:5000/api/viewplan/zerocomplete`,
																				'PATCH',
																				JSON.stringify({
																					tuid: auth.userId,
																					day: p1.dayNo,
																				}),
																				{
																					'Content-Type': 'application/json',
																				}
																			);
																			console.log(responseData.defaultexercise);
																			setTrainerPlan(
																				responseData.defaultexercise
																			);
																		} catch (err) {
																			console.log(err);
																		}
																	}}
																>
																	COMPLETE
																</button>
															</div>
														)}

														{p1.dayNo === day && p1.exercises.length !== 0 && (
															<div>
																<div className="data201">
																	{p1.exercises.map(e => (
																		<React.Fragment>
																			<div className="gif">
																				<Image
																					src={e.exerciseid.gif}
																					style={{
																						border: '2px solid #4caf50',
																						width: '100%',
																						height: '200px',
																					}}
																					fluid
																				/>
																			</div>

																			<div className="ename">
																				<h3>{e.exerciseid.ename}</h3>
																				<br />
																				{e.reps !== 0 && <h3>{e.reps}x</h3>}
																				{e.time !== 0 && <h3>{e.time}s</h3>}
																			</div>

																			<button
																				className="goto"
																				style={{
																					border: ' 1px solid #4caf50',
																					color: '#4caf50',
																				}}
																				onClick={async event => {
																					event.preventDefault();
																					console.log(e.exerciseid.id);
																					setOneExer(true);
																					try {
																						const responseData = await sendRequest(
																							`http://localhost:5000/api/search/${e.exerciseid.id}`
																						);
																						//setexercise(responseData.exercise);
																						console.log(responseData.exe);
																						setEname(responseData.exe.ename);
																						setVideoLink(
																							responseData.exe.vlink
																						);
																						setcategory(
																							responseData.exe.category
																						);
																						setDesc(responseData.exe.desc);
																						setFlag(true);
																					} catch (err) {}
																				}}
																			>
																				&gt;
																			</button>
																		</React.Fragment>
																	))}
																</div>
																<input
																	className="button"
																	type="button"
																	name="BACK"
																	value="BACK"
																	style={{ margin: 'auto 5px' }}
																	onClick={() => {
																		setIsDays(true);
																		setDay(0);
																	}}
																/>
																<input
																	className="button"
																	type="button"
																	name="START"
																	value="START"
																	style={{ margin: 'auto 5px' }}
																	onClick={() => {
																		setExer(true);
																	}}
																/>
																<button
																	className="button"
																	style={{ margin: 'auto 5px' }}
																	onClick={async () => {
																		setSelectedDay(p1.dayNo);
																		open();
																	}}
																>
																	COMPLETE
																</button>
															</div>
														)}
													</div>
												))}
											</div>
										</div>
									</Card>
								)}
								{!isDays && exer && !oneexer && (
									<Card
										className="authentication"
										style={{
											maxWidth: '500px',
											width: 'auto',
											margin: 'auto ',
										}}
									>
										<div>
											<div style={{ padding: '5px' }}>
												{trainerPlan.plan.map(p1 => (
													<div>
														{p1.dayNo === day && p1.exercises.length !== 0 && (
															<div>
																<Exercise items={p1} dayNumber={p1.dayNo} />
															</div>
														)}
													</div>
												))}
												<hr style={{ color: 'white' }} />
												<input
													className="button"
													type="button"
													name="EXIT"
													value="EXIT"
													style={{ margin: '10px 5px' }}
													onClick={async () => {
														setExer(false);
														setIsDays(true);
														try {
															const responseData = await sendRequest(
																`http://localhost:5000/api/viewplan/viewdefaultplan/${auth.userId}`
															);
															setTrainerPlan(responseData.defaultexercise);
															console.log(responseData.defaultexercise);
														} catch (err) {}
													}}
												/>
											</div>
										</div>
									</Card>
								)}
							</div>
						</div>
					)}
					{!isDays && !exer && oneexer && (
						<div>
							<div style={{ textAlign: 'center' }}>
								{!isLoading && flag && (
									<Container>
										<Card
											className="authentication"
											style={{
												maxWidth: '500px',
												margin: 'auto ',
												color: 'black',
												marginBottom: '50px',
												padding: '0 10px',
											}}
										>
											{!isLoading && flag && (
												<Card.Header
													as="h2"
													style={{
														marginTop: '0px',
														padding: '10px 0',
														backgroundColor: 'none',
													}}
												>
													{ename}
												</Card.Header>
											)}
											{!isLoading && flag && (
												<div style={{ textAlign: 'left' }}>
													<h4 style={{ display: 'inline', color: '#4caf50' }}>
														Exercise Category :
													</h4>
													<p
														style={{
															display: 'inline',
															marginLeft: '22px',
															color: 'white',
														}}
													>
														{' '}
														{category}
													</p>
												</div>
											)}
											{!isLoading && flag && (
												<div
													style={{
														display: 'inline',
														textALign: 'justify',
														paddingRight: '10px',
														width: 'auto',
													}}
												>
													<h4
														style={{
															display: 'inline',
															height: '100%',
															position: 'absolute',
															paddingTop: '10px',
															marginTop: '16px',
															marginRight: '5px',
															willChange: 'transform',
															color: '#4caf50',
														}}
													>
														Exercise Description :
													</h4>
													<p
														style={{
															display: 'inline-block',
															width: 'auto',
															height: '100px',
															margin: '16px 10px 10px 175px',
															textAlign: 'justify',
															paddingTop: '10px',
															fontSize: '14px',
															paddingRight: '10px',
															color: 'white',
														}}
													>
														{' '}
														{desc}
													</p>
												</div>
											)}
											{!isLoading && flag && (
												<iframe
													style={{ borderRadius: '8px', width: '100%' }}
													title={ename}
													height="315"
													src={videoLink}
													allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
													allowFullScreen
												></iframe>
											)}
											<input
												className="button"
												type="button"
												name="BACK"
												value="BACK"
												style={{ margin: 'auto 5px' }}
												onClick={() => {
													setOneExer(false);
												}}
											/>
										</Card>
									</Container>
								)}
							</div>
						</div>
					)}{' '}
					<div style={{ marginTop: '50px' }}>
						<DialogOverlay
							style={{ background: '' }}
							isOpen={showDialog}
							onDismiss={close}
						>
							<Dialog
								isOpen={showDialog}
								onDismiss={dismiss}
								className="dialog"
								style={{
									maxWidth: '400px',
									marginTop: '50px !important',
									background: 'black',
									textAlign: 'center',
								}}
							>
								{showWarning && (
									<p style={{ color: 'red' }}>
										You must make a choice, sorry :(
									</p>
								)}
								<h4 style={{ color: 'white' }}>HOW DO YOU FEEL</h4>
								<hr />
								<button
									className="button"
									style={{ margin: 'auto 5px', width: '150px' }}
									onClick={() => {
										completeHandler(selectedDay, 1);
									}}
								>
									EASY
								</button>
								<br />
								<br />
								<button
									className="button"
									onClick={() => {
										completeHandler(selectedDay, 5);
									}}
									style={{ margin: 'auto 5px', width: '150px' }}
								>
									JUST RIGHT
								</button>
								<br />
								<br />
								<button
									className="button"
									onClick={() => {
										completeHandler(selectedDay, 10);
									}}
									style={{ margin: 'auto 5px', width: '150px' }}
								>
									TOO HARD
								</button>
							</Dialog>
						</DialogOverlay>
					</div>
				</div>
			)}
		</React.Fragment>
	);
};

export default ViewPlan;
