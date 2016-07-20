import React from 'react'
import Slider from 'react-superslider'

import './default.scss'

var Volumn = React.createClass({
    getInitialState: function()
    {
        return {value: 10}
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
        return (
            <Slider
                orientation='vertical'
                value={this.state.value}
                onChange={this.handleChange}
                />
        )
    }
});

export {Volumn}
