const INITASTEROIDS = 5;
var ship;
var asteroids = [];
var lasers = [];
var gameoverBool = false;
var pauseBool = false;
var levelCompleteBool = false;
var maxasteroids = INITASTEROIDS;
var level = 1; // voor level unlocks
var bulletmodus = false; // false voor classic
var endlessmode = false;
var shootmodus = 1;
var unlocks = [2, 4]; // laser mod, double shot

var highscore = 0;
var score = 0;

var ally;
var r; // voor ally random behavior

window.addEventListener("keydown", function (e) {
    // space en arrow keys
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

function setup() {
    var c = createCanvas(windowWidth, windowHeight);
    document.getElementById("canvascontainer").appendChild(c.canvas);
    document.body.scrollTop = 0;
    highscore = localStorage.getItem("highscore");
    ship = new Ship('rgb(255,255,255)');
    for (let i = 0; i < maxasteroids; i++) {
        asteroids.push(new Asteroid());
    }
    r = floor(random(12));
}

function draw() {
    if (!gameoverBool) {
        background(0);

        ship.render();
        ship.turn();
        ship.update();
        ship.thrust();

        // in commentaar voor classic
        // if (ally) {
        //     ally.render();
        //     ally.turn();
        //     ally.update();
        //     ally.thrust();

        //     if (frameCount % 10 === 0) {
        //         r = floor(random(12));
        //     }
        //     switch (r) {
        //         case 0:
        //             ally.setRotation(random() < 0.5 ? 0 : -0.07);
        //             break;
        //         case 1:
        //             ally.setRotation(random() < 0.5 ? 0 : 0.07);
        //             break;
        //         case 2:
        //             ally.thrusting = !ally.thrusting;
        //             break;
        //         case 3:
        //             if (random() < 0.1) {
        //                 ally.pulse();
        //             }
        //             break;
        //         case 4:
        //             if (random() < 0.1) {
        //                 ally.bombwall();
        //             }
        //             break;
        //         case 5:
        //             if (random() < 0.1) {
        //                 ally.nuke();
        //             }
        //             break;
        //         default:
        //             if (bulletmodus && random() < 0.05) {
        //                 ally.shoot(4, shootmodus);
        //             } else if (!bulletmodus && ally.rotation === 0 && random() < 0.8) {
        //                 ally.shoot(0, shootmodus);
        //             }
        //             break;
        //     }
        // }

        for (let i = 0; i < asteroids.length; i++) {
            asteroids[i].render();
            asteroids[i].update();
            if (ship.collide(asteroids[i])) {
                gameover();
            }
        }

        for (let i = 0; i < lasers.length; i++) {
            lasers[i].render();
            lasers[i].update();
            for (let j = 0; j < asteroids.length; j++) {
                if (lasers[i].hit(asteroids[j])) {
                    score += floor(70/asteroids[j].r);
                    asteroids = asteroids.concat(asteroids[j].break());
                    asteroids.splice(j, 1);
                    if (lasers[i].isnuke) {
                        lasers[i].chainreact();
                    } else if (lasers[i].isbomb) {
                        lasers[i].explode();
                    }
                    lasers.splice(i, 1);
                    writeScore();
                    return;
                }
            }
            if (lasers[i].checkEdges()) {
                lasers.splice(i, 1);
            }
        }

        if (!endlessmode && asteroids.length === 0) {
            levelComplete();
        }

        if (endlessmode && frameCount % 350 === 0 && asteroids.length < 30) {
            asteroids.push(new Asteroid());
        }

        if (!bulletmodus && keyIsDown(32) && !keyIsDown(LEFT_ARROW) && !keyIsDown(RIGHT_ARROW)) { // laser modus
            ship.shoot(0, shootmodus);
        }
        writeScore();
    }
}

function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        ship.setRotation(-0.07);
    } else if (keyCode === RIGHT_ARROW) {
        ship.setRotation(0.07);
    } else if (keyCode === UP_ARROW) {
        ship.thrusting = true;
    } else if (gameoverBool && key === 'R') {
        restart();
    } else if (!gameoverBool && !levelCompleteBool && key === 'P') {
        pauseBool = !pauseBool;
        if (pauseBool) {
            noLoop();
        } else {
            loop();
        }
    } else if (levelCompleteBool && key === 'N') {
        nextLevel();
    } else if (/*level >= unlocks[0] &&*/ key === 'L') {
        bulletmodus = !bulletmodus;
    } else if (bulletmodus && key === ' ') { // bullet modus
        ship.shoot(4, shootmodus);
    } else if (!gameoverBool && !endlessmode && !pauseBool && key === 'C') {
        asteroids = [];
        levelComplete();
    } else if (key === 'B') {
        // in commentaar voor classic
        ship.pulse();
    } else if (key === 'W') {
        // in commentaar voor classic
        ship.bombwall();
    } else if (key === '1') {
        // in commentaar voor classic
        shootmodus = 1;
    } else if (key === '2') {
        // in commentaar voor classic
        shootmodus = 2;
    } else if (key === '3') {
        // in commentaar voor classic
        shootmodus = 3;
    } else if (key === 'X') {
        // in commentaar voor classic
        ship.nuke();
    } else if (key === 'F') {
        var fs = fullscreen();
        fullscreen(!fs);
    }
}

function keyReleased() {
    if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
        ship.setRotation(0);
    } else if (keyCode === UP_ARROW) {
        ship.thrusting = false;
    } else if (pauseBool && key === 'P') {
        pause();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    if (pauseBool) {
        pause();
    } else if (gameoverBool) {
        background(0);
        ship.render();
        if (ally) {
            ally.render();
        }
        asteroids.forEach(function (e) {
            e.render();
        }, this);
        lasers.forEach(function (e) {
            e.render();
        }, this);
        gameover();
    }
}

function levelComplete() {
    levelCompleteBool = true;
    var leveltext = "Level " + level + " complete, press N for next level";
    // in commentaar voor classic
    // if (level === unlocks[0] - 1) {
    //     leveltext += "\nLaser unlocked, press L to toggle lasermodus on/off";
    // } else if (level === unlocks[1] - 1) {
    //     leveltext += "\nDouble shot unlocked";
    // } else 
    if (level === 4) {
        leveltext = "Level " + level + " complete, press N to enter endless mode";
    }
    fill(255);
    textSize(30);
    textAlign(CENTER);
    text(leveltext, width / 2, height / 2);
}

function nextLevel() {
    if (level === 4) {
        endlessmode = true;
    } else {
        maxasteroids += 1;
        level += 1;
        if (level === unlocks[1]) {
            // in commentaar voor classic
            // shootmodus = 2;
        } else if (level === unlocks[0]) {
            bulletmodus = false;
        }
    }
    restart();
}

function gameover() {
    gameoverBool = true;
    if (score > highscore) {
        localStorage.setItem("highscore", score);
    }
    maxasteroids = INITASTEROIDS;
    level = 1;
    shootmodus = 1;
    bulletmodus = false; // false voor classic
    endlessmode = false;
    fill(255);
    textSize(30);
    textAlign(CENTER);
    text("Game Over\n(R)estart", width / 2, height / 2);
    noLoop();
}

function pause() {
    fill(255);
    textSize(30);
    textAlign(CENTER);
    text("(P)aused", width / 2, height / 2);
}

function restart() {
    asteroids = [];
    lasers = [];
    if (gameoverBool) {
        score = 0;
    }
    gameoverBool = false;
    levelCompleteBool = false;
    // in commentaar voor classic
    // if (level > 2) {
    //     ally = new Ship('rgb(65,105,225)');
    // } else {
    //     ally = null;
    // }
    setup();
    loop();
}

function writeScore() {
    fill(255);
    textSize(30);
    textAlign(RIGHT, CENTER);
    text("high: " + highscore + "\n" + "score: " + score, width-10, 40);
}
