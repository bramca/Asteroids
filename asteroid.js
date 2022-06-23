function Asteroid(pos) {
    this.r = random(30, 70);
    this.asteroidcolor = 'rgb(' + floor(random(100, 150)) + ',' +
                                floor(random(100, 150)) + ',' +
                                floor(random(100, 150)) + ')';
    if (pos) {
        this.pos = pos;
    } else {
        this.pos = createVector(random(width), random(height));
        while (dist(this.pos.x, this.pos.y, ship.pos.x, ship.pos.y) < this.r + ship.r) {
            this.pos = createVector(random(width), random(height));
        }
    }
    this.vel = p5.Vector.random2D().mult(random(1, 3)); // createVector(random(-3, 3), random(-3, 3));
    this.vertices = floor(random(8, 16));
    this.offset = [];

    for (let i = 0; i < this.vertices; i++) {
        this.offset[i] = random(-15, 15);
    }

    this.render = function () {
        push();
        translate(this.pos.x, this.pos.y);
        fill(this.asteroidcolor);
        beginShape();
        for (let i = 0; i < this.vertices ; i++) {
            let angle = map(i, 0, this.vertices, 0, TWO_PI);
            let x = (this.r + this.offset[i]) * cos(angle);
            let y = (this.r + this.offset[i]) * sin(angle);
            vertex(x, y);
        }
        endShape(CLOSE);
        pop();
    }

    this.update = function () {
        this.pos.add(this.vel);

        if (this.pos.x + this.r < 0) {
            this.pos.x = width + this.r;
        } else if (this.pos.x - this.r > width) {
            this.pos.x = 0 - this.r;
        } else if (this.pos.y + this.r < 0) {
            this.pos.y = height + this.r;
        } else if (this.pos.y - this.r > height) {
            this.pos.y = 0 - this.r;
        }
    }

    this.break = function () {
        var smallerasteroids = [];
        for (let i = 0; i < floor(this.r / 10); i++) {
            let a = new Asteroid(this.pos.copy());
            a.vel.setMag(this.vel.mag());
            a.vel.mult(random() * 0.3 + 1.1);
            a.r = floor(this.r / 2);
            a.vertices = floor(random(4, 8));
            if (a.r > 10) {
                smallerasteroids.push(a);
            }
        }
        return smallerasteroids;
    }
}
