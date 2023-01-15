import React from 'react';

type Props = {
	setShowModal: Function;
	text1: String;
	text2: String;
	redirect: String | null;
}

const Alert: React.FC<Props> = ({setShowModal, text1, text2, redirect}) => {

	const onClickHandler = () => {
		if(redirect !== null) {
			window.location.href = `${redirect}`;
		} else {
			setShowModal(false);
		}
	}

	return (
		<div className="fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-90 flex">
			<div className="bg-white w-11/12 md:w-auto mx-auto my-auto py-20 px-2 md:px-20 pb-14 rounded-3xl">
				<p className="text-center lg:text-3xl font-black text-black">{text1}</p>
				<p className="text-center lg:text-3xl font-black text-indigo-700">{text2}</p>
				<button className="bg-indigo-700 py-2 px-12 rounded-lg w-full md:w-auto text-white font-bold uppercase mt-12" type="button" onClick={onClickHandler}>Close
				</button>
			</div>
		</div>
	);
}

export default Alert;
