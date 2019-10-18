const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
const port = 3000;
const decoder = require("string_decoder");


// io.on("connection", socket => {
//   console.log("a user connected :D and their id is " + socket.id);
//   socket.addListener
//   socket.on("chat message", msg => {
//     console.log(msg);
//     io.emit("chat message", msg);
//   });
// });

server.listen(port, () => console.log("server running on port:" + port));
function Node(data)
{
  this.data = data;
  this.parent = null;
  this.children = [];
}
function Tree(data)
{
  this.root = new Node(data);
}

var fs = require('fs');
let rawdata = fs.readFileSync('menuInformation.json');
let menu = JSON.parse(rawdata);

function treeBuild(node,name)
{
  var x;

  for (x of menu[name].children)
  {
    let tempNode = new Node(menu[x].data);
    tempNode.parent = node;

    node.children.push(tempNode);

    if (menu[tempNode.data.name].children != null)
      treeBuild(tempNode,tempNode.data.name);
  }

}

// function printTree(node)
// {
//   console.log(node);
//   var x;
//   for (x of node.children)
//   {
//     if(x.children != [])
//     printTree(x);
//   }
// }

// var app = require('express')();
// var http = require('http').Server(app);
// var io = require('socket.io')(http);
// var port = process.env.PORT || 3000;

var menuTree = new Tree(menu.root.data);

treeBuild(menuTree.root,menu.root.data.name);
//printTree(menuTree.root);


// app.get('/', function(req, res){
//   res.sendFile(__dirname + '/index.html');
//   // fs.readFile('Menu.txt', function(err, data) {
//   //   res.writeHead(200, {'Content-Type': 'text/html'});
//   //   res.write(data);
//   //   res.end();
//   // });
// });

console.log(menu);

io.on('connection', function(socket){
  console.log("user connected");
  menu = JSON.stringify(menu);
  socket.emit('menu',menu);
  fs.readFile('Menu.txt', function(err, data) {
    // res.writeHead(200, {'Content-Type': 'text/html'});
    // res.write(data);
    // res.end();
    //socket.emit('menu',data);
    //console.log(data);
  });
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    socket.emit('chat message', msg);
  });
  
});

// http.listen(port, function(){
//   console.log('listening on *:' + port);
// });