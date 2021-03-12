import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import clsx from 'clsx';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import { AuthContext } from '../shared/context/auth-context';
import ErrorModal from '../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../shared/hooks/http-hook';
import { Card } from 'react-bootstrap';
import './getData.css';

const useStyles = makeStyles({
	root: {
		width: 516,
		flexGrow: 1,
		margin: 'auto',
		'& .MuiInput-underline:after': {
			borderBottomColor: '#4caf50',
		},
		'& .MuiOutlinedInput-root': {
			'& fieldset': {
				borderColor: 'white',
			},
			'&:hover fieldset': {
				borderColor: 'white',
			},
			'&.Mui-focused fieldset': {
				borderColor: '#4caf50',
			},
		},
		'& .MuiInputLabel-formControl': {
			color: '#4caf50',
		},
	},
});
const useStyles1 = makeStyles(theme => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
		'& .MuiInput-underline:after': {
			borderBottomColor: '#4caf50',
		},
		'& .MuiOutlinedInput-root': {
			'& fieldset': {
				borderColor: 'white',
			},
			'&:hover fieldset': {
				borderColor: 'white',
			},
			'&.Mui-focused fieldset': {
				borderColor: '#4caf50',
			},
		},
		'& .MuiInputLabel-formControl': {
			color: '#4caf50',
		},
	},
	margin: {
		margin: theme.spacing(1),
	},
	withoutLabel: {
		marginTop: theme.spacing(3),
	},
	textField: {
		width: '25ch',
		display: 'block',
		margin: '10px auto',
	},
	MuiTypography: {},
}));

export default function ProgressMobileStepper() {
	const history = useHistory();
	const auth = useContext(AuthContext);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const classes = useStyles();
	const classes1 = useStyles1();
	const theme = useTheme();
	const [nextActive, setNextActive] = useState(false);
	const [activeStep, setActiveStep] = useState(0);
	const [form1Data, setForm1Data] = useState(null);
	const [form2Data, setForm2Data] = useState(null);
	const [form3Data, setForm3Data] = useState(null);
	const [form4Data, setForm4Data] = useState(null);
	const [form5Data, setForm5Data] = useState(null);
	const [form6Data, setForm6Data] = useState(null);
	const [form7Data, setForm7Data] = useState(null);
	const [values, setValues] = useState({ weight: '', height: '', age: '' });

	const formSubmitHandler = async () => {
		let responseData;
		console.log(
			auth.userId,
			form1Data,
			form2Data,
			form3Data,
			form4Data,
			form5Data,
			form6Data,
			form7Data,
			values
		);
		try {
			responseData = await sendRequest(
				'http://localhost:5000/api/getplan/plan',
				'POST',
				JSON.stringify({
					userid: auth.userId,
					gender: form1Data,
					goal: form2Data,
					time: form3Data,
					strength: form4Data,
					pushups: form5Data,
					workout: form6Data,
					difficulty: form7Data,
					values: values,
				}),
				{
					'Content-Type': 'application/json',
				}
			);
			console.log(responseData);
		} catch (err) {
		} finally {
			auth.setDataGiven();
			history.push('/');
		}
	};

	const handleNext = () => {
		setNextActive(false);
		setActiveStep(prevActiveStep => prevActiveStep + 1);
	};

	const handleBack = () => {
		setNextActive(false);
		setActiveStep(prevActiveStep => prevActiveStep - 1);
	};

	const form1MaleSubmitHandler = () => {
		setForm1Data('male');
		setNextActive(true);
	};
	const form1FemaleSubmitHandler = () => {
		setForm1Data('female');
		setNextActive(true);
	};
	const form2LoseSubmitHandler = () => {
		setForm2Data('lose weight');
		setNextActive(true);
	};
	const form2GainSubmitHandler = () => {
		setForm2Data('gain weight');
		setNextActive(true);
	};
	const form2BuildSubmitHandler = () => {
		setForm2Data('build muscle');
		setNextActive(true);
	};
	const form31SubmitHandler = () => {
		setForm3Data('HARDLY');
		setNextActive(true);
	};
	const form32SubmitHandler = () => {
		setForm3Data('SOMETIMES');
		setNextActive(true);
	};
	const form33SubmitHandler = () => {
		setForm3Data('2-3 TIMES A WEEK');
		setNextActive(true);
	};
	const form34SubmitHandler = () => {
		setForm3Data('OVER 4 TIMES A WEEK');
		setNextActive(true);
	};
	const form41SubmitHandler = () => {
		setForm4Data('SHORTNESS OF BREATH');
		setNextActive(true);
	};
	const form42SubmitHandler = () => {
		setForm4Data('A LITTLE TIRED');
		setNextActive(true);
	};

	const form43SubmitHandler = () => {
		setForm4Data('EASY');
		setNextActive(true);
	};
	const form44SubmitHandler = () => {
		setForm4Data('I CAN RUN UP THERE');
		setNextActive(true);
	};
	const form51SubmitHandler = () => {
		setForm5Data('Less Than 10');
		setNextActive(true);
	};
	const form52SubmitHandler = () => {
		setForm5Data('10-20');
		setNextActive(true);
	};
	const form53SubmitHandler = () => {
		setForm5Data('21-40');
		setNextActive(true);
	};
	const form54SubmitHandler = () => {
		setForm5Data('OVER 40');
		setNextActive(true);
	};
	const form61SubmitHandler = () => {
		setForm6Data('FULL BODY');
		setNextActive(true);
	};
	const form62SubmitHandler = () => {
		setForm6Data('ABS');
		setNextActive(true);
	};
	const form63SubmitHandler = () => {
		setForm6Data('ARM');
		setNextActive(true);
	};
	const form64SubmitHandler = () => {
		setForm6Data('LEG');
		setNextActive(true);
	};
	const form71SubmitHandler = () => {
		setForm7Data('EASY');
		setNextActive(true);
	};
	const form72SubmitHandler = () => {
		setForm7Data('MEDIUM');
		setNextActive(true);
	};
	const form73SubmitHandler = () => {
		setForm7Data('HARD');
		setNextActive(true);
	};
	const handleChange = prop => event => {
		setValues({ ...values, [prop]: event.target.value });
	};

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			{isLoading && <LoadingSpinner asOverlay />}
			<Card
				style={{
					maxWidth: '500px',
					margin: 'auto',
					textAlign: 'center',
					color: 'white',
				}}
			>
				{activeStep === 0 && (
					<div>
						<p>
							Please let us know you better to help boost your workout results
						</p>
						<hr/>
						
						<input
							type="button"
							className="btn1"
							value="MALE"
							onClick={form1MaleSubmitHandler}
						/>
						<input
							type="button"
							className="btn1"
							value="FEMALE"
							onClick={form1FemaleSubmitHandler}
						/>
					</div>
				)}
				{activeStep === 1 && (
					<div>
						<p>Achieve your goal with our personalized plan</p>
						<hr/>
					
						<input
							type="button"
							className="btn1"
							value="WEIGHT LOSE"
							onClick={form2LoseSubmitHandler}
						/>
						<input
							type="button"
							className="btn1"
							value="GET TONED"
							onClick={form2GainSubmitHandler}
						/>
						<input
							type="button"
							className="btn1"
							value="BUILD MUSCLE"
							onClick={form2BuildSubmitHandler}
						/>
					</div>
				)}
				{activeStep === 2 && (
					<div>
						<h3>How often do you Exercise?</h3>
						<hr/>
						
						<input
							type="button"
							className="btn1"
							value="HARDLY"
							onClick={form31SubmitHandler}
						/>
						<input
							type="button"
							className="btn1"
							value="SOMETIMES"
							onClick={form32SubmitHandler}
						/>
						<input
							type="button"
							className="btn1"
							value="2-3 TIMES A WEEK"
							onClick={form33SubmitHandler}
						/>
						<input
							type="button"
							className="btn1"
							value="OVER 4 TIMES A WEEK"
							onClick={form34SubmitHandler}
						/>
					</div>
				)}
				{activeStep === 3 && (
					<div>
						<h4>HOW DO YOU FEEL AFTER CLIMBING 5 FLOORS?</h4>
						<hr/>
						
						<input
							type="button"
							className="btn1"
							value="SHORTNESS OF BREATH"
							onClick={form41SubmitHandler}
						/>
						<input
							type="button"
							className="btn1"
							value="A LITTLE TIRED"
							onClick={form42SubmitHandler}
						/>
						<input
							type="button"
							className="btn1"
							value="EASY"
							onClick={form43SubmitHandler}
						/>
						<input
							type="button"
							className="btn1"
							value="I CAN RUN UP THERE"
							onClick={form44SubmitHandler}
						/>
					</div>
				)}
				{activeStep === 4 && (
					<div>
						<h3>HOW MANY PUSH-UPS CAN YOU DO AT ONE TIME??</h3>
						<hr/>
						
						<input
							type="button"
							className="btn1"
							value="LESS THAN 10"
							onClick={form51SubmitHandler}
						/>
						<input
							type="button"
							className="btn1"
							value="10-20"
							onClick={form52SubmitHandler}
						/>
						<input
							type="button"
							className="btn1"
							value="21-40"
							onClick={form53SubmitHandler}
						/>
						<input
							type="button"
							className="btn1"
							value="OVER 40"
							onClick={form54SubmitHandler}
						/>
					</div>
				)}
				{activeStep === 5 && (
					<div>
						<h3>PLEASE SELECT YOUR WORKOUT PLAN</h3>
						<hr/>
						
						<input
							type="button"
							className="btn1"
							value="FULL BODY WORKOUT"
							onClick={form61SubmitHandler}
						/>
						{/* <button onClick={form62SubmitHandler}>ABS WORKOUT</button> */}

						<input
							type="button"
							className="btn1"
							value="ABS WORKOUT"
							onClick={form62SubmitHandler}
						/>

						<input
							type="button"
							className="btn1"
							value="ARM WORKOUT"
							onClick={form63SubmitHandler}
						/>
						<input
							type="button"
							className="btn1"
							value="LEG WORKOUT"
							onClick={form64SubmitHandler}
						/>
					</div>
				)}
				{activeStep === 6 && (
					<div>
						<h3>PLEASE SELECT DIFFICULTY</h3>
						<hr/>
						
						<input
							type="button"
							className="btn1"
							value="EASY"
							onClick={form71SubmitHandler}
						/>
						<input
							type="button"
							className="btn1"
							value="MEDIUM"
							onClick={form72SubmitHandler}
						/>
						<input
							type="button"
							className="btn1"
							value="HARD"
							onClick={form73SubmitHandler}
						/>
					</div>
				)}
				{!isLoading && activeStep === 7 && (
					<form>
						<div style={{ backgroundColor: '' }}>
							<FormControl
								className={clsx(
									classes1.margin,
									classes1.withoutLabel,
									classes1.textField
								)}
							>
								<Input
									id="standard-adornment-age"
									value={values.age}
									onChange={handleChange('age')}
									endAdornment={
										<InputAdornment position="end">years</InputAdornment>
									}
									aria-describedby="standard-age-helper-text"
									inputProps={{
										'aria-label': 'age',
									}}
								/>
								<FormHelperText id="standard-age-helper-text">
									Age
								</FormHelperText>
							</FormControl>
							<FormControl
								className={clsx(
									classes1.margin,
									classes1.withoutLabel,
									classes1.textField
								)}
							>
								<FormHelperText id="standard-weight-helper-text">
									Weight
								</FormHelperText>
								<Input
									id="standard-adornment-weight"
									value={values.weight}
									onChange={handleChange('weight')}
									endAdornment={
										<InputAdornment position="end">Kg</InputAdornment>
									}
									aria-describedby="standard-weight-helper-text"
									inputProps={{
										'aria-label': 'weight',
									}}
									InputLabelProps={{
										shrink: true,
										style: { color: '#4caf50' },
									}}
									InputProps={{
										style: {
											color: 'white',
											'&:hover': {
												border: '1px solid red',
											},
										},
										outlinedRoot: {
											'&:hover': {
												border: '1px solid red',
											},
										},
									}}
								/>
								<FormHelperText id="standard-weight-helper-text">
									Weight
								</FormHelperText>
							</FormControl>
							<FormControl
								className={clsx(
									classes1.margin,
									classes1.withoutLabel,
									classes1.textField
								)}
							>
								<Input
									id="standard-adornment-height"
									value={values.height}
									onChange={handleChange('height')}
									endAdornment={
										<InputAdornment position="end">cm</InputAdornment>
									}
									aria-describedby="standard-height-helper-text"
									inputProps={{
										'aria-label': 'height',
									}}
								/>
								<FormHelperText id="standard-weight-helper-text">
									Height
								</FormHelperText>
							</FormControl>
						</div>
						<input
							className="btn1"
							type="submit"
							onClick={e => {
								e.preventDefault();
								formSubmitHandler();
							}}
						/>
					</form>
				)}
				<div
					style={{
						background: 'none',
						textAlign: 'center',
						margin: 'auto',
						marginBottom: '50px',
					}}
				>
					<MobileStepper
						variant="dots"
						steps={8}
						position="static"
						activeStep={activeStep}
						className={classes.root}
						nextButton={
							<Button
								size="small"
								onClick={handleNext}
								disabled={!nextActive || activeStep === 7}
							>
								Next
								{theme.direction === 'rtl' ? (
									<KeyboardArrowLeft />
								) : (
									<KeyboardArrowRight />
								)}
							</Button>
						}
						backButton={
							<Button
								size="small"
								onClick={handleBack}
								disabled={activeStep === 0}
							>
								{theme.direction === 'rtl' ? (
									<KeyboardArrowRight />
								) : (
									<KeyboardArrowLeft />
								)}
								Back
							</Button>
						}
					/>
				</div>
			</Card>
		</React.Fragment>
	);
}
