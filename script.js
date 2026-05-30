const API_URL = "https://ai-custom-hosting.onrender.com/chat";

const chatContainer =
    document.getElementById("chat-container");

const input =
    document.getElementById("message-input");

const sendButton =
    document.getElementById("send-button");

function addMessage(text, type){

    const div = document.createElement("div");

    div.classList.add("message");
    div.classList.add(type);

    div.textContent = text;

    chatContainer.appendChild(div);

    chatContainer.scrollTop =
        chatContainer.scrollHeight;
}

async function sendMessage(){

    const message = input.value.trim();

    if(!message){
        return;
    }

    addMessage(message, "user");

    input.value = "";

    addMessage("Thinking...", "ai");

    try{

        console.log("Sending to:", API_URL);

        const response = await fetch(
            API_URL,
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    message:message
                })
            }
        );

        console.log("Status:", response.status);

        const text = await response.text();

        console.log("Response:", text);

        const data = JSON.parse(text);

        chatContainer.lastChild.textContent =
            data.response;

    }catch(error){

    console.error(error);

    chatContainer.lastChild.textContent =
        "Error: " + error.message;
    }
}

sendButton.addEventListener(
    "click",
    sendMessage
);

input.addEventListener(
    "keydown",
    function(e){

        if(e.key === "Enter"){
            sendMessage();
        }
    }
);
