import React from 'react';
import Carousel from 'react-material-ui-carousel';
import { Paper, Button } from '@material-ui/core';
import './style.css';

// jo ama me components muki didha 6e have tu ane sarkha arrenge karje n carousal ma jya image 6ene ema text mukvai try karje
// thay jashe m to ae
// w3school ma search karje etle emathi thay jashe
// n tari rite content change kari nakhje
//evu lage to red  pictures 6e ae change karvi hoy to ae y kari nakhje
// n aj sanj sudhi ma kari ne apaje

const Home = () => {
	var items = [
		{
			name: 'Random Name #1',
			description: 'Probably the most random thing you have ever seen!',
			img:
				'https://res.cloudinary.com/gymmie/image/upload/v1614924713/home%20page/slide1_xhkvma.jpg',
		},
		{
			name: 'Random Name #2',
			description: 'Hello World!',
			img:
				'https://res.cloudinary.com/gymmie/image/upload/v1614924713/home%20page/slide2_yus4jz.jpg',
		},
		{
			name: 'Random Name #3',
			description: 'Hello World!',
			img:
				'https://res.cloudinary.com/gymmie/image/upload/v1614924723/home%20page/slide3_z38jpb.jpg',
		},
	];

	function Item(props) {
		return (
			<Paper className="paper">
				<img
					src={props.item.img}
					alt="nothing"
					style={{ width: '100%', height: '40%' }}
				></img>
				<h2>{props.item.name}</h2>
				<p>{props.item.description}</p>

				<Button className="CheckButton">Check it out!</Button>
			</Paper>
		);
	}

	return (
		<React.Fragment>
			<div>
				<div className="all">
				<div className="carousel">
					<Carousel
						next={(next, active) =>
							console.log(`we left ${active}, and are now at ${next}`)
						}
						prev={(prev, active) =>
							console.log(`we left ${active}, and are now at ${prev}`)
						}
					>
						{items.map((item, i) => (
							<Item key={i} item={item} />
						))}
					</Carousel>
					</div>
					<div className="about">
						<img
							src="https://res.cloudinary.com/gymmie/image/upload/v1614924741/home%20page/slid2_igyibo.jpg"
							width="1400px"
							height="250px"
							alt=""
						/>
						<div className="text1">
							<h1>About Us</h1>
						</div>
					</div>
					<div className="title">
						<h3>Who we Are &amp; What We Do</h3>
						<p1>
							GEP is a cutting-edge functional fitness system that can help
							everyone - everyday. There is a significant portion of
						</p1>
						<p>
							{' '}
							the people , who actually want and need
							gudiance and awareness for finess and
							we help them.
							
						</p>
					</div>
					<div>
						<img
							className="aboutimg"
							src="https://res.cloudinary.com/gymmie/image/upload/v1614924771/home%20page/slide6_dsanya.jpg"
							alt=""
						/>
					</div>
					<table className="t1">
						<tbody>
							<tr>
								<td className="list1">About Us</td>
								<td className="list1" colSpan={2}>
									Why To Choose Us?
								</td>
							</tr>
							<tr>
								<td className="list" style={{ width: '600px' }}>
									{' '}
									Aboutehhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
									Aboutehhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
									Aboutehhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
									Aboutehhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
									Aboutehhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
									Aboutusssssss
								</td>
								<td />
								<td className="list2">
								<div className="list2header">
									We would like to highlight few points which seperate us from others!
									Let's take a look!
								</div>
								
								</td>
							</tr>
							<tr>
								<td className="list">
							
									Aboutehhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
									Aboutehhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
									Aboutehhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
									Aboutehhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
									Aboutehhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
									Aboutehhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
									Aboutehhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
									Aboutehhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
									Aboutusssssss
								</td>
								<td />
								<td className="list2">
									<div className="list2points">
									<ul>
										<li id="li">
											Certified Trainers
										</li>
										<li id="li">
											Personalized Plans
										</li>
										<li id="li">
											Detailed Explanation Of Every Exercises
										</li>
										<li id="li">
											Fitness Related Tips & Tricks
										</li>
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
							<img
								src="https://res.cloudinary.com/gymmie/image/upload/v1614924665/home%20page/logo1_c1srzw.png"
								alt=""
							/>
						</div>
						<div className="text5">
							{' '}
							<p>
								Despite growth of the Internet over the past seven years, the
								use of toll-free phone numbers in television advertising
								continues.
							</p>
						</div>
					</div>
					<div className="right">
						<h5>Get Info</h5>
						<ul>
							<div className="f1">
								<i
									className="fa fa-phone"
									style={{ color: 'green', marginRight: '9px' }}
								/>
								<span>Phone:</span>
								(12) 345 6789
							</div>
							<div className="f1">
								<i
									className="fa fa-envelope"
									style={{ color: 'green', marginRight: '9px' }}
								/>
								<span>Email:</span>
								<a href="#" style={{ color: 'white', borderBottom: 'none' }}>
									{' '}
									bonytrainer@gmail.com
								</a>
							</div>
							<div className="f1">
								<i
									className="fa fa-map-marker"
									style={{ color: 'green', marginRight: '9px' }}
								/>
								<span>Address: </span>
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
