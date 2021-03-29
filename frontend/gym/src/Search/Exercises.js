import React, { useEffect, useState } from 'react';

import ExerciseList from './components/ExerciseList';
import ErrorModal from '../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../shared/hooks/http-hook';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Card } from 'react-bootstrap';

import { makeStyles, withStyles } from '@material-ui/core/styles';
import './Search.css';

const CssTextField = withStyles({
	root: {
		color: 'black',

		'& label': {
			color: 'black',
		},
		'& label.Mui-focused': {
			color: 'black',
		},
	},
})(TextField);

const useStyles = makeStyles(theme => ({
	inputRoot: {
		color: 'black',
		'& .MuiOutlinedInput-notchedOutline': {
			borderColor: '#4caf50',
		},
		'&:hover .MuiOutlinedInput-notchedOutline': {
			borderColor: '#4caf50',
		},
		'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
			borderColor: '#4caf50',
		},
		'&.MuiAutocomplete-option': {
			color: 'black',
		},
	},
	option: {
		color: 'black',
	},
}));

const Exercises = () => {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [allExercises, setAllExercises] = useState();
	const [loadedExercises, setloadedExercises] = useState();
	let temp;
	const classes = useStyles();
	const [searched, setSearched] = useState();

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const responseData = await sendRequest(
					'http://localhost:5000/api/search'
				);
				setloadedExercises(responseData.exercises);
				setAllExercises(responseData.exercises);
			} catch (err) {}
		};
		fetchUsers();
	}, [sendRequest]);

	if (!allExercises) {
		return (
			<React.Fragment>
				<ErrorModal error={error} onClear={clearError} />
				{isLoading && (
					<div className="center">
						<LoadingSpinner asOverlay />
					</div>
				)}
			</React.Fragment>
		);
	} else {
		const data = [allExercises];
		const options = data[0].map(option => {
			const firstLetter = option.ename[0].toUpperCase();
			return {
				firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
				...option,
			};
		});

		function searchSubmitHandler(event) {
			let abc;
			if (searched) {
				abc = allExercises.filter(exe => exe.ename === searched.ename);
				setloadedExercises(abc);
			} else {
				setloadedExercises(allExercises);
			}
		}

		const LagcategorySubmitHandler = () => {
			let abc;
			abc = allExercises.filter(exe => exe.category === 'leg');
			setloadedExercises(abc);
		};

		const ArmcategorySubmitHandler = () => {
			let abc;
			abc = allExercises.filter(exe => exe.category === 'arm');
			setloadedExercises(abc);
		};

		const AbscategorySubmitHandler = () => {
			let abc;
			abc = allExercises.filter(exe => exe.category === 'abs');
			setloadedExercises(abc);
		};

		return (
			<React.Fragment>
				<ErrorModal error={error} onClear={clearError} />
				{isLoading && (
					<div className="center">
						<LoadingSpinner />
					</div>
				)}

				<div
					className="motu"
					style={{
						marginTop: '0',
						width: '20vw',
						height: '100%',
						zIndex: '1',
						backgroundColor: 'none',
						border: '1px solid #4caf50',
						color: 'white',
						position: 'fixed',
						overflow: 'auto',
						marginRight: '0px',
						overflowY: 'auto',
						display: 'block',
						willChange: 'transform',
						backfaceVisibility: 'hidden',
					}}
				>
					<div
						style={{
							padding: '8px 16px',
							width: '100%',
							display: 'block',
							textAlign: 'left',
						}}
					>
						<h3 size={{ fontSize: '2vw' }}>Search By Category</h3>
						<ul
							style={{
								textAlign: 'left',
								paddingLeft: '20px',
								color: 'white',
							}}
						>
							<li>
								<input
									className="input"
									type="button"
									value="Legs"
									style={{ color: 'white' }}
									onClick={LagcategorySubmitHandler}
								></input>
							</li>
							<li>
								<input
									className="input"
									type="button"
									value="Arms"
									style={{ color: 'white' }}
									onClick={ArmcategorySubmitHandler}
								></input>
							</li>
							<li>
								<input
									className="input"
									type="button"
									value="Abs"
									style={{ color: 'white' }}
									onClick={AbscategorySubmitHandler}
								></input>
							</li>
						</ul>
					</div>
				</div>
				{!isLoading && allExercises && (
					<React.Fragment>
						<form
							className="nanuform"
							style={{
								marginLeft: '15%',
								marginRight: '15%',
								display: 'block',
							}}
							onSubmit={searchSubmitHandler}
						>
							<div className="outerDiv">
								<div
									style={{
										width: 'auto',
										marginLeft: '15%',
										marginRight: '15%',
										display: 'block',
										textAlign: 'center',
									}}
								>
									<Autocomplete
										classes={classes}
										value={temp}
										id="grouped-demo"
										options={options.sort(
											(a, b) => -b.firstLetter.localeCompare(a.firstLetter)
										)}
										groupBy={option => option.firstLetter}
										getOptionLabel={option => option.ename}
										onChange={(event, value) => setSearched(value)}
										style={{ maxWidth: '700px', width: '75vw', color: 'black' }}
										renderInput={params => (
											<div className="SearchExercises">
												<CssTextField
													{...params}
													label="Search Exercises"
													variant="outlined"
												/>
											</div>
										)}
										getOptionSelected={option => option.ename}
									/>
								</div>
								<div className="dabu-button">
									<br />
									<input
										className="button"
										type="button"
										onClick={searchSubmitHandler}
										value="SEARCH"
									/>
								</div>
							</div>
						</form>
						<div className="outerDiv1">
							<Card
								style={{
									marginTop: '15px',
									display: 'block',
									width: '50%',
									margin: '15px auto auto auto',
								}}
							>
								<h3>Please select Category</h3>
								<br />
								<button
									className="button"
									style={{ width: '150px' }}
									onClick={LagcategorySubmitHandler}
								>
									Legs
								</button>
								<br />
								<br />
								<button
									className="button"
									style={{ width: '150px' }}
									onClick={ArmcategorySubmitHandler}
								>
									Arms
								</button>
								<br />
								<br />
								<button
									className="button"
									style={{ width: '150px' }}
									onClick={AbscategorySubmitHandler}
								>
									Abs
								</button>
								<br />
							</Card>
						</div>
					</React.Fragment>
				)}

				<br />
				{!isLoading && loadedExercises && (
					<ExerciseList items={loadedExercises} />
				)}
			</React.Fragment>
		);
	}
};

export default Exercises;
