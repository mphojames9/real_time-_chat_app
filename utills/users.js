const users = [];

//When the user join the chat
function userJoin(id, username, room) {
    const user = {id, username, room };

    users.push(user);

    return user;
}

//getting the current user
function getCurrentUser(id){
    return users.find(user => user.id == id);
}

//when the user leaves the room
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if(index !== -1){
        return users.splice(index, 1)[0];
    }
}

//get room detains
function getRoomUsers(room) {
    return users.filter(user => user.room == room);
}

//exports function
module.exports =  {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
};