import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Carousel from 'react-material-ui-carousel';
import { AuthContext } from '../shared/context/auth-context';
import './style.css';

const Home = () => {
	const history = useHistory();
	const auth = useContext(AuthContext);
	var items = [
		{
			name: 'Join Us Now',
			description: 'Get In Shape!',
			img:
				'https://res.cloudinary.com/gymmie/image/upload/v1614924713/home%20page/slide1_xhkvma.jpg',
		},
		{
			name: 'Customized Plans',
			description: 'Certified Trainers',
			img:
				'https://res.cloudinary.com/gymmie/image/upload/v1614924713/home%20page/slide2_yus4jz.jpg',
		},
		{
			name: 'Best Exercises At Home',
			description: ' Explained In Details Exercises ',
			img:
				'https://res.cloudinary.com/gymmie/image/upload/v1614924723/home%20page/slide3_z38jpb.jpg',
		},
	];

	function Item(props) {
		return (
			<div className="container">
				<img
					src={props.item.img}
					alt="nothing"
					style={{ width: '100%', height: '40%' }}
				></img>
				<div className="bottom-left">
					{!auth.isLoggedIn && (
						<h1 style={{ fontSize: '2vw', color: '#4caf50' }}>
							{props.item.name}
						</h1>
					)}
					<h2 style={{ fontSize: '2vw' }}>{props.item.description}</h2>

					{!auth.isLoggedIn && (
						<button
							style={{
								padding: '10px 30px',
								margin: '12px 0px',
								backgroundColor: '#4caf50',
							}}
							className="button"
							onClick={() => {
								history.push('/auth');
							}}
						>
							JOIN US
						</button>
					)}
				</div>
			</div>
		);
	}

	return (
		<React.Fragment>
			<div>
				<div className="all">
					<div className="carousel">
						<Carousel style={{ color: 'red' }}>
							{items.map((item, i) => (
								<Item key={i} item={item} />
							))}
						</Carousel>
					</div>
					<div className="about">
						<img
							src="https://res.cloudinary.com/gymmie/image/upload/v1614924741/home%20page/slid2_igyibo.jpg"
							width="100%"
							height="25%"
							alt=""
						/>
						<div className="text1">
							<h1>Get Fit Today!</h1>
						</div>
					</div>
					<div className="title" style={{ display: 'inline-block' }}>
						{!auth.isLoggedIn && <h3>Who we Are &amp; What We Do</h3>}
						{auth.userType === 'user' && <h3>Guidelines for Trainees</h3>}
						{auth.userType === 'trainer' && <h3>Guidelines for Trainers</h3>}
						{!auth.isLoggedIn && (
							<div
								style={{ textAlign: 'justify', width: '40%', margin: 'auto' }}
							>
								<p>
									HEP is a cutting-edge functional fitness system that can help
									everyone - everyday. There is a significant portion of the
									people , who actually want and need gudiance and awareness for
									finess and we help them.
								</p>
							</div>
						)}
						{auth.userType === 'user' && (
							<div
								style={{ textAlign: 'justify', width: '40%', margin: 'auto' }}
							>
								<ul>
									<li id="li">Login into your account.</li>
									<li id="li">
										select your trainer and give your imformation to your
										selected trainer, so your trainer can give suitable plan to
										you.
									</li>
									<li id="li">
										After providing your information wait until your trainer
										create suitable plan for you.
									</li>
									<li id="li">
										Once, you get plan, start workout as given. You will find
										out detailed explanation video and GIF for every exercise.
									</li>
									<li id="li">
										You have to report your trainer every week so your trainer
										can have the idea whether he need to change yor plan or not.
									</li>
									<li id="li">
										After completing all the exercise provide the appropriate
										feedback to your trainer.
									</li>
								</ul>
							</div>
						)}
						{auth.userType === 'trainer' && (
							<div
								style={{ textAlign: 'justify', width: '40%', margin: 'auto' }}
							>
								<ul>
									<li id="li">Login into your account.</li>
									<li id="li">
										Now, you have to submit your application to become trainer
										on our website.
									</li>
									<li id="li">
										After submit relevent application, wait until your
										application is approved by an admin.
									</li>
									<li id="li">
										Once, you have been approved, users will be able to see your
										profile and might select you as his trainer.
									</li>
									<li id="li">
										Now you can create plans for them daily or weekly.
									</li>
									<li id="li">
										Check the feedbacks regularly to improve plans and customer
										experience.
									</li>
								</ul>
							</div>
						)}
					</div>
					<div style={{ display: 'block', textAlign: 'center' }}>
						<img
							className="aboutimg"
							src="https://res.cloudinary.com/gymmie/image/upload/v1614924771/home%20page/slide6_dsanya.jpg"
							alt=""
						/>
					</div>
					<table className="t1">
						<tbody>
							<tr>
								<td className="list1">
									<h4>About Us</h4>
								</td>
								<td className="list1" colSpan={2}>
									<h4>Why To Choose Us?</h4>
								</td>
							</tr>
							<tr>
								<td className="list" style={{ width: '600px' }}>
									{' '}
									If you want to exercise and get healthy or get in shape
									without going to actual gym due to global pendamic or for
									anyother reason, then HEP is perfect for what you are looking
									for!
								</td>
								<td />
								<td className="list2">
									<div className="list2header">
										We would like to highlight few points which seperate us from
										others! Let's take a look!
									</div>
								</td>
							</tr>
							<tr>
								<td className="list">
									Here at HEP , every fitness enthusiastic get personlized
									fitness plans , sounds cool right? Not just that , but also
									exercises with description , video and animated gif! To make
									sure trainers and users are always on the same page , users
									can leave feedback and share their experienece.
								</td>
								<td />
								<td className="list2">
									<div className="list2points">
										<ul>
											<li id="li">Certified Trainers</li>
											<li id="li">Personalized Plans</li>
											<li id="li">Detailed Explanation Of Every Exercises</li>
											<li id="li">Fitness Related Tips & Tricks</li>
										</ul>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div className="footer">
					<div className="left">
						<div className="left1">
							<h1 style={{ color: '#4caf50' }}>HEP</h1>
						</div>
						<div className="text5">
							{' '}
							<p>
								Feel free to contact us if you have any questions! We would Be
								more than happy to guide you.
							</p>
						</div>
					</div>
					<div className="right">
						<h4>Get Info</h4>
						<ul style={{ paddingLeft: '0' }}>
							<div className="f1">
								<i
									className="fa fa-phone"
									style={{ color: 'green', marginRight: '9px' }}
								/>
								<span>Phone:</span>
								<br />
								(+91) 7069965355
							</div>
							<div className="f1">
								<i
									className="fa fa-envelope"
									style={{ color: 'green', marginRight: '9px' }}
								/>
								<span>Email:</span>
								<br />
								<a href="/" style={{ color: 'white', borderBottom: 'none' }}>
									{' '}
									gymmie@gmail.com
								</a>
							</div>
							<div className="f1">
								<i
									className="fa fa-map-marker"
									style={{ color: 'green', marginRight: '9px' }}
								/>
								<span>Address: </span>
								<br />
								Surat, Gujarat , India
							</div>
						</ul>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Home;
