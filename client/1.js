var localConnection = null;   // RTCPeerConnection for our "local" connection
var remoteConnection = null;  // RTCPeerConnection for the "remote"

var sendChannel = null;       // RTCDataChannel for the local (sender)
var receiveChannel = null;    // RTCDataChannel for the remote (receiver)

function connectPeers() {
    // Create the local connection and its event listeners

    localConnection = new RTCPeerConnection();
    console.log('localConnection = new RTCPeerConnection()', localConnection);

    // Create the data channel and establish its event listeners
    sendChannel = localConnection.createDataChannel("sendChannel");
    sendChannel.onopen = handleSendChannelStatusChange;
    sendChannel.onclose = handleSendChannelStatusChange;

    // Create the remote connection and its event listeners

    remoteConnection = new RTCPeerConnection();
    console.log('remoteConnection = new RTCPeerConnection()', remoteConnection);
    remoteConnection.ondatachannel = receiveChannelCallback;

    // Set up the ICE candidates for the two peers


    localConnection.onicecandidate = function (e) {
        console.log('localConnection.onicecandidate', e);
        !e.candidate
        || remoteConnection.addIceCandidate(e.candidate)
            .catch(handleAddCandidateError);
    };

    remoteConnection.onicecandidate = function (e) {
        console.log('remoteConnection.onicecandidate', e);
        !e.candidate
        || localConnection.addIceCandidate(e.candidate)
            .catch(handleAddCandidateError);
    };

    // Now create an offer to connect; this starts the process

    localConnection.createOffer()
        .then(function (offer) {
            console.log('localConnection.createOffer()', offer);
            localConnection.setLocalDescription(offer)
        })
        .then(function () {
            console.log('remoteConnection.setRemoteDescription()', localConnection.localDescription);
            remoteConnection.setRemoteDescription(localConnection.localDescription)
        })
        .then(function () {
            console.log('remoteConnection.createAnswer');
            return remoteConnection.createAnswer();
        })
        .then(function (answer) {
            console.log('remoteConnection.setLocalDescription(answer)', answer);
            remoteConnection.setLocalDescription(answer)
        })
        .then(function () {
            console.log('localConnection.setRemoteDescription', remoteConnection.localDescription);
            localConnection.setRemoteDescription(remoteConnection.localDescription)
        })
        .catch(handleCreateDescriptionError);
}

function handleCreateDescriptionError(error) {
    console.log("Unable to create an offer: " + error.toString());
}

function handleLocalAddCandidateSuccess() {
    console.log('handleLocalAddCandidateSuccess', arguments);
}

function handleRemoteAddCandidateSuccess() {
    console.log('handleRemoteAddCandidateSuccess', arguments);
}

function handleAddCandidateError() {
    console.log("Oh noes! addICECandidate failed!");
}

function sendMessage(message) {
    console.log('sendMessage', message);
    sendChannel.send(message);
}

function handleSendChannelStatusChange(event) {
    if (sendChannel) {
        var state = sendChannel.readyState;

        console.log('change state', state);
        if (state === "open") {
        } else {
        }
    }
}

function receiveChannelCallback(event) {
    console.log('receiveChannelCallback');
    receiveChannel = event.channel;
    receiveChannel.onmessage = handleReceiveMessage;
    receiveChannel.onopen = handleReceiveChannelStatusChange;
    receiveChannel.onclose = handleReceiveChannelStatusChange;
}

function handleReceiveMessage(event) {
    console.log('handleReceiveMessage', event.data);
}

function handleReceiveChannelStatusChange(event) {
    if (receiveChannel) {
        console.log("Receive channel's status has changed to " +
            receiveChannel.readyState);
    }
}

function disconnectPeers() {

    sendChannel.close();
    receiveChannel.close();

    localConnection.close();
    remoteConnection.close();

    sendChannel = null;
    receiveChannel = null;
    localConnection = null;
    remoteConnection = null;
}
