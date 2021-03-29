import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { Container, Card } from 'react-bootstrap';

const Exercise = () => {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [category, setcategory] = useState();
	const [videoLink, setVideoLink] = useState();
	const [desc, setDesc] = useState();
	const [ename, setEname] = useState();
	const [flag, setFlag] = useState(false);

	const eid = useParams().eid;

	useEffect(() => {
		const fetchPlaces = async () => {
			try {
				const responseData = await sendRequest(
					`http://localhost:5000/api/search/${eid}`
				);
				//setexercise(responseData.exercise);
				console.log(responseData.exe);
				setEname(responseData.exe.ename);
				setVideoLink(responseData.exe.vlink);
				setcategory(responseData.exe.category);
				setDesc(responseData.exe.desc);
				setFlag(true);
			} catch (err) {}
		};
		fetchPlaces();
	}, [sendRequest, eid]);

	if (!flag && !isLoading) {
		return (
			<div className="center">
				<Card>
					<h2>No Exercises Found.</h2>
				</Card>
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
				<div style={{ textAlign: 'center' }}>
					{!isLoading && flag && (
						<Container>
							<Card
								className="authentication"
								style={{
									maxWidth: '500px',
									margin: 'auto',
									color: 'black',
									marginBottom: '50px',
									padding: '0 10px',
								}}
							>
								{!isLoading && flag && (
									<Card.Header
										as="h2"
										style={{
											marginTop: '0px',
											borderBottom: '1px solid black',
											padding: '10px 0',
											backgroundColor: 'none',
										}}
									>
										{ename}
									</Card.Header>
								)}
								{!isLoading && flag && (
									<div style={{ textAlign: 'left' }}>
										<h4 style={{ display: 'inline', color: '#4caf50' }}>
											Exercise Category :
										</h4>
										<p
											style={{
												display: 'inline',
												marginLeft: '22px',
												color: 'white',
											}}
										>
											{' '}
											{category}
										</p>
									</div>
								)}
								{!isLoading && flag && (
									<div
										style={{
											display: 'inline',
											textALign: 'justify',
											paddingRight: '10px',
											width: '500px',
										}}
									>
										<h4
											style={{
												display: 'inline',
												height: '100%',
												position: 'absolute',
												paddingTop: '10px',
												marginTop: '16px',
												marginRight: '5px',
												willChange: 'transform',
												color: '#4caf50',
											}}
										>
											Exercise Description :
										</h4>
										<p
											style={{
												display: 'inline-block',
												width: 'auto',
												height: '100px',
												margin: '16px 10px 10px 175px',
												textAlign: 'justify',
												paddingTop: '10px',
												fontSize: '14px',
												paddingRight: '10px',
												color: 'white',
											}}
										>
											{' '}
											{desc}
										</p>
									</div>
								)}
								{!isLoading && flag && (
									<iframe
										style={{ borderRadius: '8px', width: '100%' }}
										title={ename}
										height="315"
										src={videoLink}
										allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
										allowFullScreen
									></iframe>
								)}
							</Card>
						</Container>
					)}
				</div>
			</React.Fragment>
		);
	}
};

export default Exercise;
