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
			<Paper>
				<img
					src={props.item.img}
					alt="nothing"
					style={{ width: '50%', height: '50%' }}
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
							CrossFit is a cutting-edge functional fitness system that can help
							everyday men. There is a significant portion of
						</p1>
						<p>
							{' '}
							the population here in North America, that actually want and need
							success to be hard!
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
									Qaulities
								</td>
							</tr>
							<tr>
								<td className="list" style={{ width: '600px' }}>
									{' '}
									Having a baby can be a nerve wracking experience for new
									parents – not the nine months of pregnancy, I’m talking about
									after the infant is brought home from the hospital. It’s
									always the same thing, by the time they have their third child
									they have it all figured out, but with number one it’s a
									learning thing.
								</td>
								<td />
								<td className="list2">
									Donec enim ipsum porta justo integer at velna vitae auctor
									integer congue magna at risus auctor purus unt pretium ligula
									rutrum integer sapien ultrice ligula luctus undo magna risus{' '}
								</td>
							</tr>
							<tr>
								<td className="list">
									Baby monitors help you hear your baby’s needs without you
									having to be in the room with the baby. Some baby monitors are
									portable, or “mobile” and are small enough that you can carry
									it in your pocket as you do your daily chores around the
									house. Depending on your price range it’s best to have a base
									unit that plugs into the wall. The receiving unit can be like
									your portable phone, you can carry it around with you, and
									plug it back into the base unit to be recharged.
								</td>
								<td />
								<td className="list2">
									<ul>
										<li id="li">
											Lorem ipsum dolor sitdoni amet, consectetur dont adipis
											elite vivamus interdum.
										</li>
										<li id="li">
											Integer pulvinar ante nulla, ac fermentum ex congue id
											vestibulum ensectetur.
										</li>
										<li id="li">
											Proin blandit nibh in quam semper iaculis lorem ipsum
											dolor salama ender.
										</li>
										<li id="li">
											Quis ipsum suspendisse ultrices gravida. Risus commodo
											viverra maecenas accumsan lacus vel facilisis.{' '}
										</li>
									</ul>
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
									Colorlib.info@gmail.com
								</a>
							</div>
							<div className="f1">
								<i
									className="fa fa-map-marker"
									style={{ color: 'green', marginRight: '9px' }}
								/>
								<span>Address</span>
								Iris Watson, Box 283 8562, NY
							</div>
						</ul>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Home;
