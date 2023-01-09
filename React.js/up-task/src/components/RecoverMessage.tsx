import Title from "./Title";
import './../styles/Messages.css';

const RecoverMessage = () => {
	return(
		<div className='container'>
			<div className={'messages'}>
				<Title />
				<div className={'container-sm'}>
					<p className={'page-description'}>We send you an email so you can recover your account</p>
				</div>
			</div>
		</div>
	);
}


export default RecoverMessage;
