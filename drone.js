class Drone {
    constructor() {
        this.maxVelocity = .5;
        angleMode(DEGREES);
        this.maxAngleVariation = 6;

        this.droneColor = color(255);
        this.announcing = false;
        this.targetResourceIndex = null;

        this.stepCount = [];
        for (let i = 0; i < resources.length; i++) {
            this.stepCount[i] = 0;
        }

        this.location = createVector(
            int(random(0.3 * width, 0.7 * width)),
            int(random(0.3 * height, 0.7 * height))
        );

        this.velocity = createVector(
            random(-this.maxVelocity, this.maxVelocity),
            random(-this.maxVelocity, this.maxVelocity)
        );
    }

    move() {
        // update step count
        for (let i = 0; i < resources.length; i++) {
            this.stepCount[i] += 1;
        }

        this.velocity.rotate(random(-this.maxAngleVariation, this.maxAngleVariation));

        this.location.add(this.velocity);

        // don't let item go off screen
        if (this.location.x - droneRadius < 0) {
            this.velocity.x *= -1;
        }
        if (this.location.x + droneRadius > width) {
            this.velocity.x *= -1;
        }
        if (this.location.y - droneRadius < 0) {
            this.velocity.y *= -1;
        }
        if (this.location.y + droneRadius > height) {
            this.velocity.y *= -1;
        }
    }

    checkForResourceCollision(qtree) {
        // only need to check items within quadtree boundaries
        for (let i = 0; i < resources.length; i++) {
            let nearbyPoints = qtree.queryRange(resources[i].boundary);

            for (let point of nearbyPoints) {
                if (this === point.userData) {
                    this.announcing = true;
                    this.handleResourceCollision(collidedResourceIndex);
                    return i;
                }
            }
        }

        return null;
    }

    handleResourceCollision(collidedResourceIndex) {
        // change appropriate step count to zero
        this.stepCount[collidedResourceIndex] = 0;

        // announce location for others to listen
        this.announcing = true;

        if (null === this.targetResourceIndex || collidedResourceIndex === this.targetResourceIndex) {
            // reverse course
            this.velocity.rotate(180);

            // assure that drone is not stuck "inside" resource
            while (this.checkForResourceCollision(qtree) !== null) {
                this.location.add(this.velocity);
            }

            // set new target resource
            this.targetResourceIndex = (collidedResourceIndex + 1) % resources.length;

            // change color to match new target resource
            this.droneColor = resources[this.targetResourceIndex].resourceColor;
        }
    }

    listenToMe() {
        let newAnnoucement = false;
        // let listeningRange = new Circle(this.location.x, this.location.y, droneListeningDistance + droneRadius);
        let listeningRange = new Rectangle(this.location.x, this.location.y, droneListeningDistance + droneRadius, droneListeningDistance + droneRadius);
        let points = qtree.queryRange(listeningRange);

        for (let point of points) {
            let listeningDrone = point.userData;

            // ignore self
            if (this === listeningDrone) {
                continue;
            }

            // ignore if too far away
            if (this.location.dist(listeningDrone.location) > droneListeningDistance) {
                continue;
            }

            // update step count of listening drone if indicated
            for (let j = 0; j < resources.length; j++) {
                if (this.stepCount[j] < listeningDrone.stepCount[j] - droneListeningDistance) {
                    listeningDrone.stepCount[j] = this.stepCount[j] + droneListeningDistance;
                    listeningDrone.announcing = true;

                    // if listening drone is not committed, then claim it for this resource
                    if (null === listeningDrone.targetResourceIndex) {
                        listeningDrone.targetResourceIndex = j;
                        listeningDrone.color = resources[j].color;
                    }

                    // if listening drone is looking for announced resource, then change direction towards announcing drone
                    if (j === listeningDrone.targetResourceIndex) {
                        let directionToAnnouncer = p5.Vector.sub(this.location, listeningDrone.location);
                        listeningDrone.velocity = directionToAnnouncer.setMag(random(this.maxVelocity));

                        this.displayConnection(listeningDrone, this);
                    } else {
                        this.displayConnection(listeningDrone, this,null);
                    }
                }
            }
        }
        this.announcing = false;

        return newAnnoucement;
    }

    show() {
        stroke(this.droneColor);
        fill(this.droneColor);
        ellipse(this.location.x, this.location.y, 2 * droneRadius, 2 * droneRadius);
    }

    displayConnection(drone1, drone2, targetResourceIndex) {
        if (!showLines) {
            return;
        }

        let lineColor = targetResourceIndex ? resources[targetResourceIndex].resourceColor : 'light grey';

        stroke(lineColor);
        line(drone1.location.x, drone1.location.y, drone2.location.x, drone2.location.y);
    }
}