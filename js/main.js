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
      //audio
      this.audioOption = new Howl({src: ['https://martialarcade.github.io/qotk/sfx/option.m4a', 'https://martialarcade.github.io/qotk/sfx/option.ogg']});
      this.audioSelect= new Howl({src: ['https://martialarcade.github.io/qotk/sfx/select.m4a', 'https://martialarcade.github.io/qotk/sfx/select.ogg']});
      this.audioIntro= new Howl({src: ['https://martialarcade.github.io/qotk/sfx/intro.m4a', 'https://martialarcade.github.io/qotk/sfx/intro.ogg'], volume: 2});
      this.audioStart = new Howl({src: ['https://martialarcade.github.io/qotk/sfx/start.m4a', 'https://martialarcade.github.io/qotk/sfx/start.ogg']});
      this.audioFight = new Howl({src: ['https://martialarcade.github.io/qotk/sfx/fight.m4a', 'https://martialarcade.github.io/qotk/sfx/fight.ogg']});
      this.audioHit1 = new Howl({src: ['https://martialarcade.github.io/qotk/sfx/hit1.m4a', 'https://martialarcade.github.io/qotk/sfx/hit1.ogg']});
      this.audioHit2 = new Howl({src: ['https://martialarcade.github.io/qotk/sfx/hit2.m4a', 'https://martialarcade.github.io/qotk/sfx/hit2.ogg']});
      this.audioHit3 = new Howl({src: ['https://martialarcade.github.io/qotk/sfx/hit3.m4a', 'https://martialarcade.github.io/qotk/sfx/hit3.ogg']});
      this.audioFall = new Howl({src: ['https://martialarcade.github.io/qotk/sfx/fall.m4a', 'https://martialarcade.github.io/qotk/sfx/fall.ogg']});
      this.audioBlock = new Howl({src: ['https://martialarcade.github.io/qotk/sfx/block.m4a', 'https://martialarcade.github.io/qotk/sfx/block.ogg']});
      this.audioYouWin = new Howl({src: ['https://martialarcade.github.io/qotk/sfx/you-win.m4a', 'https://martialarcade.github.io/qotk/sfx/you-win.ogg']});
      this.audioYouLose = new Howl({src: ['https://martialarcade.github.io/qotk/sfx/you-lose.m4a', 'https://martialarcade.github.io/qotk/sfx/you-lose.ogg']});
      //audio impact
      this.audioImpact_0_1 = new Howl({src: ['https://martialarcade.github.io/qotk/sfx/impact-0-1.m4a', 'https://martialarcade.github.io/qotk/sfx/impact-0-1.ogg']});
      this.audioImpact_1_1 = new Howl({src: ['https://martialarcade.github.io/qotk/sfx/impact-1-1.m4a', 'https://martialarcade.github.io/qotk/sfx/impact-1-1.ogg']});
      this.audioImpact_2_1 = new Howl({src: ['https://martialarcade.github.io/qotk/sfx/impact-2-1.m4a', 'https://martialarcade.github.io/qotk/sfx/impact-2-1.ogg']});
      this.audioImpact1 = [this.audioImpact_0_1, this.audioImpact_1_1, this.audioImpact_2_1];
      this.audioImpact_0_2 = new Howl({src: ['https://martialarcade.github.io/qotk/sfx/impact-0-2.m4a', 'https://martialarcade.github.io/qotk/sfx/impact-0-2.ogg']});
      this.audioImpact_1_2 = new Howl({src: ['https://martialarcade.github.io/qotk/sfx/impact-1-2.m4a', 'https://martialarcade.github.io/qotk/sfx/impact-1-2.ogg']});
      this.audioImpact_2_2 = new Howl({src: ['https://martialarcade.github.io/qotk/sfx/impact-2-2.m4a', 'https://martialarcade.github.io/qotk/sfx/impact-2-2.ogg']});
      this.audioImpact2 = [this.audioImpact_0_2, this.audioImpact_1_2, this.audioImpact_2_2];
      this.audioImpact_0_3 = new Howl({src: ['https://martialarcade.github.io/qotk/sfx/impact-0-3.m4a', 'https://martialarcade.github.io/qotk/sfx/impact-0-3.ogg']});
      this.audioImpact_1_3 = new Howl({src: ['https://martialarcade.github.io/qotk/sfx/impact-1-3.m4a', 'https://martialarcade.github.io/qotk/sfx/impact-1-3.ogg']});
      this.audioImpact_2_3 = new Howl({src: ['https://martialarcade.github.io/qotk/sfx/impact-2-3.m4a', 'https://martialarcade.github.io/qotk/sfx/impact-2-3.ogg']});
      this.audioImpact3 = [this.audioImpact_0_3, this.audioImpact_1_3, this.audioImpact_2_3];
      //audio kiai
      this.audioKiai_0_1 = new Howl({src: ['https://martialarcade.github.io/qotk/sfx/kiai-0-1.m4a', 'https://martialarcade.github.io/qotk/sfx/kiai-0-1.ogg']});
      this.audioKiai_1_1 = new Howl({src: ['https://martialarcade.github.io/qotk/sfx/kiai-1-1.m4a', 'https://martialarcade.github.io/qotk/sfx/kiai-1-1.ogg']});
      this.audioKiai_2_1 = new Howl({src: ['https://martialarcade.github.io/qotk/sfx/kiai-2-1.m4a', 'https://martialarcade.github.io/qotk/sfx/kiai-2-1.ogg']});
      this.audioKiai1 = [this.audioKiai_0_1, this.audioKiai_1_1, this.audioKiai_2_1];
      this.audioKiai_0_2 = new Howl({src: ['https://martialarcade.github.io/qotk/sfx/kiai-0-2.m4a', 'https://martialarcade.github.io/qotk/sfx/kiai-0-2.ogg']});
      this.audioKiai_1_2 = new Howl({src: ['https://martialarcade.github.io/qotk/sfx/kiai-1-2.m4a', 'https://martialarcade.github.io/qotk/sfx/kiai-1-2.ogg']});
      this.audioKiai_2_2 = new Howl({src: ['https://martialarcade.github.io/qotk/sfx/kiai-2-2.m4a', 'https://martialarcade.github.io/qotk/sfx/kiai-2-2.ogg']});
      this.audioKiai2 = [this.audioKiai_0_2, this.audioKiai_1_2, this.audioKiai_2_2];
      this.audioKiai_0_3 = new Howl({src: ['https://martialarcade.github.io/qotk/sfx/kiai-0-3.m4a', 'https://martialarcade.github.io/qotk/sfx/kiai-0-3.ogg'], volume: 3});
      this.audioKiai_1_3 = new Howl({src: ['https://martialarcade.github.io/qotk/sfx/kiai-1-3.m4a', 'https://martialarcade.github.io/qotk/sfx/kiai-1-3.ogg'], volume: 3});
      this.audioKiai_2_3 = new Howl({src: ['https://martialarcade.github.io/qotk/sfx/kiai-2-3.m4a', 'https://martialarcade.github.io/qotk/sfx/kiai-2-3.ogg'], volume: 3});
      this.audioKiai3 = [this.audioKiai_0_3, this.audioKiai_1_3, this.audioKiai_2_3];
    }
    update(deltaTime) {
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
      var voice = 0;
      if (this.mode !== 'kumite') {
        var backgrounds = this.shuffle(this.getBackgrounds());
        backgroundId = backgrounds[0][1];
        voice = backgrounds[0][0];
        if (backgroundId === this.background.id) {
          backgroundId = backgrounds[1][1];
          voice = backgrounds[1][0];
        }
      }
      this.background.reset(backgroundId);
      this.fighter0.reset(this.getFighters()[this.fighter0.no], 'h', 0);
      if (this.mode === 'kumite') {
        const fighters = this.shuffle(this.getFighters());
        var fighter1 = fighters[0];
        if (fighter1[0] === this.fighter1.no) fighter1 = fighters[1];
        this.fighter1.reset(fighter1, 'k1', 1);
      } else {
        this.fighter1.reset([null, 1, 1, 1, voice], 't1', 1);
        this.fighter2.reset([null, 1, 1, 1, voice], 't2', 0);
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
        [0, 2, 5, 1, 0],
        [1, 0, 6, 2, 1],
        [2, 0, 7, 1, 2],
        /*[3, 3, 4, 1],
        [4, 0, 4, 4],
        [5, 1, 4, 3],
        [6, 1, 6, 1],
        [7, 2, 4, 2],
        [8, 0, 5, 3]*/
      ];
    }
    getBackgrounds() {
      return [
        [0, 'dojo'],
        [1, 'dojang'],
        [2, 'gym']
      ];
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
