import React, { useState, useEffect } from 'react';
import ErrorModal from '../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../shared/hooks/http-hook';
import Card1 from '../shared/components/UIElements/Card';

import { Container, Card, Image } from 'react-bootstrap';
import ReactStars from 'react-rating-stars-component';
import { useHistory } from 'react-router-dom';
import './SelectTrainers.css';

const Home = () => {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const history = useHistory();

	const [trainer, setTrainer] = useState();
	const [flag, setFlag] = useState(false);

	useEffect(() => {
		const fetchRequests = async () => {
			try {
				const responseData = await sendRequest(
					`http://localhost:5000/api/selectTrainer/select`
				);

				setFlag(true);
				setTrainer(responseData.trainers);
			} catch (err) {}
		};
		fetchRequests();
	}, [sendRequest]);

	if (!trainer && !flag && !isLoading) {
		return (
			<div className="center">
				<Card1>
					<h2>No Trainers Found.</h2>
				</Card1>
			</div>
		);
	}

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			{isLoading && (
				<div className="center">
					<LoadingSpinner />
				</div>
			)}
			{!isLoading && trainer && (
				<ul
					className="users-list1"
					style={{
						color: 'black',
					}}
				>
					{trainer.map(t => (
						<Container>
							<Card
								border="primary"
								style={{ maxWidth: '100%', padding: '0px', margin: 'auto ' }}
							>
								<div className="cardheader">
									<Card.Header
										as="h3"
										style={{
											marginTop: '0px',
											padding: '5px 0',
											background: 'none',
											marginBottom: '10px',
											textDecoration: 'none',
										}}
									>
										{t.name}
									</Card.Header>
								</div>
								<Card.Body>
									<Image
										src={t.image}
										alt={t.name}
										style={{
											width: '200px',
											height: '200px',
											border: '1px solid #4caf50',
											borderRadius: '50%',
										}}
										fluid
									/>
									<div
										style={{
											dispaly: 'inline',
											width: '150px',
											margin: 'auto',
										}}
									>
										<ReactStars
											style={{ dispaly: 'inline' }}
											count={5}
											isHalf={true}
											size={36}
											edit={false}
											value={t.rating}
											activeColor="#fbcd0a"
										/>
									</div>
								</Card.Body>
								<Card.Footer>
									<button
										className="button"
										style={{ marginBottom: '5px' }}
										onClick={e => {
											e.preventDefault();
											history.push(`/selecttrainer/${t.id}`);
										}}
									>
										{' '}
										VIEW PROFILE
									</button>
								</Card.Footer>
							</Card>
						</Container>
					))}
				</ul>
			)}
		</React.Fragment>
	);
};

export default Home;
