let users = [];

const addUser = ({ socketId, username, userId, roomId, token, roomTitle }) => {
  const existingUser = users.find(
    (user) => user.roomId === roomId && user.userId === userId
  );

  if (existingUser) {
    return { error: "이미 접속 중 입니다." };
  }

  const user = { socketId, username, userId, roomId, token, roomTitle };
  console.log("users", user);
  users.push(user);
  return user;
};

const removeUser = (socketId) => {
  const index = users.findIndex((user) => user.socketId === socketId);

  if (index !== -1) {
    console.log("are you in??");
    return users.splice(index, 1)[0];
  }
};

const getUser = (socketId) => {
  return users.find((user) => user.socketId === socketId);
};

const getUsersInRoom = (roomId) =>
  users.filter((user) => user.roomId === roomId);

module.exports = { addUser, removeUser, getUser, getUsersInRoom };
