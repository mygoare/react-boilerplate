import React from 'react'

var Canvas = React.createClass({
    displayName: 'Canvas',
    propTypes: {
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        onDraw: React.PropTypes.func,
    },
    getDefaultProps: function() {
      return {
          width: 300,
          height: 150,
          onDraw: function(){console.log('draw an empty canvas...')}
      }
    },
    componentWillReceiveProps: function(props) {
        var {width, height, onDraw} = props;

        this.canvas.width = width;
        this.canvas.height = height;

        if (onDraw) onDraw(this.ctx);
    },
    componentDidMount: function() {
        var {width, height} = this.props;

        var canvas = this.canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';

        this.refs.container.appendChild(canvas);

        var ctx = this.ctx = canvas.getContext('2d');

        canvas.width = width;
        canvas.height = height;

        this.props.onDraw(ctx)
    },
    render: function() {
        var {width, height} = this.props;

        var containerStyles = {
            width,
            height,
            position: 'relative',
            overflow: 'hidden'
        };

        return (
            <div style={containerStyles} ref="container"></div>
        )
    }
});

function CanvasRect(props) {
    var {width, height} = props;

    var DrawRect = function(ctx) {
        // do what you want using canvas & ctx in this func
        ctx.fillStyle = 'red';
        ctx.fillRect(10, 10, 400, 200);
    };

    return (
        <Canvas width={width} height={height} onDraw={DrawRect}/>
    )
}


export {Canvas, CanvasRect}