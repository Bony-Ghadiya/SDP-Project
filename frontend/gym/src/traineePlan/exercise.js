import React, { useState, useEffect, useContext } from 'react';
import { Image } from 'react-bootstrap';
import Countdown from 'react-countdown';
import ErrorModal from '../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../shared/context/auth-context';
import { useHttpClient } from '../shared/hooks/http-hook';
import { Fireworks } from 'fireworks/lib/react';
import GifIcon from '@material-ui/icons/Gif';
import VideocamIcon from '@material-ui/icons/Videocam';
import CheckIcon from '@material-ui/icons/Check';
export let Fine = true;

const Exercise = props => {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const auth = useContext(AuthContext);

	const [isGif, setIsGif] = useState(true);
	const [isRest, setIsRest] = useState(false);
	const [exerciseNo, setExerciseNo] = useState(0);
	const [isWaiting, setIsWaiting] = useState(true);
	const [isStarted, setisStarted] = useState(false);

	const [isCompleted, setIsCompleted] = useState(false);
	const [finished, setFinished] = useState(false);

	useEffect(() => {
		const fetchRequests = async () => {
			setIsWaiting(true);
			setisStarted(false);
			setIsCompleted(false);
		};
		fetchRequests();
	}, []);

	const waiting = ({ hours, minutes, seconds, completed }) => {
		if (completed) {
			// Render a completed state
			setIsWaiting(false);
			return <div style={{ display: 'none' }}></div>;
		} else {
			// Render a countdown
			return (
				<div>
					<h3>Ready to go...</h3>
				</div>
			);
		}
	};
	const timer = ({ hours, minutes, seconds, completed }) => {
		if (completed) {
			// Render a completed state
			setisStarted(true);
			return <div style={{ display: 'none' }}></div>;
		} else {
			// Render a countdown
			return <span style={{ fontSize: '32px' }}>{seconds}</span>;
		}
	};
	const complated = ({ minutes, seconds, completed }) => {
		if (completed) {
			// Render a completed state
			setIsCompleted(true);
			return <div style={{ display: 'none' }}></div>;
		} else {
			// Render a countdown
			return (
				<span style={{ fontSize: '32px' }}>
					Do Exercise..{minutes}:{seconds}
				</span>
			);
		}
	};
	const aftercomplate = ({ minutes, seconds, completed }) => {
		if (completed) {
			// Render a completed state
			if (exerciseNo === props.items.exercises.length - 1) {
				setFinished(true);
			} else {
				setIsRest(true);
			}

			return <div style={{ display: 'none' }}></div>;
		} else {
			// Render a countdown
			return <span style={{ fontSize: '32px' }}>COMPLETE</span>;
		}
	};
	let fxProps = {
		count: 3,
		interval: 200,
		colors: ['#cc3333', '#4CAF50', '#81C784'],
		calc: (props, i) => ({
			...props,
			x: 150 + i * 50,
			y: 125,
		}),
	};
	const resting = ({ minutes, seconds, completed }) => {
		if (completed) {
			// Render a completed state
			setIsRest(false);
			setExerciseNo(exerciseNo + 1);
			setIsWaiting(true);
			setisStarted(false);
			setIsCompleted(false);
			return <div style={{ display: 'none' }}></div>;
		} else {
			// Render a countdown
			return (
				<span style={{ fontSize: '32px' }}>
					Do Exercise..{minutes}:{seconds}
				</span>
			);
		}
	};
	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			{isLoading && (
				<div className="center">
					<LoadingSpinner />
				</div>
			)}
			{!isLoading && !finished && (
				<div>
					{!isRest && (
						<div>
							<h1>{props.items.exercises[exerciseNo].exerciseid.ename}</h1>
							<div style={{ textAlign: 'right' }}>
								{isGif && (
									<button onClick={() => setIsGif(false)}>
										<VideocamIcon />
									</button>
								)}
								{!isGif && (
									<button onClick={() => setIsGif(true)}>
										<GifIcon />
									</button>
								)}
							</div>
							{isGif && (
								<div className="gif">
									<Image
										src={props.items.exercises[exerciseNo].exerciseid.gif}
										style={{
											width: '485px',
											height: '315px',
										}}
										fluid
									/>
								</div>
							)}
							{!isGif && (
								<iframe
									style={{ borderRadius: '8px' }}
									title={props.items.exercises[exerciseNo].exerciseid.ename}
									width="485"
									height="315"
									src={props.items.exercises[exerciseNo].exerciseid.vlink}
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
								></iframe>
							)}

							{props.items.exercises[exerciseNo].reps !== 0 && (
								<h3>{props.items.exercises[exerciseNo].reps}x</h3>
							)}
							{props.items.exercises[exerciseNo].time !== 0 && (
								<h3>{props.items.exercises[exerciseNo].time}s</h3>
							)}

							{isWaiting && (
								<Countdown date={Date.now() + 5000} renderer={waiting} />
							)}
							{!isWaiting && !isStarted && !isCompleted && (
								<Countdown date={Date.now() + 5000} renderer={timer} />
							)}
							{!isWaiting &&
								isStarted &&
								!isCompleted &&
								props.items.exercises[exerciseNo].time !== 0 && (
									<Countdown
										date={
											Date.now() + props.items.exercises[exerciseNo].time * 1000
										}
										renderer={complated}
									/>
								)}
							{!isWaiting && isStarted && !isCompleted && (
								<Countdown date={Date.now() + 5 * 1000} renderer={complated} />
							)}
							{!isWaiting && isStarted && isCompleted && (
								<Countdown
									date={Date.now() + 60 * 1000}
									renderer={aftercomplate}
								/>
							)}
							{!isWaiting && isStarted && (
								<div style={{ marginBottom: '10px' }}>
									<button
										style={{ margin: 'auto 5px' }}
										disabled={exerciseNo === 0}
										onClick={() => {
											setExerciseNo(exerciseNo - 1);
											setIsWaiting(true);
											setisStarted(false);
											setIsCompleted(false);
										}}
									>
										&lt;
									</button>
									{!(exerciseNo === props.items.exercises.length - 1) && (
										<button
											style={{ margin: 'auto 5px' }}
											onClick={() => {
												setIsRest(true);
											}}
										>
											<CheckIcon />
										</button>
									)}

									{exerciseNo === props.items.exercises.length - 1 && (
										<button
											style={{ margin: 'auto 5px' }}
											onClick={async () => {
												setFinished(true);
												let responseData;
												try {
													responseData = await sendRequest(
														`http://localhost:5000/api/viewplan/zerocomplete`,
														'PATCH',
														JSON.stringify({
															tuid: auth.userId,
															day: props.items.dayNo,
														}),
														{
															'Content-Type': 'application/json',
														}
													);
													console.log(responseData.defaultexercise);
												} catch (err) {
													console.log(err);
												}
											}}
										>
											COMPLETE
										</button>
									)}

									{!(exerciseNo === props.items.exercises.length - 1) && (
										<button
											style={{ margin: 'auto 5px' }}
											onClick={async () => {
												setFinished(true);
												let responseData;
												try {
													responseData = await sendRequest(
														`http://localhost:5000/api/viewplan/zerocomplete`,
														'PATCH',
														JSON.stringify({
															tuid: auth.userId,
															day: props.items.dayNo,
														}),
														{
															'Content-Type': 'application/json',
														}
													);
													console.log(responseData.defaultexercise);
												} catch (err) {
													console.log(err);
												}
											}}
										>
											COMPLETE
										</button>
									)}

									<button
										style={{ margin: 'auto 5px' }}
										disabled={exerciseNo === props.items.exercises.length - 1}
										onClick={() => {
											setExerciseNo(exerciseNo + 1);
											setIsWaiting(true);
											setisStarted(false);
											setIsCompleted(false);
										}}
									>
										&gt;
									</button>
								</div>
							)}
						</div>
					)}
					{isRest && (
						<div>
							<h3>REST</h3>
							<Countdown date={Date.now() + 30 * 1000} renderer={resting} />

							<button
								onClick={() => {
									setIsRest(false);
									if (exerciseNo === props.items.exercises.length - 1) {
									} else {
										setExerciseNo(exerciseNo + 1);
									}

									setIsWaiting(true);
									setisStarted(false);
									setIsCompleted(false);
								}}
							>
								SKIP
							</button>
						</div>
					)}
				</div>
			)}
			{!isLoading && finished && (
				<div>
					<h3>day {props.items.dayNo} Finished</h3>
				</div>
			)}
		</React.Fragment>
	);
};

export default Exercise;

/*
<div style={{ margin: '50px', padding: '50px' }}>
						<Fireworks {...fxProps} />
					</div>
 */
