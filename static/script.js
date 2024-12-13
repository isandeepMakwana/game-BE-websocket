const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const clientId = Math.random().toString(36).substring(7);
let balls = new Map(); // Store all balls
let isDragging = false;

// WebSocket connection
const ws = new WebSocket(`ws://192.168.102.58:8000/ws/${clientId}`);

ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    
    if (message.type === 'initial_positions') {
        message.data.forEach(ball => {
            balls.set(ball.clientId, ball);
        });
        drawBalls();
    }
    else if (message.type === 'position') {
        balls.set(message.data.clientId, message.data);
        drawBalls();
    }
    else if (message.type === 'client_disconnected') {
        balls.delete(message.client_id);
        drawBalls();
    }
};

function drawBalls() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    balls.forEach((ball, id) => {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, 20, 0, Math.PI * 2);
        // Use different colors for own ball vs others
        ctx.fillStyle = id === clientId ? 'red' : 'blue';
        ctx.fill();
        ctx.closePath();
        
        // Add client ID label above the ball
        ctx.fillStyle = 'black';
        ctx.font = '12px Arial';
        ctx.fillText(id, ball.x - 15, ball.y - 25);
    });
}

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const myBall = balls.get(clientId);
    if (myBall && Math.sqrt((x - myBall.x) ** 2 + (y - myBall.y) ** 2) < 20) {
        isDragging = true;
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const myBall = balls.get(clientId);
        myBall.x = x;
        myBall.y = y;
        
        ws.send(JSON.stringify(myBall));
    }
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
});

// Initial draw
drawBalls(); 