class Resource {
    constructor(label, resourceColor, location) {
        this.label = label;
        this.resourceColor = resourceColor;
        this.location = location;

        this.range = new Circle(this.location.x, this.location.y, resourceRadius + droneRadius);
        // this.range = new Rectangle(this.location.x, this.location.y, resourceRadius + droneRadius, resourceRadius + droneRadius);
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