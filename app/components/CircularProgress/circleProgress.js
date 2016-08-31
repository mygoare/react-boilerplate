import React from 'react'

function isDefined(variable)
{
    if (variable === undefined) return false

    return typeof variable !== typeof undefined
}

function toRadians (degree)
{
    return degree * (Math.PI / 180);
}

function toDegrees (radians)
{
    return radians * 180 / Math.PI;
}

var CircleProgress = React.createClass({
    displayName: 'CircleProgress',
    getInitialState: function()
    {
        return {
            bg: null,
            fg: null
        }
    },
    getDefaultProps: function()
    {
        return {
            value           : undefined,
            min             : 0,
            max             : 100,
            radius          : 60,
            thickness       : 4,
            arc             : 180,
            bgStrokeColor   : '#ddd',
            fgStrokeColor   : ['#bbb'],
            lineCap         : 'butt',  // 'butt', 'round', 'square'
            colorGradient   : false,
            clip            : false,
            onChange        : function(){},
            foreground      : '',
            background      : '',
        }
    },
    propTypes:
    {
        value           : React.PropTypes.number,
        min             : React.PropTypes.number,
        max             : React.PropTypes.number,
        radius          : React.PropTypes.number,
        thickness       : React.PropTypes.number,
        arc             : React.PropTypes.number,
        bgStrokeColor   : React.PropTypes.string,
        fgStrokeColor   : React.PropTypes.oneOfType([
                            React.PropTypes.object,
                            React.PropTypes.array
                          ]),
        lineCap         : React.PropTypes.string,
        colorGradient   : React.PropTypes.bool,
        clip            : React.PropTypes.bool,
        onChange        : React.PropTypes.func,
        foreground      : React.PropTypes.string,
        background      : React.PropTypes.string,
    },
    componentDidMount: function()
    {
        var props = this.props;
        var {foreground, background} = props;

        // load fg & bg async first
        var self = this;

        self.loadImage(foreground, 'fg');
        self.loadImage(background, 'bg');

        // do NOT put canvas in render function, avoid canvas be rendered every time.
        self.createCanvas();

        self.setCanvasDimension(props);

        self.draw(props);
    },
    componentWillReceiveProps: function(props)
    {
        this.setCanvasDimension(props);
        this.draw(props);
    },
    loadImage: function(src, key)
    {
        var self = this;
        if (src !== '')
        {
            var img = new Image();
            img.src = src;

            img.onload = function() {
                switch (key)
                {
                    case 'bg':
                        self.setState({bg: src});
                        break;
                    case 'fg':
                        self.setState({fg: src});
                        break;
                }
            }
        }

    },
    createCanvas: function()
    {
        var canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        this.refs.bg.parentNode.insertBefore(canvas, this.refs.bg.nextSibling);

        this.canvas = canvas;
        this.ctx    = canvas.getContext('2d');
    },
    setCanvasDimension: function(props)
    {
        var {width, height} = this.calcDimension(props);

        this.canvas.width  = width;
        this.canvas.height = height;
    },
    draw: function(props)
    {
        var {thickness, lineCap, value, onChange} = props;

        // clear before redraw, clear a maximum area
        this.ctx.clearRect(0, 0, 100000, 100000);

        this.ctx.beginPath();
        this.ctx.lineCap = lineCap;
        this.ctx.lineWidth = thickness;
        this.ctx.save();

        // draw arc
        this.drawArc(props);

        this.ctx.restore(); // restore the origin

        // draw empty arc
        this.drawEmptyArc(props);

        if (onChange)
            onChange();
    },
    drawEmptyArc: function(props)
    {
        var {bgStrokeColor, arc, radius, value, min, max, thickness} = props;

        if (isDefined(value))
        {
            var {width, height} = this.calcDimension(props);
            var x = width / 2.0,
                y = height / 2.0;

            var r = radius - thickness / 2.0;

            var startAngle = toRadians((360 - arc)/2 + 90);

            var percentage = (value - min) / (max - min) * 100;

            this.ctx.beginPath();
            this.ctx.strokeStyle = bgStrokeColor;
            this.ctx.arc(x, y, r, startAngle + toRadians(arc) * percentage / 100, startAngle + toRadians(arc));
            this.ctx.stroke();
            this.ctx.closePath();
            this.ctx.restore();
        }

    },
    calcFgStrokeColor: function(obj)
    {
        var colorArr = [];
        Object.keys(obj).map(function(key, index){
            var n = obj[key];

            for (var i = 0; i < n; i++)
                colorArr.push(key)
        });

        return colorArr;
    },
    drawArc: function(props)
    {
        var {value, fgStrokeColor, arc, colorGradient, radius, thickness, min, max} = props;

        var {width, height} = this.calcDimension(props);
        var x = width / 2.0,
            y = height / 2.0;

        var r = radius - thickness / 2.0;

        var arcRadians = toRadians(arc);

        var startAngle = toRadians((360 - arc)/2 + 90);

        var colors = Array.isArray(fgStrokeColor) ? fgStrokeColor : this.calcFgStrokeColor(fgStrokeColor);

        var percentage = isDefined(value) ? (value - min) / (max - min) * 100 : 100;

        this.ctx.beginPath();
        this.ctx.arc(x, y, radius + 2, startAngle, startAngle + toRadians(arc) * percentage / 100);
        this.ctx.lineTo(x, y);
        this.ctx.clip();

        // draw bg to decrease the splits
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#b9b9b9';
        this.ctx.arc(x, y, r, startAngle, startAngle + arcRadians);
        this.ctx.stroke();
        this.ctx.closePath();
        // draw bg to decrease the splits

        this.ctx.save();

        if (colors.length == 1)
        {
            this.ctx.beginPath();

            this.ctx.strokeStyle = colors[0];
            this.ctx.arc(x, y, r, startAngle, startAngle + arcRadians);

            this.ctx.stroke();
            this.ctx.closePath();
        }
        else
        {
            var partLength = colorGradient ? arcRadians / (colors.length -1) : arcRadians / colors.length;

            var gradient = null,
                startColor = null,
                endColor = null;

            for (var i = 0; i < colors.length; i++)
            {
                this.ctx.beginPath();

                var arcFill;
                if (colorGradient)
                {
                    // less one iteration
                    if (i + 1 == colors.length) continue;

                    startColor = colors[i];
                    endColor   = colors[(i + 1) % colors.length];

                    var xStart = x + Math.cos(startAngle) * r;
                    var xEnd   = x + Math.cos(startAngle + partLength) * r;
                    var yStart = y + Math.sin(startAngle) * r;
                    var yEnd   = y + Math.sin(startAngle + partLength) * r;

                    gradient = this.ctx.createLinearGradient(xStart, yStart, xEnd, yEnd);
                    gradient.addColorStop(0, startColor);
                    gradient.addColorStop(1.0, endColor);

                    arcFill = gradient;
                }
                else
                {
                    arcFill = colors[i];
                }

                this.ctx.strokeStyle = arcFill;
                this.ctx.arc(x, y, r, startAngle, startAngle + partLength);

                this.ctx.stroke();
                this.ctx.closePath();

                startAngle += partLength;
            }
        }

        this.ctx.restore();

    },
    calcDimension: function(props)
    {
        var {radius, thickness, arc, clip} = props;

        var R = radius;

        if (clip)
        {
            if (arc < 180)
            {
                return {
                    width: R * Math.sin(toRadians(arc/2)) * 2,
                    height: 2 * R
                }
            }
            else
            {
                return {
                    width : 2 * R,
                    height: 2 * R
                }
            }
        }
        else
        {
            return {
                width : 2 * R,
                height: 2 * R
            }
        }
    },
    render: function()
    {
        var props = this.props;
        var {clip, arc, radius, thickness} = props;
        var containerWidth, containerHeight;

        var R = radius;

        var {width, height} = this.calcDimension(props);

        if (clip)
        {
            if (arc > 180)
            {
                containerWidth  = 2 * R;
                containerHeight = Math.cos(toRadians((360 - arc)/2)) * R + R;
            }
            else
            {
                containerWidth  = R * Math.sin(toRadians(arc/2)) * 2;
                containerHeight = R - (R - thickness) * Math.cos(toRadians(arc/2));
            }
        }
        else
        {
            containerWidth  = width;
            containerHeight = height;
        }

        var containerStyle = {
            width   : containerWidth,
            height  : containerHeight,
            position: 'relative',
            overflow: 'hidden',
            // backgroundColor: '#ccc', // test
        };

        return (
            <div ref="container" style={containerStyle} >
                <div ref="bg" style={{position: 'absolute', lineHeight: 0}}>
                    <img src={this.state.bg} />
                </div>
                <div ref="fg" style={{position: 'absolute', lineHeight: 0}}>
                    <img src={this.state.fg} />
                </div>
            </div>
        )
    }
});

import {Canvas} from '../Canvas/base'

function CircleProgress2 (props) {
    function calcDimension(props) {
        var {radius, thickness, arc, clip} = props;

        var R = radius;

        if (clip)
        {
            if (arc < 180)
            {
                return {
                    width: R * Math.sin(toRadians(arc/2)) * 2,
                    height: 2 * R
                }
            }
            else
            {
                return {
                    width : 2 * R,
                    height: 2 * R
                }
            }
        }
        else
        {
            return {
                width : 2 * R,
                height: 2 * R
            }
        }
    }

    function DrawCircleProgress(ctx) {
        // do what you want using canvas & ctx in this func

        function calcFgStrokeColor(obj) {
            var colorArr = [];
            Object.keys(obj).map(function(key, index){
                var n = obj[key];

                for (var i = 0; i < n; i++)
                    colorArr.push(key)
            });

            return colorArr;
        }

        function drawArc(props) {
            var {value, fgStrokeColor, arc, colorGradient, radius, thickness, min, max} = props;

            var {width, height} = calcDimension(props);
            var x = width / 2.0,
                y = height / 2.0;

            var r = radius - thickness / 2.0;

            var arcRadians = toRadians(arc);

            var startAngle = toRadians((360 - arc)/2 + 90);

            var colors = Array.isArray(fgStrokeColor) ? fgStrokeColor : calcFgStrokeColor(fgStrokeColor);

            var percentage = isDefined(value) ? (value - min) / (max - min) * 100 : 100;

            ctx.beginPath();
            ctx.arc(x, y, radius + 2, startAngle, startAngle + toRadians(arc) * percentage / 100);
            ctx.lineTo(x, y);
            ctx.clip();

            // draw bg to decrease the splits
            ctx.beginPath();
            ctx.strokeStyle = '#b9b9b9';
            ctx.arc(x, y, r, startAngle, startAngle + arcRadians);
            ctx.stroke();
            ctx.closePath();
            // draw bg to decrease the splits

            ctx.save();

            if (colors.length == 1)
            {
                ctx.beginPath();

                ctx.strokeStyle = colors[0];
                ctx.arc(x, y, r, startAngle, startAngle + arcRadians);

                ctx.stroke();
                ctx.closePath();
            }
            else
            {
                var partLength = colorGradient ? arcRadians / (colors.length -1) : arcRadians / colors.length;

                var gradient = null,
                    startColor = null,
                    endColor = null;

                for (var i = 0; i < colors.length; i++)
                {
                    ctx.beginPath();

                    var arcFill;
                    if (colorGradient)
                    {
                        // less one iteration
                        if (i + 1 == colors.length) continue;

                        startColor = colors[i];
                        endColor   = colors[(i + 1) % colors.length];

                        var xStart = x + Math.cos(startAngle) * r;
                        var xEnd   = x + Math.cos(startAngle + partLength) * r;
                        var yStart = y + Math.sin(startAngle) * r;
                        var yEnd   = y + Math.sin(startAngle + partLength) * r;

                        gradient = ctx.createLinearGradient(xStart, yStart, xEnd, yEnd);
                        gradient.addColorStop(0, startColor);
                        gradient.addColorStop(1.0, endColor);

                        arcFill = gradient;
                    }
                    else
                    {
                        arcFill = colors[i];
                    }

                    ctx.strokeStyle = arcFill;
                    ctx.arc(x, y, r, startAngle, startAngle + partLength);

                    ctx.stroke();
                    ctx.closePath();

                    startAngle += partLength;
                }
            }

            ctx.restore();
        }

        function drawEmptyArc(props) {
            var {bgStrokeColor, arc, radius, value, min, max, thickness} = props;

            if (isDefined(value))
            {
                var {width, height} = calcDimension(props);
                var x = width / 2.0,
                    y = height / 2.0;

                var r = radius - thickness / 2.0;

                var startAngle = toRadians((360 - arc)/2 + 90);

                var percentage = (value - min) / (max - min) * 100;

                ctx.beginPath();
                ctx.strokeStyle = bgStrokeColor;
                ctx.arc(x, y, r, startAngle + toRadians(arc) * percentage / 100, startAngle + toRadians(arc));
                ctx.stroke();
                ctx.closePath();
                ctx.restore();
            }
        }

        function draw(props) {
            var {thickness, lineCap, value, onChange} = props;

            // clear before redraw, clear a maximum area
            ctx.clearRect(0, 0, 100000, 100000);

            ctx.beginPath();
            ctx.lineCap = lineCap;
            ctx.lineWidth = thickness;
            ctx.save();

            // draw arc
            drawArc(props);

            ctx.restore(); // restore the origin

            // draw empty arc
            drawEmptyArc(props);
        }

        draw(props);
    }

    var {value, min, max, radius, thickness, arc, bgStrokeColor, fgStrokeColor, lineCap, colorGradient, clip} = props;

    var canvasWidth, canvasHeight;
    var {width, height} = calcDimension(props);
    var R = radius;

    if (clip)
    {
        if (arc > 180)
        {
            canvasWidth  = 2 * R;
            canvasHeight = Math.cos(toRadians((360 - arc)/2)) * R + R;
        }
        else
        {
            canvasWidth  = R * Math.sin(toRadians(arc/2)) * 2;
            canvasHeight = R - (R - thickness) * Math.cos(toRadians(arc/2));
        }
    }
    else
    {
        canvasWidth  = width;
        canvasHeight = height;
    }

    return (
        <Canvas width={canvasWidth} height={canvasHeight} onDraw={DrawCircleProgress}/>
    )
}

export {CircleProgress, CircleProgress2}
