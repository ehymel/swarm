class Resource {
    constructor(label, resourceColor, location) {
        this.label = label;
        this.resourceColor = resourceColor;
        this.location = location;
        // this.create();
    }

    create() {
        this.location = createVector(
            int(random(2 * this.radius, width - 2 * this.radius)),
            int(random(2 * this.radius, width - 2 * this.radius))
        );
    }

    getLocation() {
        return this.location;
    }

    getColor() {
        return this.resourceColor;
    }

    show() {
        stroke(this.resourceColor);
        fill(this.resourceColor);
        ellipse(this.location.x, this.location.y, 2 * resourceRadius, 2 * resourceRadius);

        fill(255);
        textAlign(CENTER, CENTER);
        textSize(24);
        text(this.label, this.location.x, this.location.y);
    }
}