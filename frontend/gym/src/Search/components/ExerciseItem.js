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
						{props.id}
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
/*<Card className="user-item__content">
			<div style={{ background: 'grey', padding: '2px' }}>
				<Link
					style={{ color: 'black' }}
					className="link"
					to={`/search/${props.id}`}
					exe={props}
				>
					{props.ename}
				</Link>
			</div>
			<img
				style={{ width: '200px', height: '200px' }}
				src={props.gif}
				alt="exercise"
			/>
		</Card>*/

/**/

/*<Card className="text-center">
			<Card.Header as="h3" style={{}}>
				<Card.Link href={`/search/${props.id}`}>{props.ename}</Card.Link>
			</Card.Header>
			<Card.Body>
				<Card.Img
					variant="top"
					src={props.gif}
					style={{ width: '200px', height: '200px' }}
				/>
				<br />
			</Card.Body>
		</Card>*/

/*<Card className={classes.root}>
			<CardActionArea>
				<CardMedia
					component="img"
					alt="Exercise"
					height="200"
					width="200"
					image={props.gif}
					title={props.ename}
				/>
				<CardContent>
					<Typography gutterBottom variant="h5" component="h6">
						{props.ename}
					</Typography>
				</CardContent>
			</CardActionArea>
		</Card>*/
