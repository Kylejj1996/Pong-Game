//Canvas and drawing 
            var canvas = document.getElementById("myCanvas");
            var ctx = canvas.getContext("2d");//ctx variable to store the 2D rendering context

            //Starting point at bottom center
            let x = canvas.width / 2;
            let y = canvas.height - 30;

            //Ball speed
            let dx = 2;//Horizontal
            let dy = -2;//Vertical

            //Game Object Dimensions
            const ballRadius = 10;
            const paddleHeight = 10;
            let paddleWidth = 100;

            //Paddle starting position
            let paddleX = (canvas.width - paddleWidth) / 2;

            //Paddle control flags
            let rightPressed = false;
            let leftPressed = false;

            let interval = 0;

            //Variables to create the bricks
            const brickRowCount = 10;
            const brickColumnCount = 11;
            const brickWidth = 55;
            const brickHeight = 30;
            const brickPadding = 10;
            const brickOffsetTop = 30;
            const brickOffsetLeft = 45;

            //Array to hold the bricks
            let bricks = [];
            
            //Variables for score, lives and ball color
            let score = 0;
            let lastScore = 0;
            let destroyedBricks = 0;
            let lives = 4;
            let ballColor = getRandomColor();

            //Function to generate a random color
            function getRandomColor(){
                const letters = "0123456789ABCDEF";
                let color = "#";
                for (let i = 0; i < 6; i++){
                    color += letters[Math.floor(Math.random() * 16)];// This generates a random number 0-15, then the Math.floor rounds the number to the nearest whole
                    //number. The generate number is used to select the number or character from the letters string. Then it is added onto the color variable. This
                    //repeats 6 times to generate a random color
                }

                return color;
            }

            //Initializing the bricks 
            for (let c = 0; c < brickColumnCount; c++) {
                bricks[c] = [];
                for (let r = 0; r < brickRowCount; r++) {
                    bricks[c][r] = { x: 0, y: 0, status: 1 };
                }
            }

            document.addEventListener("keydown", keyDownHandler, false);//Listener for keyDown
            document.addEventListener("keyup", keyUpHandler, false);//Listener for keyUp
            document.addEventListener("mousemove", mouseMoveHandler, false);//Listening for mouse move

            function keyDownHandler(e) {
                if (e.key === "Right" || e.key === "ArrowRight") {
                    rightPressed = true;
                } else if (e.key === "Left" || e.key === "ArrowLeft") {
                    leftPressed = true;
                }
            }

            function keyUpHandler(e) {
                if (e.key === "Right" || e.key === "ArrowRight") {
                    rightPressed = false;
                } else if (e.key === "Left" || e.key === "ArrowLeft") {
                    leftPressed = false;
                }
            }

            function mouseMoveHandler(e) {
                const relativeX = e.clientX - canvas.offsetLeft;
                if (relativeX > 0 && relativeX < canvas.width){
                    paddleX = relativeX - paddleWidth / 2;

                    //If else to make sure that the paddle stays inside of the canvas screen
                    if (paddleX < 0) {
                        paddleX = 0;//Making sure the paddle's left side doesnt go off of the left of screen
                    } else if (paddleX + paddleWidth > canvas.width) {
                        paddleX = canvas.width - paddleWidth;//Making sure the paddle's right side doesnt go off of the right side screen
                    }
                }
            }
            
            //Collision Detection
            function collisionDetection() {
                for (let c = 0; c < brickColumnCount; c++) {
                    for (let r = 0; r < brickRowCount; r++) {
                        const b = bricks[c][r];
                        if (b.status === 1) {
                            //Checking if the ball collides with a brick
                            if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                                dy = -dy;
                                b.status = 0;//Clearing the brick that was hit

                                //Giving the point value for each row - Total points = 180 to Win
                                let points = 0;
                                if (r === 0) points = 12;
                                else if (r === 1) points = 9;
                                else if (r === 2) points = 6;
                                else if (r === 3) points = 3;
                                else if (r >= 4 && r <= 6) points = 2;
                                else points = 1;

                                score += points;//Increasing the score
                                destroyedBricks++;//Increasing the destroyed bricks
                                ballColor = getRandomColor();//Changing the color when the ball destroys a brick

                                //Increasing the speed of the ball after every 10 brick hits
                                if (destroyedBricks % 10 === 0){
                                    if (dx > 0) {
                                        dx += 0.2;//Increasing the horizontal speed to the right
                                    } else {
                                        dx -= 0.2;//Increasing the horizontal speed to the left
                                    }
                                    if (dy > 0) {
                                        dy += 0.2;//Increasing the vertical speed - Down
                                    } else {
                                        dy -= 0.2;//Increasing the vertical speed - Up
                                    }
                                }

                                //Changing the balls angle and increasing the number of lives by 1 each time the player hits 50 points
                                if (score - lastScore >= 50){
                                    lives++; //Increase lives after every 50 points
                                    lastScore = score;
                                    //Increasing the vertical 
                                    if (dy > 0) {
                                        dy += 0.5; 
                                    } else {
                                        dy -= 0.5; 
                                    }
                                    //Reducing the horizontal
                                    if (dx > 0) {
                                        dx -= 0.3;
                                    } else {
                                        dx += 0.3;
                                    }
                                }

                                //Checking if the user won the game, when all bricks are gone
                                if (destroyedBricks === brickRowCount * brickColumnCount){
                                    alert(`You Win! Congratulations!!\nTotal Points: ${score}`);
                                    document.location.reload();
                                }
                            }
                        }
                    }
                }
            }

            function drawScore(){
                ctx.font = "20px Arial";
                ctx.fillStyle = "#1a237e";
                ctx.fillText(`Score: ${score}`, 8, 20);
            }

            function drawLives(){
                ctx.font = "20px Arial";
                ctx.fillStyle = "#1a237e";
                ctx.fillText(`Lives: ${lives}`, canvas.width - 85, 20);
            }

            //Drawing the ball
            function drawBall() {
            ctx.beginPath();
            ctx.arc(x, y, ballRadius, 0, Math.PI * 2);//Drawing a full circle
            ctx.fillStyle = ballColor;//Starting the ball with a random color
            ctx.fill();
            ctx.closePath();
            }

            //Drawing the paddle
            function drawPaddle() {
            ctx.beginPath();
            ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
            ctx.fillStyle = "#3f51b5";
            ctx.fill();
            ctx.closePath();
            }

            function drawBricks() {
                for (let c = 0; c < brickColumnCount; c++) {
                    for (let r = 0; r < brickRowCount; r++) {
                        if (bricks[c][r].status === 1) {
                            const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                            const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                            bricks[c][r].x = brickX;
                            bricks[c][r].y = brickY;
                            ctx.beginPath();
                            ctx.rect(brickX, brickY, brickWidth, brickHeight);
                            ctx.fillStyle = "#283593";
                            ctx.fill();
                            ctx.closePath();
                        }
                    }
                }
            }

            //The drawing loop to constantly update the canvas on each frame
            function draw() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);//Clearing the canvas
                drawBricks();
                drawBall();
                drawPaddle();
                collisionDetection();
                drawScore();
                drawLives();
                //Setting the minimum paddle width
                let minPaddleWidth = 50;

                //Checking to see if 10 bricks are destroyed
                if(destroyedBricks >= 10){
                    if (paddleWidth - 5 >= minPaddleWidth){
                        paddleWidth -= 5;//Decreasing the paddle width
                    }else{
                        paddleWidth = minPaddleWidth;//Setting the paddle width to the minimum paddle with
                    }
                }

                //To bounce off the left and right walls
                if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
                    dx = -dx;
                    ballColor = getRandomColor();//Change the color when the ball hits the left or right walls
                }
                
                if (y + dy < ballRadius) {
                    dy = -dy;
                    ballColor = getRandomColor();//Change the color when the ball hits the top wall
                } 
                else if (y + dy > canvas.height - ballRadius) {
                    if (x > paddleX && x < paddleX + paddleWidth) {
                        dy = -dy;
                        //Making the ball move faster each time it hits the paddle
                        dx *= 1.1;
                        dy *= 1.1;
                    } else {
                        lives--;
                        if(!lives){
                            alert(`GAME OVER..\nFinal Points: ${score}`);
                            document.location.reload();
                        }else{
                            x = canvas.width / 2;
                            y = canvas.height - 30;
                            dx = 2;
                            dy = -2;
                            paddleX = (canvas.width - paddleWidth) / 2;

                        }
                    }
                }

                console.log(`dx: ${dx}, dy: ${dy}`);

                if(rightPressed && paddleX < canvas.width - paddleWidth) {
                    paddleX += 7;
                }
                else if(leftPressed && paddleX > 0) {
                    paddleX -= 7;
                }

                //To move the ball
                x += dx;
                y += dy;

                requestAnimationFrame(draw);
            }
            draw();