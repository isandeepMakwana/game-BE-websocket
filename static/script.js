const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const clientId = Math.random().toString(36).substring(7);
let ball = { x: 200, y: 200 };
let isDragging = false;

// WebSocket connection
const ws = new WebSocket(`ws://localhost:8000/ws/${clientId}`);

ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type === 'position') {
        ball = message.data;
        drawBall();
    }
};

function drawBall() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, 20, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (Math.sqrt((x - ball.x) ** 2 + (y - ball.y) ** 2) < 20) {
        isDragging = true;
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const rect = canvas.getBoundingClientRect();
        ball.x = e.clientX - rect.left;
        ball.y = e.clientY - rect.top;
        
        ws.send(JSON.stringify(ball));
    }
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
});

// Initial draw
drawBall(); 