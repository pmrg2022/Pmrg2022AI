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

    if(!message) return;

    addMessage(message, "user");

    input.value = "";

    // create typing bubble
    const typingDiv = document.createElement("div");
    typingDiv.classList.add("message", "ai");
    typingDiv.textContent = "Thinking...";
    chatContainer.appendChild(typingDiv);

    chatContainer.scrollTop = chatContainer.scrollHeight;

    // disable input temporarily (prevents spam clicks)
    sendButton.disabled = true;
    input.disabled = true;

    try{

        console.log("Sending to:", API_URL);

        const response = await fetch(API_URL, {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                message:message
            })
        });

        console.log("Status:", response.status);

        const text = await response.text();

        console.log("Response:", text);

        let data;

        try {
            data = JSON.parse(text);
        } catch (e) {
            throw new Error("Invalid JSON from server");
        }

        typingDiv.textContent = data.response;

    }catch(error){

        console.error(error);

        typingDiv.textContent =
            "Error: " + error.message;

    }finally{

        sendButton.disabled = false;
        input.disabled = false;
        input.focus();
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
