import React from 'react';
import { useHistory } from 'react-router-dom';
//import { Link } from 'react-router-dom';

// import p1 from './p1.gif';
import { Card, Image } from 'react-bootstrap';

const ExerciseItem = props => {
	const history = useHistory();
	return (
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
					padding: '5px 0',
					backgroundColor: 'none',
					marginBottom: '10px',
					textDecoration: 'none',
				}}
			>
				{props.ename}
			</Card.Header>
			<Card.Body>
				<Image
					src={props.gif}
					style={{
						width: '200px',
						height: '200px',
						border: '1px solid #4caf50',
					}}
					fluid
				/>
				<br />
			</Card.Body>
			<Card.Footer>
				<button
					className="button"
					onClick={e => {
						e.preventDefault();
						history.push(`/search/${props.id}`);
					}}
					style={{ marginBottom: '5px' }}
				>
					{' '}
					VIEW MORE
				</button>
			</Card.Footer>
		</Card>
	);
};

export default ExerciseItem;
