// Bring in the room class
const Namespace =  require('../classes/Namespace');
const Room =  require('../classes/Room');

// Set up the namespaces
let namespaces = [];
let wikiNs = new Namespace(0,'Wiki','https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Tesla_T_symbol.svg/800px-Tesla_T_symbol.svg.png','/wiki');
let mozNs = new Namespace(1,'Mozilla','https://i0.wp.com/insidebusiness.ng/wp-content/uploads/2018/11/IBM-network-Blockchain-CONTENT-2018.jpg?fit=890%2C500&ssl=1','/mozilla');
let linuxNs = new Namespace(2,'Linux','https://upload.wikimedia.org/wikipedia/commons/a/af/Tux.png','/linux');


// Make the main room and add it to rooms. it will ALWAYS be 0
wikiNs.addRoom(new Room(0,'New Articles','Wiki'));
wikiNs.addRoom(new Room(1,'Editors','Wiki',true));
wikiNs.addRoom(new Room(2,'Other','Wiki'));

mozNs.addRoom(new Room(0,'Firefox','Mozilla'));
mozNs.addRoom(new Room(1,'SeaMonkey','Mozilla'));
mozNs.addRoom(new Room(2,'SpiderMonkey','Mozilla'));
mozNs.addRoom(new Room(3,'Rust','Mozilla'));

linuxNs.addRoom(new Room(0,'Debian','Linux'));
linuxNs.addRoom(new Room(1,'Red Hat','Linux'));
linuxNs.addRoom(new Room(2,'MacOs','Linux'));
linuxNs.addRoom(new Room(3,'Kernal Development','Linux'));

namespaces.push(wikiNs,mozNs,linuxNs);

module.exports = namespaces;