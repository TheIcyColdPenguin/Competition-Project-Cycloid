"use strict";
class Cycloid {
    constructor(radius, multiplier) {
        this.radius = radius;
        this.multiplier = multiplier;
        this.animationCounter = 0;
        this.graphics = createGraphics(
            canvases.drawingCanvas.width,
            canvases.drawingCanvas.height,
            WEBGL
        );
        this.graphics.background(theme.bgColor);
        this.graphics.stroke(theme.fgColor);

        this.points = [];
        this._createDrawingPoints();
    }

    _createDrawingPoints() {
        this.points = [];
        angleMode(DEGREES);
        for (let index = 0, theta = 0; theta < 360; theta++, index++) {
            let xPoint = this.radius * cos(theta);
            let yPoint = this.radius * sin(theta);
            this.points[index] = { x: xPoint, y: yPoint };
        }
    }

    updateSelf(rad, mult) {
        this.radius = rad;
        this.multiplier = mult;
        this.animationCounter = 0;
        this._createDrawingPoints();
        this.drawBackground();
    }

    drawBackground() {
        this.graphics.background(theme.bgColor);
    }

    drawCycloid(isAnimatedCheckbox) {
        //check whether the cycloid is to be animated and call respective function
        return isAnimatedCheckbox.checked()
            ? this._animateCycloid()
            : this._drawFinishedCycloid();
    }

    _drawFinishedCycloid() {
        //draw the cycloid all at once

        for (let i = 0; i < this.points.length; i++) {
            this._drawLine(i);
        }
        return this.graphics;
    }
    _animateCycloid() {
        //draw the cycloid one line at a time
        // ellipse(0, 0, this.radius * 2);
        this._drawLine(this.animationCounter);
        this.animationCounter++;
        return this.graphics;
    }

    _drawLine(index) {
        let { x1, y1, x2, y2 } = this._getLineCoords(index);
        this.graphics.line(x1, y1, x2, y2);
    }

    _getLineCoords(index1) {
        index1 -= floor(index1 / this.points.length) * this.points.length;
        // index1 = index1 % (this.points.length);

        let index2 = index1 * this.multiplier;
        //same thing for index2
        index2 -= floor(index2 / this.points.length) * this.points.length;

        let line_coords = {
            x1: this.points[index1].x,
            y1: this.points[index1].y,
            x2: this.points[index2].x,
            y2: this.points[index2].y,
        };
        return line_coords;
    }
}
