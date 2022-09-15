const express = require('express'); 
const app = express();

const path = require('path');
const port = 5001;                  //Save the port number where your server will b

app.use(require("./server.js"));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/", {
	index: false,
	immutable: true,
	cacheControl: true,
	maxAge: "30d"
}));

app.set('views' , path.join(__dirname,'views'));

app.listen(port, () => {      
		console.log(`Now listening on port ${port}`);
});
