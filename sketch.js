function setup() {
    createCanvas(600, 400);

    droneRadius = 0.5;
    droneListeningDistance = 28;

    showLines = false;

    resourcesCount = 2;
    resourceRadius = 10;
    resourceLabels = ['a', 'b', 'c', 'd'];
    resourceColors = [color(200, 10, 10), color(10, 200, 10), color(10, 10, 200), color(150, 200, 200)];
    resourceLocations = [
        createVector(0.2 * width, 0.2 * height),
        createVector(0.8 * width, 0.8 * height),
        createVector(0.2 * width, 0.8 * height),
        createVector(0.8 * width, 0.2 * height)
    ];

    showLightningButton = createButton('Toggle lines');
    showLightningButton.position(50, 25);
    showLightningButton.mouseClicked(toggleLines);

    restartButton = createButton('Restart');
    restartButton.position(150, 25);
    restartButton.mouseClicked(start);

    slider = createSlider(0, 60, droneListeningDistance, 1);
    slider.position(225, 25)
    slider.style('width', '100px');

    decreaseResourcesButton = createButton('- Resource');
    decreaseResourcesButton.position(350, 25);
    decreaseResourcesButton.mouseClicked(decreaseResourceCount);

    increaseResourcesButton = createButton('+ Resource');
    increaseResourcesButton.position(450, 25);
    increaseResourcesButton.mouseClicked(increaseResourceCount);

    this.start();
}

function start() {
    resources = Array(resourcesCount);
    for (let i = 0; i < resourcesCount; i++) {
        resources[i] = new Resource(resourceLabels[i], resourceColors[i], resourceLocations[i]);
    }

    drones = Array(2000);
    for (let i = 0; i < drones.length; i++) {
        drones[i] = new Drone();
        while (drones[i].checkForResourceCollision() !== null) {
            drones[i] = new Drone();
        }
    }
}

function draw() {
    background(100);

    stroke(255);
    fill(255);
    textSize(14);
    text('Listening distance = ' + slider.value(), width - 90, 25);

    droneListeningDistance = slider.value();

    stroke(100);
    fill('rgba(218, 112, 214, 0.25)');
    circle(width - 30 - droneListeningDistance/2, 35 + droneListeningDistance/2, droneListeningDistance);

    for (let r of resources) {
        r.show();
    }

    for (let d of drones) {
        d.move();
    }

    let newAnnouncement = false;
    for (let drone of drones) {
        if (drone.announcing) {
            newAnnouncement = drone.listenToMe() && newAnnouncement;
        }
    }
    while (newAnnouncement) {
        for (let drone of drones) {
            if (drone.announcing) {
                newAnnouncement = drone.listenToMe() && newAnnouncement;
            }
        }
    }

    for (let d of drones) {
        d.show();
    }
}

function toggleLines() {
    showLines = !showLines;
}

function decreaseResourceCount() {
    if (resourcesCount > 2) {
        resourcesCount--;
        start();
    }
}

function increaseResourceCount() {
    if (resourcesCount < 4) {
        resourcesCount++;
        start();
    }
}