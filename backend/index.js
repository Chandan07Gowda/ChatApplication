//which will handle the socket io connections

const io=require('socket.io')(8000, {
    cors: {
        origin: '*',
    }
})

const users={};
const messages = [];
io.on('connection',socket=>{
    socket.on('new-user-joined',name=>{
        // console.log("new user ",name)
        users[socket.id]=name;
        socket.broadcast.emit('user-joined',name)
        socket.emit('previous-messages', messages);
    });

    socket.on('send',message=>{
        const messageObj = {
            message: message,
            name: users[socket.id]
        };
        messages.push(messageObj);
        socket.broadcast.emit('receive',{message:message,name:users[socket.id]})
       // socket.emit('receive',{message:message,name:users[socket.id]})
    });
    
    socket.on('disconnect',message=>{
        socket.broadcast.emit('left',users[socket.id])
        delete users[socket.id];
    })
})