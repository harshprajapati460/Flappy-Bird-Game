

let board;
let boardWidth = 360;
let boardHeight = 640;  
let context;

//bird
let birdwidth = 34 // width/height ratio = 408/228
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

let bird = {
 x: birdX,
 y: birdY,
 width: birdwidth,
 height: birdHeight
}

//pipes
let pipeArray = [];
let pipeWidth = 54;  // width/height = 384/2072 = 1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;


//physics
let velocityX = -2; // Pipes moving left speed
let velocityY = 0; // bird jump speed
let gravity = 0.4;

let gameover = true;
let score = 0;

//music 
const BackgroundMusic = new Audio('./Bgmusic.mp3');
const JumpSound = new Audio('./Jumpsound.mp3');
const DeathSound = new Audio('./DeathSound.mp3');
const Coinsound = new Audio('./Coinsound.mp3');
window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");  // used for drawing on the board

   // context.fillStyle = "blue";
    //context.fillRect(bird.x, bird.y, bird.width, bird.height);
    
     //load the image
     birdImg = new Image();
     birdImg.src = "./flappybird.png";
     birdImg.onload = function(){

         context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
        }
      topPipeImg = new Image(); 
      topPipeImg.src = "./toppipe.png";
     

       bottomPipeImg = new Image();
       bottomPipeImg.src = "./bottompipe.png";
    
       // music Load 
       BackgroundMusic.volume = 0.5;
       BackgroundMusic.loop = true;
      // JumpSound.volume = 1.0;
       // Handle errors
       BackgroundMusic.onerror = function() {
        console.error('Error loading background music.');
    };

    JumpSound.onerror = function() {
        console.error('Error loading jump sound.');
    };

    DeathSound.onerror = function() {
        console.error('Error loading Death sound.');
    };
    Coinsound.onerror = function() {
        console.error('Error loading Coin sound.');
    };

        requestAnimationFrame(update);
        setInterval(placePipes, 1500); // every 1.5 seconds
        document.addEventListener("keydown" , moveBird);
        document.addEventListener('mousedown', handleMousedown);
}
function update(){
    requestAnimationFrame(update);
    if(gameover){
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //bird
    velocityY += gravity;   
   // bird.y += velocityY;
   bird.y = Math.max(bird.y + velocityY , 0); // if limit reached dont apply velociy to bird

    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if(bird.y > board.height){
        gameover = true;
        BackgroundMusic.pause();
        DeathSound.play();
        moveBird;
    }
    
    //pipe 
    for(let i=0; i<pipeArray.length; i++){
        let pipe  = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
        
        if(!pipe.passed && bird.x > pipe.x + pipe.width){
            score += 0.5;
            Coinsound.play();
            pipe.passed = true;
        }

        if(detectcollision(bird,pipe)){
            gameover = true;
            BackgroundMusic.pause();
            DeathSound.play();
        }
    }
    //clear pipes
    while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidth ){
        pipeArray.shift(); // removes the first element
    }
    context.fillstyle = "white";
    context.font = "30px sans-serif";
    context.fillText(score, 5, 45);

    if(gameover){
        context.fillText("Game Over", 5 , 90);
    }
}

function placePipes(){
    // (0-1) 
    if(gameover){
        return;
    }
    let randomPipeY = pipeY - pipeHeight/4 - Math.random() * (pipeHeight/2);
    let openingSpace = board.height/4;
    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(topPipe);
   
    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottomPipe);

}

function moveBird(e){
    if(e.code == "Enter"){
        BackgroundMusic.play();
        if(gameover){
            bird.y = birdY;
            score = 0;
            pipeArray = [];
            gameover = false;
          }
    }
    else if(e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX" || e.code == "mousedown"){
         // jump
         velocityY = -6;
         //JumpSound.play();
    }
}
 
function detectcollision(a,b){
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
               a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
               a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
               a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
    
               //reset game
    
}

function handleMousedown(event) {
    switch (event.button) {
        case 0:
            velocityY = -6;
            break;
        case 1:
            handleMiddleClick();
            break;
        case 2:
            handleRightClick();
            break;
        // Add more cases for other mouse buttons as needed
    }
}

// Task 
// mouse click jump   done -->handledown
// sound to game  done     --> const name = new Audio()
// game over sound  done  --> const name = new Audio()
// every point sound done --> const name = new Audio()
//  