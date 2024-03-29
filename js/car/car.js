class Car {
    constructor(x, y, width, height, controlBool, useBrain) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = 6;
        this.friction = 0.05;
        this.angle = 0;
        this.damaged = false;

        this.bestCar = false;

        if (controlBool || useBrain) {
            this.sensor = new Sensor(this);
            this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 6, 4]);
        }

        if (useBrain == true) {
            this.useBrain = true;
        }

        this.controls = new Controls(controlBool);
        if (!controlBool && !useBrain) {
            this.maxSpeed = 4;
        }
    }

    update(roadBorders, traffic) {
        if (!this.damaged) {
            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBorders, traffic);
        }
        if (this.sensor) {
            this.sensor.update(roadBorders, traffic);

            const OFFSETS = this.sensor.readings.map((s) =>
                s == null ? 0 : 1 - s.offset
            );
            const OUTPUTS = NeuralNetwork.feedForward(OFFSETS, this.brain);
            if (this.useBrain) {
                this.controls.forward = OUTPUTS[0];
                this.controls.left = OUTPUTS[1];
                this.controls.right = OUTPUTS[2];
                this.controls.reverse = OUTPUTS[3];
            }
        }
    }

    draw(ctx, color, drawSensor = false) {
        if (this.damaged) {
            ctx.fillStyle = "gray";
        } else {
            ctx.fillStyle = color;
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);

        for (let i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }

        ctx.fill();

        if (this.sensor && drawSensor) {
            this.sensor.draw(ctx);
        }
    }

    #move() {
        if (this.controls.forward) {
            this.speed += this.acceleration;
        }

        if (this.controls.reverse) {
            this.speed -= this.acceleration;
        }

        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        }

        if (this.speed < -this.maxSpeed / 2) {
            this.speed = -this.maxSpeed / 2;
        }

        if (this.speed > 0) {
            this.speed -= this.friction;
        }

        if (this.speed < 0) {
            this.speed += this.friction;
        }

        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }

        if (this.speed != 0) {
            const FLIP = this.speed > 0 ? 1 : -1;

            if (this.controls.left) {
                this.angle += 0.03 * FLIP;
            }

            if (this.controls.right) {
                this.angle -= 0.03 * FLIP;
            }
        }
        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
    }

    #assessDamage(roadBorders, traffic) {
        for (var i = 0; i < roadBorders.length; i++) {
            if (polysIntersect(this.polygon, roadBorders[i])) {
                return true;
            }
        }

        for (var i = 0; i < traffic.length; i++) {
            if (polysIntersect(this.polygon, traffic[i].polygon)) {
                return true;
            }
        }

        return false;
    }

    #createPolygon() {
        const POINTS = [];

        const RADIUS = Math.hypot(this.width, this.height) / 2;
        const ALPHA = Math.atan2(this.width, this.height);

        POINTS.push({
            x: this.x - Math.sin(this.angle + ALPHA) * RADIUS,
            y: this.y - Math.cos(this.angle + ALPHA) * RADIUS,
        });

        POINTS.push({
            x: this.x - Math.sin(this.angle - ALPHA) * RADIUS,
            y: this.y - Math.cos(this.angle - ALPHA) * RADIUS,
        });

        POINTS.push({
            x: this.x - Math.sin(Math.PI + this.angle + ALPHA) * RADIUS,
            y: this.y - Math.cos(Math.PI + this.angle + ALPHA) * RADIUS,
        });

        POINTS.push({
            x: this.x - Math.sin(Math.PI + this.angle - ALPHA) * RADIUS,
            y: this.y - Math.cos(Math.PI + this.angle - ALPHA) * RADIUS,
        });

        return POINTS;
    }
}
