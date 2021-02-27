import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import ErrorModal from '../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../shared/hooks/http-hook';
import { traineeid, traineename } from './showtrainee';
import { Card } from 'react-bootstrap';
import './viewdata.css';

const ViewData = () => {
	const history = useHistory();
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [data, setData] = useState();

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

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			{isLoading && (
				<div className="center">
					<LoadingSpinner />
				</div>
			)}
			{!isLoading && data && (
				<div style={{ textAlign: 'center', color: 'black' }}>
					<Card style={{ width: '35%', textAlign: 'center', margin: 'auto' }}>
						<table className="table1" id="t01">
							<caption>{traineename}'s data</caption>
							<tr className="row">
								<td className="data1">gender</td>
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
						<input
							type="button"
							className="btn2"
							value="View Plan"
							onClick={e => {
								e.preventDefault();
								history.push('/showtrainees/giveplan');
							}}
						/>
					</Card>
				</div>
			)}
		</React.Fragment>
	);
};

export default ViewData;
