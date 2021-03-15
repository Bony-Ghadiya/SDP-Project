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
					className="users-list"
					style={{
						paddingLeft: ' 30px',
						paddingRight: ' 30px',
						color: 'black',
					}}
				>
					{trainer.map(t => (
						<Container>
							<Card
								border="primary"
								style={{ maxWidth: '18rem', padding: '0px' }}
							>
								<div className="cardheader">
									<Card.Header
										as="h3"
										style={{
											marginTop: '0px',
											borderBottom: '1px solid black',
											padding: '5px 0',
											background: 'none',
										}}
									>
										<Card.Link
											href={`/selecttrainer/${t.id}`}
											style={{ marginBottom: '30px', textDecoration: 'none' }}
											onClick={e => {
												e.preventDefault();
												history.push(`/selecttrainer/${t.id}`);
											}}
										>
											{t.name}
										</Card.Link>
									</Card.Header>
								</div>
								<Card.Body>
									<Image
										src={t.image}
										alt={t.name}
										style={{ width: '200px', height: '200px' }}
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
							</Card>
						</Container>
					))}
				</ul>
			)}
		</React.Fragment>
	);
};

export default Home;
