const hero = document.querySelector('.hero');
const leftPane = document.querySelector('.left.pane');
const splitter = document.querySelector('.hero>hr');
const hint = document.querySelector('.hints');

let splitterX = innerWidth * 0.9;

leftPane.style.width = splitterX + 'px';

if ('ontouchstart' in window) {
  hero.ontouchstart = hero.ontouchmove = jump;

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

  splitterX = Math.max(0, e.x - 5);
  leftPane.style.width = splitterX + 'px';
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

function jump(e) {
  if (!e.altKey && !('ontouchstart' in window)) return;

  splitterX = Math.max(0, (e.x || e.touches[0].clientX) - 5);
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

    leftPane.style.width = Math.max(0, splitterX + deltaX) + 'px';
  };

  document.onmouseup = e => {
    const deltaX = e.x - x;

    splitterX = Math.max(0, splitterX + deltaX);
    document.onmousemove = document.onmouseup = null;
  };
}

function animate(e) {
  if (e.key !== 'Control' && e.key !== 'Meta' || e.repeat) return;

  if (e.type === 'keydown') {
    leftPane.style.transition = '1.5s';
    leftPane.style.width = '0';

    leftPane.ontransitionend = () => {
      leftPane.style.width = '100%';
      leftPane.ontransitionend = () => {
        animate(e);
      }
    }
  } else {
    leftPane.style.width = splitter.offsetLeft + 'px';

    leftPane.ontransitionend = () => {
      leftPane.style.transition = null;
      leftPane.ontransitionend = null;
    }
  }
}
