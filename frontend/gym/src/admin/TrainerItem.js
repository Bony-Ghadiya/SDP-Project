import React from 'react';
//import { Link } from 'react-router-dom';

// import p1 from './p1.gif';
import { Container, Card, Image } from 'react-bootstrap';
import { useHttpClient } from '../shared/hooks/http-hook';

const ExerciseItem = props => {
	const {sendRequest} = useHttpClient();
	const acceptHandler = async event => {
        console.log('accept');
				const fetchPlace = async () => {
					try {
						const responseData = await sendRequest(
							`http://localhost:5000/api/admin/approvetrainers`,
							'PATCH',
							JSON.stringify({
								userid: props.id,
								approved: '0',
							}),
							{
								'Content-Type': 'application/json',
							}
						);
						console.log(responseData);
					} catch (err) {}
				};
				fetchPlace();
    };

	const deleteHandler = () => {
		console.log('delete');
	};
	return (
		<Container>
			<Card border="primary" style={{ maxWidth: '18rem', padding: '0px' }}>
				<Card.Header as="h3" style={{ borderBottom: '1px solid black' }}>
					{props.name}
				</Card.Header>
				<Card.Body>
					{props.startTime}
					<br />
					{props.endTime}
					<br />
					{props.experience}
					<br />
					<Image
						src={`http://localhost:5000/${props.image}`}
						alt={props.name}
						style={{ width: '200px', height: '200px' }}
						fluid
					/>
				</Card.Body>
				<Card.Footer style={{ borderTop: '1px solid black' }}>
					<input
						type="button"
						className="button"
						value="ACCEPT"
						onClick={acceptHandler}
					/>
					<input
						type="button"
						className="button"
						value="DELETE"
						onClick={deleteHandler}
					/>
				</Card.Footer>
			</Card>
		</Container>
	);
};

export default ExerciseItem;

