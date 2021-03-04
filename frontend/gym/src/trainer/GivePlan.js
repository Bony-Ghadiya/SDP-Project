import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Card, Image, Container } from 'react-bootstrap';
import ErrorModal from '../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';
import Modal from '../shared/components/UIElements/Modal';
import Button from '../shared/components/FormElements/Button';
import { useHttpClient } from '../shared/hooks/http-hook';
import { traineeid, traineename } from './showtrainee';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';

import { makeStyles, withStyles } from '@material-ui/core/styles';
import './Giveplan.css';

const CssTextField = withStyles({
	root: {
		color: 'black',
		'& label': {
			color: 'black',
		},
		'& label.Mui-focused': {
			color: 'black',
		},
	},
})(TextField);

const useStyles = makeStyles(theme => ({
	inputRoot: {
		color: 'black',
		'& .MuiOutlinedInput-notchedOutline': {
			borderColor: 'black',
		},
		'&:hover .MuiOutlinedInput-notchedOutline': {
			borderColor: 'black',
		},
		'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
			borderColor: 'black',
		},
	},
}));

const GivePlan = () => {
	const history = useHistory();
	let temp;
	const [savedCount, setSavedCount] = useState(0);
	const classes = useStyles();
	const [day, setDay] = useState(0);
	const [reps, setReps] = useState(0);
	const [time, setTime] = useState(0);
	const [allExercises, setAllExercises] = useState();
	const [loadedExercises, setloadedExercises] = useState();
	const [searched, setSearched] = useState();
	const [isDays, setIsDays] = useState(true);
	const [trainerPlan, setTrainerPlan] = useState();
	const [exer, setexer] = useState();
	const [showNew, setShowNew] = useState(false);
	const [searched1, setSerched1] = useState(false);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [submitted, setIsSubmitted] = useState(0);
	const [zero, setNotZero] = useState(true);
	const [category, setcategory] = useState();
	const [videoLink, setVideoLink] = useState();
	const [desc, setDesc] = useState();
	const [ename, setEname] = useState();
	const [flag, setFlag] = useState(false);
	const [oneexer, setOneExer] = useState(false);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const showWarningHandler = () => {
		setShowConfirmModal(true);
	};

	const cancelWarningHandler = () => {
		setShowConfirmModal(false);
	};

	const deleteexercise = (p1, e) => {
		if (trainerPlan) {
			let abc = exer.filter(e1 => e1.exerciseid.id !== e.exerciseid.id);
			setexer(abc);
			console.log('hello', abc);
		}
	};

	function TransitionDown(props) {
		return <Slide {...props} direction="down" />;
	}

	const [open, setOpen] = React.useState(false);
	const [transition, setTransition] = React.useState(undefined);

	const handleClick = Transition => {
		console.log('true');
		setTransition(() => Transition);
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const checkSubmitHandler = async e => {
		e.preventDefault();
		console.log('check');
		if (searched1) {
			try {
				const responseData = await sendRequest(
					`http://localhost:5000/api/getplan/plan/getExercise`,
					'PATCH',
					JSON.stringify({
						exerciseid: loadedExercises[0].id,
						reps: 0,
						time: 0,
					}),
					{
						'Content-Type': 'application/json',
					}
				);
				console.log(responseData);
				let obj = {
					reps: reps,
					time: time,
					exerciseid: responseData.exe,
				};
				let abc;

				console.log(obj);

				abc = [...exer, obj];
				console.log('exer', abc);
				setexer(abc);

				try {
					const responseData = await sendRequest(
						`http://localhost:5000/api/getplan/getdefaultplan1/${traineeid}`
					);
					setTrainerPlan(responseData.defaultexercise);
					var i,
						t = 0;
					for (i = 0; i < responseData.defaultexercise.plan.length; i++) {
						if (responseData.defaultexercise.plan[i].isSaved === 1) {
							t = t + 1;
						}
					}
					setSavedCount(t);
					setIsSubmitted(responseData.defaultexercise.isComplate);
				} catch (err) {}
			} catch (err) {
			} finally {
				setShowNew(false);
				setloadedExercises();
				setSerched1(false);
			}
		}
	};

	const checkrepsSubmitHandler = async (p1, e) => {
		console.log(p1.exercises, e);
		var i;
		for (i = 0; i < p1.exercises.length; i++) {
			if (p1.exercises[i].exerciseid.id === e.exerciseid.id) {
				p1.exercises[i].reps = reps;
				p1.exercises[i].time = time;
			}
		}
		setexer(p1.exercises);
		try {
			await sendRequest(
				`http://localhost:5000/api/getplan/savereps`,
				'PATCH',
				JSON.stringify({
					day: day,
					traineeid: traineeid,
					exerciseid: e.exerciseid.id,
					reps: reps,
					time: time,
				}),
				{
					'Content-Type': 'application/json',
				}
			);
		} catch (err) {}
	};

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const responseData = await sendRequest(
					'http://localhost:5000/api/search'
				);
				setloadedExercises(responseData.exercises);
				setAllExercises(responseData.exercises);
			} catch (err) {}
		};
		fetchUsers();
	}, [sendRequest]);

	useEffect(() => {
		const fetchRequests = async () => {
			try {
				await sendRequest(
					`http://localhost:5000/api/getplan/getdefaultplan/${traineeid}`
				);
			} catch (err) {}
			try {
				const responseData = await sendRequest(
					`http://localhost:5000/api/getplan/getdefaultplan1/${traineeid}`
				);
				setTrainerPlan(responseData.defaultexercise);
				var i,
					t = 0;
				for (i = 0; i < responseData.defaultexercise.plan.length; i++) {
					if (responseData.defaultexercise.plan[i].isSaved === 1) {
						console.log(responseData.defaultexercise.plan[i].dayNo);
						t = t + 1;
					}
				}
				setSavedCount(t);
				console.log('t', responseData.defaultexercise.isComplate);
				setIsSubmitted(responseData.defaultexercise.isComplate);
			} catch (err) {}
		};
		fetchRequests();
	}, [sendRequest]);

	if (!allExercises) {
		return (
			<React.Fragment>
				<ErrorModal error={error} onClear={clearError} />
				{console.log('!all')}
				{isLoading && (
					<div className="center">
						<LoadingSpinner />
					</div>
				)}
			</React.Fragment>
		);
	} else {
		const data1 = [allExercises];
		const options = data1[0].map(option => {
			const firstLetter = option.ename[0].toUpperCase();
			return {
				firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
				...option,
			};
		});

		function searchSubmitHandler(event) {
			event.preventDefault();
			setSerched1(true);
			let abc;
			if (searched) {
				abc = allExercises.filter(exe => exe.ename === searched.ename);
				setloadedExercises(abc);
			} else {
				setSerched1(false);
				setloadedExercises(allExercises);
			}
		}
		return (
			<React.Fragment>
				<ErrorModal error={error} onClear={clearError} />
				{isLoading && (
					<div className="center">
						<LoadingSpinner />
					</div>
				)}
				{!isLoading && trainerPlan && (
					<div className="header1">
						<h3> Please Provide fitness plan for {traineename}</h3>
					</div>
				)}
				{!isLoading && trainerPlan && !oneexer && (
					<div className="card1">
						<Card
							style={{ width: '495px', margin: 'auto', background: 'none' }}
						>
							{trainerPlan && (
								<div>
									{isDays && (
										<div className="grid">
											{trainerPlan.plan.map(p => (
												<div className="mh" id={p.dayNo}>
													{p.isSaved !== 1 && (
														<button
															className="daysButton--notsaved"
															onClick={() => {
																setDay(p.dayNo);
																setIsDays(false);
																setexer(p.exercises);
															}}
														>
															Day {p.dayNo}
														</button>
													)}
													{p.isSaved === 1 && (
														<button
															className="daysButton--saved"
															onClick={() => {
																setDay(p.dayNo);
																setIsDays(false);
																setexer(p.exercises);
															}}
														>
															Day {p.dayNo}
														</button>
													)}
												</div>
											))}
										</div>
									)}
									{!isDays && (
										<div style={{ backgroundColor: 'gray', padding: '5px' }}>
											{trainerPlan.plan.map(p1 => (
												<div>
													{p1.dayNo === day && p1.exercises.length === 0 && (
														<h3>No Exercise Today...</h3>
													)}
													{p1.dayNo === day && (
														<div className="data101">
															{zero &&
																p1.dayNo === day &&
																p1.exercises.length === 0 &&
																showNew &&
																!searched1 && (
																	<div className="gif__preview">
																		<p>Please pick an exercise.</p>
																	</div>
																)}
															{zero &&
																p1.dayNo === day &&
																p1.exercises.length === 0 &&
																showNew &&
																loadedExercises &&
																searched1 && (
																	<Image
																		src={loadedExercises[0].gif}
																		style={{
																			width: '170px',
																			height: '170px',
																		}}
																		fluid
																	/>
																)}
															{zero &&
																p1.dayNo === day &&
																p1.exercises.length === 0 &&
																showNew &&
																!loadedExercises &&
																searched1 && (
																	<Image
																		src={loadedExercises}
																		alt="GIF"
																		style={{
																			width: '170px',
																			height: '170px',
																		}}
																		fluid
																	/>
																)}
															{zero &&
																p1.dayNo === day &&
																p1.exercises.length === 0 &&
																showNew && (
																	<form
																		style={{
																			display: 'block',
																		}}
																		onSubmit={searchSubmitHandler}
																	>
																		<div className="outerDiv">
																			<div
																				style={{
																					display: 'inline-block',
																					textAlign: 'center',
																					backgroundColor: 'none',
																				}}
																			>
																				<Autocomplete
																					width={300}
																					style={{ width: 200 }}
																					classes={classes}
																					value={temp}
																					id="grouped-demo"
																					options={options.sort(
																						(a, b) =>
																							-b.firstLetter.localeCompare(
																								a.firstLetter
																							)
																					)}
																					groupBy={option => option.firstLetter}
																					getOptionLabel={option =>
																						option.ename
																					}
																					onChange={(event, value) =>
																						setSearched(value)
																					}
																					renderInput={params => (
																						<div className="SearchExercises">
																							<CssTextField
																								{...params}
																								label="Add Exercises"
																								variant="outlined"
																							/>
																						</div>
																					)}
																					getOptionSelected={option =>
																						option.ename
																					}
																				/>
																			</div>
																			<br></br>
																			<br />
																			<button
																				className="daysbutton"
																				onClick={e => {
																					searchSubmitHandler(e);
																				}}
																			>
																				ADD
																			</button>
																			{showNew && (
																				<div className="repstime">
																					<label for="reps">reps : </label>
																					<input
																						type="text"
																						name="reps"
																						defaultValue={0}
																						style={{ width: '3ch' }}
																						onChange={e => {
																							e.preventDefault();
																							setTime(0);
																							setReps(e.target.value);
																						}}
																					></input>
																					x
																				</div>
																			)}
																			{showNew && (
																				<div className="repstime">
																					<label for="time">time : </label>
																					<input
																						type="text"
																						name="time"
																						defaultValue={0}
																						style={{ width: '3ch' }}
																						onChange={e => {
																							e.preventDefault();
																							setReps(0);
																							setTime(e.target.value);
																						}}
																					></input>
																					s
																				</div>
																			)}
																		</div>
																	</form>
																)}
															{zero &&
																p1.dayNo === day &&
																p1.exercises.length === 0 &&
																showNew && (
																	<div
																		style={{
																			textAlign: 'center',
																		}}
																	>
																		<button
																			className="close"
																			onClick={async e => {
																				setNotZero(false);
																				checkSubmitHandler(e);
																			}}
																		>
																			<CheckIcon style={{ padding: '0' }} />
																		</button>
																	</div>
																)}
															{zero &&
																p1.dayNo === day &&
																p1.exercises.length === 0 &&
																showNew && (
																	<button
																		className="close"
																		onClick={() => {
																			setloadedExercises(null);
																			setShowNew(false);
																			setSerched1(false);
																		}}
																	>
																		X
																	</button>
																)}
														</div>
													)}
													{p1.dayNo === day && exer.length !== 0 && (
														<div className="data101">
															{exer.map(e => (
																<React.Fragment>
																	<div className="gif">
																		<Image
																			src={e.exerciseid.gif}
																			style={{
																				width: '170px',
																				height: '170px',
																			}}
																			fluid
																		/>
																	</div>

																	<div className="ename">
																		<h3>{e.exerciseid.ename}</h3>
																		{e.reps !== 0 && (
																			<div className="repstime">
																				<label for="reps">reps : </label>
																				<input
																					type="text"
																					name="reps"
																					defaultValue={e.reps}
																					style={{ width: '3ch' }}
																					onChange={e => {
																						e.preventDefault();
																						console.log(e.target.value);
																						setTime(0);
																						setReps(e.target.value);
																					}}
																				></input>
																				x
																			</div>
																		)}
																		{e.time !== 0 && (
																			<div className="repstime">
																				<label for="time">time : </label>
																				<input
																					type="text"
																					name="time"
																					defaultValue={e.time}
																					style={{ width: '3ch' }}
																					onChange={e => {
																						e.preventDefault();
																						console.log(e.target.value);
																						setReps(0);
																						setTime(e.target.value);
																					}}
																				></input>
																				s
																			</div>
																		)}
																	</div>

																	<div
																		style={{
																			textAlign: 'center',
																			display: 'block',
																		}}
																	>
																		<button
																			className="close"
																			onClick={event => {
																				event.preventDefault();
																				checkrepsSubmitHandler(p1, e);
																			}}
																		>
																			<CheckIcon style={{ padding: '0' }} />
																		</button>
																		<button
																			className="close"
																			onClick={() => {
																				deleteexercise(p1, e);
																			}}
																		>
																			X
																		</button>
																	</div>

																	<button
																		className="goto"
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
																				setcategory(responseData.exe.category);
																				setDesc(responseData.exe.desc);
																				setFlag(true);
																			} catch (err) {}
																		}}
																	>
																		&gt;
																	</button>
																</React.Fragment>
															))}
															{showNew && !searched1 && (
																<div className="gif__preview">
																	<p>Please pick an exercise.</p>
																</div>
															)}
															{showNew && loadedExercises && searched1 && (
																<Image
																	src={loadedExercises[0].gif}
																	style={{
																		width: '170px',
																		height: '170px',
																	}}
																	fluid
																/>
															)}
															{showNew && !loadedExercises && searched1 && (
																<Image
																	src={loadedExercises}
																	alt="GIF"
																	style={{
																		width: '170px',
																		height: '170px',
																	}}
																	fluid
																/>
															)}
															{showNew && (
																<form
																	style={{
																		display: 'block',
																	}}
																	onSubmit={searchSubmitHandler}
																>
																	<div className="outerDiv">
																		<div
																			style={{
																				display: 'inline-block',
																				textAlign: 'center',
																				backgroundColor: 'none',
																			}}
																		>
																			<Autocomplete
																				width={300}
																				style={{ width: 200 }}
																				classes={classes}
																				value={temp}
																				id="grouped-demo"
																				options={options.sort(
																					(a, b) =>
																						-b.firstLetter.localeCompare(
																							a.firstLetter
																						)
																				)}
																				groupBy={option => option.firstLetter}
																				getOptionLabel={option => option.ename}
																				onChange={(event, value) =>
																					setSearched(value)
																				}
																				renderInput={params => (
																					<div className="SearchExercises">
																						<CssTextField
																							{...params}
																							label="Add Exercises"
																							variant="outlined"
																						/>
																					</div>
																				)}
																				getOptionSelected={option =>
																					option.ename
																				}
																			/>
																		</div>

																		<br></br>
																		<br />
																		<button
																			className="daysbutton"
																			onClick={e => {
																				searchSubmitHandler(e);
																			}}
																		>
																			ADD
																		</button>
																		{showNew && (
																			<div className="repstime">
																				<label for="reps">reps : </label>
																				<input
																					type="text"
																					name="reps"
																					defaultValue={0}
																					style={{ width: '3ch' }}
																					onChange={e => {
																						e.preventDefault();
																						setTime(0);
																						setReps(e.target.value);
																					}}
																				></input>
																				x
																			</div>
																		)}
																		{showNew && (
																			<div className="repstime">
																				<label for="time">time : </label>
																				<input
																					type="text"
																					name="time"
																					defaultValue={0}
																					style={{ width: '3ch' }}
																					onChange={e => {
																						e.preventDefault();
																						setReps(0);
																						setTime(e.target.value);
																					}}
																				></input>
																				s
																			</div>
																		)}
																	</div>
																</form>
															)}
															{showNew && (
																<div
																	style={{
																		textAlign: 'center',
																	}}
																>
																	<button
																		className="close"
																		onClick={async e => {
																			checkSubmitHandler(e);
																		}}
																	>
																		<CheckIcon style={{ padding: '0' }} />
																	</button>
																</div>
															)}
															{showNew && (
																<button
																	className="close"
																	onClick={() => {
																		setloadedExercises(null);
																		setShowNew(false);
																		setSerched1(false);
																	}}
																>
																	X
																</button>
															)}
														</div>
													)}
												</div>
											))}
											{!isDays && !showNew && (
												<div className="anotherData">
													<button
														onClick={e => {
															e.preventDefault();
															setShowNew(true);
														}}
													>
														<AddIcon />
														<h4>add another exercise.</h4>
													</button>
												</div>
											)}
											{!isDays && (
												<div>
													<button
														style={{ margin: 'auto 5px' }}
														onClick={() => {
															setIsDays(true);
															setShowNew(false);
															setDay(0);
															setReps(0);
															setTime(0);
															setNotZero(true);
														}}
													>
														BACK
													</button>
													<button
														style={{ margin: 'auto 5px' }}
														onClick={async e => {
															e.preventDefault();
															try {
																const responseData = await sendRequest(
																	`http://localhost:5000/api/getplan/resetday/${traineeid}`,
																	'PATCH',
																	JSON.stringify({
																		day: day,
																		traineeid: traineeid,
																		exercise: exer,
																		reps: reps,
																		time: time,
																	}),
																	{
																		'Content-Type': 'application/json',
																	}
																);
																try {
																	const responseData = await sendRequest(
																		`http://localhost:5000/api/getplan/getdefaultplan1/${traineeid}`
																	);
																	setTrainerPlan(responseData.defaultexercise);
																} catch (err) {
																} finally {
																	setShowNew(false);
																}
																setIsDays(true);
																console.log(responseData);
															} catch (err) {}
														}}
													>
														RESET
													</button>
													<button
														style={{ margin: 'auto 5px' }}
														onClick={async e => {
															e.preventDefault();
															console.log(savedCount);
															try {
																const responseData = await sendRequest(
																	`http://localhost:5000/api/getplan/saveday`,
																	'PATCH',
																	JSON.stringify({
																		day: day,
																		traineeid: traineeid,
																		exercise: exer,
																		reps: reps,
																		time: time,
																	}),
																	{
																		'Content-Type': 'application/json',
																	}
																);
																console.log(responseData);
															} catch (err) {
															} finally {
																try {
																	const responseData = await sendRequest(
																		`http://localhost:5000/api/getplan/getdefaultplan1/${traineeid}`
																	);
																	setTrainerPlan(responseData.defaultexercise);
																} catch (err) {
																} finally {
																	setSavedCount(savedCount + 1);
																	setIsDays(true);
																	setShowNew(false);
																	setNotZero(true);
																}
															}
														}}
													>
														SAVE
													</button>
												</div>
											)}
										</div>
									)}
								</div>
							)}
						</Card>
					</div>
				)}
				{oneexer && (
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
										<button
											style={{ margin: 'auto 5px' }}
											onClick={() => {
												setOneExer(false);
											}}
										>
											BACK
										</button>
									</Card>
								</Container>
							)}
						</div>
					</div>
				)}
				<Modal
					show={showConfirmModal}
					onCancel={cancelWarningHandler}
					header="Are you sure?"
					footerClass="place-item__modal-actions"
					footer={
						<React.Fragment>
							<div style={{ marginRight: '10px', display: 'inline' }}>
								<Button inverse onClick={cancelWarningHandler}>
									CANCEL
								</Button>
							</div>
							<Button
								danger
								onClick={async e => {
									e.preventDefault();
									cancelWarningHandler();
									setDay(0);
									try {
										await sendRequest(
											`http://localhost:5000/api/getplan/resetall/${traineeid}`
										);

										const responseData = await sendRequest(
											`http://localhost:5000/api/getplan/getdefaultplan1/${traineeid}`
										);
										setTrainerPlan(responseData.defaultexercise);
										var i,
											t = 0;
										for (
											i = 0;
											i < responseData.defaultexercise.plan.length;
											i++
										) {
											if (responseData.defaultexercise.plan[i].isSaved === 1) {
												console.log(responseData.defaultexercise.plan[i].dayNo);
												t = t + 1;
											}
										}
										setSavedCount(t);
									} catch (err) {}
								}}
							>
								DELETE
							</Button>
						</React.Fragment>
					}
				>
					<p>You want to reset ?</p>
				</Modal>
				{!isLoading && trainerPlan && isDays && (
					<Card style={{ width: '495px', margin: 'auto', background: 'none' }}>
						<input
							class="button"
							type="button"
							value="RESET"
							style={{ margin: '5px' }}
							onClick={showWarningHandler}
						></input>
						<input
							class="button"
							type="button"
							value={submitted ? 'UPDATE' : 'SUBMIT'}
							style={{ margin: '5px' }}
							disabled={savedCount === 0}
							onClick={async e => {
								e.preventDefault();
								setIsSubmitted(1);
								handleClick(TransitionDown);
								console.log(savedCount);
								try {
									const responseData = await sendRequest(
										`http://localhost:5000/api/getplan/submit`,
										'PATCH',
										JSON.stringify({
											traineeid: traineeid,
										}),
										{
											'Content-Type': 'application/json',
										}
									);
									console.log(responseData);
								} catch (err) {}
							}}
						></input>
						<Snackbar
							open={open}
							onClose={handleClose}
							TransitionComponent={transition}
							message="Send Successfully."
							key={transition ? transition.name : ''}
						/>
					</Card>
				)}
			</React.Fragment>
		);
	}
};

export default GivePlan;
