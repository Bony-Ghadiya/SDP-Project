import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { useHistory } from 'react-router-dom';
import ErrorModal from '../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../shared/hooks/http-hook';
import { traineeid, traineename } from './showtrainee';
import { Card } from 'react-bootstrap';
import './ViewReporting.css';
import { transparent } from 'material-ui/styles/colors';

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box p={3}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired,
};

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
		backgroundColor: transparent,
	},
	PrivateTabIndicator: {
		backgroundColor: 'black',
	},
}));

const ViewReporting = () => {
	const history = useHistory();
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [data, setData] = useState();
	const classes = useStyles();
	const [value, setValue] = React.useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	useEffect(() => {
		const fetchRequests = async () => {
			try {
				const responseData = await sendRequest(
					`http://localhost:5000/api/viewplan/showreporting/${traineeid}`
				);
				setData(responseData.defaultexercise);
			} catch (err) {}
		};
		fetchRequests();
	}, [sendRequest]);

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			{isLoading && (
				<div className="center">
					<LoadingSpinner />
				</div>
			)}
			{!isLoading && data && (
				<Card style={{ width: '35%', margin: 'auto' }}>
					<div className={classes.root}>
						<AppBar position="static">
							<Tabs
								value={value}
								onChange={handleChange}
								aria-label="simple tabs example"
							>
								<Tab label="WEEK 1" {...a11yProps(0)} />
								<Tab label="WEEK 2" {...a11yProps(1)} />
								<Tab label="WEEK 3" {...a11yProps(2)} />
								<Tab label="WEEK 4" {...a11yProps(3)} />
							</Tabs>
						</AppBar>
						<TabPanel value={value} index={0}>
							<div style={{ textAlign: 'center', color: 'black' }}>
								{data.week1Report && (
									<table className="table1" id="t01" style={{ margin: '0px' }}>
										<caption>{traineename}'s Week 1 Report</caption>
										<tr className="row">
											<td className="data1">strength</td>
											<td className="data2">{data.week1Report.strength}</td>
										</tr>
										<tr className="row">
											<td className="data1">pushups</td>
											<td className="data2">{data.week1Report.pushups}</td>
										</tr>
										<tr className="row">
											<td className="data1">weight</td>
											<td className="data2">{data.week1Report.weight}</td>
										</tr>
										{data.week1Report.other && (
											<tr className="row">
												<td className="data1">other</td>
												<td className="data2">{data.week1Report.other}</td>
											</tr>
										)}
									</table>
								)}
								{!data.week1Report && <h3>Please Wait.....</h3>}
							</div>
						</TabPanel>
						<TabPanel value={value} index={1}>
							<div style={{ textAlign: 'center', color: 'black' }}>
								{data.week2Report && (
									<table className="table1" id="t01" style={{ margin: '0px' }}>
										<caption>{traineename}'s Week 2 Report</caption>
										<tr className="row">
											<td className="data1">strength</td>
											<td className="data2">{data.week2Report.strength}</td>
										</tr>
										<tr className="row">
											<td className="data1">pushups</td>
											<td className="data2">{data.week2Report.pushups}</td>
										</tr>
										<tr className="row">
											<td className="data1">weight</td>
											<td className="data2">{data.week2Report.weight}</td>
										</tr>
										{data.week2Report.other && (
											<tr className="row">
												<td className="data1">other</td>
												<td className="data2">{data.week2Report.other}</td>
											</tr>
										)}
									</table>
								)}
								{!data.week2Report && <h3>Please Wait.....</h3>}
							</div>
						</TabPanel>
						<TabPanel value={value} index={2}>
							<div style={{ textAlign: 'center', color: 'black' }}>
								{data.week3Report && (
									<table className="table1" id="t01" style={{ margin: '0px' }}>
										<caption>{traineename}'s Week 3 Report</caption>
										<tr className="row">
											<td className="data1">strength</td>
											<td className="data2">{data.week3Report.strength}</td>
										</tr>
										<tr className="row">
											<td className="data1">pushups</td>
											<td className="data2">{data.week3Report.pushups}</td>
										</tr>
										<tr className="row">
											<td className="data1">weight</td>
											<td className="data2">{data.week3Report.weight}</td>
										</tr>
										{data.week3Report.other && (
											<tr className="row">
												<td className="data1">other</td>
												<td className="data2">{data.week3Report.other}</td>
											</tr>
										)}
									</table>
								)}
								{!data.week3Report && <h3>Please Wait.....</h3>}
							</div>
						</TabPanel>
						<TabPanel value={value} index={3}>
							<div style={{ textAlign: 'center', color: 'black' }}>
								{data.week4Report && (
									<table className="table1" id="t01" style={{ margin: '0px' }}>
										<caption>{traineename}'s Week 4 Report</caption>
										<tr className="row">
											<td className="data1">strength</td>
											<td className="data2">{data.week4Report.strength}</td>
										</tr>
										<tr className="row">
											<td className="data1">pushups</td>
											<td className="data2">{data.week4Report.pushups}</td>
										</tr>
										<tr className="row">
											<td className="data1">weight</td>
											<td className="data2">{data.week4Report.weight}</td>
										</tr>
										{data.week4Report.other && (
											<tr className="row">
												<td className="data1">other</td>
												<td className="data2">{data.week4Report.other}</td>
											</tr>
										)}
									</table>
								)}
								{!data.week4Report && <h3>Please Wait.....</h3>}
							</div>
						</TabPanel>
					</div>
					<input
						type="button"
						className="btn2"
						value="View Plan"
						onClick={e => {
							e.preventDefault();
							history.push('/showtrainees/giveplan');
						}}
					/>
				</Card>
			)}
		</React.Fragment>
	);
};

export default ViewReporting;
