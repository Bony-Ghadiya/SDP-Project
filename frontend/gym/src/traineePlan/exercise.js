import React, { useState } from 'react';
import { Image } from 'react-bootstrap';

const Exercise = props => {
	const [isGif, setIsGif] = useState(true);
	return (
		<React.Fragment>
			<h1>{props.items.ename}</h1>
			{isGif && (
				<div className="gif">
					<Image
						src={props.items.gif}
						style={{
							width: '170px',
							height: '170px',
						}}
						fluid
					/>
				</div>
			)}
			{!isGif && (
				<iframe
					style={{ borderRadius: '8px' }}
					title={props.items.ename}
					width="500"
					height="315"
					src={props.items.vlink}
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowFullScreen
				></iframe>
			)}
		</React.Fragment>
	);
};

export default Exercise;
