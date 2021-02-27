import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import ErrorModal from '../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../shared/hooks/http-hook';
import Card1 from '../shared/components/UIElements/Card';
import { AuthContext } from '../shared/context/auth-context';
import { Container, Card, Image } from 'react-bootstrap';

export let traineeid;
export let traineename;
const Home = () => {
	const history = useHistory();
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const auth = useContext(AuthContext);
	const [trainer, setTrainer] = useState();

	useEffect(() => {
		const fetchRequests = async () => {
			try {
				const responseData = await sendRequest(
					`http://localhost:5000/api/show/showtrainees/${auth.userId}`
				);
				setTrainer(responseData.trainees);
				console.log(responseData.trainees);
			} catch (err) {}
		};
		fetchRequests();
	}, [sendRequest, auth.userId]);

	if (trainer && trainer.length === 0 && !isLoading) {
		return (
			<div className="center">
				<Card1>
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
										maxWidth: '18rem',
										padding: '0px',
										color: 'black',
									}}
								>
									<Card.Header
										as="h3"
										style={{
											marginTop: '0px',
											borderBottom: '1px solid black',
											padding: '5px 0',
											backgroundColor: '#F5F5F5',
										}}
									>
										{t.name}
									</Card.Header>
									<Card.Body>
										<Image
											src={`http://localhost:5000/${t.image}`}
											alt={t.name}
											style={{ width: '200px', height: '200px' }}
											fluid
										/>
									</Card.Body>
									<Card.Footer
										style={{ borderTop: '1px solid black', padding: '5px 0' }}
									>
										<div style={{ padding: '0 7px', display: 'inline' }}>
											<input
												type="button"
												className="button"
												value="VIEW DATA"
												onClick={() => {
													traineeid = t.id;
													traineename = t.name;
													console.log(t.id, traineeid);
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
