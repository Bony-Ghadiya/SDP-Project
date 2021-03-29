import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import ErrorModal from '../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../shared/hooks/http-hook';
import Card1 from '../shared/components/UIElements/Card';
import { AuthContext } from '../shared/context/auth-context';
import { Container, Card, Image } from 'react-bootstrap';
import Countdown from 'react-countdown';

export let traineeid;
export let traineename;
const Home = () => {
	const history = useHistory();
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const auth = useContext(AuthContext);

	const [ctime, setCtime] = useState(15000);
	const [trainer, setTrainer] = useState();

	useEffect(() => {
		const fetchRequests = async () => {
			try {
				const responseData = await sendRequest(
					`http://localhost:5000/api/show/showtrainees/${auth.userId}`
				);
				setTrainer(responseData.trainees);
			} catch (err) {}
		};
		fetchRequests();
	}, [sendRequest, auth.userId]);

	const waiting = ({ hours, minutes, seconds, completed }) => {
		if (completed) {
			return <div style={{ display: 'none' }}></div>;
		} else {
			if (seconds === 10) {
				fetch(`http://localhost:5000/api/show/showtrainees/${auth.userId}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				})
					.then(res => res.json())
					.then(data => {
						setTrainer(data.trainees);
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

	if (trainer && trainer.length === 0 && !isLoading) {
		return (
			<div className="center">
				<Card1>
					<Countdown date={Date.now() + ctime + 2000} renderer={waiting} />
					<h2>No Trainees Found.</h2>
				</Card1>
			</div>
		);
	} else {
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
									style={{
										margin: 'auto',
										maxWidth: '18rem',
										padding: '0px',
										color: 'black',
									}}
								>
									<Card.Header
										as="h3"
										style={{
											marginTop: '0px',
											padding: '5px 0',
											backgroundColor: 'none',
										}}
									>
										{t.name}
									</Card.Header>
									<Card.Body>
										<Image
											src={t.image}
											alt={t.name}
											style={{
												width: '200px',
												height: '200px',
												borderRadius: '50%',
												border: '1px solid #4caf50',
											}}
											fluid
										/>
									</Card.Body>
									<Card.Footer style={{ padding: '5px 0' }}>
										<div style={{ padding: '0 7px', display: 'inline' }}>
											<input
												type="button"
												className="button"
												value="VIEW DATA"
												onClick={() => {
													traineeid = t.id;
													traineename = t.name;
													history.push('/showtrainees/viewdata');
												}}
											/>
										</div>
									</Card.Footer>
								</Card>
							</Container>
						))}
					</ul>
				)}
			</React.Fragment>
		);
	}
};

export default Home;
