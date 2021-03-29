import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import ErrorModal from '../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../shared/hooks/http-hook';
import { traineeid, traineename } from './showtrainee';
import { Card } from 'react-bootstrap';
import './viewdata.css';

const ViewDailyFeedback = () => {
	const history = useHistory();
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [data, setData] = useState();

	useEffect(() => {
		const fetchRequests = async () => {
			try {
				const responseData = await sendRequest(
					`http://localhost:5000/api/viewplan/getfeedback/${traineeid}`
				);
				setData(responseData.defaultexercise);
				console.log(responseData.defaultexercise.plan.map(p => p.dayComplated));
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
				<div style={{ textAlign: 'center', color: 'white' }}>
					<Card
						className="authentication"
						style={{
							maxWidth: '400px',
							textAlign: 'center',
							margin: 'auto ',
						}}
					>
						<table className="table1" id="t01" style={{ margin: '0px' }}>
							<caption>{traineename}'s Daily Feedback</caption>
							{data.plan.map(p => (
								<React.Fragment>
									{p.dayComplated === 1 && p.exercises.length !== 0 && (
										<tr className="row">
											<td className="data1">Day {p.dayNo}</td>
											<td className="data2">{p.feedback}</td>
										</tr>
									)}
									{p.dayComplated === 1 && p.exercises.length === 0 && (
										<tr className="row">
											<td className="data1">Day {p.dayNo}</td>
											<td className="data2">REST DAY</td>
										</tr>
									)}
								</React.Fragment>
							))}
						</table>
						{data.week1Submitted === 0 && (
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
						{data.week1Submitted !== 0 && (
							<input
								type="button"
								className="btn2"
								value="Reporting"
								onClick={e => {
									e.preventDefault();
									history.push('/showtrainees/viewreporting');
								}}
							/>
						)}
					</Card>
				</div>
			)}
		</React.Fragment>
	);
};

export default ViewDailyFeedback;
