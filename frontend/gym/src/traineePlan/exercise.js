import React, { useState, useEffect, useContext } from 'react';
import { Image } from 'react-bootstrap';
import Countdown from 'react-countdown';
import ErrorModal from '../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../shared/context/auth-context';
import { useHttpClient } from '../shared/hooks/http-hook';

import GifIcon from '@material-ui/icons/Gif';
import VideocamIcon from '@material-ui/icons/Videocam';
import CheckIcon from '@material-ui/icons/Check';
import { Dialog, DialogOverlay } from '@reach/dialog';
import '@reach/dialog/styles.css';

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
	const [showDialog, setShowDialog] = React.useState(false);
	const [showWarning, setShowWarning] = React.useState(false);
	const open = () => {
		setShowDialog(true);
		setShowWarning(false);
	};
	const close = () => setShowDialog(false);
	const dismiss = () => setShowWarning(true);

	const completeHandler = async feedback => {
		try {
			setShowDialog(false);
			console.log(feedback);
			await sendRequest(
				`http://localhost:5000/api/viewplan/zerocomplete`,
				'PATCH',
				JSON.stringify({
					tuid: auth.userId,
					fb: feedback,
					day: props.dayNumber,
				}),
				{
					'Content-Type': 'application/json',
				}
			);
		} catch (err) {
			console.log(err);
		} finally {
			setFinished(true);
		}
	};

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
			setIsWaiting(false);
			return <div style={{ display: 'none' }}></div>;
		} else {
			return (
				<div>
					<h3 style={{ margin: '5px 0px', fontSize: '40px' }}>
						Ready to go...
					</h3>
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
			return (
				<span style={{ margin: '5px 0px', fontSize: '50px' }}>{seconds}</span>
			);
		}
	};
	const complated = ({ minutes, seconds, completed }) => {
		if (completed) {
			// Render a completed state
			setIsCompleted(true);
			return <div style={{ display: 'none' }}></div>;
		} else {
			// Render a countdown
			if (exerciseNo !== props.items.exercises.length - 1)
				return (
					<span style={{ margin: '5px 0px', fontSize: '40px' }}>
						Do Exercise..
					</span>
				);
			else {
				return <div style={{ display: 'none' }}></div>;
			}
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
			return (
				<span style={{ margin: '5px 0px', fontSize: '40px' }}>COMPLETE</span>
			);
		}
	};
	// let fxProps = {
	// 	count: 3,
	// 	interval: 200,
	// 	colors: ['#cc3333', '#4CAF50', '#81C784'],
	// 	calc: (props, i) => ({
	// 		...props,
	// 		x: 150 + i * 50,
	// 		y: 125,
	// 	}),
	// };
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
				<div>
					<h1>REST</h1>
					<span style={{ color: '#4caf50', fontSize: '32px' }}>
						{minutes}:{seconds}
					</span>
				</div>
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
							<h1 style={{}}>
								{props.items.exercises[exerciseNo].exerciseid.ename}
							</h1>
							<div style={{ textAlign: 'right' }}>
								{isGif && (
									<button
										style={{
											color: '#4caf50',
											border: '1px solid #4caf50',
											marginBottom: '5px',
											paddingBottom: '4px',
										}}
										onClick={() => setIsGif(false)}
									>
										<VideocamIcon />
									</button>
								)}
								{!isGif && (
									<button
										style={{
											color: '#4caf50',
											border: '1px solid #4caf50',
											marginBottom: '5px',
											fontSize: '5px',
										}}
										onClick={() => setIsGif(true)}
									>
										<GifIcon />
									</button>
								)}
							</div>
							{isGif && (
								<div className="gif">
									<Image
										src={props.items.exercises[exerciseNo].exerciseid.gif}
										style={{
											border: '1px solid #4caf50',
											width: '90%',
											height: '315px',
											margin: '5px 10px 5px 0',
											borderRadius: '8px',
										}}
										fluid
									/>
								</div>
							)}
							{!isGif && (
								<iframe
									style={{
										margin: '5px 0',
										border: '1px solid #4caf50',
										borderRadius: '8px',
										width: '90%',
									}}
									title={props.items.exercises[exerciseNo].exerciseid.ename}
									height="315"
									src={props.items.exercises[exerciseNo].exerciseid.vlink}
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
								></iframe>
							)}

							{props.items.exercises[exerciseNo].reps !== 0 && (
								<h2 style={{ fontSize: '40px', color: '#4caf50' }}>
									{props.items.exercises[exerciseNo].reps}x
								</h2>
							)}
							{props.items.exercises[exerciseNo].time !== 0 && (
								<h2 style={{ fontSize: '40px' }}>
									{props.items.exercises[exerciseNo].time}s
								</h2>
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
							{!isWaiting &&
								isStarted &&
								!isCompleted &&
								props.items.exercises[exerciseNo].reps !== 0 && (
									<Countdown
										date={Date.now() + 5 * 1000}
										renderer={complated}
									/>
								)}
							{!isWaiting && isStarted && isCompleted && (
								<Countdown
									date={Date.now() + 60 * 1000}
									renderer={aftercomplate}
								/>
							)}
							{!isWaiting && isStarted && (
								<div style={{ marginBottom: '10px' }}>
									<input
										className="button"
										type="button"
										name="<"
										value="<"
										style={{ margin: 'auto 5px' }}
										disabled={exerciseNo === 0}
										onClick={() => {
											setExerciseNo(exerciseNo - 1);
											setIsWaiting(true);
											setisStarted(false);
											setIsCompleted(false);
										}}
									/>
									{!(exerciseNo === props.items.exercises.length - 1) && (
										<button
											className="button"
											style={{
												margin: 'auto 5px',
											}}
											onClick={() => {
												setIsRest(true);
											}}
										>
											<CheckIcon />
										</button>
									)}
									{exerciseNo === props.items.exercises.length - 1 && (
										<input
											className="button"
											type="button"
											name="COMPLETE"
											value="COMPLETE"
											style={{ margin: 'auto 5px' }}
											onClick={async () => {
												open();
											}}
										/>
									)}
									{/* {!(exerciseNo === props.items.exercises.length - 1) && (
										<input
											className="button"
											type="button"
											name="COMPLETE"
											value="COMPLETE"
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
										/>
									)} */}
									<input
										className="button"
										type="button"
										name=">"
										value=">"
										style={{ margin: 'auto 5px' }}
										disabled={exerciseNo === props.items.exercises.length - 1}
										onClick={() => {
											setExerciseNo(exerciseNo + 1);
											setIsWaiting(true);
											setisStarted(false);
											setIsCompleted(false);
										}}
									/>
								</div>
							)}
						</div>
					)}
					{isRest && (
						<div>
							<Countdown date={Date.now() + 30 * 1000} renderer={resting} />
							<input
								className="button"
								type="button"
								name="SKIP"
								value="SKIP"
								style={{ margin: '10px 5px' }}
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
							/>
						</div>
					)}
				</div>
			)}
			{!isLoading && finished && (
				<div>
					<h3 syle={{ margin: '10px' }}>day {props.items.dayNo} Finished</h3>
				</div>
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
						className="dialog"
						style={{
							maxWidth: '400px',
							marginTop: '50px !important',
							background: 'black',
							textAlign: 'center',
						}}
					>
						{showWarning && (
							<p style={{ color: 'red' }}>You must make a choice, sorry :(</p>
						)}
						<h4 style={{ color: 'white' }}>HOW DO YOU FEEL</h4>
						<hr />
						<button
							className="button"
							style={{ margin: 'auto 5px', width: '150px' }}
							onClick={() => {
								completeHandler(1);
							}}
						>
							EASY
						</button>
						<br />
						<br />
						<button
							className="button"
							onClick={() => {
								completeHandler(5);
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
								completeHandler(10);
							}}
							style={{ margin: 'auto 5px', width: '150px' }}
						>
							TOO HARD
						</button>
					</Dialog>
				</DialogOverlay>
			</div>
		</React.Fragment>
	);
};

export default Exercise;

/*
<div style={{ margin: '50px', padding: '50px' }}>
						<Fireworks {...fxProps} />
					</div>
					import { Fireworks } from 'fireworks/lib/react';
 */
