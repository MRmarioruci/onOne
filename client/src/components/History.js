import React, {useEffect, useState} from 'react'
import {CopyToClipboard} from 'react-copy-to-clipboard';

function History() {
	const [rooms, setRoom] = useState([]);
	useEffect(() => {
		getHistory();
	},[])
	const getHistory = async () => {
		let o = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({})
		};
		const response = await fetch('/getHistory', o);
		const {status,data} = await response.json();
		if(status === 'ok'){
			if(data){
				setRoom([...rooms, ...data]);
			}else{
				console.log('History error');
			}
		}
	}
	const deleteHistory = async (room_id) => {
		let o = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({'room_id': room_id})
		};
		const response = await fetch('/deleteHistory', o);
		const {status,data} = await response.json();
		if(status === 'ok'){
			if(data){
				let tmpArray = [...rooms];
				let i = null;
				tmpArray.forEach( (room, index) => {
					if(room.room_id === room_id){
						i = index;
					}
				})
				if(i !== null){
					tmpArray.splice(i, 1);
					setRoom(tmpArray);
				}
			}else{
				console.log('History deletion error');
			}
		}
	}
	return (
		<div className="history__section">
			<h3>
				<i className="fa fa-history" aria-hidden="true"></i>
				&nbsp;
				<span>History</span>
				{
					rooms.length > 0 &&
					<div>
						{
							rooms.map( (room, index) => {
								return (
								<div key={index} className="history__item">
									<div className="history__left">
										<span className="fnt17">#{index+1}</span>
										<span className="fnt17 table__30">{room.name}</span>
									</div>
									<div className="history__right">
										<span className="fnt17">
											<a className="btn btn-primary history__button" href={window.location.href+'call/'+room.name}>
												<i className="fas fa-sign-in-alt"></i>&nbsp;
												<span className="hidden-md">Join</span>
											</a>
										</span>
										<span className="fnt17">
											<button className="btn btn-danger history__button" onClick={ () => deleteHistory(room.room_id) }>
												<i className="fas fa-trash"></i>&nbsp;
												<span className="hidden-md">Delete</span>
											</button>
										</span>
									</div>
								</div>
								)
							})
						}
					</div>
				}
				{
					rooms.length == 0 &&
					<div className="text-center"> No rooms joined yet.</div>
				}
			</h3>
			<hr/>
		</div>
	)
}

export default History
