import React, { useState, useEffect } from 'react';
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
		color: 'white',
		'& label': {
			color: 'white',
		},
		'& label.Mui-focused': {
			color: 'white',
		},
	},
})(TextField);

const useStyles = makeStyles(theme => ({
	inputRoot: {
		color: 'black',
		'& .MuiOutlinedInput-notchedOutline': {
			borderColor: 'white',
		},
		'&:hover .MuiOutlinedInput-notchedOutline': {
			borderColor: 'white',
		},
		'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
			borderColor: 'white',
		},
	},
}));

const GivePlan = () => {
	let temp;
	const [week1savedCount, setWeek1SavedCount] = useState(0);
	const [week2savedCount, setWeek2SavedCount] = useState(0);
	const [week3savedCount, setWeek3SavedCount] = useState(0);
	const [week4savedCount, setWeek4SavedCount] = useState(0);
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
	const [showConfirmModal2, setShowConfirmModal2] = useState(false);
	const [showConfirmModal3, setShowConfirmModal3] = useState(false);
	const [showConfirmModal4, setShowConfirmModal4] = useState(false);
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
	const showWarningHandler2 = () => {
		setShowConfirmModal2(true);
	};

	const cancelWarningHandler2 = () => {
		setShowConfirmModal2(false);
	};
	const showWarningHandler3 = () => {
		setShowConfirmModal3(true);
	};

	const cancelWarningHandler3 = () => {
		setShowConfirmModal3(false);
	};
	const showWarningHandler4 = () => {
		setShowConfirmModal4(true);
	};

	const cancelWarningHandler4 = () => {
		setShowConfirmModal4(false);
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
					console.log(responseData.defaultexercise);
					setTrainerPlan(responseData.defaultexercise);
					var i,
						t1 = 0,
						t2 = 0,
						t3 = 0,
						t4 = 0;
					for (i = 0; i < responseData.defaultexercise.plan.length; i++) {
						if (responseData.defaultexercise.plan[i].isSaved === 1) {
							if (
								responseData.defaultexercise.plan[i].dayNo >= 1 &&
								responseData.defaultexercise.plan[i].dayNo <= 7
							) {
								t1 += 1;
							}
							if (
								responseData.defaultexercise.plan[i].dayNo >= 8 &&
								responseData.defaultexercise.plan[i].dayNo <= 14
							) {
								t2 += 1;
							}
							if (
								responseData.defaultexercise.plan[i].dayNo >= 15 &&
								responseData.defaultexercise.plan[i].dayNo <= 21
							) {
								t3 += 1;
							}
							if (
								responseData.defaultexercise.plan[i].dayNo >= 22 &&
								responseData.defaultexercise.plan[i].dayNo <= 28
							) {
								t4 += 1;
							}
						}
					}
					setWeek1SavedCount(t1);
					setWeek2SavedCount(t2);
					setWeek3SavedCount(t3);
					setWeek4SavedCount(t4);
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
					t1 = 0,
					t2 = 0,
					t3 = 0,
					t4 = 0;
				for (i = 0; i < responseData.defaultexercise.plan.length; i++) {
					if (responseData.defaultexercise.plan[i].isSaved === 1) {
						if (
							responseData.defaultexercise.plan[i].dayNo >= 1 &&
							responseData.defaultexercise.plan[i].dayNo <= 7
						) {
							t1 += 1;
						}
						if (
							responseData.defaultexercise.plan[i].dayNo >= 8 &&
							responseData.defaultexercise.plan[i].dayNo <= 14
						) {
							t2 += 1;
						}
						if (
							responseData.defaultexercise.plan[i].dayNo >= 15 &&
							responseData.defaultexercise.plan[i].dayNo <= 21
						) {
							t3 += 1;
						}
						if (
							responseData.defaultexercise.plan[i].dayNo >= 22 &&
							responseData.defaultexercise.plan[i].dayNo <= 28
						) {
							t4 += 1;
						}
					}
				}
				setWeek1SavedCount(t1);
				setWeek2SavedCount(t2);
				setWeek3SavedCount(t3);
				setWeek4SavedCount(t4);
			} catch (err) {}
		};
		fetchRequests();
	}, [sendRequest]);

	if (!allExercises) {
		return (
			<React.Fragment>
				<ErrorModal error={error} onClear={clearError} />
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
						<div
							style={{
								width: 'auto',
								margin: 'auto',
								background: 'none',
								border: '0px',
							}}
						>
							{trainerPlan && (
								<div style={{ margin: 'auto', textAlign: 'center' }}>
									{isDays && (
										<div className="grid">
											{true && (
												<Card
													style={{
														maxWidth: '250px',
													}}
												>
													<h3 className="week-header">WEEK 1 </h3>
													<hr />
													<div className="dayGrid">
														{trainerPlan.plan.map(p => (
															<div className="mh" id={p.dayNo}>
																{trainerPlan.traineeDay === p.dayNo &&
																	p.isSaved !== 1 &&
																	p.dayNo >= 1 &&
																	p.dayNo <= 7 && (
																		<button
																			className="daysButton--notsaved"
																			onClick={() => {
																				setDay(p.dayNo);
																				setIsDays(false);
																				setexer(p.exercises);
																			}}
																		>
																			Day {p.dayNo}*
																		</button>
																	)}
																{!(trainerPlan.traineeDay === p.dayNo) &&
																	p.isSaved !== 1 &&
																	p.dayNo >= 1 &&
																	p.dayNo <= 7 && (
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
																{trainerPlan.traineeDay === p.dayNo &&
																	p.isSaved === 1 &&
																	p.dayNo >= 1 &&
																	p.dayNo <= 7 && (
																		<button
																			className="daysButton--saved"
																			onClick={() => {
																				setDay(p.dayNo);
																				setIsDays(false);
																				setexer(p.exercises);
																			}}
																		>
																			Day {p.dayNo}*
																		</button>
																	)}
																{!(trainerPlan.traineeDay === p.dayNo) &&
																	p.isSaved === 1 &&
																	p.dayNo >= 1 &&
																	p.dayNo <= 7 && (
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
																{!(p.dayNo >= 1 && p.dayNo <= 7) && (
																	<div style={{ display: 'none' }}>hello</div>
																)}
															</div>
														))}
													</div>
													{!isLoading && trainerPlan && isDays && (
														<Card
															style={{
																margin: 'auto',
																background: 'none',
															}}
														>
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
																value={
																	trainerPlan.week1Submitted
																		? 'UPDATE'
																		: 'SUBMIT'
																}
																style={{ margin: '5px' }}
																disabled={week1savedCount === 0}
																onClick={async e => {
																	e.preventDefault();
																	try {
																		const responseData = await sendRequest(
																			`http://localhost:5000/api/getplan/submit`,
																			'PATCH',
																			JSON.stringify({
																				traineeid: traineeid,
																				startDay: 1,
																				lastDay: 7,
																			}),
																			{
																				'Content-Type': 'application/json',
																			}
																		);
																		console.log(responseData);
																	} catch (err) {}
																	try {
																		const responseData = await sendRequest(
																			`http://localhost:5000/api/getplan/getdefaultplan1/${traineeid}`
																		);
																		console.log('2nd');
																		setTrainerPlan(
																			responseData.defaultexercise
																		);
																		var i,
																			t1 = 0,
																			t2 = 0,
																			t3 = 0,
																			t4 = 0;
																		for (
																			i = 0;
																			i <
																			responseData.defaultexercise.plan.length;
																			i++
																		) {
																			if (
																				responseData.defaultexercise.plan[i]
																					.isSaved === 1
																			) {
																				if (
																					responseData.defaultexercise.plan[i]
																						.dayNo >= 1 &&
																					responseData.defaultexercise.plan[i]
																						.dayNo <= 7
																				) {
																					t1 += 1;
																				}
																				if (
																					responseData.defaultexercise.plan[i]
																						.dayNo >= 8 &&
																					responseData.defaultexercise.plan[i]
																						.dayNo <= 14
																				) {
																					t2 += 1;
																				}
																				if (
																					responseData.defaultexercise.plan[i]
																						.dayNo >= 15 &&
																					responseData.defaultexercise.plan[i]
																						.dayNo <= 21
																				) {
																					t3 += 1;
																				}
																				if (
																					responseData.defaultexercise.plan[i]
																						.dayNo >= 22 &&
																					responseData.defaultexercise.plan[i]
																						.dayNo <= 28
																				) {
																					t4 += 1;
																				}
																			}
																		}
																		setWeek1SavedCount(t1);
																		setWeek2SavedCount(t2);
																		setWeek3SavedCount(t3);
																		setWeek4SavedCount(t4);
																	} catch (err) {
																	} finally {
																		handleClick(TransitionDown);
																	}
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
												</Card>
											)}
											{trainerPlan.week1Submitted === 1 && (
												<Card style={{ maxWidth: '250px' }}>
													<h3 className="week-header">WEEK 2 </h3>
													<hr />
													<div className="dayGrid">
														{trainerPlan.plan.map(p => (
															<div className="mh" id={p.dayNo}>
																{trainerPlan.traineeDay === p.dayNo &&
																	p.isSaved !== 1 &&
																	p.dayNo >= 8 &&
																	p.dayNo <= 14 && (
																		<button
																			className="daysButton--notsaved"
																			onClick={() => {
																				setDay(p.dayNo);
																				setIsDays(false);
																				setexer(p.exercises);
																			}}
																		>
																			Day {p.dayNo}*
																		</button>
																	)}
																{!(trainerPlan.traineeDay === p.dayNo) &&
																	p.isSaved !== 1 &&
																	p.dayNo >= 8 &&
																	p.dayNo <= 14 && (
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
																{trainerPlan.traineeDay === p.dayNo &&
																	p.isSaved === 1 &&
																	p.dayNo >= 8 &&
																	p.dayNo <= 14 && (
																		<button
																			className="daysButton--saved"
																			onClick={() => {
																				setDay(p.dayNo);
																				setIsDays(false);
																				setexer(p.exercises);
																			}}
																		>
																			Day {p.dayNo}*
																		</button>
																	)}
																{!(trainerPlan.traineeDay === p.dayNo) &&
																	p.isSaved === 1 &&
																	p.dayNo >= 8 &&
																	p.dayNo <= 14 && (
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
																{!(p.dayNo >= 8 && p.dayNo <= 14) && (
																	<div style={{ display: 'none' }}>hello</div>
																)}
															</div>
														))}
													</div>
													{!isLoading && trainerPlan && isDays && (
														<Card
															style={{
																margin: 'auto',
																background: 'none',
															}}
														>
															<input
																class="button"
																type="button"
																value="RESET"
																style={{ margin: '5px' }}
																onClick={showWarningHandler2}
															></input>
															<input
																class="button"
																type="button"
																value={
																	trainerPlan.week2Submitted
																		? 'UPDATE'
																		: 'SUBMIT'
																}
																style={{ margin: '5px' }}
																disabled={week2savedCount === 0}
																onClick={async e => {
																	e.preventDefault();
																	handleClick(TransitionDown);
																	try {
																		const responseData = await sendRequest(
																			`http://localhost:5000/api/getplan/submit`,
																			'PATCH',
																			JSON.stringify({
																				traineeid: traineeid,
																				startDay: 8,
																				lastDay: 14,
																			}),
																			{
																				'Content-Type': 'application/json',
																			}
																		);
																		console.log(responseData);
																	} catch (err) {}
																	try {
																		const responseData = await sendRequest(
																			`http://localhost:5000/api/getplan/getdefaultplan1/${traineeid}`
																		);
																		setTrainerPlan(
																			responseData.defaultexercise
																		);
																		var i,
																			t1 = 0,
																			t2 = 0,
																			t3 = 0,
																			t4 = 0;
																		for (
																			i = 0;
																			i <
																			responseData.defaultexercise.plan.length;
																			i++
																		) {
																			if (
																				responseData.defaultexercise.plan[i]
																					.isSaved === 1
																			) {
																				if (
																					responseData.defaultexercise.plan[i]
																						.dayNo >= 1 &&
																					responseData.defaultexercise.plan[i]
																						.dayNo <= 7
																				) {
																					t1 += 1;
																				}
																				if (
																					responseData.defaultexercise.plan[i]
																						.dayNo >= 8 &&
																					responseData.defaultexercise.plan[i]
																						.dayNo <= 14
																				) {
																					t2 += 1;
																				}
																				if (
																					responseData.defaultexercise.plan[i]
																						.dayNo >= 15 &&
																					responseData.defaultexercise.plan[i]
																						.dayNo <= 21
																				) {
																					t3 += 1;
																				}
																				if (
																					responseData.defaultexercise.plan[i]
																						.dayNo >= 22 &&
																					responseData.defaultexercise.plan[i]
																						.dayNo <= 28
																				) {
																					t4 += 1;
																				}
																			}
																		}
																		setWeek1SavedCount(t1);
																		setWeek2SavedCount(t2);
																		setWeek3SavedCount(t3);
																		setWeek4SavedCount(t4);
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
												</Card>
											)}
											{trainerPlan.week2Submitted === 1 && (
												<Card style={{ maxWidth: '250px' }}>
													<h3 className="week-header">WEEK 3 </h3>
													<hr />
													<div className="dayGrid3">
														{trainerPlan.plan.map(p => (
															<div className="mh" id={p.dayNo}>
																{trainerPlan.traineeDay === p.dayNo &&
																	p.isSaved !== 1 &&
																	p.dayNo >= 15 &&
																	p.dayNo <= 21 && (
																		<button
																			className="daysButton--notsaved"
																			onClick={() => {
																				setDay(p.dayNo);
																				setIsDays(false);
																				setexer(p.exercises);
																			}}
																		>
																			Day {p.dayNo}*
																		</button>
																	)}
																{!(trainerPlan.traineeDay === p.dayNo) &&
																	p.isSaved !== 1 &&
																	p.dayNo >= 15 &&
																	p.dayNo <= 21 && (
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
																{trainerPlan.traineeDay === p.dayNo &&
																	p.isSaved === 1 &&
																	p.dayNo >= 15 &&
																	p.dayNo <= 21 && (
																		<button
																			className="daysButton--saved"
																			onClick={() => {
																				setDay(p.dayNo);
																				setIsDays(false);
																				setexer(p.exercises);
																			}}
																		>
																			Day {p.dayNo}*
																		</button>
																	)}
																{!(trainerPlan.traineeDay === p.dayNo) &&
																	p.isSaved === 1 &&
																	p.dayNo >= 15 &&
																	p.dayNo <= 21 && (
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
																{!(p.dayNo >= 15 && p.dayNo <= 21) && (
																	<div style={{ display: 'none' }}>hello</div>
																)}
															</div>
														))}
													</div>
													{!isLoading && trainerPlan && isDays && (
														<Card
															style={{
																margin: 'auto',
																background: 'none',
															}}
														>
															<input
																className="button"
																type="button"
																value="RESET"
																style={{ margin: '5px' }}
																onClick={showWarningHandler3}
															></input>
															<input
																class="button"
																type="button"
																value={
																	trainerPlan.week3Submitted
																		? 'UPDATE'
																		: 'SUBMIT'
																}
																style={{ margin: '5px' }}
																disabled={week3savedCount === 0}
																onClick={async e => {
																	e.preventDefault();
																	handleClick(TransitionDown);
																	try {
																		const responseData = await sendRequest(
																			`http://localhost:5000/api/getplan/submit`,
																			'PATCH',
																			JSON.stringify({
																				traineeid: traineeid,
																				startDay: 15,
																				lastDay: 21,
																			}),
																			{
																				'Content-Type': 'application/json',
																			}
																		);
																		console.log(responseData);
																	} catch (err) {}
																	try {
																		const responseData = await sendRequest(
																			`http://localhost:5000/api/getplan/getdefaultplan1/${traineeid}`
																		);
																		setTrainerPlan(
																			responseData.defaultexercise
																		);
																		var i,
																			t1 = 0,
																			t2 = 0,
																			t3 = 0,
																			t4 = 0;
																		for (
																			i = 0;
																			i <
																			responseData.defaultexercise.plan.length;
																			i++
																		) {
																			if (
																				responseData.defaultexercise.plan[i]
																					.isSaved === 1
																			) {
																				if (
																					responseData.defaultexercise.plan[i]
																						.dayNo >= 1 &&
																					responseData.defaultexercise.plan[i]
																						.dayNo <= 7
																				) {
																					t1 += 1;
																				}
																				if (
																					responseData.defaultexercise.plan[i]
																						.dayNo >= 8 &&
																					responseData.defaultexercise.plan[i]
																						.dayNo <= 14
																				) {
																					t2 += 1;
																				}
																				if (
																					responseData.defaultexercise.plan[i]
																						.dayNo >= 15 &&
																					responseData.defaultexercise.plan[i]
																						.dayNo <= 21
																				) {
																					t3 += 1;
																				}
																				if (
																					responseData.defaultexercise.plan[i]
																						.dayNo >= 22 &&
																					responseData.defaultexercise.plan[i]
																						.dayNo <= 28
																				) {
																					t4 += 1;
																				}
																			}
																		}
																		setWeek1SavedCount(t1);
																		setWeek2SavedCount(t2);
																		setWeek3SavedCount(t3);
																		setWeek4SavedCount(t4);
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
												</Card>
											)}
											{trainerPlan.week3Submitted === 1 && (
												<Card style={{ maxWidth: '250px' }}>
													<h3 className="week-header">WEEK 4 </h3>
													<hr />
													<div className="dayGrid">
														{trainerPlan.plan.map(p => (
															<div className="mh" id={p.dayNo}>
																{trainerPlan.traineeDay === p.dayNo &&
																	p.isSaved !== 1 &&
																	p.dayNo >= 22 &&
																	p.dayNo <= 28 && (
																		<button
																			className="daysButton--notsaved"
																			onClick={() => {
																				setDay(p.dayNo);
																				setIsDays(false);
																				setexer(p.exercises);
																			}}
																		>
																			Day {p.dayNo}*
																		</button>
																	)}
																{!(trainerPlan.traineeDay === p.dayNo) &&
																	p.isSaved !== 1 &&
																	p.dayNo >= 22 &&
																	p.dayNo <= 28 && (
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
																{trainerPlan.traineeDay === p.dayNo &&
																	p.isSaved === 1 &&
																	p.dayNo >= 22 &&
																	p.dayNo <= 28 && (
																		<button
																			className="daysButton--saved"
																			onClick={() => {
																				setDay(p.dayNo);
																				setIsDays(false);
																				setexer(p.exercises);
																			}}
																		>
																			Day {p.dayNo}*
																		</button>
																	)}
																{!(trainerPlan.traineeDay === p.dayNo) &&
																	p.isSaved === 1 &&
																	p.dayNo >= 22 &&
																	p.dayNo <= 28 && (
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
																{!(p.dayNo >= 22 && p.dayNo <= 28) && (
																	<div style={{ display: 'none' }}>hello</div>
																)}
															</div>
														))}
													</div>
													{!isLoading && trainerPlan && isDays && (
														<Card
															style={{
																margin: 'auto',
																background: 'none',
																color: 'white',
															}}
														>
															<input
																class="button"
																type="button"
																value="RESET"
																style={{ margin: '5px' }}
																onClick={showWarningHandler4}
															></input>
															<input
																class="button"
																type="button"
																value={
																	trainerPlan.week4Submitted
																		? 'UPDATE'
																		: 'SUBMIT'
																}
																style={{ margin: '5px' }}
																disabled={week4savedCount === 0}
																onClick={async e => {
																	e.preventDefault();
																	handleClick(TransitionDown);
																	try {
																		const responseData = await sendRequest(
																			`http://localhost:5000/api/getplan/submit`,
																			'PATCH',
																			JSON.stringify({
																				traineeid: traineeid,
																				startDay: 22,
																				lastDay: 28,
																			}),
																			{
																				'Content-Type': 'application/json',
																			}
																		);
																		console.log(responseData);
																	} catch (err) {}
																	try {
																		const responseData = await sendRequest(
																			`http://localhost:5000/api/getplan/getdefaultplan1/${traineeid}`
																		);
																		setTrainerPlan(
																			responseData.defaultexercise
																		);
																		var i,
																			t1 = 0,
																			t2 = 0,
																			t3 = 0,
																			t4 = 0;
																		for (
																			i = 0;
																			i <
																			responseData.defaultexercise.plan.length;
																			i++
																		) {
																			if (
																				responseData.defaultexercise.plan[i]
																					.isSaved === 1
																			) {
																				if (
																					responseData.defaultexercise.plan[i]
																						.dayNo >= 1 &&
																					responseData.defaultexercise.plan[i]
																						.dayNo <= 7
																				) {
																					t1 += 1;
																				}
																				if (
																					responseData.defaultexercise.plan[i]
																						.dayNo >= 8 &&
																					responseData.defaultexercise.plan[i]
																						.dayNo <= 14
																				) {
																					t2 += 1;
																				}
																				if (
																					responseData.defaultexercise.plan[i]
																						.dayNo >= 15 &&
																					responseData.defaultexercise.plan[i]
																						.dayNo <= 21
																				) {
																					t3 += 1;
																				}
																				if (
																					responseData.defaultexercise.plan[i]
																						.dayNo >= 22 &&
																					responseData.defaultexercise.plan[i]
																						.dayNo <= 28
																				) {
																					t4 += 1;
																				}
																			}
																		}
																		setWeek1SavedCount(t1);
																		setWeek2SavedCount(t2);
																		setWeek3SavedCount(t3);
																		setWeek4SavedCount(t4);
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
												</Card>
											)}
										</div>
									)}
									{!isDays && (
										<Card style={{ width: '35%', margin: 'auto' }}>
											<div style={{ backgroundColor: 'none', padding: '5px' }}>
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
																						style={{
																							width: 200,
																							color: 'white',
																						}}
																						classes={classes}
																						value={temp}
																						id="grouped-demo"
																						options={options.sort(
																							(a, b) =>
																								-b.firstLetter.localeCompare(
																									a.firstLetter
																								)
																						)}
																						groupBy={option =>
																							option.firstLetter
																						}
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
																						<label for="reps">Reps : </label>
																						<input
																							type="text"
																							name="reps"
																							defaultValue={0}
																							style={{
																								width: '3ch',
																								color: '#4caf50',
																							}}
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
																						<label for="time">Time : </label>
																						<input
																							type="text"
																							name="time"
																							defaultValue={0}
																							style={{
																								width: '3ch',
																								color: '#4caf50',
																							}}
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
																					<label for="reps">Reps : </label>
																					<input
																						type="text"
																						name="reps"
																						defaultValue={e.reps}
																						style={{
																							width: '3ch',
																							color: '#4caf50',
																						}}
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
																					<label for="time">Time : </label>
																					<input
																						type="text"
																						name="time"
																						defaultValue={e.time}
																						style={{
																							width: '3ch',
																							color: '#4caf50',
																						}}
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
																				color: 'white',
																				border: 'white',
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
																				style={{
																					margin: '10px 5px',
																					color: 'white',
																					borderColor: 'white',
																				}}
																				onClick={e => {
																					searchSubmitHandler(e);
																				}}
																			>
																				ADD
																			</button>
																			{showNew && (
																				<div className="repstime">
																					<label for="reps">Reps : </label>
																					<input
																						type="text"
																						name="reps"
																						defaultValue={0}
																						style={{
																							width: '3ch',
																							color: '#4caf50',
																						}}
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
																					<label for="time">TIME : </label>
																					<input
																						type="text"
																						name="time"
																						defaultValue={0}
																						style={{
																							width: '3ch',
																							color: '#4caf50',
																						}}
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
															<h4>ADD ANOTHER EXERCISE</h4>
														</button>
													</div>
												)}
												{!isDays && (
													<div>
														<button
															style={{
																margin: 'auto 5px',
																color: 'white',
																borderColor: 'white',
															}}
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
															style={{
																margin: 'auto 5px',
																color: 'white',
																borderColor: 'white',
															}}
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
																		setTrainerPlan(
																			responseData.defaultexercise
																		);
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
															style={{
																margin: 'auto 5px',
																color: 'white',
																borderColor: 'white',
															}}
															onClick={async e => {
																e.preventDefault();
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
																		setTrainerPlan(
																			responseData.defaultexercise
																		);
																	} catch (err) {
																	} finally {
																		if (day >= 1 && day <= 7) {
																			setWeek1SavedCount(week1savedCount + 1);
																		} else if (day >= 8 && day <= 14) {
																			setWeek2SavedCount(week2savedCount + 1);
																		} else if (day >= 15 && day <= 21) {
																			setWeek3SavedCount(week3savedCount + 1);
																		} else if (day >= 22 && day <= 28) {
																			setWeek4SavedCount(week4savedCount + 1);
																		}

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
										</Card>
									)}
								</div>
							)}
						</div>
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
											style={{
												margin: 'auto 5px',
												color: 'white',
												border: 'white',
											}}
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
							<div
								style={{
									marginRight: '10px',
									display: 'inline',
									color: 'white',
									border: 'white',
								}}
							>
								<Button danger onClick={cancelWarningHandler}>
									CANCEL
								</Button>
							</div>
							<Button
								inverse
								onClick={async e => {
									e.preventDefault();
									cancelWarningHandler();
									setDay(0);
									try {
										await sendRequest(
											`http://localhost:5000/api/getplan/resetall/${traineeid}`,
											'PATCH',
											JSON.stringify({
												startDay: 1,
												lastDay: 7,
											}),
											{
												'Content-Type': 'application/json',
											}
										);

										const responseData = await sendRequest(
											`http://localhost:5000/api/getplan/getdefaultplan1/${traineeid}`
										);
										setTrainerPlan(responseData.defaultexercise);
										var i,
											t1 = 0,
											t2 = 0,
											t3 = 0,
											t4 = 0;
										for (
											i = 0;
											i < responseData.defaultexercise.plan.length;
											i++
										) {
											if (responseData.defaultexercise.plan[i].isSaved === 1) {
												if (
													responseData.defaultexercise.plan[i].dayNo >= 1 &&
													responseData.defaultexercise.plan[i].dayNo <= 7
												) {
													t1 += 1;
												}
												if (
													responseData.defaultexercise.plan[i].dayNo >= 8 &&
													responseData.defaultexercise.plan[i].dayNo <= 14
												) {
													t2 += 1;
												}
												if (
													responseData.defaultexercise.plan[i].dayNo >= 15 &&
													responseData.defaultexercise.plan[i].dayNo <= 21
												) {
													t3 += 1;
												}
												if (
													responseData.defaultexercise.plan[i].dayNo >= 22 &&
													responseData.defaultexercise.plan[i].dayNo <= 28
												) {
													t4 += 1;
												}
											}
										}
										setWeek1SavedCount(t1);
										setWeek2SavedCount(t2);
										setWeek3SavedCount(t3);
										setWeek4SavedCount(t4);
									} catch (err) {}
								}}
							>
								DELETE
							</Button>
						</React.Fragment>
					}
				>
					<p>You want to reset week 1?</p>
				</Modal>
				<Modal
					show={showConfirmModal2}
					onCancel={cancelWarningHandler2}
					header="Are you sure?"
					footerClass="place-item__modal-actions"
					footer={
						<React.Fragment>
							<div style={{ marginRight: '10px', display: 'inline' }}>
								<Button danger onClick={cancelWarningHandler2}>
									CANCEL
								</Button>
							</div>
							<Button
								inverse
								onClick={async e => {
									e.preventDefault();
									cancelWarningHandler2();
									setDay(0);
									try {
										await sendRequest(
											`http://localhost:5000/api/getplan/resetall/${traineeid}`,
											'PATCH',
											JSON.stringify({
												startDay: 8,
												lastDay: 14,
											}),
											{
												'Content-Type': 'application/json',
											}
										);

										const responseData = await sendRequest(
											`http://localhost:5000/api/getplan/getdefaultplan1/${traineeid}`
										);
										setTrainerPlan(responseData.defaultexercise);
										var i,
											t1 = 0,
											t2 = 0,
											t3 = 0,
											t4 = 0;
										for (
											i = 0;
											i < responseData.defaultexercise.plan.length;
											i++
										) {
											if (responseData.defaultexercise.plan[i].isSaved === 1) {
												if (
													responseData.defaultexercise.plan[i].dayNo >= 1 &&
													responseData.defaultexercise.plan[i].dayNo <= 7
												) {
													t1 += 1;
												}
												if (
													responseData.defaultexercise.plan[i].dayNo >= 8 &&
													responseData.defaultexercise.plan[i].dayNo <= 14
												) {
													t2 += 1;
												}
												if (
													responseData.defaultexercise.plan[i].dayNo >= 15 &&
													responseData.defaultexercise.plan[i].dayNo <= 21
												) {
													t3 += 1;
												}
												if (
													responseData.defaultexercise.plan[i].dayNo >= 22 &&
													responseData.defaultexercise.plan[i].dayNo <= 28
												) {
													t4 += 1;
												}
											}
										}
										setWeek1SavedCount(t1);
										setWeek2SavedCount(t2);
										setWeek3SavedCount(t3);
										setWeek4SavedCount(t4);
									} catch (err) {}
								}}
							>
								DELETE
							</Button>
						</React.Fragment>
					}
				>
					<p>You want to reset week 2?</p>
				</Modal>
				<Modal
					show={showConfirmModal3}
					onCancel={cancelWarningHandler3}
					header="Are you sure?"
					footerClass="place-item__modal-actions"
					footer={
						<React.Fragment>
							<div style={{ marginRight: '10px', display: 'inline' }}>
								<Button danger onClick={cancelWarningHandler3}>
									CANCEL
								</Button>
							</div>
							<Button
								inverse
								onClick={async e => {
									e.preventDefault();
									cancelWarningHandler3();
									setDay(0);
									try {
										await sendRequest(
											`http://localhost:5000/api/getplan/resetall/${traineeid}`,
											'PATCH',
											JSON.stringify({
												startDay: 15,
												lastDay: 21,
											}),
											{
												'Content-Type': 'application/json',
											}
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
										var t1 = 0,
											t2 = 0,
											t3 = 0,
											t4 = 0;
										for (
											i = 0;
											i < responseData.defaultexercise.plan.length;
											i++
										) {
											if (responseData.defaultexercise.plan[i].isSaved === 1) {
												if (
													responseData.defaultexercise.plan[i].dayNo >= 1 &&
													responseData.defaultexercise.plan[i].dayNo <= 7
												) {
													t1 += 1;
												}
												if (
													responseData.defaultexercise.plan[i].dayNo >= 8 &&
													responseData.defaultexercise.plan[i].dayNo <= 14
												) {
													t2 += 1;
												}
												if (
													responseData.defaultexercise.plan[i].dayNo >= 15 &&
													responseData.defaultexercise.plan[i].dayNo <= 21
												) {
													t3 += 1;
												}
												if (
													responseData.defaultexercise.plan[i].dayNo >= 22 &&
													responseData.defaultexercise.plan[i].dayNo <= 28
												) {
													t4 += 1;
												}
											}
										}
										setWeek1SavedCount(t1);
										setWeek2SavedCount(t2);
										setWeek3SavedCount(t3);
										setWeek4SavedCount(t4);
									} catch (err) {}
								}}
							>
								DELETE
							</Button>
						</React.Fragment>
					}
				>
					<p>You want to reset week 3?</p>
				</Modal>
				<Modal
					show={showConfirmModal4}
					onCancel={cancelWarningHandler}
					header="Are you sure?"
					footerClass="place-item__modal-actions"
					footer={
						<React.Fragment>
							<div style={{ marginRight: '10px', display: 'inline' }}>
								<Button danger onClick={cancelWarningHandler4}>
									CANCEL
								</Button>
							</div>
							<Button
								inverse
								onClick={async e => {
									e.preventDefault();
									cancelWarningHandler4();
									setDay(0);
									try {
										await sendRequest(
											`http://localhost:5000/api/getplan/resetall/${traineeid}`,
											'PATCH',
											JSON.stringify({
												startDay: 22,
												lastDay: 28,
											}),
											{
												'Content-Type': 'application/json',
											}
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
										var t1 = 0,
											t2 = 0,
											t3 = 0,
											t4 = 0;
										for (
											i = 0;
											i < responseData.defaultexercise.plan.length;
											i++
										) {
											if (responseData.defaultexercise.plan[i].isSaved === 1) {
												if (
													responseData.defaultexercise.plan[i].dayNo >= 1 &&
													responseData.defaultexercise.plan[i].dayNo <= 7
												) {
													t1 += 1;
												}
												if (
													responseData.defaultexercise.plan[i].dayNo >= 8 &&
													responseData.defaultexercise.plan[i].dayNo <= 14
												) {
													t2 += 1;
												}
												if (
													responseData.defaultexercise.plan[i].dayNo >= 15 &&
													responseData.defaultexercise.plan[i].dayNo <= 21
												) {
													t3 += 1;
												}
												if (
													responseData.defaultexercise.plan[i].dayNo >= 22 &&
													responseData.defaultexercise.plan[i].dayNo <= 28
												) {
													t4 += 1;
												}
											}
										}
										setWeek1SavedCount(t1);
										setWeek2SavedCount(t2);
										setWeek3SavedCount(t3);
										setWeek4SavedCount(t4);
									} catch (err) {}
								}}
							>
								DELETE
							</Button>
						</React.Fragment>
					}
				>
					<p>You want to reset week 4?</p>
				</Modal>
			</React.Fragment>
		);
	}
};

export default GivePlan;
