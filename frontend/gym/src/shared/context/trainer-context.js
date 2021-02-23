import { createContext } from 'react';

export const TrainerContext = createContext({
	isTrainerApproved: false,
	setApproval: () => {},
	removeApproval: () => {},
});
