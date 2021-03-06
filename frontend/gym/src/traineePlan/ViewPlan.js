import React, { useState, useEffect, useContext } from 'react';
import { Card, Image, Container } from 'react-bootstrap';
import ErrorModal from '../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../shared/hooks/http-hook';
import { AuthContext } from '../shared/context/auth-context';
import Exercise from './exercise';
// ani CSS :- giveplan.css
const ViewPlan = () => {
	const auth = useContext(AuthContext);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [trainerPlan, setTrainerPlan] = useState();
	const [isDays, setIsDays] = useState(true);
	const [exer, setExer] = useState(false);
	const [oneexer, setOneExer] = useState(false);

	const [category, setcategory] = useState();
	const [videoLink, setVideoLink] = useState();
	const [desc, setDesc] = useState();
	const [ename, setEname] = useState();
	const [flag, setFlag] = useState(false);
	const [day, setDay] = useState(0);

	const [exerciseNo, setExerciseNo] = useState(0);

	useEffect(() => {
		const fetchRequests = async () => {
			try {
				const responseData = await sendRequest(
					`http://localhost:5000/api/viewplan/viewdefaultplan/${auth.userId}`
				);
				setTrainerPlan(responseData.defaultexercise);
				console.log(responseData.defaultexercise);
			} catch (err) {}
		};
		fetchRequests();
	}, [sendRequest, auth.userId]);

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			{isLoading && (
				<div className="center">
					<LoadingSpinner />
				</div>
			)}
			{!isLoading && !trainerPlan && <h1>Please Wait....!!!!</h1>}
			{!isLoading && trainerPlan && (
				<div className="header1">
					<h1> Your Fitness Plan</h1>
				</div>
			)}

			{!isLoading && trainerPlan && (
				<div className="card1">
					{!oneexer && (
						<Card
							style={{ width: '485px', margin: 'auto', background: 'none' }}
						>
							<div>
								{isDays && !exer && !oneexer && (
									<div className="grid">
										{trainerPlan.plan.map(p => (
											<div className="mh" id={p.dayNo}>
												{p.dayComplated !== 1 && (
													<button
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
												{p.dayComplated === 1 && (
													<button
														className="daysButton--saved"
														onClick={() => {
															setDay(p.dayNo);
															setIsDays(false);
														}}
													>
														Day {p.dayNo}
													</button>
												)}
											</div>
										))}
									</div>
								)}
								{!isDays && !exer && !oneexer && (
									<div>
										<div style={{ padding: '5px' }}>
											{trainerPlan.plan.map(p1 => (
												<div>
													{p1.dayNo === day && p1.exercises.length === 0 && (
														<div>
															<h3>No Exercise Today...</h3>
															<button
																style={{ margin: 'auto 5px' }}
																onClick={() => {
																	setIsDays(true);
																	setDay(0);
																}}
															>
																BACK
															</button>
															<button
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
																					width: '200px',
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
																					setVideoLink(responseData.exe.vlink);
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
														</div>
													)}
												</div>
											))}
										</div>
									</div>
								)}
								{!isDays && exer && !oneexer && (
									<div>
										<div style={{ padding: '5px' }}>
											{trainerPlan.plan.map(p1 => (
												<div>
													{p1.dayNo === day && p1.exercises.length !== 0 && (
														<div>
															<Exercise items={p1} />
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
								)}
							</div>
						</Card>
					)}
					{!isDays && !exer && oneexer && (
						<div>
							<div style={{ textAlign: 'center' }}>
								{!isLoading && flag && (
									<Container>
										<Card
											style={{
												maxWidth: '500px',
												margin: 'auto',
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
														borderBottom: '1px solid black',
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
														width: '500px',
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
															width: '330px',
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
													style={{ borderRadius: '8px' }}
													title={ename}
													width="500"
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
					)}
				</div>
			)}
		</React.Fragment>
	);
};

export default ViewPlan;
