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
import TextField from '@material-ui/core/TextField';
import { Card } from 'react-bootstrap';
import { weekNo } from './ViewPlan';
import './Reporting.css';

const useStyles = makeStyles({
	root: {
		width: 'auto',
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
		'& .MuiTextField-root': {
			margin: theme.spacing(1),
			width: '228px',
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
	const [form4Data, setForm4Data] = useState(null);
	const [form5Data, setForm5Data] = useState(null);
	const [values, setValues] = useState({ weight: '', other: '' });

	const formSubmitHandler = async () => {
		let responseData;
		console.log(auth.userId, form4Data, form5Data, values);
		try {
			responseData = await sendRequest(
				'http://localhost:5000/api/viewplan/givereporting',
				'PATCH',
				JSON.stringify({
					week: weekNo,
					userid: auth.userId,
					strength: form4Data,
					pushups: form5Data,
					weight: values.weight,
					other: values.other,
				}),
				{
					'Content-Type': 'application/json',
				}
			);
			console.log(responseData);
		} catch (err) {
		} finally {
			if (weekNo === 4) {
				auth.setPlanComplated();
			}
			if (responseData.success === 1) {
				history.push('/viewplan');
			}
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

	const handleChange = prop => event => {
		setValues({ ...values, [prop]: event.target.value });
	};

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			{isLoading && <LoadingSpinner asOverlay />}
			{!isLoading && (
				<Card
					style={{
						maxWidth: '620px',
						margin: 'auto',
						textAlign: 'center',
						color: 'white',
					}}
				>
					{activeStep === 0 && (
						<div>
							<h4>HOW DO YOU FEEL AFTER CLIMBING 5 FLOORS?</h4>
							<hr></hr>
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
					{activeStep === 1 && (
						<div>
							<h3>HOW MANY PUSH-UPS CAN YOU DO AT ONE TIME??</h3>
							<hr></hr>
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
					{!isLoading && activeStep === 2 && (
						<form>
							<div style={{ backgroundColor: '' }}>
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
										type="number"
										value={values.weight}
										onChange={handleChange('weight')}
										endAdornment={
											<InputAdornment position="end">Kg</InputAdornment>
										}
										aria-describedby="standard-weight-helper-text"
										inputProps={{
											'aria-label': 'weight',
											min: 40,
											max: 130,
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
								<TextField
									id="standard-multiline-flexible"
									label="other feedback"
									multiline
									rowsMax={4}
									value={values.others}
									onChange={handleChange('other')}
								/>
							</div>
							<br></br>
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
							steps={3}
							position="static"
							activeStep={activeStep}
							className={classes.root}
							nextButton={
								<Button
									size="small"
									onClick={handleNext}
									disabled={!nextActive || activeStep === 2}
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
			)}
		</React.Fragment>
	);
}
