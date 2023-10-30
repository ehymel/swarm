function setup() {
    createCanvas(600, 400);

    drones = Array(2000);
    droneRadius = 0.5;
    droneListeningDistance = 28;

    showLines = false;

    resources = Array(2);
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
    slider.position(250, 25)
    slider.style('width', '100px');

    this.start();
}

function start() {

    for (let i = 0; i < 2; i++) {
        resources[i] = new Resource(resourceLabels[i], resourceColors[i], resourceLocations[i]);
    }

    // // make sure new resource is separated from first resource
    // while (resources[0].getLocation().dist(resources[1].getLocation()) < 10 * resourceRadius) {
    //     resources[1] = new Resource('B', color(10, 200, 10));
    // }

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
    textSize(16);
    text(slider.value(), width - 35, 25);

    droneListeningDistance = slider.value();

    for (let i = 0; i < resources.length; i++) {
        resources[i].show();
    }
    for (let i = 0; i < drones.length; i++) {
        drones[i].move();
    }

    let newAnnouncement = false;
    for (let i = 0; i < drones.length; i++) {
        if (drones[i].announcing) {
            newAnnouncement = drones[i].listenToMe() && newAnnouncement;
        }
    }
    while (newAnnouncement) {
        for (let i = 0; i < drones.length; i++) {
            if (drones[i].announcing) {
                newAnnouncement = drones[i].listenToMe() && newAnnouncement;
            }
        }
    }

    for (let i = 0; i < drones.length; i++) {
        drones[i].show();
    }
}

function toggleLines() {
    showLines = !showLines;
}
