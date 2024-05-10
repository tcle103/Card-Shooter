class TitleLetter {
    constructor(scene, x, y, card, cardHalf) {
        this.dir = -1;
        // -1 is up, 1 is down

        this.frame = 0;
        this.swapping = false;

        this.sprites = {
            face: scene.add.sprite(x, y, card),
            faceHalf: scene.add.sprite(x, y, cardHalf),
            back: scene.add.sprite(x, y, "cardBack"),
            backHalf: scene.add.sprite(x, y, "cardBackHalf"),
            frontToBack: scene.add.sprite(x, y, "frontToBack"),
            backToFront: scene.add.sprite(x, y, "backToFront")
        }

        for (let key in this.sprites) {
            this.sprites[key].setScale(2.5);
        }


        this.currSprite = this.sprites.face;

        console.log(this.sprites.face);
        this.display();
    }

    display() {
        this.currSprite.visible = true;

        for (let key in this.sprites) {
            if (this.sprites[key] != this.currSprite) {
                this.sprites[key].visible = false;
            }
        }
    }

    swap() {
        let currKey;
        for (let key in this.sprites) {
            if (this.sprites[key] == this.currSprite) {
                currKey = key;
                break;
            }
        }

        switch (currKey) {
            case "face":
                if (this.frame == 0) {
                    this.currSprite = this.sprites.faceHalf;
                    this.display();
                    ++this.frame;
                }
                break;
            case "faceHalf":
                if (this.frame == 1) {
                    this.currSprite = this.sprites.frontToBack;
                    this.display();
                    ++this.frame;
                }
                else if (this.frame == 7) {
                    this.currSprite = this.sprites.face;
                    this.display();
                    ++this.frame;
                }
                break;
            case "frontToBack":
                // this.frame is 2 here
                this.currSprite = this.sprites.backHalf;
                this.display();
                ++this.frame;
                break;
            case "backHalf":
                if (this.frame == 3) {
                    this.currSprite = this.sprites.back;
                    this.display();
                    ++this.frame;
                }
                if (this.frame == 5) {
                    this.currSprite = this.sprites.backToFront;
                    this.display();
                    ++this.frame;
                }
                break;
            case "back":
                // this.frame is 4 here
                this.currSprite = this.sprites.backHalf;
                this.display();
                ++this.frame;
                break;
            case "backToFront":
                // the frame is 6 here
                this.currSprite = this.sprites.faceHalf;
                this.display();
                ++this.frame;
                break;
        }
    }
}


class Title extends Phaser.Scene {
    constructor() {
        super("titleScene");
        this.my = { sprite: {} }; // creates object to hold sprite bindings

        this.title = []; // stores title letters
        this.titleHeight = 115;

        this.timer = 200;

        this.playerX = 400;
        this.playerY = 640;

        this.playerDir = -1;

        this.start = true;

        this.playerYBob = 360;

        this.startGame = false;

        this.chip;

    }

    preload() {
        this.load.setPath("./assets/kenney_playing-cards-pack/PNG/");

        this.load.image("bg", "../../bg.png");

        // load title letters + half frames
        this.load.image("title_c", "edited/title/card_c.png");
        this.load.image("title_c_half", "edited/title/card_c_half.png");

        this.load.image("title_a", "edited/title/card_a.png");
        this.load.image("title_a_half", "edited/title/card_a_half.png");

        this.load.image("title_r", "edited/title/card_r.png");
        this.load.image("title_r_half", "edited/title/card_r_half.png");

        this.load.image("title_d", "edited/title/card_d.png");
        this.load.image("title_d_half", "edited/title/card_d_half.png");

        // load text
        this.load.image("shooter", "edited/title/shooter.png");

        // load player sprite
        this.load.image("player1", "Cards (large)/card_joker_black.png");
        this.load.image("cardBack", "Cards (large)/card_back.png");

        // for flips
        this.load.image("cardBackHalf", "edited/enemy flips/card_back_half.png");
        this.load.image("frontToBack", "edited/enemy flips/front_to_back_side.png");
        this.load.image("backToFront", "edited/enemy flips/back_to_front_side.png");

        // button
        this.load.image("button", "../../kenney_1-bit-input-prompts-pixel-16/Tiles (White)/tile_0741.png");
        this.load.image("hover", "../../kenney_1-bit-input-prompts-pixel-16/edited/tile_0741_hover.png");

        this.load.setPath("./assets/kenney_casino-audio/Audio");
        this.load.audio("chip", ["chipLay1.ogg"]);

    }

    create() {
        let my = this.my; // alias for readability

        my.sprite.bg = this.add.sprite(400, 300, "bg");

        my.sprite.shooter = this.add.sprite(400, 230, "shooter");
        my.sprite.shooter.setScale(0.6);


        my.sprite.hover = this.add.sprite(400, 510, "hover");
        my.sprite.hover.setScale(6);
        my.sprite.hover.visible = false;

        this.chip = this.sound.add("chip", {volume: 0.5});

        my.sprite.button = this.add.sprite(400, 510, "button");
        my.sprite.button.setScale(6);
        my.sprite.button.setInteractive();
        my.sprite.button.on('pointerover', () => { my.sprite.hover.visible = true; });
        my.sprite.button.on('pointerout', () => { my.sprite.hover.visible = false; });
        my.sprite.button.on('pointerdown', () => 
            {
                this.startGame = true;
                console.log("starting game");
                this.chip.play();
            })


        //this.scene.start("movementScene");

        // populate title array with letters
        this.title.push(new TitleLetter(this, 220, this.titleHeight + 18, "title_c", "title_c_half"));
        this.title.push(new TitleLetter(this, 340, this.titleHeight + 6, "title_a", "title_a_half"));
        this.title.push(new TitleLetter(this, 460, this.titleHeight - 6, "title_r", "title_r_half"));
        this.title.push(new TitleLetter(this, 580, this.titleHeight - 18, "title_d", "title_d_half"));
        this.title[0].dir = 1;
        this.title[3].dir = 1;

        // make a player
        my.sprite.player = [];
        my.sprite.player.push((this.add.sprite(this.playerX, this.playerY + 24, "cardBack")));
        my.sprite.player.push((this.add.sprite(this.playerX, this.playerY + 16, "cardBack")));
        my.sprite.player.push((this.add.sprite(this.playerX, this.playerY + 8, "cardBack")));
        my.sprite.player.push((this.add.sprite(this.playerX, this.playerY, "player1")));
        for (let sprite of my.sprite.player) {
            sprite.setScale(1.5);
        }
    }

    update() {
        let my = this.my;

        if (this.startGame && !this.start) {
            if (my.sprite.player[3].y < this.playerY) {
                my.sprite.player[3].y += 6;
            }
            else {
                this.startGame = false;
                this.start = true;
                this.scene.start("movementScene");
            }

            for (let sprite of my.sprite.player) {
                if (my.sprite.player.indexOf(sprite) != 3) {
                    if (sprite.y < (my.sprite.player[3].y + (8 * (3 - my.sprite.player.indexOf(sprite))))) {
                        sprite.y += (6 + (my.sprite.player.indexOf(sprite) * 0.2));
                    }
                    if (sprite.y > (my.sprite.player[3].y + (8 * (3 - my.sprite.player.indexOf(sprite))))) {
                        if (this.start) {
                            sprite.y -= (6 + (my.sprite.player.indexOf(sprite) * 0.2));
                        }
                    }
                }
            }
        }

        // title floating and flipping
        for (let i = 0; i < this.title.length; ++i) {
            for (let key in this.title[i].sprites) {
                this.title[i].sprites[key].y += (0.75 * this.title[i].dir);
                if (this.title[i].sprites.face.y <= (this.titleHeight - 18)) {
                    this.title[i].dir = 1;
                }
                if (this.title[i].sprites.face.y >= (this.titleHeight + 18)) {
                    this.title[i].dir = -1;
                }
            }

            if (this.title[i].swapping) {
                this.title[i].swap();
                if (this.title[i].frame >= 8) {
                    this.title[i].swapping = false;
                    this.title[i].frame = 0;
                }
            }
        }

        ++this.timer;

        if ((this.timer % 200) == 0) {
            if (getRndInteger(0, 150)) {
                this.title[0].swapping = true;
            }
        }
        if ((this.timer % 352) == 0) {
            console.log("here");
            if (getRndInteger(0, 50)) {
                this.title[1].swapping = true;
            }
        }
        if ((this.timer % 700) == 0) {
            if (getRndInteger(0, 230)) {
                this.title[2].swapping = true;
            }
        }
        if ((this.timer % 103) == 0) {
            if (getRndInteger(0, 100)) {
                this.title[3].swapping = true;
            }
        }

        // player character bobbing/movement

        if (my.sprite.player[3].y > this.playerYBob && this.start) {
            my.sprite.player[3].y -= 6;

            for (let sprite of my.sprite.player) {
                if (my.sprite.player.indexOf(sprite) != 3) {
                    if (sprite.y < (my.sprite.player[3].y + (8 * (3 - my.sprite.player.indexOf(sprite))))) {
                        sprite.y += (6 + (my.sprite.player.indexOf(sprite) * 0.2));
                    }
                    if (sprite.y > (my.sprite.player[3].y + (8 * (3 - my.sprite.player.indexOf(sprite))))) {
                        if (this.start) {
                            sprite.y -= (6 + (my.sprite.player.indexOf(sprite) * 0.2));
                        }
                    }
                }
            }
        }

        if (my.sprite.player[3].y <= this.playerYBob) {
            this.start = false;
        }

        for (let sprite of my.sprite.player) {
            my.sprite.player[3].y += (0.25 * this.playerDir);
            if (my.sprite.player[3].y <= (this.playerYBob - 25)) {
                this.playerDir = 1;
            }
            if (my.sprite.player[3].y >= (this.playerYBob + 25)) {
                this.playerDir = -1;
            }

            if (my.sprite.player.indexOf(sprite) != 3) {
                if (sprite.x > my.sprite.player[3].x) {
                    //console.log(sprite.x);
                    sprite.x -= (5.4 + (my.sprite.player.indexOf(sprite) * 0.2));
                }
                if (sprite.x < my.sprite.player[3].x) {
                    //console.log(sprite.x);
                    sprite.x += (5.4 + (my.sprite.player.indexOf(sprite) * 0.2));
                }
                if ((sprite.y < (my.sprite.player[3].y + (8 * (3 - my.sprite.player.indexOf(sprite))))) && !this.start) {
                    sprite.y += (0.7 + (my.sprite.player.indexOf(sprite) * 0.2));
                }
                if ((sprite.y > (my.sprite.player[3].y + (8 * (3 - my.sprite.player.indexOf(sprite))))) && !this.start) {
                    sprite.y -= (0.7 + (my.sprite.player.indexOf(sprite) * 0.2));
                }
            }
        }
    }
}