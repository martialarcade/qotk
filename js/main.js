import Menu from './menu.js';
import Background from './background.js';
import Player from './player.js';
import Blood from './blood.js';
import InputHandler from './input.js';
import FightPanel from './fightPanel.js';

window.addEventListener('load', function() {
  
  const gameCanvas = document.getElementById('gameCanvas');
  const gameCtx = gameCanvas.getContext('2d');
  gameCanvas.width = 320;
  gameCanvas.height = 224;
  
  const menuCanvas = document.getElementById('menuCanvas');
  const menuCtx = menuCanvas.getContext('2d');
  menuCanvas.width = 320;
  menuCanvas.height = 224;
  
  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.mode = 'kumite';
      this.fps = 10;
      this.background = new Background(this);
      this.fighter0 = new Player(this, this.getFighters()[0], 'h', 0);
      let fighters = this.shuffle(this.getFighters());
      this.fighter1 = new Player(this, fighters[0], 'k1', 0);
      this.fighter2 = new Player(this, [null, 1, 1, 1], 't2', 1);
      this.fightPanel = new FightPanel(this);
      this.input = new InputHandler(this, null);
      this.start = false;
      this.end = false;
      this.bloods = [];
      this.enemyThrown = null;
      this.frameTimer = 0;
		  this.frameInterval = 100;
		  //audio
      this.audioOption = new Howl({
        src: ['https://dl.dropbox.com/scl/fi/bmv5b7pei0m35i4ds2n9z/qotk-option.ogg?rlkey=ptd0a2ms54qly6omdmhmfgn75', 'https://dl.dropbox.com/scl/fi/2fhdfd3msfw9dix97kue4/qotk-option.m4a?rlkey=qvxc7h0l7y8qhdk30bjrszz43']
      });
      this.audioSelect= new Howl({
        src: ['https://dl.dropbox.com/scl/fi/8rk5vo7o3a9hyq7po81fl/qotk-select.ogg?rlkey=hc4hbrd0bfqtvpk9fz1ymw6bp', 'https://dl.dropbox.com/scl/fi/u274c9sz0qzjv2lpccjf9/qotk-select.m4a?rlkey=d0dxkeh8rf64iwpisrrsyky8f']
      });
      this.audioIntro= new Howl({
        src: ['https://dl.dropbox.com/scl/fi/ypsc8d27kn6w4s7856np4/qotk-intro.ogg?rlkey=fkvrj1nkxdp08lzwanq0paqwm', 'https://dl.dropbox.com/scl/fi/mpxch5l0ppwfl1w34om0u/qotk-intro.m4a?rlkey=1fu8pl2z9dduc78pxq9adyog9']
      });
      this.audioStart = new Howl({
        src: ['https://dl.dropbox.com/scl/fi/ypsc8d27kn6w4s7856np4/qotk-intro.ogg?rlkey=fkvrj1nkxdp08lzwanq0paqwm', 'https://dl.dropbox.com/scl/fi/mpxch5l0ppwfl1w34om0u/qotk-intro.m4a?rlkey=1fu8pl2z9dduc78pxq9adyog9']
      });
      this.audioFight = new Howl({
        src: ['https://dl.dropbox.com/scl/fi/1m90yki6o0hqyiczkc5dh/qotk-fight.ogg?rlkey=bbm6ikrygmn55yw50y06a3ws1', 'https://dl.dropbox.com/scl/fi/iek4xog9c3hb4v4wegxtt/qotk-fight.m4a?rlkey=s5mxo3krhf2kwiat8jgqwyqox']
      });
      this.audioHit1 = new Howl({
        src: ['https://dl.dropbox.com/scl/fi/o4asq95phbvl4t5a9oegs/qotk-hit1.ogg?rlkey=uv4mz8crsbz7uzoejann57vw3', 'https://dl.dropbox.com/scl/fi/p9d8p7encg470h3na7vsp/qotk-hit1.m4a?rlkey=6j0e1ynlku4ld5rtr8n1m5udz']
      });
      this.audioHit2 = new Howl({
        src: ['https://dl.dropbox.com/scl/fi/u2sgndnjxnspz05qgpepi/qotk-hit2.ogg?rlkey=p565wwhbfjcbi1dgclkftx8ih', 'https://dl.dropbox.com/scl/fi/k88ylcakt6ws7m035o7b9/qotk-hit2.m4a?rlkey=vtc0o23y4jut1o2w0x00b095t']
      });
      this.audioHit3 = new Howl({
        src: ['https://dl.dropbox.com/scl/fi/fua4w6oybdiugpflv7n61/qotk-hit3.ogg?rlkey=rkcrhw7zibrvuneumozamkxqv', 'https://dl.dropbox.com/scl/fi/z816i0jsyjqo9rxmlgjc4/qotk-hit3.m4a?rlkey=fuidxgpsrwu4czdivp5gy9xfh']
      });
    }
    update(deltaTime) {
      if (this.frameTimer > this.frameInterval) {
        this.input.update(deltaTime);
        this.frameTimer = 0;
      } else {
        this.frameTimer += deltaTime;
      }
      this.background.update(deltaTime);
      this.fighter1.update(this.input, deltaTime);
       if (this.mode === 'training') this.fighter2.update(this.input, deltaTime);
      this.fighter0.update(this.input, deltaTime);
      this.bloods.forEach(blood => {
			   blood.update(this.input, deltaTime);
			   if (blood.time >= 10) this.bloods.splice(this.bloods.indexOf(blood), 1);
		  });
      if (this.mode === 'kumite') this.fightPanel.update(deltaTime);
      if (this.fightPanel.timer.count == 0 || this.fighter0.health <= 0 || this.fighter1.health <= 0) this.end = true;
    }
    draw(context) {
      this.background.draw(context);
      if (this.fighter1.strike === 1) {
        this.fighter0.draw(context);
        this.fighter1.draw(context);
      } else if (this.fighter1.order === -1) {
        this.fighter1.draw(context);
        this.fighter2.draw(context);
        this.fighter0.draw(context);
      } else {
        if (this.mode === 'training') this.fighter2.draw(context);
        this.fighter1.draw(context);
        this.fighter0.draw(context);
      }
      this.bloods.forEach(blood => {
			  blood.draw(context);
		  });
      if (this.mode === 'kumite') this.fightPanel.draw(context);
    }
    addBlood(player) {
      this.bloods.push(new Blood(this, player)); 
    }
    movement(direction, player, amount) {
      if (direction === 'left') {
        if (player.x > -10) {
          player.x-=amount;
        } else if (this.background.x < 0 && player.enemies[0].x < this.width-player.enemies[0].width+10) {
          this.background.x+=amount;
          if (player.enemies[0].currentState.length && player.enemies[0].currentState.state === 'WALK') {
            if (player.enemies[0].direction === 0) player.enemies[0].x+=amount*2;
            else player.enemies[0]-=amount*2
          } else player.enemies[0].x+=amount;
          this.bloods.forEach(blood => {
			      blood.x+=amount;
		      });
        }
      } else if (direction === 'right') {
        if (player.x < this.width-player.width+10) {
          player.x+=amount;
        } else if (this.background.x > 0-(this.background.width-this.width) && player.enemies[0].x > -10) {
          this.background.x-=amount;
          if (player.enemies[0].currentState.length && player.enemies[0].currentState.state === 'WALK') {
            if (player.enemies[0].direction === 0) player.enemies[0].x-=amount*2;
            else player.enemies[0]+=amount*2
          } else player.enemies[0].x-=amount;
          this.bloods.forEach(blood => {
			      blood.x-=amount;
		      });
        }
      }
    }
    reset(mode) {
      this.mode = mode;
      var backgroundId = 'kumite';
      if (this.mode !== 'kumite') {
        var backgrounds = this.shuffle(this.getBackgrounds());
        backgroundId = backgrounds[0];
        if (backgroundId === this.background.id) backgroundId = backgrounds[1];
      }
      this.background.reset(backgroundId);
      this.fighter0.reset(this.getFighters()[this.fighter0.no], 'h', 0);
      if (this.mode === 'kumite') {
        const fighters = this.shuffle(this.getFighters());
	      var fighter1 = fighters[0];
	      if (fighter1[0] === this.fighter1.no) fighter1 = fighters[1];
        this.fighter1.reset(fighter1, 'k1', 1);
      } else {
        this.fighter1.reset([null, 1, 1, 1], 't1', 1);
        this.fighter2.reset([null, 1, 1, 1], 't2', 0);
      }
      this.fightPanel.reset();
      this.start = true;
      this.end = false;
      this.bloods = [];
      document.getElementById("pause").value = 0;
    }
    shuffle(array) {
      let currentIndex = array.length,  randomIndex;
      while (currentIndex > 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
      }
      return array;
    }
    getFighters() {
      //DF (0-3), AT(4-7), SP(1-4)
      return [
        [0, 2, 5, 1],
        [1, 0, 6, 2],
        [2, 0, 7, 1],
        /*[3, 3, 4, 1],
        [4, 0, 4, 4],
        [5, 1, 4, 3],
        [6, 1, 6, 1],
        [7, 2, 4, 2],
        [8, 0, 5, 3]*/
      ];
    }
    getBackgrounds() {
      return ['dojo', 'dojang', 'gym'];
    }
  }
  
  const game = new Game(gameCanvas.width, gameCanvas.height);
  const menu = new Menu(game, menuCanvas.width, menuCanvas.height, menuCanvas);
  
  let lastTime = 0;
  
  function play(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    menuCtx.clearRect(0, 0, menuCanvas.width, menuCanvas.height);
    if (document.getElementById("pause").value == 1) {
		  menuCanvas.style.visibility = "visible";
		} else {
		  menuCanvas.style.visibility = "hidden";
		  gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
      game.update(deltaTime); 
		}
	  game.draw(gameCtx);
	  menu.update(menuCtx);
    requestAnimationFrame(play);
  }
  play(0);
  
});