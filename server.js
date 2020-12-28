var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

let state = 0;
const RESET_STATE = -1;
const CLOCK_STATE = 0;
const STOPWATCH_STARTED_STATE = 1;
const STOPWATCH_STOPPED_STATE = 2;

io.on('connection', (socket) => {
    socket.on('clockClicked', () => {
        io.emit('setClock', state);
        state = CLOCK_STATE;
    });

    socket.on('stopwatchClicked', () => {
        io.emit('setStopwatch', state);
        if (state === STOPWATCH_STARTED_STATE) {
            state = STOPWATCH_STOPPED_STATE;
        }
        else {
            state = STOPWATCH_STARTED_STATE;
        }
    });

    socket.on('disconnect', () => {
        state = RESET_STATE;
    })


});

http.listen(3000, () => {
    console.log('listening on *:3000');
});