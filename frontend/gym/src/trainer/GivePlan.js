import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Card, Image } from 'react-bootstrap';
import ErrorModal from '../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../shared/hooks/http-hook';
import { traineeid, traineename } from './showtrainee';
import './Giveplan.css';

const GivePlan = () => {
	const history = useHistory();
	const [day, setDay] = useState(0);
	const [isDays, setIsDays] = useState(true);
	const [plan, setPlan] = useState();
	const [trainerPlan, setTrainerPlan] = useState();
	const [exer, setexer] = useState();
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
		console.log(p1);
		if (trainerPlan) {
			let abc = exer.filter(e1 => e1.exerciseid.id !== e.exerciseid.id);
			// let abc = trainerPlan.map(p =>
			// 	p.plan.map(p1 =>
			// 		p1.exercises.filter(e1 => e1.exerciseid.id !== e.exerciseid.id)
			// 	)
			// );
			// setTrainerPlan(abc);
			setexer(abc);
			console.log('hello', abc);
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
		const fetchRequests = async () => {
			try {
				const responseData = await sendRequest(
					`http://localhost:5000/api/getplan/getdefaultplan`
				);
				setPlan(responseData.defaultexercise);
				setTrainerPlan(responseData.defaultexercise);
			} catch (err) {}
		};
		fetchRequests();
	}, [sendRequest]);

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			{isLoading && (
				<div className="center">
					<LoadingSpinner />
				</div>
			)}
			<div className="header1">
				<h3> Please Provide fitness plan for {traineename}</h3>
			</div>
			<div className="card1">
				{console.log(trainerPlan)}
				<Card style={{ width: '50%', margin: 'auto', background: 'none' }}>
					{trainerPlan &&
						trainerPlan.map(p => (
							<div>
								{isDays &&
									p.gender === data.gender &&
									p.difficulty === data.difficulty &&
									p.goal === data.goal &&
									p.pushups === data.pushups &&
									p.workout === data.workout &&
									p.strength === data.strength &&
									p.time === data.time && (
										<div className="grid">
											{p.plan.map(p => (
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
								{!isDays &&
									p.gender === data.gender &&
									p.difficulty === data.difficulty &&
									p.goal === data.goal &&
									p.pushups === data.pushups &&
									p.workout === data.workout &&
									p.strength === data.strength &&
									p.time === data.time && (
										<div>
											{p.plan.map(p1 => (
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

																	<button className="goto" onClick={() => {}}>
																		&gt;
																	</button>
																	<button
																		className="close"
																		onClick={() => {
																			deleteexercise(p1, e);
																		}}
																	>
																		X
																	</button>
																</React.Fragment>
															))}
															<h3>add another data.</h3>
														</div>
													)}
												</div>
											))}
										</div>
									)}
							</div>
						))}
					{!isDays && (
						<button
							onClick={() => {
								setIsDays(true);
								console.log(day);
							}}
						>
							BACK
						</button>
					)}
				</Card>
			</div>
		</React.Fragment>
	);
};

export default GivePlan;
