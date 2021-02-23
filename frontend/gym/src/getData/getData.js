import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	margin: {
		margin: theme.spacing(1),
	},
	withoutLabel: {
		marginTop: theme.spacing(3),
	},
	textField: {
		width: '25ch',
	},
}));

// export default function InputAdornments() {
//   const classes = useStyles();
//   const [values, setValues] = React.useState({
//     amount: '',
//     password: '',
//     weight: '',
//     weightRange: '',
//     showPassword: false,
//   });

const GetData = () => {
	// const [from1, setForm1] = useState(true);
	// const [from2, setForm2] = useState(false);
	// const [from3, setForm3] = useState(false);
	// const [from4, setForm4] = useState(false);
	// const [from5, setForm5] = useState(false);
	// const [from6, setForm6] = useState(false);
	// const [from7, setForm7] = useState(false);
	// const [from8, setForm8] = useState(false);

	// const viewfrom2 = () => {
	// 	setForm1(false);
	// 	setForm2(true);
	// 	setForm3(false);
	// 	setForm4(false);
	// 	setForm5(false);
	// 	setForm6(false);
	// 	setForm7(false);
	// 	setForm8(false);
	// };

	// const viewfrom3 = () => {
	// 	setForm1(false);
	// 	setForm2(false);
	// 	setForm3(true);
	// 	setForm4(false);
	// 	setForm5(false);
	// 	setForm6(false);
	// 	setForm7(false);
	// 	setForm8(false);
	// };
	// const viewfrom4 = () => {
	// 	setForm1(false);
	// 	setForm2(false);
	// 	setForm3(false);
	// 	setForm4(true);
	// 	setForm5(false);
	// 	setForm6(false);
	// 	setForm7(false);
	// 	setForm8(false);
	// };
	// const viewfrom5 = () => {
	// 	setForm1(false);
	// 	setForm2(false);
	// 	setForm3(false);
	// 	setForm4(false);
	// 	setForm5(true);
	// 	setForm6(false);
	// 	setForm7(false);
	// 	setForm8(false);
	// };
	// const viewfrom6 = () => {
	// 	setForm1(false);
	// 	setForm2(false);
	// 	setForm3(false);
	// 	setForm4(false);
	// 	setForm5(false);
	// 	setForm6(true);
	// 	setForm7(false);
	// 	setForm8(false);
	// };
	// const viewfrom7 = () => {
	// 	setForm1(false);
	// 	setForm2(false);
	// 	setForm3(false);
	// 	setForm4(false);
	// 	setForm5(false);
	// 	setForm6(false);
	// 	setForm7(true);
	// 	setForm8(false);
	// };
	// const viewfrom8 = () => {
	// 	setForm1(false);
	// 	setForm2(false);
	// 	setForm3(false);
	// 	setForm4(false);
	// 	setForm5(false);
	// 	setForm6(false);
	// 	setForm7(false);
	// 	setForm8(true);
	// };

	const [viewFormNumber, setViewFormNumber] = useState(1);
	const [form1Data, setForm1Data] = useState(null);
	const [form2Data, setForm2Data] = useState(null);
	const [form3Data, setForm3Data] = useState(null);
	const [form4Data, setForm4Data] = useState(null);
	const [form5Data, setForm5Data] = useState(null);
	const [form6Data, setForm6Data] = useState(null);
	const [form7Data, setForm7Data] = useState(null);
	const [values, setValues] = useState({ weight: '', height: '' });
	const classes = useStyles();

	const handleChange = prop => event => {
		setValues({ ...values, [prop]: event.target.value });
	};

	const nextHandler = () => {
		setViewFormNumber(viewFormNumber >= 8 ? 8 : viewFormNumber + 1);
		console.log(viewFormNumber);
	};

	const previousHandler = () => {
		setViewFormNumber(viewFormNumber < 2 ? 1 : viewFormNumber - 1);
		console.log(viewFormNumber);
	};

	const form1MaleSubmitHandler = () => {
		setForm1Data('male');
	};
	const form1FemaleSubmitHandler = () => {
		setForm1Data('female');
	};
	const form2LoseSubmitHandler = () => {
		setForm2Data('lose');
	};
	const form2GainSubmitHandler = () => {
		setForm2Data('gain');
	};
	const form2BuildSubmitHandler = () => {
		setForm2Data('build');
	};
	const form31SubmitHandler = () => {
		setForm3Data('HARDLY');
	};
	const form32SubmitHandler = () => {
		setForm3Data('SOMETIMES');
	};
	const form33SubmitHandler = () => {
		setForm3Data('2-3 TIMES A WEEK');
	};
	const form34SubmitHandler = () => {
		setForm3Data('OVER 4 TIMES A WEEK');
	};
	const form41SubmitHandler = () => {
		setForm4Data('SHORTNESS OF BREATH');
	};
	const form42SubmitHandler = () => {
		setForm4Data('A LITTLE TIRED');
	};

	const form43SubmitHandler = () => {
		setForm4Data('EASY');
	};
	const form44SubmitHandler = () => {
		setForm4Data('I CAN RUN UP THERE');
	};
	const form51SubmitHandler = () => {
		setForm5Data('Less Than 10');
	};
	const form52SubmitHandler = () => {
		setForm5Data('10-20');
	};
	const form53SubmitHandler = () => {
		setForm5Data('21-40');
	};
	const form54SubmitHandler = () => {
		setForm5Data('OVER 40');
	};
	const form61SubmitHandler = () => {
		setForm6Data('FULL BODY');
	};
	const form62SubmitHandler = () => {
		setForm6Data('ABS');
	};
	const form63SubmitHandler = () => {
		setForm6Data('ARM');
	};
	const form64SubmitHandler = () => {
		setForm6Data('LEG');
	};
	const form71SubmitHandler = () => {
		setForm7Data('EASY');
	};
	const form72SubmitHandler = () => {
		setForm7Data('MEDIUM');
	};
	const form73SubmitHandler = () => {
		setForm7Data('HARD');
	};
	return (
		<React.Fragment>
			{viewFormNumber === 1 && (
				<div>
					<p>
						Please let us know you better to help boost your workout results
					</p>
					<input
						type="button"
						className="button"
						value="MALE"
						onClick={form1MaleSubmitHandler}
					/>
					<input
						type="button"
						className="button"
						value="FEMALE"
						onClick={form1FemaleSubmitHandler}
					/>
					<p>{form1Data}</p>
				</div>
			)}
			{viewFormNumber === 2 && (
				<div>
					<p>Achieve your goal with your personalized plan</p>
					<input
						type="button"
						className="button"
						value="WEIGHT LOSE"
						onClick={form2LoseSubmitHandler}
					/>
					<input
						type="button"
						className="button"
						value="GET TONED"
						onClick={form2GainSubmitHandler}
					/>
					<input
						type="button"
						className="button"
						value="BUILD MUSCLE"
						onClick={form2BuildSubmitHandler}
					/>
					{<p>{form2Data}</p>}
				</div>
			)}
			{viewFormNumber === 3 && (
				<div>
					<h3>How often do you Exercise?</h3>
					<input
						type="button"
						className="button"
						value="HARDLY"
						onClick={form31SubmitHandler}
					/>
					<input
						type="button"
						className="button"
						value="SOMETIMES"
						onClick={form32SubmitHandler}
					/>
					<input
						type="button"
						className="button"
						value="2-3 TIMES A WEEK"
						onClick={form33SubmitHandler}
					/>
					<input
						type="button"
						className="button"
						value="OVER 4 TIMES A WEEK"
						onClick={form34SubmitHandler}
					/>
					<p>{form3Data}</p>
				</div>
			)}
			{viewFormNumber === 4 && (
				<div>
					<h4>HOW DO YOU FEEL AFTER CLIMBING 5 FLOORS?</h4>
					<input
						type="button"
						className="button"
						value="SHORTNESS OF BREATH"
						onClick={form41SubmitHandler}
					/>
					<input
						type="button"
						className="button"
						value="A LITTLE TIRED"
						onClick={form42SubmitHandler}
					/>
					<input
						type="button"
						className="button"
						value="EASY"
						onClick={form43SubmitHandler}
					/>
					<input
						type="button"
						className="button"
						value="I CAN RUN UP THERE"
						onClick={form44SubmitHandler}
					/>
					{<p>{form4Data}</p>}
				</div>
			)}
			{viewFormNumber === 5 && (
				<div>
					<h3>HOW MANY PUSH-UPS CAN YOU DO AT ONE TIME??</h3>
					<input
						type="button"
						className="button"
						value="LESS THAN 10"
						onClick={form51SubmitHandler}
					/>
					<input
						type="button"
						className="button"
						value="10-20"
						onClick={form52SubmitHandler}
					/>
					<input
						type="button"
						className="button"
						value="21-40"
						onClick={form53SubmitHandler}
					/>
					<input
						type="button"
						className="button"
						value="OVER 40"
						onClick={form54SubmitHandler}
					/>
					<p>{form5Data}</p>
				</div>
			)}
			{viewFormNumber === 6 && (
				<div>
					<h3>PLEASE SELECT YOUR WORKOUT PLAN</h3>
					<input
						type="button"
						className="button"
						value="FULL BODY WORKOUT"
						onClick={form61SubmitHandler}
					/>
					<input
						type="button"
						className="button"
						value="ABS WORKOUT"
						onClick={form62SubmitHandler}
					/>
					<input
						type="button"
						className="button"
						value="ARM WORKOUT"
						onClick={form63SubmitHandler}
					/>
					<input
						type="button"
						className="button"
						value="LEG WORKOUT"
						onClick={form64SubmitHandler}
					/>
					<p>{form6Data}</p>
				</div>
			)}
			{viewFormNumber === 7 && (
				<div>
					<h3>PLEASE SELECT DIFFICULTY</h3>
					<input
						type="button"
						className="button"
						value="EASY"
						onClick={form71SubmitHandler}
					/>
					<input
						type="button"
						className="button"
						value="MEDIUM"
						onClick={form72SubmitHandler}
					/>
					<input
						type="button"
						className="button"
						value="HARD"
						onClick={form73SubmitHandler}
					/>
					<p>{form7Data}</p>
				</div>
			)}
			{viewFormNumber === 8 && (
				<div>
					<FormControl
						className={clsx(
							classes.margin,
							classes.withoutLabel,
							classes.textField
						)}
					>
						<Input
							id="standard-adornment-weight"
							value={values.weight}
							onChange={handleChange('weight')}
							endAdornment={<InputAdornment position="end">Kg</InputAdornment>}
							aria-describedby="standard-weight-helper-text"
							inputProps={{
								'aria-label': 'weight',
							}}
						/>
						<FormHelperText id="standard-weight-helper-text">
							Weight
						</FormHelperText>
					</FormControl>
					<FormControl
						className={clsx(
							classes.margin,
							classes.withoutLabel,
							classes.textField
						)}
					>
						<Input
							id="standard-adornment-height"
							value={values.height}
							onChange={handleChange('height')}
							endAdornment={<InputAdornment position="end">cm</InputAdornment>}
							aria-describedby="standard-height-helper-text"
							inputProps={{
								'aria-label': 'height',
							}}
						/>
						<FormHelperText id="standard-weight-helper-text">
							Height
						</FormHelperText>
					</FormControl>
					<p>
						weight : {values.weight}
						height: {values.height}
					</p>
				</div>
			)}
			<br />
			{viewFormNumber !== 1 && (
				<input
					type="button"
					className="button"
					value="PREVIOUS"
					onClick={previousHandler}
				/>
			)}
			{viewFormNumber !== 8 && (
				<input
					type="button"
					className="button"
					value="NEXT"
					onClick={nextHandler}
				/>
			)}
		</React.Fragment>
	);
};

export default GetData;
