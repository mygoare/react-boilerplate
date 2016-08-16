import React from 'react'
// import Slider from 'react-superslider'
import Slider from './lib'

import './default.scss'

var SuperSlider = React.createClass({
    getDefaultProps: function()
    {
        return {
            min: 0,
            max: 100,
            step: 1,
            orientation: 'horizontal',
            value: 0,
            theme: 'default',
            fillDecorate: {},
            trackerDecorate: {},
        }
    },
    getInitialState: function()
    {
        return {value: this.props.value}
    },
    handleChange: function(value)
    {
        this.setState({
            value
        });

        console.log(value);
    },
    render: function()
    {
        var {min, max, step, orientation, theme, value, width, height, fillDecorate, trackerDecorate, handleDecorate} = this.props;

        var wrapperStyle = {};
        switch (orientation)
        {
            case 'horizontal':
                wrapperStyle.width = width;
                break;
            case 'vertical':
                wrapperStyle.height = height;
                break;
        }

        return (
            <div className="superslider-wrapper" style={wrapperStyle}>
                <Slider
                    min={min}
                    max={max}
                    step={step}
                    orientation={orientation}
                    theme={theme}
                    fillDecorate={fillDecorate}
                    trackerDecorate={trackerDecorate}
                    handleDecorate={handleDecorate}
                    value={this.state.value}
                    onChange={this.handleChange}
                    />
            </div>
        )
    }
});

export {SuperSlider}
