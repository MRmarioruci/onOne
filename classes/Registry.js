const User = require('./User');
const Room = require('./Room');
const Room_Model = require('../models/Room_Model');

module.exports = function Registry(){
	const userRegistry = {};
	const userRegistryByUsername = {};
	const roomRegistry = {};
	this.addUser = (data) => {
		if(userRegistry[data.user_id] === undefined){
			let newUser = new User(data);
			userRegistry[data.user_id] = newUser;
			return newUser;
		}else{
			return 'exists';
		}
	}
	this.getUser = (user_id) => {
		if(userRegistry[user_id]){
			return userRegistry[user_id];
		}else{
			return false;
		}
	}
	this.getUserByUserName = (username) => {
		if(userRegistryByUsername[username]){
			return userRegistryByUsername[username];
		}else{
			return false;
		}
	}
	this.deleteUser = (user_id) => {
		if(userRegistry[user_id]){
			let user = userRegistry[user_id];
			delete userRegistry[user_id];
			delete userRegistry[user.getUsername()];
		}else{
			console.log('user does not exist');
		}
	}
	this.addRoom = async (kurentoClient, room, user_id, CONNECTION) => {
		if(!roomRegistry[room]){
			const room_db_id = await Room_Model.addRoom(room, user_id, CONNECTION).catch( () => {})
			console.log(room_db_id);
			if(room_db_id){
				const new_room = new Room(room, room_db_id);
				roomRegistry[room] =  new_room;
				const pipeline = await new_room.createPipeline(kurentoClient);
				return new_room;
			}else{
				return false;
			}
		}
	}
	this.getRoom = (room) => {
		if( roomRegistry[room] ){
			return roomRegistry[room];
		}else{
			return false;
		}
	}
	this.getByWebsocket = (websocket) => {
		let out = null;
		for (const key in userRegistry) {
			if (userRegistry.hasOwnProperty(key)) {
				const user = userRegistry[key];
				var w = user.getWebsocket();
				if(w){
					if(w.id == websocket){
						out = user;
					}
				}
			}
		}
		return out;
	}
	this.getUsersByRoom = (room) => {
		let out = [];
		for (const key in userRegistry) {
			if (userRegistry.hasOwnProperty(key)) {
				const user = userRegistry[key];
				var roomName = user.getRoomName();
				if(roomName){
					if(roomName == room){
						out.push(user.getInfo());
					}
				}
			}
		}
		return out;
	}
	this.clearData = () => {
		roomRegistry = {};
		userRegistry = {};
		userRegistryByUsername = {};
	}

}