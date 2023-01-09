import Title from "./Title";
import './../styles/Messages.css';

const RegisterMessage = () => {
  return(
		<div className='container'>
			<div className={'messages'}>
				<Title />
				<div className={'container-sm'}>
					<p className={'page-description'}>you have created your account correctly, now check your email to confirm your account</p>
				</div>
			</div>
		</div>
	);
}


export default RegisterMessage;
