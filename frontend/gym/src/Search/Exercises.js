import React, { useEffect, useState } from 'react';

import ExerciseList from './components/ExerciseList';
import ErrorModal from '../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../shared/hooks/http-hook';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

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
			borderColor: 'black',
		},
		'&:hover .MuiOutlinedInput-notchedOutline': {
			borderColor: 'black',
		},
		'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
			borderColor: 'black',
		},
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
					style={{
						marginTop: '0',
						width: '20%',
						height: '100%',
						zIndex: '1',
						backgroundColor: 'white',
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
						<h3>Search By Category</h3>
						<ul
							style={{
								textAlign: 'left',
								paddingLeft: '20px',
							}}
						>
							<li>
								<input
									className="input"
									type="button"
									value="Legs"
									onClick={LagcategorySubmitHandler}
								></input>
							</li>
							<li>
								<input
									className="input"
									type="button"
									value="Arms"
									onClick={ArmcategorySubmitHandler}
								></input>
							</li>
							<li>
								<input
									className="input"
									type="button"
									value="Abs"
									onClick={AbscategorySubmitHandler}
								></input>
							</li>
						</ul>
					</div>
				</div>
				{!isLoading && allExercises && (
					<React.Fragment>
						<form
							style={{
								marginLeft: '15%',
								paddingLeft: '20px',
								display: 'block',
							}}
							onSubmit={searchSubmitHandler}
						>
							<div className="outerDiv">
								<div
									style={{
										display: 'inline-block',
										textAlign: 'center',
										backgroundColor: 'none',
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
										style={{ width: 600 }}
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

								<br></br>
								<br />
								<input
									className="button"
									type="button"
									onClick={searchSubmitHandler}
									value="SEARCH"
								/>
							</div>
						</form>
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
