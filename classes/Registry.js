const User = require('./User');
const Room = require('./Room');

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
	this.addRoom = async (kurentoClient,room) => {
		if(!roomRegistry[room]){
			const new_room = new Room(room);
			roomRegistry[room] =  new_room;
			const pipeline = await new_room.createPipeline(kurentoClient);
			return new_room;
		}
	}
	this.getRoom = (room) => {
		if( roomRegistry[room] ){
			return roomRegistry[room];
		}else{
			return false;
		}
	}
	this.clearData = () => {
		roomRegistry = {};
		userRegistry = {};
		userRegistryByUsername = {};
	}

}