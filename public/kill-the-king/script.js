class Enemy {
  constructor(health, name) {
    this.health = health;
    this.initHealth = health;
    this.name = name;
    this.combatMode = Math.floor(Math.random() * 3);
  }
}

const characters = [
  {
    code: 65,
    letter: 'A'
  },
  {
    code: 83,
    letter: 'S'
  },
  {
    code: 68,
    letter: 'D'
  },
  {
    code: 70,
    letter: 'F'
  },
  {
    code: 71,
    letter: 'G'
  },
  {
    code: 72,
    letter: 'H'
  },
  {
    code: 74,
    letter: 'J'
  },
  {
    code: 75,
    letter: 'K'
  },
  {
    code: 76,
    letter: 'L'
  },
  {
    code: 81,
    letter: 'Q'
  },
  {
    code: 87,
    letter: 'W'
  },
  {
    code: 69,
    letter: 'E'
  },
  {
    code: 82,
    letter: 'R'
  },
  {
    code: 84,
    letter: 'T'
  },
  {
    code: 89,
    letter: 'Y'
  },
  {
    code: 85,
    letter: 'U'
  },
  {
    code: 73,
    letter: 'I'
  },
  {
    code: 79,
    letter: 'O'
  },
  {
    code: 80,
    letter: 'P'
  },
  {
    code: 90,
    letter: 'Z'
  },
  {
    code: 88,
    letter: 'X'
  },
  {
    code: 67,
    letter: 'C'
  },
  {
    code: 86,
    letter: 'V'
  },
  {
    code: 66,
    letter: 'B'
  },
  {
    code: 78,
    letter: 'N'
  },
  {
    code: 77,
    letter: 'M'
  },
]

const development = true;

class AudioController {
  constructor(audioArray, helpers) {

    this.sampleCount = 0;
    this.loadedIndex = 0;
    this.sfxOn = true;

    if(helpers == undefined) {
      this.helpers = true;
    }

    // Affirm in console that module has been included
    console.log('%c 🔊 Audio module active ', 'padding: 10px; background: #cbfd9f; color: #3b4e2a');

    // Helpers
    if(this.helpers) {
      if(audioArray.length == 0) {
        console.warn('No audio array or audio array empty');
      }
    }

    audioArray.forEach(function(aud, index) {
      if(aud.stackSize != undefined) {
        this.sampleCount += aud.stackSize;
      } else {
        this.sampleCount += 1;
      }
    }.bind(this));

    // Create a global audio array
    this._globalAudio = [];

    // Iterate through all our samples
    audioArray.forEach(function(aud, index) {

      if(aud.stackSize != undefined) {
        this.stackSize = aud.stackSize;
      } else {
        this.stackSize = 1;
      }

      // If the type of audio is not background music, stack it and play based on an index,
      // This means you can play small samples very quickly. You cannot play the same audio
      // Object until the current object has finished

      var audioObject = [];

      let a = new Audio();
      let b;
      a.preload = true; 
      a.src = aud.source;

      for(var i = 0; i < this.stackSize; i++) {

        b = new Audio()
        b.src = a.src

        b.onloadeddata = function() {
          this.loadedIndex++;
          this.progress = Math.ceil(this.loadedIndex / this.sampleCount * 100);

          if(this.helpers) {
            console.clear();
            console.log('%c 🔊 Audio module active ', 'padding: 10px; background: #cbfd9f; color: #3b4e2a');
            console.log(`Loading ${audioArray.length} audio sample(s)`);
            console.log(`Loading ${aud.name}`);
            console.log(`${this.progress}%`)
          }

          if(this.progress == 100) {
            this.onLoaded();
          }

        }.bind(this);

        audioObject.push(b);
      }

      audioObject.index = 0;
      audioObject.maxIndex = this.stackSize;

      this._globalAudio[aud.name] = audioObject;

    }.bind(this));
  }

  play(audio) {

    let sample =  this._globalAudio[audio];

    if(sample != undefined) {
      // Get the current audio object in the stack
      let index = sample.index;
      let aud = sample[index];

      // Play the audio object
      if(this.sfxOn) {
        aud.play();
      }


      // Increase the stack index or reset if it exceeds the max stack size
      if(sample.index > sample.maxIndex - 2) {
        sample.index = 0;
      } else {
        sample.index++;
      }
    } else {
      console.warn(`${audio} does not exist.`);
    }
  }

  stop(audio) {
    let sample =  this._globalAudio[audio];

    if(sample != undefined) {
      // Get the current audio object in the stack
      let index = sample.index;
      let aud = sample[index];

      // Stop the audio object
      aud.pause();
      aud.currentTime = 0;
    }
  }

  restart(audio) {
    let sample =  this._globalAudio[audio];

    if(sample != undefined) {
      // Get the current audio object in the stack
      let index = sample.index;
      let aud = sample[index];

      // Stop the audio object
      aud.pause();
      aud.currentTime = 0;
      aud.play();
    }
  }

  pause(audio) {
    let sample =  this._globalAudio[audio];

    if(sample != undefined) {
      // Get the current audio object in the stack
      let index = sample.index;
      let aud = sample[index];

      // Stop the audio object
      aud.pause();
    }
  }

  mute(audio) {
    let sample =  this._globalAudio[audio];

    sample.forEach(function(s) {
      s.volume = 0;
    })
  }

  setVolume(audio, volume) {
    let sample =  this._globalAudio[audio];
    let vol = volume / 100;

    sample.forEach(function(s) {
      s.volume = vol;
    })
  }

  // Destroy an audio sample to save memory

  destroy(audio) {
    this._globalAudio[audio] = undefined;
  }

  stopAll() {
    Object.keys(this._globalAudio).forEach(function(key) {
      this._globalAudio[key].forEach(function(aud) {
        aud.pause();
        aud.currentTime = 0;
      })
    }.bind(this));
  }

  muteAll() {
    Object.keys(this._globalAudio).forEach(function(key) {
      this._globalAudio[key].forEach(function(aud) {
        aud.volume = 0;
      })
    }.bind(this));
  } 

  list() {
    Object.keys(this._globalAudio).forEach(function(key) {
      console.log('%c' + key, 'font-weight: bold; color: green');
    }.bind(this));
  }

  onLoaded() {
    if(this.helpers) {
      console.log('All audio loaded');
      this.list();
    }
  }
}

let vm = new Vue({
  el: '#app',

  data() {
    return {
      // * My additions
      characterToPressKeycodeIndex: Math.floor(Math.random() * characters.length), 
      tooltipText: '',
      showClickCircle: false,
      spacebarWidth: {
        width: '390px',
      },
      position: {},
      plasmite: 1, 
      claws: 1,
      adrenals: 1,
      clickDamage: 2,
      keyDamage: 3,
      spaceDamage: 1,

      keyCode: 32,
      minutes: 4,
      seconds: 0,
      ms: 1,
      pressed: false,
      strength: 1,
      intelligence: 1,
      luck: 1,
      speed: 1,
      gameStarted: false,
      muteBg: false, 
      boss: false,
      damage: 1,
      weapon: 'Blunt sword',
      weaponDamage: 1,
      enemiesPerStage: 2,
      canAttack: false,
      stage: 1,
      goldGained: 0,
      sfx: true,
      xpGained: 0,
      introClicked: false,
      bgMusicStarted: false,
      stageComplete: false,
      xp: 0,
      damageAnim: 1, 
      shoppingPhase: false,
      gold: 0,
      gameover: false,
      gamewin: false,
      audioController: '',
      enemy: new Enemy(5, 'HAREK SEDGWICK'),
      enemiesDefeated: 0,
      enemyKilled: false,
      tooltipTimer: 0,
      tooltip: true,
      enemyNames: [
        'JACOB DANGERS',
        'MILEON MASON',
        'MACE CAVELIER',
        'OSRIC GRAGOLOON',
        'MOSES STONEWELL',
        'TRISTAN GOSBECK',
        'REDWALD CROMWELL',
        'JEREMIAS PICARD',
        'EGRIC MAIDSTONE',
        'ROBIN CURTEYS',
        'DINUS DE REUE',
        'HAREK SEDGWICK',
        'FLORA DAUBERVILLE',
        'RAMETTA THE SLENDER',
        'ISEMAY VERNOLD',
        'AVINA CECIL',
        'FANUS THE GREAT',
        'GASPAR SHADOWSEEKER',
        'GOUBERT THE RED',
        'ALDOUS DARCY',
        'RYN THE RED',
        'FULLER CARDON',
        'ANSELM THE OLD',
        'ALVINA BLUETOOTH',
        'MICKNEY  CORVISER',
        'RYKOR RAVENSGATE',
        'REYNARD LONGBOW',
        'ALEX TROST',
        'ADAM KUHN',
        'STEVE GARDNER',
        'CHASSIE EVANS',
        'STEVEN SHAW',
        'CHRIS COYIER',
        'JHEY',
        'PETE BARR',
        'ZACH SAUCIER'
      ],

      audioArray: [
        {
          'name'      : 'swordHit1',
          'source'    : 'https://assets.codepen.io/217233/ktkSwordHit1.mp3',
          'stackSize' : 10
        },
        {
          'name'      : 'swordHit2',
          'source'    : 'https://assets.codepen.io/217233/ktkSwordHit2.mp3',
          'stackSize' : 10
        },
        {
          'name'      : 'swordHit3',
          'source'    : 'https://assets.codepen.io/217233/ktkSwordHit3.mp3',
          'stackSize' : 10
        },
        {
          'name'      : 'death1',
          'source'    : 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/ktkDeath1.mp3',
          'stackSize' : 10
        },
        {
          'name'      : 'death2',
          'source'    : 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/ktkDeath2.mp3',
          'stackSize' : 10
        },
        {
          'name'      : 'death3',
          'source'    : 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/ktkDeath3.mp3',
          'stackSize' : 10
        },
        {
          'name'      : 'death4',
          'source'    : 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/ktkDeath4.mp3',
          'stackSize' : 10
        },
        {
          'name'      : 'grunt1',
          'source'    : 'https://assets.codepen.io/217233/ktkGrunt1.mp3',
          'stackSize' : 10
        },
        {
          'name'      : 'grunt2',
          'source'    : 'https://assets.codepen.io/217233/ktkGrunt2.mp3',
          'stackSize' : 10
        },
        {
          'name'      : 'grunt3',
          'source'    : 'https://assets.codepen.io/217233/ktkGrunt3.mp3',
          'stackSize' : 10
        },
        {
          'name'      : 'grunt4',
          'source'    : 'https://assets.codepen.io/217233/ktkGrunt4.mp3',
          'stackSize' : 10
        },
        {
          'name'      : 'grunt5',
          'source'    : 'https://assets.codepen.io/217233/ktkGrunt5.mp3',
          'stackSize' : 10
        },
        {
          'name'      : 'grunt6',
          'source'    : 'https://assets.codepen.io/217233/ktkGrunt6.mp3',
          'stackSize' : 10
        },
        {
          'name'      : 'grunt7',
          'source'    : 'https://assets.codepen.io/217233/ktkGrunt7.mp3',
          'stackSize' : 10
        },
        {
          'name'      : 'grunt8',
          'source'    : 'https://assets.codepen.io/217233/ktkGrunt8.mp3',
          'stackSize' : 10
        },
        {
          'name'      : 'grunt9',
          'source'    : 'https://assets.codepen.io/217233/ktkGrunt9.mp3',
          'stackSize' : 10
        },
        {
          'name'      : 'bgmusic',
          'source'    : 'https://assets.codepen.io/217233/ktkBgAudio.mp3'
        },
        {
          'name'      : 'shopBell',
          'source'    : 'https://assets.codepen.io/217233/ktkBell.wav'
        },
        {
          'name'      : 'shopWoosh',
          'source'    : 'https://assets.codepen.io/217233/ktkWoosh.wav'
        },
        {
          'name'      : 'upgrade',
          'source'    : 'https://assets.codepen.io/217233/ktkUpgrade.mp3',
          'stackSize' : 10
        },
        {
          'name'      : 'hover',
          'source'    : 'https://assets.codepen.io/217233/ktkHover.mp3',
          'stackSize' : 10
        },
        {
          'name'      : 'crushyou',
          'source'    : 'https://assets.codepen.io/217233/crush+you.wav',
          'stackSize' : 1
        },
        {
          'name'      : 'neverstop',
          'source'    : 'https://assets.codepen.io/217233/neverstop.wav',
          'stackSize' : 1
        },
        {
          'name'      : 'persistance',
          'source'    : 'https://assets.codepen.io/217233/persistance.wav',
          'stackSize' : 1
        },
        {
          'name'      : 'mercy',
          'source'    : 'https://assets.codepen.io/217233/mercy.wav',
          'stackSize' : 1
        },
        {
          'name'      : 'purchases',
          'source'    : 'https://assets.codepen.io/217233/pointlesspurchases.wav',
          'stackSize' : 1
        },
        {
          'name'      : 'fool',
          'source'    : 'https://assets.codepen.io/217233/fool.wav',
          'stackSize' : 1
        },
        {
          'name'      : 'notpossible',
          'source'    : 'https://assets.codepen.io/217233/not+possible.wav',
          'stackSize' : 1
        },
        {
          'name'      : 'hitmarker',
          'source'    : './hitmarker_2.mp3',
          'stackSize' : 1
        },
      ],

      // Hmm. Upgrades
      upgrades: {
        0: {
          'type': 'stat',
          'names': 'Inject Plasmite',
          'descriptions' : 'Increase the damage of your keyboard and click attacks.',
          'cost' : 25,
          'level' : 1,
          'increment' : 1,
          'costIncreasePerLevel' : 20,
          'metric' : 'Plasmite',
          'stat' : 'plasmite',
          'maxLevel' : 100
        },
        1: {
          'type': 'stat',
          'names': 'Sharpen Claws',
          'descriptions' : 'Increase the damage of your spacebar attacks.',
          'cost' : 25,
          'level' : 1,
          'increment' : 1,
          'costIncreasePerLevel' : 20,
          'metric' : 'Claws',
          'stat' : 'claws',
          'maxLevel' : 100
        },
        2: {
          'type': 'stat',
          'names': 'Boost Adrenals',
          'descriptions' : 'Increase the speed and precision of all attacks.',
          'cost' : 25,
          'level' : 1,
          'increment' : 1,
          'costIncreasePerLevel' : 20,
          'metric' : 'Adrenals',
          'stat' : 'adrenals',
          'maxLevel' : 7
        }
      }
    }
  },
  methods: {
    setPosition() {
      let topMin = 15;
      let topMax = 40;

      let leftMin = 0;
      let leftMax = 90;

      topMin = (1.786 * (_this.adrenals - 1)) + topMin;
      topMax = topMax - (1.786 * (_this.adrenals - 1));

      leftMin = 6.43 * (_this.adrenals - 1);
      leftMax = leftMax - (6.43 * (_this.adrenals - 1));
      
      // * 15% - 40%
      let topVal = Math.floor(Math.random() * ((topMax - topMin) + 1)) + topMin;
      // * 0% - 90%
      let leftVal = Math.floor(Math.random() * ((leftMax - leftMin) + 1)) + leftMin;

      _this.position = {
        marginTop: `${topVal}%`,
        marginLeft:  `${leftVal}%`,
      }
    },
    punch() {
      if(_this.canAttack && !_this.gamewin && !_this.gameover) {

        // * Play sound
        if (_this.enemy.combatMode === 2) {
          _this.audioController.play('hitmarker');
        }

        _this.tooltipTimer = 0;

        // * Only slow down attacking when its spacebar mode and remove UI if its keyboard mode
        if (_this.enemy.combatMode === 0) {
          _this.canAttack = !_this.canAttack;
        } else if (_this.enemy.combatMode === 1) {
          _this.canAttack = !_this.canAttack;
          _this.tooltip = false;
        }

        _this.pressed = !_this.pressed;
        _this.damageAnim = Math.floor(Math.random() * 10) + 1;

        let hitSound = Math.floor(Math.random() * 3) + 1;
        let gruntSound = Math.floor(Math.random() * 9) + 1;
        _this.audioController.play(`swordHit${hitSound}`);
        _this.audioController.play(`grunt${gruntSound}`);

        setTimeout(function() {
          _this.pressed = !_this.pressed;
        }, 150)

        // * Only allow attacking if its spacebar mode
        setTimeout(function() {
          if(_this.enemyKilled == false) {
            if (_this.enemy.combatMode === 0) {
              _this.canAttack = !_this.canAttack;
            } else if (_this.enemy.combatMode === 1) {
              _this.canAttack = !_this.canAttack;
              _this.tooltip = true;

              // * switch letter because now they can attack.
              if (_this.enemy.combatMode === 1 && _this.enemy.health > 0) {
                _this.characterToPressKeycodeIndex = Math.floor(Math.random() * characters.length);
                _this.tooltipText = `Press ${characters[_this.characterToPressKeycodeIndex].letter}`;
              }
            }
          }
        }, 500 - (50 * _this.adrenals))

        // * Calculate damage based off new stats
        let damageVal;

        if (_this.enemy.combatMode === 0) {
          damageVal = _this.spaceDamage;
        } else if (_this.enemy.combatMode === 1) {
          damageVal = _this.keyDamage
        } else if (_this.enemy.combatMode === 2) {
          damageVal = _this.clickDamage;
        }

        if(_this.enemy.health > damageVal) {
          
          _this.enemy.health -= damageVal;
          
        } else {

          // * This removes click circle once the enemy dies so you can't press it anymore
          if (_this.enemy.combatMode === 2) {
            _this.showClickCircle = false;
          }

          _this.canAttack = false;

          let deathSound = Math.floor(Math.random() * 4) + 1;
          _this.audioController.play(`death${deathSound}`)

          _this.enemy.health = 0;  
          _this.enemiesDefeated++;
          _this.enemyKilled = true;

          let baseXpPerKill = 10 + Math.floor(Math.random() * 3) + 1;
          let xpPerKillWithBonus = Math.ceil((baseXpPerKill * _this.stage) + (((baseXpPerKill * _this.stage) / 100) * (_this.intelligence * 10)));

          _this.xp += xpPerKillWithBonus;
          _this.xpGained = xpPerKillWithBonus;

          let baseGoldPerKill = 10 + Math.floor(Math.random() * 3) + 1;
          let goldPerKillWithBonus = Math.ceil((baseGoldPerKill * _this.stage) + (((baseGoldPerKill * _this.stage) / 100) * (_this.luck * 10)));

          _this.goldGained = goldPerKillWithBonus;
          _this.gold += goldPerKillWithBonus;

          if(_this.boss) {
            _this.audioController.play('notpossible');
            window.clearInterval(timer)
            _this.gamewin = true;

          } else {

            if(_this.enemiesDefeated > _this.enemiesPerStage - 1) {

              _this.stageComplete = true;

              setTimeout(function() {

                // * This is where shopping phase begins
                _this.shoppingPhase = true;

                _this.audioController.play('shopWoosh');
                _this.audioController.play('shopBell');

                if(_this.stage == 1) {
                  _this.audioController.play('fool');
                }

                if(_this.stage == 3) {
                  _this.audioController.play('neverstop');
                }

                if(_this.stage == 5) {
                  _this.audioController.play('purchases');
                }

                if(_this.stage == 7) {
                  _this.audioController.play('persistance');
                }

                if(_this.stage == 9) {
                  _this.audioController.play('mercy');
                }

                console.log('lowpass')
                lowpassNode.frequency.value = 250;

              }, 1000)
            } else {
              setTimeout(function() {
                console.log(_this.enemiesDefeated, _this.stage)
                if(_this.enemiesDefeated == 10 && _this.stage == 10) {
                  _this.enemy = new Enemy(3000, 'King Trost');
                  _this.boss = true;
                } else {
                  _this.enemy = new Enemy(7 * (_this.enemiesDefeated + 1 * _this.stage), _this.enemyNames[ Math.floor(Math.random() * _this.enemyNames.length)]);
                }

                // * Remove space bar if it is combatMode 2 and show circle
                if (_this.enemy.combatMode === 2) {
                  _this.tooltip = false;
                  _this.showClickCircle = true;

                // * Set circle location
                vm.setPosition();
                } else {
                  _this.tooltip = true;
                  _this.showClickCircle = false;
                }

                // * Change tooltip text and spacebar length here
                if (_this.enemy.combatMode === 0) {
                  _this.tooltipText = 'Smash the spacebar!'
                  _this.spacebarWidth.width = '390px';
                } else if (_this.enemy.combatMode === 1) {
                  _this.tooltipText = `Press ${characters[_this.characterToPressKeycodeIndex].letter}`;
                  _this.spacebarWidth.width = '50px';
                }

              }, 800)
            }
          }

          setTimeout(function() {
            _this.canAttack = true;
            _this.enemyKilled = false;

            // * This switches the letter when an enemy spawns
            if (_this.enemy.combatMode === 1) {
              _this.characterToPressKeycodeIndex = Math.floor(Math.random() * characters.length);
              _this.tooltipText = `Press ${characters[_this.characterToPressKeycodeIndex].letter}`;
            }
          }, 800)
        }
      }

      if (_this.enemy.combatMode === 2) {
        // * Set circle location
        vm.setPosition();
      }
    },

    toggleBg() {
      if(this.muteBg == false) {
        audioNode.volume = 0;
        this.muteBg = true;
      } else {
        audioNode.volume = 1;
        this.muteBg = false;
      }
    },
    toggleSFX() {
      this.sfx = !this.sfx;
    },

    buy (upgrade, type, stat) {

      if(type == 'stat') {
        let u = this.upgrades[upgrade];
        u.level++;

        this.xp -= u.cost;

        // * we configure damage here
        if(stat == 'plasmite') {
          this.plasmite += u.increment;
          this.keyDamage = this.plasmite * 3;
          this.clickDamage = this.plasmite * 2;
        }

        if(stat == 'claws') {
          this.claws += u.increment
          this.spaceDamage = this.claws;
        }

        if(stat == 'adrenals') {
          this.adrenals += u.increment;
        }

        if(stat == 'luck') {
          this.luck += u.increment
        }

        let newCost = u.costIncreasePerLevel * u.level;
        u.cost = newCost; 
      }

      if(type == 'weapons') {
        let w = this.upgrades[upgrade];
        this.gold -= w.cost;
        this.weaponDamage = w.damage;
        this.damage = (this.strength * 1) + this.weaponDamage;
        this.weapon = w.names;
        w.bought = true;

        let newCost = u.costIncreasePerLevel * u.level;
        u.cost = newCost;   
      }
    },

    exitShoppingPhase() {
      _this.stageComplete = false;
      this.shoppingPhase = !this.shoppingPhase;
      this.stage++;
      this.enemiesPerStage++;
      this.enemiesDefeated = 0;
      this.enemy = new Enemy(5 * (_this.enemiesDefeated + 1 * _this.stage), _this.enemyNames[ Math.floor(Math.random() * _this.enemyNames.length)]);

      lowpassNode.frequency.value = 15000;

      // * Remove space bar if it is combatMode 2 and show circle
      if (_this.enemy.combatMode === 2) {
        _this.tooltip = false;
        _this.showClickCircle = true;

        // * Set circle location
        vm.setPosition();
      } else {
        _this.tooltip = true;
        _this.showClickCircle = false;
      }

      // * ON SHOPPING STAGE EXIT
      // * Change tooltip text and spacebar width here
      if (_this.enemy.combatMode === 0) {
        _this.tooltipText = 'Smash the spacebar!'
        _this.spacebarWidth.width = '390px';
      } else if (_this.enemy.combatMode === 1) {
        _this.tooltipText = `Press ${characters[_this.characterToPressKeycodeIndex].letter}`;
        _this.spacebarWidth.width = '50px';
      }
    },

    startGame() {
      this.gameStarted = true;
      lowpassNode.frequency.value = 15000;

      // * Remove space bar if it is combatMode 2 and show circle
      if (_this.enemy.combatMode === 2) {
        _this.tooltip = false;
        _this.showClickCircle = true;

        // * Set circle location
        vm.setPosition();

      } else {
        _this.tooltip = true;
        _this.showClickCircle = false;
      }

      // * ON START OF GAME
      // * Change tooltip text and spacebar width here
      if (_this.enemy.combatMode === 0) {
        _this.tooltipText = 'Smash the spacebar!'
        _this.spacebarWidth.width = '390px';
      } else if (_this.enemy.combatMode === 1) {
        _this.tooltipText = `Press ${characters[_this.characterToPressKeycodeIndex].letter}`;
        _this.spacebarWidth.width = '50px';
      }

      this.canAttack = true;

      timer = setInterval(function() {
        _this.tooltipTimer++;

        if(_this.minutes == 0 && _this.seconds == 0 && _this.ms == 0) {
          // Show game over!
          window.clearInterval(timer)
          _this.gameover = true;
          _this.canAttack = false;
        }

        // if(_this.tooltipTimer > 100) {
        //   _this.tooltip = true;
        // }

        if(_this.ms > 0) {
          _this.ms--;
          if(_this.ms < 10) {
            _this.ms = '0' + _this.ms;
          }
        } else {
          _this.ms = 99;
          if(_this.seconds < 1) {
            _this.seconds = 59;
            _this.minutes--;
            _this.minutes = '0' + _this.minutes;
          } else {
            _this.seconds--;
            if(_this.seconds < 10) {
              _this.seconds = '0' + _this.seconds;
            }
          }
        }
      },10)

    }
  },

  mounted () {
    _this = this;

    this.audioController = new AudioController(this.audioArray);

    // JCanvas Audio Module
    audioNode = document.querySelector("audio");

    document.onclick = function() {
      audioNode.loop = true;
      audioNode.play()

      if(!_this.bgMusicStarted) {
        _this.bgMusicStarted = true;
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        sourceNode = audioCtx.createMediaElementSource(audioNode);

        // Create the lowpass filter
        lowpassNode = audioCtx.createBiquadFilter();

        // Connect the source to the lowpass filter
        sourceNode.connect(lowpassNode);

        // Connect the lowpass filter to the output (speaker)
        lowpassNode.connect(audioCtx.destination);

        console.log('lowpass')
        lowpassNode.frequency.value = 250;
      }
    }

    // * SPACE BAR AND KEYBOARD SPAMMING 
    document.body.onkeyup = function(e) {
      if (_this.enemy.combatMode === 0) {
        if(e.keyCode == _this.keyCode) {
          if(!_this.shoppingPhase)
            _this.punch();
        }
      } else if (_this.enemy.combatMode === 1) {
        if (e.keyCode == characters[_this.characterToPressKeycodeIndex].code) {
          if (!_this.shoppingPhase) {
            _this.punch()
          }
        }
      }
    }
  }
});