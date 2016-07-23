import React from 'react'
import Slider from 'react-superslider'

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
            theme: 'default'
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
        var {min, max, step, orientation, theme, value, width, height} = this.props;

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
                    value={this.state.value}
                    onChange={this.handleChange}
                    />
            </div>
        )
    }
});

export {SuperSlider}
