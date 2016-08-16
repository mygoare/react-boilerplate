// inspired by http://www.hongkiat.com/blog/svg-meter-gauge-tutorial/, https://github.com/wmartins/react-circular-progress
import React from 'react'

import './circularProgress.css'

function isDefined(variable)
{
    if (variable === undefined) return false

    return typeof variable !== typeof undefined
}

var toRadians = function (degree) {
    return degree * (Math.PI / 180);
};

var toDegrees = function (radians) {
    return radians * 180 / Math.PI;
}

function calcRadius(w, h, arc)
{
    var w_r = w / 2;
    var h_r = h / (1 + Math.cos(toRadians(arc)/2));

    console.log(w_r, h_r, Math.cos(toRadians(arc)/2.0), toRadians(arc));

    return (w_r < h_r) ? w_r : h_r;
}

var CircularProgress = React.createClass({
    getDefaultProps: function()
    {
        return {
            strokeWidth: 2,
            arc: 0,
            fgStrokeColor: 'green',
            bgStrokeColor: '#ddd',

            value: 50,
            min: 0,
            max: 100,

            // calculate radius
            // H = 2r - (r - r * Math.cos(arc/2)) = r + r * Math.cos(arc/2) = r * (1 + Math.cos(arc/2))
            // W = 2r
            // which radius is smaller, use it.
            width: 80,
            height: 80,
        }
    },
    render: function()
    {
        var {value, min, max, width, height, arc, strokeWidth, fgStrokeColor, bgStrokeColor} = this.props;
        strokeWidth = parseInt(strokeWidth);
        if (value < min || value > max) return;
        var percentage = 10;

        arc = 360 - arc;

        if (isDefined(value) && isDefined(min) && isDefined(max))
            percentage = (value - min) / (max - min) * 100

        var r = calcRadius(width, height, arc);

        const radius = r - strokeWidth / 2;
        const viewBox = `0 0 ${width} ${height}`;
        const dashArrayVal = radius * Math.PI * 2;
        const dashArray = [0, dashArrayVal * arc / 360, dashArrayVal].join(',');
        const dashOffset = [0, dashArrayVal * arc / 360 + ( dashArrayVal - (dashArrayVal * arc / 360) ) / 100 * percentage, dashArrayVal].join(',');

        // dashArrayVal * this.props.arc / 360 + ( dashArrayVal - (dashArrayVal * this.props.arc / 360) ) / 100 * percentage

        const rotateAngle = 90 - arc/2;

        const rotateArc = 'rotate('+rotateAngle+'deg)';

        return (
            <div
            style={{
                width: width,
                height: height,
                overflow: 'hidden',
            }}>
                <svg
                    className="CircularProgress"
                    width={r * 2}
                    height={r * 2}
                    style={{
                        transform: rotateArc,
                    }}>

                    <circle
                        className="CircularProgress-Bg"
                        cx={r}
                        cy={r}
                        r={radius}
                        strokeWidth={`${strokeWidth}px`}
                        style={{
                            stroke: fgStrokeColor,
                            strokeDasharray: dashArray
                        }} />


                    <circle
                        className="CircularProgress-Fg"
                        cx={r}
                        cy={r}
                        r={radius}
                        strokeWidth={`${strokeWidth + 0.8}px`}
                        style={{
                            stroke: bgStrokeColor,
                            strokeDasharray: dashOffset
                        }} />
                </svg>
            </div>
        );
    }
});

export {CircularProgress}
