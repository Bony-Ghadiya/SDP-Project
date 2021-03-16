import React from 'react';

import ExerciseItem from './ExerciseItem';
import Card from '../../shared/components/UIElements/Card';
import { Container } from 'react-bootstrap';
import './ExerciseList.css';

const ExerciseList = props => {
	if (props.items.length === 0) {
		return (
			<div className="center">
				<Card>
					<h2>No Exercises Found.</h2>
				</Card>
			</div>
		);
	}
	return (
		<Container style={{ paddingLeft: '23vw' }}>
			<ul className="users-list" style={{ paddingRight: ' 30px' }}>
				{props.items.map(exe => (
					<ExerciseItem
						key={exe.id}
						id={exe.id}
						ename={exe.ename}
						vlink={exe.vlink}
						gif={exe.gif}
					/>
				))}
			</ul>
		</Container>
	);
};

export default ExerciseList;
