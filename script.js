(() => {
  const DOT_MIN_RAD = 5;
  const DOT_MAX_RAD = 20;
  const MASS_FACTOR = 0.001;
  const DEF_COLOR = "rgba(250, 10, 10, 0.8)";
  const TWO_PI = 2 * Math.PI;
  const SMOTH = 0.95;
  const SPHERE_RAD = 300;
  const BIG_DOT_RAD = 40;
  const MOUSE_SIZE = 100;

  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");

  let w, h, mouse, dots;

  class Dot {
    constructor(r) {
      this.pos = { x: mouse.x, y: mouse.y };
      this.vel = { x: 0, y: 0 };
      this.rad = r || random(DOT_MIN_RAD, DOT_MAX_RAD);
      this.mass = this.rad * MASS_FACTOR;
      this.color = DEF_COLOR;
    }

    draw(x, y) {
      this.pos.x = x || this.pos.x + this.vel.x;
      this.pos.y = y || this.pos.y + this.vel.y;
      createCircle(this.pos.x, this.pos.y, this.rad, true, this.color);
      createCircle(this.pos.x, this.pos.y, this.rad, false, DEF_COLOR);
    }
  }

  function createCircle(x, y, rad, fill, color) {
    ctx.fillStyle = ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, TWO_PI);
    ctx.closePath();
    fill ? ctx.fill() : ctx.stroke();
  }

  function updateDots() {
    for (let i = 1; i < dots.length; i++) {
      let acc = { x: 0, y: 0 };
      for (let j = 0; j < dots.length; j++) {
        if (i == j) continue;
        let [a, b] = [dots[i], dots[j]];

        let delta = { x: b.pos.x - a.pos.x, y: b.pos.y - a.pos.y };
        let dist = Math.sqrt(Math.pow(delta.x, 2) + Math.pow(delta.y, 2)) || 1;
        let force = ((dist - SPHERE_RAD) / dist) * b.mass;

        if (j == 0) {
          let alpha = MOUSE_SIZE / dist;
          a.color = `rgba(250, 10, 10, ${alpha})`;
          dist < MOUSE_SIZE
            ? (force = (dist - MOUSE_SIZE) * b.mass)
            : (force = a.mass);
        }

        acc.x += delta.x * force;
        acc.y += delta.y * force;
      }

      dots[i].vel.x = dots[i].vel.x * SMOTH + acc.x * dots[i].mass;
      dots[i].vel.y = dots[i].vel.y * SMOTH + acc.y * dots[i].mass;
    }

    dots.map((e) => (e == dots[0] ? e.draw(mouse.x, mouse.y) : e.draw()));
  }

  function setPos({ layerX, layerY }) {
    [mouse.x, mouse.y] = [layerX, layerY];
  }

  function isDown() {
    mouse.down = !mouse.down;
  }

  canvas.addEventListener("mousemove", setPos);
  window.addEventListener("mousedown", isDown);
  window.addEventListener("mouseup", isDown);

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function init() {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;

    mouse = { x: w / 2, y: h / 2, down: false };
    dots = [];

    dots.push(new Dot(BIG_DOT_RAD));
  }

  function loop() {
    ctx.clearRect(0, 0, w, h);
    if (mouse.down) {
      dots.push(new Dot());
    }

    updateDots();

    window.requestAnimationFrame(loop);
  }

  init();
  loop();
})();
