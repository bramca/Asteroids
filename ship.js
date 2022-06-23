function Ship(color) {
    this.pos = createVector(width/2, height/2);
    this.vel = createVector(0, 0);
    this.r = 10;
    this.angle = 0;
    this.rotation = 0;
    this.thrusting = false;
    this.shipcolor = color;

    this.setRotation = function (a) {
        this.rotation = a;
    }

    this.render = function () {
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.angle);
        noFill();
        stroke(this.shipcolor);
        // fill(this.shipcolor);
        triangle(-this.r, this.r, -this.r, -this.r, this.r, 0);
        pop();
    }

    this.turn = function () {
        this.angle += this.rotation;
    }

    this.update = function () {
        this.pos.add(this.vel);
        this.vel.mult(0.99);

        if (this.pos.x + this.r < 0) {
            this.pos.x = width - this.r;
        } else if (this.pos.x - this.r > width) {
            this.pos.x = this.r;
        } else if (this.pos.y + this.r < 0) {
            this.pos.y = height - this.r;
        } else if (this.pos.y - this.r > height) {
            this.pos.y = this.r;
        }
    }

    this.thrust = function () {
        if (this.thrusting) {
            this.vel.add(p5.Vector.fromAngle(this.angle).mult(0.1));
        }
    }

    this.collide = function (asteroid) {
        if (dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y) < asteroid.r) {
            return true;
        } else {
            return false;
        }
    }

    this.shoot = function (velocity, shootmod) {
        var lcolor = velocity > 0 ? 'rgb(255,255,0)' : 'rgb(255,0,0)';
        if (shootmod === 1) {
            let position = this.pos.copy();
            position.add(p5.Vector.fromAngle(this.angle).mult(this.r));
            lasers.push(new Laser(position, this.angle, p5.Vector.fromAngle(this.angle).mult(this.vel.mag() + velocity), lcolor));
        } else if (shootmod === 2) {
            let position1 = this.pos.copy();
            position1.add(p5.Vector.fromAngle(this.angle + HALF_PI).mult(this.r / 2));
            let position2 = this.pos.copy();
            position2.add(p5.Vector.fromAngle(this.angle - HALF_PI).mult(this.r / 2));
            lasers.push(new Laser(position1, this.angle, p5.Vector.fromAngle(this.angle).mult(this.vel.mag() + velocity), lcolor));
            lasers.push(new Laser(position2, this.angle, p5.Vector.fromAngle(this.angle).mult(this.vel.mag() + velocity), lcolor));
        } else if (shootmod === 3) {
            let position = this.pos.copy();
            position.add(p5.Vector.fromAngle(this.angle).mult(this.r));
            lasers.push(new Laser(position, this.angle, p5.Vector.fromAngle(this.angle).mult(this.vel.mag() + velocity), lcolor));
            let position1 = this.pos.copy();
            position1.add(p5.Vector.fromAngle(this.angle).mult(this.r));
            let position2 = this.pos.copy();
            position2.add(p5.Vector.fromAngle(this.angle).mult(this.r));
            lasers.push(new Laser(position1, this.angle + PI/8, p5.Vector.fromAngle(this.angle).mult(this.vel.mag() + velocity), lcolor));
            lasers.push(new Laser(position2, this.angle - PI/8, p5.Vector.fromAngle(this.angle).mult(this.vel.mag() + velocity), lcolor));
        }
    }

    var pulseCount = 0;

    this.pulse = function() {
        if (pulseCount < 2) {
            var pulsecolor = 'rgb(0,255,127)';
            pulseCount++;
            for (let i = 0; i < 360; i += 10) {
                let position = this.pos.copy();
                let laser = new Laser(position, 0, createVector(0, 0), pulsecolor);
                laser.vel = p5.Vector.fromAngle(this.angle + radians(i)).mult(2);
                lasers.push(laser);
            }
        }
    }

    var bombwallCount = 0;

    this.bombwall = function() {
        if (bombwallCount < 1) {
            var bombcolor = 'rgb(255,0,255)';
            bombwallCount++;
            var i = 1;
            var position = this.pos.copy();
            position.add(p5.Vector.fromAngle(this.angle).mult(i * this.r));
            while (position.x > 0 && position.x < width && position.y > 0 && position.y < height) {
                let bomb = new Laser(position, 0, createVector(0, 0), bombcolor);
                bomb.vel = createVector(0, 0);
                bomb.isbomb = true;
                lasers.push(bomb);
                i += 5;
                position = this.pos.copy();
                position.add(p5.Vector.fromAngle(this.angle).mult(i * this.r));
            }
        }
    }

    var nukeCount = 0;

    this.nuke = function() {
        if (nukeCount < 3) {
            let nukecolor = 'rgb(255,178,102)';
            let position = this.pos.copy();
            position.add(p5.Vector.fromAngle(this.angle).mult(this.r));
            let nuke = new Laser(position, this.angle, createVector(0, 0), nukecolor);
            nuke.isnuke = true;
            nuke.weight = 6;
            nuke.vel = p5.Vector.fromAngle(this.angle).mult(15);
            lasers.push(nuke);
            nukeCount++;
        }
    }
}
