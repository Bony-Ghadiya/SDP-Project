import React from 'react';
import './Home.css';

const Home = () => {
	return (
		<React.Fragment>
			<div className="container">
				<img
					src="https://res.cloudinary.com/gymmie/image/upload/v1613751972/samples/wp4077407_lcywru.jpg"
					alt="workout"
					height="650px"
					width="100%"
				/>
				<h3 className="bottom-left">
					{' '}
					Welcome Fitness Lovers!
					<br />
					<br />
					Here , We help others to acheive their fitness goals!
					<br />
					<br />
					Take a look at exercises !
				</h3>
			</div>
		</React.Fragment>
	);
};

export default Home;
