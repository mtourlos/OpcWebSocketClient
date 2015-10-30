var socket = new WebSocket("ws://10.10.10.62:8080/OpcWebSockets/actions");
//alert("connected");
socket.onmessage = onMessage;

function onMessage(event) {
    //alert("message received");
    var data = JSON.parse(event.data);
    document.getElementById("analog").innerHTML=data.analog;
    document.getElementById("boolean").innerHTML=data.boolean;
    var SendMessage = {
        action:"ok"
    };
    socket.send(JSON.stringify(SendMessage));
}

function stop(){
    var StopMessage = {
        action:"stop"
    };
    socket.send(JSON.stringify(StopMessage));
    action("Stop sended");
}

function ok(){
    var OkMessage = {
        action:"ok"
    };
    socket.send(JSON.stringify(OkMessage));
}
