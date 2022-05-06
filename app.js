// MODULE IMPORTING
const express =  require("express");
const socket =  require("socket.io")
const namespaces = require("./data/namespaces")

const app =  express()

app.use(express.static(__dirname +"/public"))

const expressServer = app.listen(7000)

const io = socket(expressServer);

io.on("connection",(socket)=>{
    // when socket is connected, send back all namespaces
    const allNs = namespaces.map(namespace=>{
        return {
            imgUrl: namespace.img,
            endpoint: namespace.endpoint
        }
    })
    socket.emit("namespaces",allNs)
})

namespaces.forEach(namespace=>{ 
    // console.log(namespace.nsTitle)
    const namespaceServer =  io.of(`${namespace.endpoint}`)
    namespaceServer.on("connection",(nssocket)=>{
        nssocket.emit("namespaceroom",{data:namespace.rooms})

        nssocket.on("joinRoom", async (data)=>{
            // leave former room 
            const room = Array.from(nssocket.rooms)[1]
            nssocket.leave(room)
            updatePeeps(namespaceServer,room)
            //join new room
            nssocket.join(data.data)
            updatePeeps(namespaceServer,data.data)
            const roomObj = namespace.rooms.find(ns=> ns.roomTitle === data.data)
            // send all history on joining room 
            nssocket.emit("allMessagefromHistory",{
                data:roomObj.history
            })
            console.log(roomObj.history)
        })

        nssocket.on("newMessageToServer",(data)=>{
            console.log(data)
            const sendMessage = {
                text: data.data,
                author: "Jasmine blee",
                time: Date.now(),
                imgUrl: "https://via.placeholder.com/30"
            }
            // tell everyone in the room about the mesage
            console.log(nssocket.rooms)
            const room = Array.from(nssocket.rooms)[1]
            // store in the message history
            const roomObj = namespace.rooms.find(ns=> ns.roomTitle === room)
            roomObj.addMessage(sendMessage)
            namespaceServer.to(room).emit("messageToClient",{data:sendMessage})
        })
    })
})

async function updatePeeps (namespaceServer,room){
    const ids = await namespaceServer.in(room).allSockets()  
    namespaceServer.to(room).emit("amountOfPeep",{data:Array.from(ids).length, name:room})
}