import React from 'react';
import ErrorModal from '../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../shared/hooks/http-hook';

const ViewData = () => {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			{isLoading && (
				<div className="center">
					<LoadingSpinner />
				</div>
			)}
			<p>viewdata</p>
		</React.Fragment>
	);
};

export default ViewData;
