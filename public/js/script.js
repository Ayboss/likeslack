// SOCKETS 
const sockethost = "http://localhost:7000"
const socket = io(sockethost)
let nsSocket = ""


function joinRoom(room){
    nsSocket.emit("joinRoom",{data:room})
}
function joinNameSpace(endpoint){
    // first closr existing socket
    if(nsSocket){
        nsSocket.close()
    }
    nsSocket = io(`http://localhost:7000${endpoint}`)
    
    nsSocket.on("namespaceroom",(data)=>{
        populateRooms(data.data)
        // get that room for the initial
        if(!data.data[0]) return
        console.log(data.data[0].roomTitle)
        const room = data.data[0].roomTitle    
        joinRoom(room)
    })

    nsSocket.on("amountOfPeep",(data)=>{
        populateRoomHeaderAndAmount(data.name, data.data)
    })

    nsSocket.on("allMessagefromHistory",(data)=>{
        populateChatAll( data.data)
    })
    nsSocket.on("messageToClient",(data)=>{
        console.log("and the whole clients says", data)
        populateChat(data.data)
    })
}




socket.on("namespaces",(ns)=>{
    console.log(ns)
    populateNamespace(ns)
    joinNameSpace(ns[0].endpoint)
})






// ELEMENTS REFERENCES
const nsContEl = document.querySelector(".namespaces")
const roomContEl =  document.querySelector(".rooms__list")
const chatsContEl = document.querySelector(".chats")
const formEl =  document.querySelector(".form")
const inputEl = formEl.querySelector(".form__input")
// ADD EVENT LISTENER 
nsContEl.addEventListener("click",(event)=>{
    if(!event.target.matches(".namespace__icon")) return
    const namespace = event.target
    console.dir(namespace.dataset.title)
    // listen to a new socket
    joinNameSpace(namespace.dataset.title)
})

roomContEl.addEventListener("click",(event)=>{
    if(!event.target.matches(".room * ") && !event.target.matches(".room")) return 
    const room = event.target
    console.dir(room.innerText)
    joinRoom(room.innerText)
})

formEl.addEventListener("submit",(event)=>{
    event.preventDefault()
    // emit the value
    nsSocket.emit("newMessageToServer",{data:inputEl.value})
    inputEl.value = ""
})





// DOM OPERATIONS 
const populateNamespace = (ns)=>{
    let prehtml = "";
    ns.forEach((nsObj)=>{
        prehtml += `<img class='namespace__icon' data-title=${nsObj.endpoint} src=${nsObj.imgUrl} />`
    })
    nsContEl.innerHTML = prehtml
}

const populateRooms = (rooms)=>{
    let prehtml = "";
    rooms.forEach((room)=>{
        const locked = room.privateRoom ? "lock-closed-outline" : "globe-outline"
        prehtml += `<li class="room"><ion-icon name=${locked}></ion-icon> <span>${room.roomTitle} </span></li>`
    })
    roomContEl.innerHTML = prehtml
}

const populateRoomHeaderAndAmount = (roomName, num)=>{
    const el = document.querySelector(".chatroom__header")
    el.innerHTML = `<span># ${roomName} </span><span class="chatroom__header--peeps">${num} peeps</span>`
    
}

const populateChat = (data)=>{
  const preHtml = `<div class="chat">
        <img class="chat__avatar" src=${data.imgUrl} />
        <div class="chat__info">
            <p class="chat__nametime">
                <span class="chat__name">${data.author}</span>
                <span class="chat__time">${data.time}</span>
            </p>
            <p class="chat__text">${data.text}</p>
        </div>
    </div>`
    chatsContEl.insertAdjacentHTML("beforeend", preHtml)
}

const populateChatAll = (dataAll)=>{
    let preHtml = ""
    dataAll.forEach(data=>{
        preHtml += `<div class="chat">
            <img class="chat__avatar" src=${data.imgUrl} />
            <div class="chat__info">
                <p class="chat__nametime">
                    <span class="chat__name">${data.author}</span>
                    <span class="chat__time">${data.time}</span>
                </p>
                <p class="chat__text">${data.text}</p>
            </div>
        </div>`
    })

chatsContEl.innerHTML = preHtml
}

function joinstuff(){
    console.log("okay")
}