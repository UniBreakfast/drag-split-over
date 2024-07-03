const hero = document.querySelector('.hero');
const leftPane = document.querySelector('.left.pane');
const splitter = document.querySelector('.hero>hr');
const hint = document.querySelector('.hints');

let splitterX = innerWidth * 0.9;
let lastTime = 0;

leftPane.style.width = splitterX + 'px';

if ('ontouchstart' in window) {
  hero.ontouchstart = hero.ontouchmove = jump;
  window.ondeviceorientation = window.ondevicemotion = roll;

  hint.replaceChildren(hint.lastElementChild);
} else {
  hero.onmousemove = follow;
  hero.onmousewheel = roll;
  hero.onclick = jump;
  splitter.onmousedown = drag;
  window.onkeydown = window.onkeyup = animate;

  hint.lastElementChild.remove();
}

function follow(e) {
  if (!e.shiftKey) return;

  splitterX = normalize(e.x - 5);
  leftPane.style.width = splitterX + 'px';
}

function roll(e) {
  e.preventDefault();

  if (e.type === 'deviceorientation') {
    const now = Date.now();
    const deltaTime = now - lastTime;
    
    lastTime = now;

    if (e.gamma < 5 && e.gamma > -5) return;

    splitterX = normalize(splitterX + e.gamma * 1.3 * deltaTime);

  } else if (e.type === 'devicemotion') {
    if (e.acceleration.x < 0.2 && e.acceleration.x > -0.2) return;

    splitterX = normalize(splitterX + e.acceleration.x * 0.3);

  } else if (e.type === 'wheel' || e.type === 'mousewheel') {
    splitterX = normalize(splitterX + e.deltaY * 0.3);
  }

  leftPane.style.transition = '0.3s';
  leftPane.style.width = splitterX + 'px';

  leftPane.ontransitionend = () => {
    leftPane.style.transition = null;
    leftPane.ontransitionend = null;
  }
}

function jump(e) {
  if (!e.altKey && !('ontouchstart' in window)) return;

  splitterX = normalize((e.x || e.touches[0].clientX) - 5);
  leftPane.style.transition = '0.3s';
  leftPane.style.width = splitterX + 'px';

  leftPane.ontransitionend = () => {
    leftPane.style.transition = null;
    leftPane.ontransitionend = null;
  }
}

function drag(e) {
  const x = e.clientX

  document.onmousemove = e => {
    const deltaX = e.clientX - x;

    leftPane.style.width = normalize(splitterX + deltaX) + 'px';
  };

  document.onmouseup = e => {
    const deltaX = e.x - x;

    splitterX = normalize(splitterX + deltaX);
    document.onmousemove = document.onmouseup = null;
  };
}

function animate(e) {
  if (e.key !== 'Control' && e.key !== 'Meta' || e.repeat) return;

  if (e.type === 'keydown') {
    leftPane.style.transition = '1.5s';
    leftPane.style.width = '1px';
    splitterX = 1;

    leftPane.ontransitionend = () => {
      splitterX = innerWidth - 11
      leftPane.style.width = splitterX + 'px';
      leftPane.ontransitionend = () => {
        animate(e);
      }
    }
  } else {
    splitterX = splitter.offsetLeft;
    leftPane.style.width = splitterX + 'px';

    leftPane.ontransitionend = () => {
      leftPane.style.transition = null;
      leftPane.ontransitionend = null;
    }
  }
}

function normalize(x) {
  return Math.max(1, Math.min(innerWidth - 11, x));
}
