import React from 'react'
import tinycolor from 'tinycolor2'

import './superlamp.scss'

//..............................................................................
function LightenColor(col, amt)
{
    return tinycolor(col).lighten(amt).toString();
}
//..............................................................................

//..............................................................................
function DarkenColor(col, amt)
{
    return tinycolor(col).darken(amt).toString();
}
//..............................................................................

//..............................................................................
function SuperLamp(props)
{
    var {color = 'red', value = 0, size = 36} = props;
    var superLampWrapperStyles = {},
        superLampStyles   = {},
        colorStyles       = {},
        maskStyles        = {},
        innerShadowStyles = {};

    function decorateSuperLamp(color, value)
    {
        var outerPadding = size * 0.4;

        // superLamp warpper
        superLampWrapperStyles.padding = outerPadding + 'px';

        // superLamp
        var blur = (value / 100) * outerPadding;
        var spread = (value / 100) * 1;
        superLampStyles.width     = size + 'px';
        superLampStyles.height    = size + 'px';
        // outer shadow
        superLampStyles.boxShadow = '0 0 ' + blur + 'px ' + LightenColor(color, 4);

        // color
        colorStyles.backgroundColor =  LightenColor(color, value * 0.4);

        // mask
        var whiteOpacity = 0.8; // min: 0.2
        var whiteRadius  = 4;   // min: 1
        var opacity = (value / 100) * 0.6 + 0.2;
        var radius  = (value / 100) * 3 + 1;
        maskStyles.background = 'radial-gradient(ellipse at center, ' +
            'rgba(255,255,255,' + opacity + ') 0%,' +
            'rgba(255,255,255,' + opacity + ') ' + radius + '%,' +
            'rgba(255,255,255,0) 60%,' +
            'rgba(255,255,255,0) 100%)';

        // inner shadow
        innerShadowStyles.boxShadow = 'inset 0px 0px 2px 1px ' + DarkenColor('#000', value) + ', inset 0px 0px 4px 1px ' + DarkenColor(color, value * 0.05);

    }

    if (value == 0)
        color = '#666';

    decorateSuperLamp(color, value);

    return (
        <div className="super-lamp-wrapper" style={superLampWrapperStyles}>
            <div className="super-lamp" style={superLampStyles}>
                <div className="color" style={colorStyles}></div>
                <div className="mask" style={maskStyles}></div>
                <div className="inner-shadow" style={innerShadowStyles}></div>
            </div>
        </div>

    )
}
//..............................................................................

export {SuperLamp}