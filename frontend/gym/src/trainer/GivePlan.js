import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Card, Image } from 'react-bootstrap';
import ErrorModal from '../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../shared/hooks/http-hook';
import { traineeid, traineename } from './showtrainee';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

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
		'& MuiOutlinedInput': {
			position: 'relative',
			borderRadius: '4px',
			width: '200px !important',
		},
		MuiOutlinedInput: {
			position: 'relative',
			borderRadius: '4px',
			width: '200px !important',
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
		'& MuiOutlinedInput': {
			position: 'relative',
			borderRadius: '4px',
			width: '200px',
		},
		MuiOutlinedInput: {
			position: 'relative',
			borderRadius: '4px',
			width: '200px !important',
		},
		'& MuiOutlinedInput-root': {
			position: 'relative',
			borderRadius: '4px',
			width: '200px',
		},
	},
	root: {
		'& MuiOutlinedInput-root': {
			position: 'relative',
			borderRadius: '4px',
			width: '200px',
		},
		'& MuiOutlinedInput': {
			position: 'relative',
			borderRadius: '4px',
			width: '200px',
		},
		MuiOutlinedInput: {
			position: 'relative',
			borderRadius: '4px',
			width: '200px !important',
		},
	},
}));

const GivePlan = () => {
	const history = useHistory();
	let temp;
	const classes = useStyles();
	const [day, setDay] = useState(0);
	const [allExercises, setAllExercises] = useState();
	const [loadedExercises, setloadedExercises] = useState();
	const [searched, setSearched] = useState();
	const [isDays, setIsDays] = useState(true);
	const [plan, setPlan] = useState();
	const [trainerPlan, setTrainerPlan] = useState();
	const [exer, setexer] = useState();
	const [showNew, setShowNew] = useState(false);
	const [searched1, setSerched1] = useState(false);
	const [data, setData] = useState({
		difficulty: '',
		gender: '',
		goal: '',
		time: '',
		strength: '',
		pushup: '',
		workout: '',
	});
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const deleteexercise = (p1, e) => {
		if (trainerPlan) {
			let abc = exer.filter(e1 => e1.exerciseid.id !== e.exerciseid.id);
			setexer(abc);
			console.log('hello', abc);
		}
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
					reps: 0,
					time: 0,
					exerciseid: responseData.exe,
				};
				let abc;

				console.log(obj);

				abc = [...exer, obj];
				setexer(abc);
			} catch (err) {
			} finally {
				setShowNew(false);
				setloadedExercises();
				setSerched1(false);
			}
		}
	};

	useEffect(() => {
		const fetchRequests = async () => {
			try {
				const responseData = await sendRequest(
					`http://localhost:5000/api/getplan/getdetails/${traineeid}`
				);
				setData(responseData.exe);
			} catch (err) {}
		};
		fetchRequests();
	}, [sendRequest]);

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
				const responseData = await sendRequest(
					`http://localhost:5000/api/getplan/getdefaultplan/${traineeid}`
				);
				setPlan(responseData.defaultexercise);
				setTrainerPlan(responseData.defaultexercise);
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
						<LoadingSpinner asOverlay />
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
				{!isLoading && (
					<div className="header1">
						<h3> Please Provide fitness plan for {traineename}</h3>
					</div>
				)}
				<div className="card1">
					<Card style={{ width: '495px', margin: 'auto', background: 'none' }}>
						{trainerPlan && (
							<div>
								{isDays && (
									<div className="grid">
										{trainerPlan.plan.map(p => (
											<button
												className="daysButton"
												onClick={() => {
													setDay(p.dayNo);
													setIsDays(false);
													setexer(p.exercises);
												}}
											>
												Day {p.dayNo}
											</button>
										))}
									</div>
								)}
								{!isDays && (
									<div style={{ backgroundColor: 'gray', padding: '5px' }}>
										{trainerPlan.plan.map(p1 => (
											<div>
												{p1.dayNo === day && p1.exercises.length === 0 && (
													<h3>No Exercise Today. Take Rest.</h3>
												)}
												{p1.dayNo === day && p1.exercises.length !== 0 && (
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
																	{e.reps !== 0 && <h3>{e.reps}x</h3>}
																	{e.time !== 0 && <h3>{e.time}s</h3>}
																</div>
																<button
																	className="close"
																	onClick={() => {
																		deleteexercise(p1, e);
																	}}
																>
																	X
																</button>
																<button
																	className="goto"
																	onClick={event => {
																		event.preventDefault();
																		console.log(e.exerciseid.id);
																		history.push(`/search/${e.exerciseid.id}`);
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
																			getOptionSelected={option => option.ename}
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
																	onClick={e => {
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
													onClick={() => {
														setIsDays(true);
													}}
												>
													BACK
												</button>
												<button
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
																	reps: 0,
																	time: 0,
																}),
																{
																	'Content-Type': 'application/json',
																}
															);
															console.log(responseData);
														} catch (err) {
														} finally {
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
			</React.Fragment>
		);
	}
};

export default GivePlan;
