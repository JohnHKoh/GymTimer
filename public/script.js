const socket = io();

const CLOCK_STATE = 0;
const STOPWATCH_STARTED_STATE = 1;
const STOPWATCH_STOPPED_STATE = 2;

let clock;
socket.emit('clockClicked');

function pad(n) { return n === 0 ? "12" : ("0" + n).slice(-2); }

function updateTime() {
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    // document.getElementById("time").innerHTML = pad(hours%12) + ":" + pad(minutes) + ":" + pad(seconds) + " " + ((hours >= 12) ? "PM" : "AM");
    document.getElementById("time").innerHTML = pad(hours%12) + ":" + pad(minutes) + ":" + pad(seconds);
}

var timeBegan = null
    , timeStopped = null
    , stoppedDuration = 0
    , started = null;

function start() {
    if (timeBegan === null) {
        timeBegan = new Date();
    }

    if (timeStopped !== null) {
        stoppedDuration += (new Date() - timeStopped);
    }

    started = setInterval(clockRunning, 10);
}

function stop() {
    timeStopped = new Date();
    clearInterval(started);
}

function reset() {
    clearInterval(started);
    stoppedDuration = 0;
    timeBegan = null;
    timeStopped = null;
    document.getElementById("time").innerHTML = "00:00.00";
}

function clockRunning() {
    var currentTime = new Date()
        , timeElapsed = new Date(currentTime - timeBegan - stoppedDuration)
        , hour = timeElapsed.getUTCHours()
        , min = timeElapsed.getUTCMinutes()
        , sec = timeElapsed.getUTCSeconds()
        , ms = Math.floor(timeElapsed.getUTCMilliseconds() / 10);

    document.getElementById("time").innerHTML =
        (min > 9 ? min : "0" + min) + ":" +
        (sec > 9 ? sec : "0" + sec) + "." +
        (ms > 9 ? ms : "0" + ms);
}

document.getElementById("clock").onclick = function () {
    socket.emit('clockClicked');
};

socket.on('setClock', (state) => {
    clearInterval(clock);
    stop();
    updateTime();
    clock = setInterval(updateTime, 1000);
});

document.getElementById("stopwatch").onclick = function () {
    socket.emit('stopwatchClicked');
};

socket.on('setStopwatch', (state) => {
    var highestTimeoutId = setTimeout(";");
    for (var i = 0 ; i < highestTimeoutId ; i++) {
        clearTimeout(i);
    }
    switch(state) {
        case CLOCK_STATE:
            reset();
            start();
            break;
        case STOPWATCH_STARTED_STATE:
            stop();
            break;
        case STOPWATCH_STOPPED_STATE:
            start();
            break;
    }
});


