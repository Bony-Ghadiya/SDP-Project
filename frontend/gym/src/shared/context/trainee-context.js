import { createContext } from 'react';

export const TraineeContext = createContext({
	isTrainerSelected: false,
	setSelection: () => {},
	removeSelection: () => {},
});
