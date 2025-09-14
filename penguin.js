let penguins = [];
let dragging = null;
let gravity = 0.5; // acceleration
let fps = 1000 / 60; // 60fps
let height = '32px'
let width = '32px'
let dragOffset = {x: 0, y: 0};

function createPenguin(x, y){
  const penguin = document.createElement('img');
  penguin.className = 'penguin';
  penguin.src= 'sprites/idle3.gif';
  penguin.style.position = 'absolute';
  penguin.style.left = x + 'px';
  penguin.style.top = y + 'px';
  penguin.style.width = width;
  penguin.style.height = height;
  penguin.style.cursor = 'grab';
  penguin.style.zIndex = '10';

  // Physics data
  penguin.vy = 0;
  penguin.isOnGround = false;

  penguin.addEventListener('mousedown', (e) =>{
    e.preventDefault();
    dragging = penguin;
    penguin.style.cursor = 'grabbing';
    penguin.classList.add('dragging');
    penguin.vy = 0;
    penguin.isOnGround = false;

    const rect = penguin.getBoundingClientRect();
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;
  });

  document.body.appendChild(penguin);
  penguins.push(penguin);
}

document.addEventListener('mouseup', (e) =>{
  if(dragging){
    dragging.style.cursor = 'grab';
    dragging.classList.remove('dragging')
    dragging.isOnGround = false;
    dragging = null;
  }
})

document.addEventListener('mousemove', (e) => {
  if(dragging){
    dragging.src = 'sprites/jump.gif';
    dragging.style.left = (e.clientX - dragOffset.x) + 'px';
    dragging.style.top = (e.clientY - dragOffset.y) + 'px';
  }
});


function physicsLoop(){
  const platform = document.getElementById('platform');
  const rect = platform.getBoundingClientRect();
  const groundY = rect.top + window.scrollY;

  const profile = document.querySelector('.container');
  const profileRect = profile.getBoundingClientRect();
  const profileLeft = profileRect.left + window.scrollX;
  const profileRight = profileRect.right + window.scrollX;


  penguins.forEach(p =>{
    if(p !== dragging){
      const penguinBottom = parseFloat(p.style.top) + 32;
      const penguinLeft = parseFloat(p.style.left);
      const penguinRight = penguinLeft + 32;

      let landingY = groundY;

      //Collision detection
      penguins.forEach(other => {
        const otherTop = parseFloat(other.style.top);
        const otherLeft = parseFloat(other.style.left);
        const otherRight = otherLeft + 32;

        if (penguinRight > otherLeft && penguinLeft < otherRight){
          if(penguinBottom <= otherTop + 5){
            landingY = Math.min(landingY, otherTop);
          }
        }
      })

      //If penguin is above the ground apply gravity
      if(penguinBottom < landingY){
        p.isOnGround = false;
        p.src = 'sprites/flap3.gif'
        p.vy += gravity;
        const newTop = parseFloat(p.style.top) + p.vy;
        p.style.top = newTop + 'px';
      } else {
        //penguin hits ground
        p.style.top = (landingY - 32) + 'px';
        p.vy = 0;
        p.src= 'sprites/idle3.gif';
        p.isOnGround = true;
      }

      //keep penguin inside boundary
      if(penguinLeft < profileLeft){
        p.style.left = profileLeft + 'px';
      } else if (penguinLeft + 32> profileRight){
        p.style.left = (profileRight - 32) + 'px';
      }
    }
  });

  setTimeout(physicsLoop, fps);
}
function spawnPenguin(){
  const profile = document.querySelector('.container');
  const profileRect = profile.getBoundingClientRect();
  const profileLeft = profileRect.left + window.scrollX;
  const profileWidth = profileRect.width;
  
  const x = profileLeft + Math.random() * (profileWidth - 32); // -32 for penguin width
  createPenguin(x, 50);
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#buttons button').addEventListener('click', spawnPenguin);
  physicsLoop();
})
