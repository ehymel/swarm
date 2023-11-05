class Drone {
    constructor() {
        this.maxVelocity = .5;
        angleMode(DEGREES);
        this.maxAngleVariation = 6;

        this.droneColor = color(255);
        this.announcing = false;
        this.targetResourceIndex = null;
        this.point = null;

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

        this.location.add(this.velocity)

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

    // checkForResourceCollision() {
    //     for (let i = 0; i < resources.length; i++) {
    //         let qtree.queryRange())
    //         if (this.location.dist(resources[i].location) <= resourceRadius + droneRadius) {
    //             this.handleResourceCollision(i);
    //         }
    //     }
    // }

    handleResourceCollision(collidedResourceIndex) {
        this.stepCount[collidedResourceIndex] = 0;
        this.announcing = true;

        if (null === this.targetResourceIndex || collidedResourceIndex === this.targetResourceIndex) {
            this.velocity.rotate(180);
            this.location.add(this.velocity);
            this.point.location = this.location;

            this.targetResourceIndex = (collidedResourceIndex + 1) % resources.length;
            this.droneColor = resources[this.targetResourceIndex].resourceColor;
        }
    }

    listenToMe() {
        let newAnnoucement = false;

        // listeningRange should be a circle, however this really bogs down the process (as judged by frameRate() in browser console)
        // Using rectangle much faster and makes for a close approximation.
        let listeningRange = new Rectangle(this.location.x, this.location.y, droneListeningDistance + droneRadius, droneListeningDistance + droneRadius);
        // let listeningRange = new Circle(this.location.x, this.location.y, droneListeningDistance + droneRadius);
        let points = qtree.queryRange(listeningRange, []);

        for (let point of points) {
            let listeningDrone = point.userData;

            // ignore self
            if (this === listeningDrone) {
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