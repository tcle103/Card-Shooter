// Tien Le <ticale@ucsc.edu>

// from w3schools
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Prof Whitehead's collision detection function
function collides(a, b) {
    if (Math.abs(a.x - b.x) > (a.displayWidth / 2 + b.displayWidth / 2)) { return false; }
    if (Math.abs(a.y - b.y) > (a.displayHeight / 2 + b.displayHeight / 2)) { return false; }
    return true;
}

function cleanUp(scene) {
    this.healthUpdate = false;

    scene.health.splice(0, 3);
    scene.bullets.splice(0, scene.bullets.length);

    for (let i = 0; i < scene.enemies.length; ++i) {
        scene.enemies[i].bullets.splice(0, scene.enemies[i].bullets.length);
    }

    scene.enemies.splice(0, scene.enemies.length);
}

function initGame(scene) {
    scene.health.push(new Health(scene, 140, 550));
    scene.health.push(new Health(scene, 90, 550));
    scene.health.push(new Health(scene, 40, 550));

    // place enemies!!!
    scene.enemies.push(new Enemy(scene, 165, 275));
    scene.enemies.push(new Enemy(scene, 320, 275));
    scene.enemies.push(new Enemy(scene, 480, 275));
    scene.enemies.push(new Enemy(scene, 635, 275));

    for (let i = 0; i < scene.enemies.length; ++i) {
        scene.enemies[i].lr = -1;
    }

    scene.enemies.push(new Enemy(scene, 100, 175));
    scene.enemies.push(new Enemy(scene, 250, 175));
    scene.enemies.push(new Enemy(scene, 400, 175));
    scene.enemies.push(new Enemy(scene, 550, 175));
    scene.enemies.push(new Enemy(scene, 700, 175));

    scene.enemies.push(new Face(scene, 200, 75));
    scene.enemies.push(new Face(scene, 400, 75));
    scene.enemies.push(new Face(scene, 600, 75));
}

class Enemy {
    constructor(scene, x, y) {
        this.type = "num";
        this.health = 5;

        this.timer = 4;

        this.frame = 0;
        this.swapping = false;

        this.bullets = [];

        this.x = x;
        this.y = y;

        this.step = 0;

        // movement
        // left right - 1 is right, -1 left
        this.lr = 1;
        // up down - -1 is up, 1 is down
        this.ud = 1
        // vert horiz - -1 is horizontal, 1 is down;
        this.vh = -1;

        this.flipflop = 2;

        this.sprites = {
            faces: [],
            faceHalf: [],
            back: scene.add.sprite(x, y, "cardBack"),
            backHalf: scene.add.sprite(x, y, "cardBackHalf"),
            frontToBack: scene.add.sprite(x, y, "frontToBack"),
            backToFront: scene.add.sprite(x, y, "backToFront")
        }

        for (let i = 0; i < 6; ++i) {
            this.sprites.faces.push(scene.add.sprite(x, y, "redCard0" + i));
            this.sprites.faces[i].setScale(1.5);
        }

        for (let i = 0; i < 6; ++i) {
            this.sprites.faceHalf.push(scene.add.sprite(x, y, "redCard0" + i + "Half"));
            this.sprites.faceHalf[i].setScale(1.5);
        }

        for (let key in this.sprites) {
            if (key != "faces" && key != "faceHalf") {
                this.sprites[key].setScale(1.5);
            }
        }


        this.currSprite = this.sprites.faces[5];

        //console.log(this.sprites.faces);
        this.display();
    }

    display() {
        this.currSprite.visible = true;
        this.currSprite.x = this.x;
        this.currSprite.y = this.y;

        for (let i = 0; i < this.sprites.faces.length; ++i) {
            if (this.sprites.faces[i] != this.currSprite) {
                this.sprites.faces[i].visible = false;
                this.sprites.faces[i].x = this.x;
                this.sprites.faces[i].y = this.y;
            }

            if (this.sprites.faceHalf[i] != this.currSprite) {
                this.sprites.faceHalf[i].visible = false;
                this.sprites.faceHalf[i].x = this.x;
                this.sprites.faceHalf[i].y = this.y;
            }
        }

        for (let key in this.sprites) {
            if (key != "faces" && key != "faceHalf") {
                if (this.sprites[key] != this.currSprite) {
                    this.sprites[key].visible = false;
                    this.sprites[key].x = this.x;
                    this.sprites[key].y = this.y;
                }
            }
        }
    }

    swap() {
        //console.log(this.frame);
        if (this.sprites.faces.includes(this.currSprite)) {
            if (this.frame == 0) {
                this.currSprite = this.sprites.faceHalf[this.sprites.faces.indexOf(this.currSprite)];
                this.display();
                ++this.frame;
            }
        }
        else if (this.sprites.faceHalf.includes(this.currSprite)) {
            if (this.frame == 1) {
                this.currSprite = this.sprites.frontToBack;
                this.display();
                ++this.frame;
            }
            else if (this.frame == 7) {
                if (this.health > 0 && this.health <= 5) {
                    this.currSprite = this.sprites.faces[this.health];
                }
                else {
                    this.currSprite = this.sprites.faces[0]
                }
                this.display();
                ++this.frame;
            }
        }
        else {
            let currKey;
            for (let key in this.sprites) {
                if (key == "faces" || key == "faceHalf") {
                    continue;
                }
                if (this.sprites[key] == this.currSprite) {
                    currKey = key;
                    break;
                }
            }
            switch (currKey) {
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
                    if (this.health > 0 && this.health <= 5) {
                        this.currSprite = this.sprites.faceHalf[this.health];
                    }
                    else {
                        this.currSprite = this.sprites.faceHalf[0];
                    }
                    this.display();
                    ++this.frame;
                    break;
            }
        }
    }

    shoot(scene) {
        let bullet;
        //console.log(bullet);
        let temp = scene.add.sprite(this.currSprite.x, this.currSprite.y + 40, "redBullet");
        temp.setScale(1);
        this.bullets.push(temp);
    }

    move() {
        //console.log(this.vh);
        if (this.vh == -1) {
            this.x += (0.25 * this.lr);
        }
        if (this.vh == 1) {
            this.y += (0.25 * this.ud);
        }

        if (this.step >= 80) {
            this.step = 0;
            this.vh = (-1 * this.vh);
            ++this.flipflop;
            console.log(this.flipflop);

            if (this.vh == 1 && (this.flipflop % 3) == 0) {
                this.lr = (-1 * this.lr);
            }

            if (this.flipflop == 12) {
                this.ud = -1 * this.ud;
                this.flipflop = 0;
            }
        }

        ++this.step;
        this.display();
    }

    update(scene) {
        this.move();
        ++this.timer;

        if (this.health >= 0) {
            if (this.swapping) {
                this.swap();
                if (this.frame >= 8) {
                    this.swapping = false;
                    this.frame = 0;
                }
            }
            if (this.health > 0) {
                if (this.timer > 50) {
                    this.timer = 0;
                    if (this.health > 0) { }
                    if (getRndInteger(0, 2) == 0) {
                        this.shoot(scene);
                    }
                }
            }
            else {
                if (this.timer > 80) {
                    --this.health;
                }
            }
        }

        for (let i = 0; i < this.bullets.length; ++i) {
            this.bullets[i].y += 10;
            if (this.bullets[i].y > 600) {
                this.bullets[i].destroy();
                this.bullets.splice(i, 1);
                break;
            }
            if (collides(this.bullets[i], scene.my.sprite.player[3])) {
                //console.log("enemy collided");
                if (scene.playerHealth > 0) {
                    scene.healthUpdate = true;
                    scene.dmg.play();
                    --scene.playerHealth;
                    switch (scene.playerHealth) {
                        case 9:
                        case 8:
                        case 7:
                        case 6:
                            --scene.health[0].count;
                            break;
                        case 5:
                            --scene.health[0].count;
                        case 4:
                        case 3:
                            --scene.health[1].count;
                            break;
                        case 2:
                            --scene.health[1].count;
                        case 1:
                        case 0:
                            --scene.health[2].count;
                            break;
                    }
                    this.bullets[i].destroy();
                    this.bullets.splice(i, 1);
                }
            }
        }
    }
}

class Health {
    constructor(scene, x, y) {
        this.count = 3;

        this.frame = 0;
        this.swapping = false;

        this.sprites = {
            faces: [],
            faceHalf: scene.add.sprite(x, y, "playerHealthHalf"),
            back: scene.add.sprite(x, y, "playerHealthBack"),
            backHalf: scene.add.sprite(x, y, "playerHealthBackHalf"),
            frontToBack: scene.add.sprite(x, y, "healthFrontToBack"),
            backToFront: scene.add.sprite(x, y, "healthBackToFront")
        }

        this.sprites.faces.push(scene.add.sprite(x, y, "playerHealthBack"));
        this.sprites.faces[0].setScale(2);

        for (let i = 1; i < 4; ++i) {
            this.sprites.faces.push(scene.add.sprite(x, y, "playerHealth" + i));
            this.sprites.faces[i].setScale(2);
        }

        for (let sprite in this.sprites) {
            if (sprite != "faces") {
                this.sprites[sprite].setScale(2);
            }
        }

        this.currSprite = this.sprites.faces[3];
    }

    display() {
        //console.log(this.currSprite);
        //console.log(this.frame);
        this.currSprite.visible = true;

        for (let i = 0; i < 4; ++i) {
            if (this.sprites.faces[i] != this.currSprite) {
                this.sprites.faces[i].visible = false;
            }
        }

        for (let key in this.sprites) {
            if (key != "faces") {
                if (this.sprites[key] != this.currSprite) {
                    this.sprites[key].visible = false;
                }
            }
        }
    }

    swap() {
        if (this.sprites.faces.includes(this.currSprite)) {
            if (this.frame == 0) {
                this.currSprite = this.sprites.faceHalf;
                this.display();
                ++this.frame;
            }
        }
        else {
            let currKey;
            for (let key in this.sprites) {
                if (key == "faces") {
                    continue;
                }
                if (this.sprites[key] == this.currSprite) {
                    currKey = key;
                    break;
                }
            }
            switch (currKey) {
                case "faceHalf":
                    if (this.frame == 1) {
                        this.currSprite = this.sprites.frontToBack;
                        this.display();
                        ++this.frame;
                    }
                    else if (this.frame == 7) {
                        if (this.count > 0 && this.count <= 3) {
                            this.currSprite = this.sprites.faces[this.count];
                        }
                        else {
                            this.currSprite = this.sprites.faces[0]
                        }
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
}

class Face extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y);

        this.type = "face";
        this.health = 3;

        this.attacking = false;

        this.timer1 = getRndInteger(0, 20);

        for (let i = 0; i < this.sprites.faces.length; ++i) {
            this.sprites.faces[i].destroy();
            this.sprites.faceHalf[i].destroy();
        }

        this.sprites.faces = [];
        this.sprites.faceHalf = [];

        this.sprites.faces.push(scene.add.sprite(x, y, "redCard00"));
        this.sprites.faceHalf.push(scene.add.sprite(x, y, "redCard00Half"));

        this.sprites.faces.push(scene.add.sprite(x, y, "redCardJ"));
        this.sprites.faceHalf.push(scene.add.sprite(x, y, "redCardJHalf"));

        this.sprites.faces.push(scene.add.sprite(x, y, "redCardQ"));
        this.sprites.faceHalf.push(scene.add.sprite(x, y, "redCardQHalf"));

        this.sprites.faces.push(scene.add.sprite(x, y, "redCardK"));
        this.sprites.faceHalf.push(scene.add.sprite(x, y, "redCardKHalf"));

        this.currSprite = this.sprites.faces[3];

        for (let i = 0; i < this.sprites.faces.length; ++i) {
            this.sprites.faces[i].setScale(1.5);
            this.sprites.faceHalf[i].setScale(1.5);
        }

        this.display();
    }

    move() {
        if (!this.attacking && getRndInteger(0, 3) == 0) {
            if (this.lr == -1 && this.x > 50) {
                this.x -= 3;
            }
            else if (this.lr == 1 && this.x < 750) {
                this.x += 3;
            }
            this.display();
        }

        if (this.timer1 % 20 == 0) {
            if (getRndInteger(0, 3) == 0) {
                this.lr = -1 * this.lr;
            }
        }
    }

    attack() {
        //console.log("wa");
        if (this.ud == 1) {
            this.y += 30;
        }
        else {
            this.y -= 7;
        }
        this.display();

        if (this.y >= 540) {
            this.ud = -1;
        }

        if (this.y <= 75) {
            this.ud = 1;
            this.attacking = false;
        }
    }

    update(scene) {
        this.move();
        //console.log("wa");
        ++this.timer1;
        //console.log(this.timer);

        if (this.health >= 0) {
            //console.log("here");
            if (this.swapping) {
                this.swap();
                if (this.frame >= 8) {
                    this.swapping = false;
                    this.frame = 0;
                }
            }
            if (this.health > 0) {
                if (this.timer1 >= 100) {
                    this.timer1 = 0;
                    if (getRndInteger(0, 3) == 0) {
                        this.attacking = true;
                    }
                    else {
                        this.swapping = true;
                    }
                }
                if (this.attacking) {
                    this.attack();
                }
                if (collides(this.currSprite, scene.my.sprite.player[3])) {
                    //console.log("enemy collided");
                    if (scene.playerHealth > 0) {
                        scene.healthUpdate = true;
                        scene.dmg.play();
                        scene.playerHealth = 0;
                        scene.health[0].count = 0;
                        scene.health[1].count = 0;
                        scene.health[2].count = 0;
                    }
                }

            }
            else {
                if (this.timer1 > 80) {
                    --this.health;
                }
            }
        }
    }
}

class Movement extends Phaser.Scene {
    constructor() {
        super("movementScene");
        this.my = { sprite: {} }; // creates object to hold sprite bindings

        this.playerHealth = 9;
        this.healthUpdate = false;

        // constant for player position
        this.playerX = 400;
        this.playerY = 640;
        this.playerYTarget = 510;

        // array to store all the bullets
        this.bullets = [];

        // key vars for polling
        this.aKey = null;
        this.leftKey = null;
        this.rightKey = null;
        this.dKey = null;
        this.spaKey = null;

        // constant running timer to limit bullet fire rate
        this.bulletTiming = 50;

        // contains possible player bullet sprites
        this.bulletSprite = ["blackcardbullet1", "blackcardbullet2", "blackcardbullet3"];

        // contains enemies
        this.enemies = [];

        // contains health indicators
        this.health = [];

        this.flip;
        this.dmg;
        this.star;

        this.start = true;

        this.score = 0;

        this.gameEnd = 0;

        this.animDone = false;
    }

    preload() {
        this.load.setPath("./assets/kenney_playing-cards-pack/PNG/");



        // load player bullet sprite
        this.load.image("blackcardbullet1", "Cards (medium)/card_clubs_03.png");
        this.load.image("blackcardbullet2", "Cards (medium)/card_clubs_A.png");
        this.load.image("blackcardbullet3", "Cards (medium)/card_clubs_J.png");

        // load player health card sprites
        this.load.image("playerHealth3", "edited/player health/card_health_03.png");
        this.load.image("playerHealth2", "edited/player health/card_health_02.png");
        this.load.image("playerHealth1", "edited/player health/card_health_A.png");
        this.load.image("playerHealthHalf", "edited/player health/card_health_half.png")
        this.load.image("playerHealthBack", "Cards (medium)/card_back.png");
        this.load.image("playerHealthBackHalf", "edited/player health/card__health_back_half.png");
        this.load.image("healthFrontToBack", "edited/player health/health_front_to_back_flip.png");
        this.load.image("healthBackToFront", "edited/player health/health_back_to_front_flip.png");

        // load enemy sprites
        // num cards
        this.load.image("redCard05", "Cards (large)/card_diamonds_05.png");
        this.load.image("redCard05Half", "edited/enemy flips/card_diamonds_05_half.png");
        this.load.image("redCard04", "Cards (large)/card_diamonds_04.png");
        this.load.image("redCard04Half", "edited/enemy flips/card_diamonds_04_half.png");
        this.load.image("redCard03", "Cards (large)/card_diamonds_03.png");
        this.load.image("redCard03Half", "edited/enemy flips/card_diamonds_03_half.png");
        this.load.image("redCard02", "Cards (large)/card_diamonds_02.png");
        this.load.image("redCard02Half", "edited/enemy flips/card_diamonds_02._half.png");
        this.load.image("redCard01", "Cards (large)/card_diamonds_A.png");
        this.load.image("redCard01Half", "edited/enemy flips/card_diamonds_A_half.png");
        this.load.image("redCard00", "edited/enemy flips/card_diamonds_00.png");
        this.load.image("redCard00Half", "edited/enemy flips/card_diamonds_00_half.png");

        // face cards
        this.load.image("redCardK", "Cards (large)/card_diamonds_K.png");
        this.load.image("redCardKHalf", "edited/enemy flips/card_diamonds_K_half.png");
        this.load.image("redCardQ", "Cards (large)/card_diamonds_Q.png");
        this.load.image("redCardQHalf", "edited/enemy flips/card_diamonds_Q_half.png");
        this.load.image("redCardJ", "Cards (large)/card_diamonds_J.png");
        this.load.image("redCardJHalf", "edited/enemy flips/card_diamonds_J_half.png");

        // load enemy bullet sprite
        this.load.image("redBullet", "Cards (medium)/card_hearts_A.png");

        // star
        this.load.image("star", "edited/card_star.png");
        this.load.image("starHalf", "edited/card_star_half.png");

        // load sounds
        this.load.setPath("./assets/kenney_casino-audio/Audio/");

        this.load.audio("flip", ["cardOpenPackage2.ogg"]);
        this.load.audio("dmg", ["cardShove1.ogg"]);
        this.load.audio("star", ["chipsHandle1.ogg"]);
    }

    create() {
        let my = this.my; // alias for readability

        my.sprite.bg = this.add.sprite(400, 300, "bg");

        my.sprite.player = [];
        my.sprite.player.push((this.add.sprite(this.playerX, this.playerY + 24, "cardBack")));
        my.sprite.player.push((this.add.sprite(this.playerX, this.playerY + 16, "cardBack")));
        my.sprite.player.push((this.add.sprite(this.playerX, this.playerY + 8, "cardBack")));
        my.sprite.player.push((this.add.sprite(this.playerX, this.playerY, "player1")));
        for (let sprite of my.sprite.player) {
            sprite.setScale(1.5);
        }

        this.flip = this.sound.add("flip", { volume: 0.2 });
        this.dmg = this.sound.add("dmg", { volume: 0.2 });
        this.star = this.sound.add("star", { volume: 0.2});

        // key objects for polling
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.spaKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        my.sprite.score = this.add.text(650, 535, `${this.score}`.padStart(4, "0"), { fontFamily: '"shape_bitregular"' });
        my.sprite.score.setFontSize(50);

        my.sprite.star = new TitleLetter(this, 400, -100, "star", "starHalf");

    }

    update() {
        console.log(this.playerHealth);
        let my = this.my; // alias for readability

        if (this.start) {
            this.gameEnd = 0;
            if (my.sprite.player[3].y > this.playerYTarget) {
                cleanUp(this);
                my.sprite.score.visible = false;
                my.sprite.player[3].y -= 6;
            }
            else {
                this.playerHealth = 9;
                // populate enemies here actually, write function to do that
                this.score = 0;
                initGame(this);
                my.sprite.score.setText(`${this.score}`.padStart(4, "0"));
                my.sprite.score.visible = true;
                this.start = false;
            }
        }

        if (this.gameEnd != 0 && !this.start) {
            console.log("hi")
            switch (this.gameEnd) {
                case 1:
                    if (my.sprite.star.sprites.face.y < 275) {
                        my.sprite.star.swapping = true;
                        for (let key in my.sprite.star.sprites) {
                            my.sprite.star.sprites[key].y += 4;
                        }
                        if (my.sprite.player[3].x > 400) {
                            my.sprite.player[3].x -= 6;
                        }
                        if (my.sprite.player[3].x < 400) {
                            my.sprite.player[3].x += 6;
                        }
                    }
                    else {
                        if (my.sprite.star.swapping) {
                            my.sprite.star.swap();
                            if (my.sprite.star.frame >= 8) {
                                this.star.play();
                                my.sprite.star.swapping = false;
                                my.sprite.star.frame = 0;
                            }
                        }
                        else {
                            if (my.sprite.player[3].y < this.playerY) {
                                my.sprite.player[3].y += 4;
                            }
                            else {
                                this.animDone = true;
                            }
                        }
                    }
                    if (this.animDone) {
                        this.start = true;
                        cleanUp(this);
                        this.gameEnd = 0;
                        this.scene.start("titleScene");
                    }
                    break;
                case -1:
                    if (my.sprite.player[3].y < this.playerY) {
                        my.sprite.player[3].y += 4;
                    }
                    else {
                        this.start = true;
                        cleanUp(this);
                        this.gameEnd = 0;
                        this.scene.start("titleScene");
                    }
            }
        }


        // to do - set an end flag instead so can have the player leave the screen before
        // return to title
        // win
        if (this.enemies.length <= 0 && !this.start) {
            console.log(this.enemies.length);
            my.sprite.score.setText(`${this.score}`.padStart(4, "0"));
            this.gameEnd = 1;
        }

        // lose
        if (this.playerHealth <= 0 && !this.start) {
            my.sprite.score.setText(`${this.score}`.padStart(4, "0"));
            this.gameEnd = -1;
        }

        ++this.bulletTiming;

        for (let i = 0; i < this.enemies.length; ++i) {
            this.enemies[i].update(this);

            for (let i = 0; i < this.enemies.length; ++i) {
                // recycle dead enemies and remove from array of enemies (for game over detection)
                if (this.enemies[i].health < 0) {
                    // increment score and update text
                    if (this.enemies[i].type == "num") {
                        this.score += 100;
                    }
                    if (this.enemies[i].type == "face") {
                        this.score += 500;
                    }
                    my.sprite.score.setText(`${this.score}`.padStart(4, "0"));
                    for (let a = 0; a < this.enemies[i].sprites.faces.length; ++a) {
                        this.enemies[i].sprites.faces[a].destroy();
                        this.enemies[i].sprites.faceHalf[a].destroy();
                        for (let key in this.sprites) {
                            if (key == "faces" || key == "faceHalf") {
                                continue;
                            }
                            this.sprites[key].destroy();
                        }
                    }
                    this.enemies.splice(i, 1);
                    //console.log(this.enemies);
                }
            }
        }

        if (this.healthUpdate) {
            //console.log(this.playerHealth);
            if (this.playerHealth >= 0) {
                for (let i = 0; i < 3; ++i) {
                    //console.log(this.health[i].count);
                    if (this.health[i].count >= 0) {
                        this.health[i].swap();
                        if (this.health[i].frame >= 8) {
                            this.health[i].frame = 0;
                            this.healthUpdate = false;
                        }
                        break;
                    }
                }
            }

        }

        if ((this.aKey.isDown || this.leftKey.isDown) && !this.start && !this.gameEnd) {
            if (this.playerHealth > 0) {
                if (my.sprite.player[3].x > 49) {
                    my.sprite.player[3].x -= 6;
                }
            }
        }

        if ((this.dKey.isDown || this.rightKey.isDown) && !this.start && !this.gameEnd) {
            if (this.playerHealth > 0) {
                if (my.sprite.player[3].x < 749) {
                    my.sprite.player[3].x += 6;
                }
            }
        }

        for (let sprite of my.sprite.player) {
            if (my.sprite.player.indexOf(sprite) != 3) {
                if (sprite.x > my.sprite.player[3].x) {
                    //console.log(sprite.x);
                    sprite.x -= (5.4 + (my.sprite.player.indexOf(sprite) * 0.2));
                }
                if (sprite.x < my.sprite.player[3].x) {
                    //console.log(sprite.x);
                    sprite.x += (5.4 + (my.sprite.player.indexOf(sprite) * 0.2));
                }
                if (sprite.y < (my.sprite.player[3].y + (8 * (3 - my.sprite.player.indexOf(sprite))))) {
                    sprite.y += (5.4 + (my.sprite.player.indexOf(sprite) * 0.2));
                }
                if (sprite.y > (my.sprite.player[3].y + (8 * (3 - my.sprite.player.indexOf(sprite))))) {
                    sprite.y -= (5.4 + (my.sprite.player.indexOf(sprite) * 0.2));
                }
            }
        }

        if (this.spaKey.isDown && !this.start && !this.gameEnd) {
            //console.log("space");
            if (this.playerHealth > 0) {
                if (this.bulletTiming > 10) {
                    let bullet = this.bulletSprite[getRndInteger(0, 2)];
                    //console.log(bullet);
                    let temp = this.add.sprite(my.sprite.player[3].x, my.sprite.player[3].y - 40, bullet);
                    temp.setScale(1);
                    this.bullets.push(temp);
                    this.bulletTiming = 0;
                }
            }
        }

        for (let i = 0; i < this.bullets.length; ++i) {
            this.bullets[i].y -= 10;
            if (this.bullets[i].y < 0) {
                this.bullets[i].destroy();
                this.bullets.splice(i, 1);
                break;
            }
            for (let enemy in this.enemies) {
                if (collides(this.bullets[i], this.enemies[enemy].currSprite)) {
                    console.log(this.bullets[i]);
                    if (this.enemies[enemy].health > 0) {
                        this.flip.play();
                        --this.enemies[enemy].health;
                        this.enemies[enemy].swapping = true;
                        this.bullets[i].destroy();
                        this.bullets.splice(i, 1);
                    }
                }
            }
        }

    }
}