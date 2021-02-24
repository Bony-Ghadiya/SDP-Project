import React, { useContext, useState, useEffect } from 'react';
import ErrorModal from '../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../shared/hooks/http-hook';
import { AuthContext } from '../shared/context/auth-context';
import { traineeid } from './showtrainee';
import { Card } from 'react-bootstrap';
import './viewdata.css';

const ViewData = () => {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const auth = useContext(AuthContext);
	const [data, setData] = useState();

	useEffect(() => {
		const fetchRequests = async () => {
			try {
				const responseData = await sendRequest(
					`http://localhost:5000/api/getplan/getdetails/${traineeid}`
				);
				setData(responseData.exe);
				console.log(responseData.exe);
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
				<Card>
					<div style={{ disply: 'inline' }}>
						<h4>gender : </h4>
						<p>{data.gender}</p>
						<h4>Goal : </h4>
						{data.goal}
						<h4>Time :</h4>
						{data.time}
						<h4>Strength :</h4>
						{data.strength}
						<h4>Workout : </h4>
						{data.workout}
						<h4>Difficulty : </h4>
						{data.difficulty}
						<h4>Height : </h4>
						{data.values.height}
						<h4>Weight : </h4>
						{data.values.weight}
						<h4>Age : </h4>
						{data.values.age}
					</div>
				</Card>
			)}
		</React.Fragment>
	);
};

export default ViewData;
