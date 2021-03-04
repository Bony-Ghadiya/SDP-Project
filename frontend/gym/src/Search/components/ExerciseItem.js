import React from 'react';
import { useHistory } from 'react-router-dom';
//import { Link } from 'react-router-dom';

// import p1 from './p1.gif';
import { Container, Card, Image } from 'react-bootstrap';

const ExerciseItem = props => {
	const history = useHistory();
	return (
		<Container style={{ marginLeft: '20%' }}>
			<Card
				border="primary"
				style={{
					padding: '0px',
					color: 'black',
					maxheight: '40rem',
				}}
			>
				<Card.Header
					as="h3"
					style={{
						marginTop: '0px',
						borderBottom: '1px solid black',
						padding: '5px 0',
						backgroundColor: 'none',
					}}
				>
					<Card.Link
						href={`/search/${props.id}`}
						style={{
							marginBottom: '30px',
							textDecoration: 'none',
							backgroundColor: 'black',
						}}
						onClick={e => {
							console.log(e);
							e.preventDefault();
							history.push(`/search/${props.id}`);
						}}
					>
						{props.ename}
					</Card.Link>
				</Card.Header>
				<Card.Body>
					<Image
						src={props.gif}
						style={{ width: '200px', height: '200px' }}
						fluid
					/>
					<br />
				</Card.Body>
			</Card>
		</Container>
	);
};

export default ExerciseItem;
