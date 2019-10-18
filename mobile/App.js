import React, { Component } from "react";
import { TextInput, StyleSheet, Text, View, Button } from "react-native";
import io from "socket.io-client";
//import console from require("console");

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


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatMessage: "",
      chatMessages: [],
      menu: null,
      menuRaw: null,
      page: "",
      pages: []
    };
    this.socket = null;
  }

  componentDidMount() {
    this.socket = io("http://192.168.1.75:3000");
    this.socket.on("chat message", msg => {
      this.setState({ chatMessages: [...this.state.chatMessages, msg] });
    });
    this.socket.on("menu",msg=>{
      var derp = JSON.parse(msg);
      var menuTree = new Tree(derp.root.data);
      treeBuild(menuTree.root,derp.root.data.name);
      this.setState({menuRaw:menuTree} );
  });


  }

  submitChatMessage() {
    this.socket.emit("chat message", this.state.chatMessage);
    this.setState({ chatMessage: "" });
  }
  
  pageChange(derp)
  {
    this.setState((prevState) => ({pages: prevState.pages[derp].children}));
  }
  render() {
    const chatMessages = this.state.chatMessages.map(chatMessage => (
      <Text key = {chatMessage}>{chatMessage}</Text>
    ));
    

    // const buttons = this.state.pages.map(button => (
    //   <Button onPress = {() => this.pageChange(button.data.name)} title = {button.data.name}> </Button>
    // ));
    return (
      
      // <View style={styles.container}>
      //   {chatMessages}
      //   <KeyboardAvoidingView behavior="padding" enabled>
      //   <TextInput
      //     style={{ height: 40, borderWidth: 2 , backgroundColor: 'red'}}
      //     autoCorrect={false}
      //     value={this.state.chatMessage}
      //     onSubmitEditing={() => this.submitChatMessage()}
      //     onChangeText={chatMessage => {
      //       this.setState({ chatMessage });
      //     }}
      //   />
      //   </KeyboardAvoidingView>
      // </View>
      <View style = {styles.main}>
        {chatMessages}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
    justifyContent: "flex-end",
  },
  main:{
    flex: 1,
    justifyContent: "center",
    alignItems:"center",
  }
});