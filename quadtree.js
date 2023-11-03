class Point {
    constructor(x, y, userData) {
        this.location = createVector(x, y);
        this.userData = userData;
    }
}

class Rectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    contains(point) {
        return point.location.x >= this.x - this.w &&
            point.location.x < this.x + this.w &&
            point.location.y <= this.y + this.h &&
            point.location.y > this.y - this.h;
    }

    intersects(range) {
        return !(range.x - range.w > this.x + this.w ||
            range.x + range.w < this.x - this.w ||
            range.y - range.h > this.y + this.h ||
            range.y + range.h < this.y - this.w);
    }
}

class Circle {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.rSquared = r * r;
    }

    contains(point) {
        return dist(this.x, this.y, point.location.x, point.location.y) <= this.r;
    }

    intersects(range) {
        // need to check this
        return !(range.x - range.w > this.x + this.r ||
            range.x + range.w < this.x - this.r ||
            range.y - range.h > this.y + this.r ||
            range.y + range.h < this.y - this.r);
    }
}

class QuadTree {
    constructor(boundary, capacity) {
        this.boundary = boundary;
        this.capacity = capacity;
        this.points = [];
        this.divided = false;
    }

    insert(point) {
        if (!this.boundary.contains(point)) {
            return false;
        }

        if (this.divided) {
            return this.insertIntoDivisions(point);
        }

        if (this.points.length < this.capacity) {
            this.points.push(point);
            return true;
        }

        this.subdivide();

        // re-distribute points of this container to its subdivisions
        let pts = this.points;
        this.points = [];
        for (let p of pts) {
            this.insertIntoDivisions(p);
        }

        this.insertIntoDivisions(point);
    }

    insertIntoDivisions(point) {
        return this.northWest.insert(point) ||
            this.northEast.insert(point) ||
            this.southEast.insert(point) ||
            this.southWest.insert(point);
    }

    subdivide() {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w;
        let h = this.boundary.h;

        let nw = new Rectangle(x - w/2, y - h/2, w/2, h/2);
        this.northWest = new QuadTree(nw, this.capacity);
        let ne = new Rectangle(x + w/2, y - h/2, w/2, h/2);
        this.northEast = new QuadTree(ne, this.capacity);
        let se = new Rectangle(x + w/2, y + h/2, w/2, h/2);
        this.southEast = new QuadTree(se, this.capacity);
        let sw = new Rectangle(x - w/2, y + h/2, w/2, h/2);
        this.southWest = new QuadTree(sw, this.capacity);

        this.divided = true;
    }

    queryRange(range, found) {
        if (!found) {
            found = [];
        }

        if (!this.boundary.intersects(range)) {
            return found;
        }

        for (let p of this.points) {
            if (range.contains(p)) {
                found.push(p);
            }
        }
        if (this.divided) {
            this.northEast.queryRange(range, found);
            this.northWest.queryRange(range, found);
            this.southEast.queryRange(range, found);
            this.southWest.queryRange(range, found);
        }

        return found;
    }

    show() {
        stroke(255);
        strokeWeight(1);
        noFill();
        rectMode(CENTER);
        rect(this.boundary.x, this.boundary.y, this.boundary.w * 2, this.boundary.h * 2);

        if (this.divided) {
            this.northWest.show();
            this.northEast.show();
            this.southEast.show()
            this.southWest.show()
        }

        for (let p of this.points) {
            strokeWeight(2);
            point(p.location.x, p.location.y);
        }
    }
}