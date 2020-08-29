import React, { useState } from 'react'
import loginImage from '../images/login.svg';
import '../css/login.css';
function Login(props) {
	const [username, setUsername] = useState(props.username)
	const login = async () => {
		let o = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username: username })
		};
		const response = await fetch('/login', o);
		const {status,data} = await response.json();
		if(status == 'ok'){
			if(data){
				props.updateAppState(data.username,data.user_id);
			}
		}else{
			if(data == 'logged'){
				props.checkIfLoggedIn();
			}
		}
	}
	return (
		<div className="login">
			<img src={loginImage} className="login__logo" alt="logo" />
			<br/>
			<input type="text" value={username} onChange={e => { setUsername(e.target.value) }} className="form-control login__username bg-light border-0 small" placeholder="Enter your username" />
			<button onClick={login} className="btn btn-primary">Continue</button>
		</div>
	)
}

export default Login