const hero = document.querySelector('.hero');
const leftPane = document.querySelector('.left.pane');
const splitter = document.querySelector('.hero>hr');

let splitterX = innerWidth * 0.9;

leftPane.style.width = splitterX + 'px';
hero.onmousemove = follow;
splitter.onmousedown = drag;
hero.onmousewheel = roll;

function follow(e) {
  if (!e.shiftKey) return;

  splitterX = Math.max(0, e.x - 5);
  leftPane.style.width = splitterX + 'px';
}

function drag(e) {
  const x = e.x;

  document.onmousemove = e => {
    const deltaX = e.x - x;
    
    leftPane.style.width = Math.max(0, splitterX + deltaX) + 'px';
  };

  document.onmouseup = e => {
    const deltaX = Math.max(0, e.x - x);
    
    splitterX += deltaX; 
    document.onmousemove = document.onmouseup = null;
  };
}

function roll(e) {
  e.preventDefault();
  splitterX = Math.max(0, splitterX + e.deltaY * 1.3);

  leftPane.style.transition = '0.3s';
  leftPane.style.width = splitterX + 'px';

  leftPane.ontransitionend = () => {
    leftPane.style.transition = null;
    leftPane.ontransitionend = null;
  }
}
