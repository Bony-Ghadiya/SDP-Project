import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import ErrorModal from '../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../shared/hooks/http-hook';
import { traineeid, traineename } from './showtrainee';
import { Card } from 'react-bootstrap';
import Countdown from 'react-countdown';
import Card1 from '../shared/components/UIElements/Card';
import './viewdata.css';

const ViewData = () => {
	const history = useHistory();
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [data, setData] = useState();
	const [day0flag, setDay0Flag] = useState(0);
	const [ctime, setCtime] = useState(15000);
	const [temp, setTemp] = useState(0);
	useEffect(() => {
		const fetchRequests = async () => {
			try {
				const responseData = await sendRequest(
					`http://localhost:5000/api/getplan/getdetails/${traineeid}`
				);
				console.log(responseData);
				setTemp(responseData.temp);
				setData(responseData.exe);
				setDay0Flag(responseData.showfeedback);
			} catch (err) {}
		};
		fetchRequests();
	}, [sendRequest]);
	const waiting = ({ hours, minutes, seconds, completed }) => {
		if (completed) {
			return <div style={{ display: 'none' }}></div>;
		} else {
			if (seconds === 10) {
				fetch(`http://localhost:5000/api/getplan/getdetails/${traineeid}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				})
					.then(res => res.json())
					.then(data => {
						setTemp(data.temp);
						setData(data.exe);
						setDay0Flag(data.showfeedback);
						setCtime(ctime + 1000);
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
	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			{isLoading && (
				<div className="center">
					<LoadingSpinner />
				</div>
			)}
			{!isLoading && temp === 0 && (
				<div className="center">
					<Card1>
						<Countdown date={Date.now() + ctime + 2000} renderer={waiting} />
						<h2>No data Found.</h2>
					</Card1>
				</div>
			)}
			{!isLoading && data && temp !== 0 && (
				<div style={{ textAlign: 'center', color: 'black' }}>
					<Card
						className="authentication"
						style={{
							maxWidth: '400px',
							textAlign: 'center',
							margin: 'auto ',
						}}
					>
						<table className="table1" id="t01" style={{ margin: '0px' }}>
							<caption>{traineename}'s Data</caption>
							<tr className="row">
								<td className="data1">Gender</td>
								<td className="data2">{data.gender}</td>
							</tr>
							<tr className="row">
								<td className="data1">Goal</td>
								<td className="data2">{data.goal}</td>
							</tr>
							<tr className="row">
								<td className="data1">Time</td>
								<td className="data2">{data.time}</td>
							</tr>
							<tr className="row">
								<td className="data1">Strength</td>
								<td className="data2">{data.strength}</td>
							</tr>
							<tr className="row">
								<td className="data1">pushups</td>
								<td className="data2">{data.pushups}</td>
							</tr>
							<tr className="row">
								<td className="data1">Workout</td>
								<td className="data2">{data.workout}</td>
							</tr>
							<tr className="row">
								<td className="data1">Difficulty</td>
								<td className="data2">{data.difficulty}</td>
							</tr>
							<tr className="row">
								<td className="data1">Height</td>
								<td className="data2">{data.values.height}</td>
							</tr>
							<tr className="row">
								<td className="data1">Weight</td>
								<td className="data2">{data.values.weight}</td>
							</tr>
							<tr className="row">
								<td className="data1">Age</td>
								<td className="data2">{data.values.age}</td>
							</tr>
						</table>
						{day0flag === 0 && (
							<input
								type="button"
								className="btn2"
								value="View Plan"
								onClick={e => {
									e.preventDefault();
									history.push('/showtrainees/giveplan');
								}}
							/>
						)}
						{day0flag === 1 && (
							<input
								type="button"
								className="btn2"
								value="Daily Feedback"
								onClick={e => {
									e.preventDefault();
									history.push('/showtrainees/viewfeedback');
								}}
							/>
						)}
					</Card>
				</div>
			)}
		</React.Fragment>
	);
};

export default ViewData;
