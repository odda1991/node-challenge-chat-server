const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { json } = require("express");

const app = express();
app.use(express.json())
app.use(bodyParser.json());
app.use(cors());

const welcomeMessage = {
  id: 0,
  from: "Bart",
  text: "Welcome to CYF chat system!",
};

//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.
let messages = [welcomeMessage];

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});

app.get("/messages", function(request,response){
  response.send(messages)
})

app.get("/messages/search", function(request, response){
  const termParam = request.query.text.toLowerCase()
  console.log(termParam)
  const result = messages.filter(function(message){
    const messageFrom = message.from.toLowerCase()
    const messageText = message.text.toLowerCase()
    return messageFrom.includes(termParam) || messageText.includes(termParam)
  })
  response.send(result)
})

app.get("/messages/latest", function(request, response){
  response.send(messages)
})

app.post("/messages", function(request,response){
  const {from , text} = request.body
  const message = {
    id : messages.length,
    from : from, 
    text : text
  }
  //const messageFrom = String(request.body.from);
  //const messageText = string(request.body.text);
  console.log(JSON.stringify(message, null, 2))
  if(
    message.from == undefined ||
    message.text == undefined){
      return response.status(400).send({success : false , message: "from and text are mandatory"})
    }else{
      message.id = messages.length
      messages.push(message)
      response.status(201).send(message)
    }
})

app.get("/messages/latest/:number", function(request, response){
  const number = request.params.number;
  const firstIndex = messages.length - number;
  const finalMessages = messages.filter((messages , index) => index >= firstIndex)
  response.send(finalMessages);
})

app.get("/messages/:id", function(request,response){
  const id = request.params.id 
  const message = messages.find(message => message.id == id)

  response.send(message)
})

app.delete("/messages/:id", function(request, response){
  const id = request.params.id
  const getById = messages.filter((message)=> message.id != id)
  if(!getById){
    response.status(500).send("account not found")
  }else{
    messages = getById;
    response.send(messages)
  }
  
})

app.listen(3000, () => {
   console.log("Listening on port 3000")
  });
