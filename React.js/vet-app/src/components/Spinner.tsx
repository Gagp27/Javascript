import React from 'react';

const Spinner = () => {
	return(
		<div className="flex items-center justify-center space-x-4">
			<div className="w-4 h-4 rounded-full animate-pulse dark:bg-indigo-700"></div>
			<div className="w-4 h-4 rounded-full animate-pulse dark:bg-indigo-700"></div>
			<div className="w-4 h-4 rounded-full animate-pulse dark:bg-indigo-700"></div>
		</div>
	);
}

export default Spinner;
