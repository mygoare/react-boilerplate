import React from 'react'
// import Slider from 'react-superslider'
import Slider from './lib'

import './default.scss'

function decorateSlider(orientation, decorate) {
    var sliderDecorate = {},
        bgDecorate = {},
        fillDecorate = {},
        trackerDecorate = {},
        handleDecorate = {};

    var {
        trackerImageHorizontal,
        trackerImageVertical,
        trackerImageSize,

        trackerImageGap,

        trackerBackgroundH, trackerBackgroundV,
        fillBackgroundH, fillBackgroundV,

        trackerBorderRadius,

        handleImage, handleImageWidth, handleImageHeight,

    } = decorate;
    var handleImagePosTop        = (handleImageHeight - trackerImageSize)/2;
    var handleImagePosLeft       = (handleImageWidth - trackerImageSize)/2;
    var trackerImageInnerPadding = trackerImageGap - trackerBorderRadius;

    switch(orientation) {
        case 'horizontal':
            // sliderDecorate
            if (handleImagePosTop > 0) sliderDecorate.margin = handleImagePosTop + 'px 0';
            sliderDecorate.height = trackerImageSize + 'px';
            sliderDecorate.borderRadius = trackerBorderRadius + 'px';
            // bgDecorate
            bgDecorate.borderTop    = trackerImageSize/2 + 'px solid transparent';
            bgDecorate.borderBottom = trackerImageSize/2 + 'px solid transparent';
            bgDecorate.borderImage  = 'url('+trackerImageHorizontal+') '+trackerImageSize/2+' '+trackerImageGap+' stretch';
            bgDecorate.borderLeft   = trackerBorderRadius + 'px solid transparent';
            bgDecorate.borderRight  = trackerBorderRadius + 'px solid transparent';
            // fillDecorate
            fillDecorate.background = fillBackgroundH;
            fillDecorate.top    = trackerImageInnerPadding+'px';
            fillDecorate.bottom = trackerImageInnerPadding+'px';
            fillDecorate.left   = trackerImageInnerPadding+'px';
            fillDecorate.right  = trackerImageInnerPadding+'px';
            fillDecorate.borderRadius = trackerBorderRadius+'px';

            // trackerDecorate
            trackerDecorate.background = trackerBackgroundH;
            trackerDecorate.top    = trackerImageInnerPadding+'px';
            trackerDecorate.bottom = trackerImageInnerPadding+'px';
            trackerDecorate.left   = trackerImageInnerPadding+'px';
            trackerDecorate.right  = trackerImageInnerPadding+'px';
            trackerDecorate.borderRadius = trackerBorderRadius+'px';

            // handleDecorate
            handleDecorate.width = handleImageWidth+'px';
            handleDecorate.height = handleImageHeight+'px';
            handleDecorate.background = 'url("'+handleImage+'") no-repeat';
            handleDecorate.top = -handleImagePosTop+'px';
            break;
        case 'vertical':
            // sliderDecorate
            if (handleImagePosTop > 0) sliderDecorate.margin = '0 ' + handleImagePosTop + 'px';
            sliderDecorate.width = trackerImageSize + 'px';
            sliderDecorate.borderRadius = trackerBorderRadius + 'px';
            // bgDecorate
            bgDecorate.borderTop    = trackerBorderRadius + 'px solid transparent';
            bgDecorate.borderBottom = trackerBorderRadius + 'px solid transparent';
            bgDecorate.borderImage  = 'url('+trackerImageVertical+') '+trackerImageGap+' '+trackerImageSize/2+' stretch';
            bgDecorate.borderLeft   = trackerImageSize/2 + 'px solid transparent';
            bgDecorate.borderRight  = trackerImageSize/2 + 'px solid transparent';
            // fillDecorate
            fillDecorate.background = fillBackgroundV;

            fillDecorate.bottom = trackerImageInnerPadding+'px';
            fillDecorate.left   = trackerImageInnerPadding+'px';
            fillDecorate.right  = trackerImageInnerPadding+'px';
            fillDecorate.borderRadius = trackerBorderRadius+'px';

            // trackerDecorate
            trackerDecorate.background = trackerBackgroundV;

            trackerDecorate.top    = trackerImageInnerPadding+'px';
            trackerDecorate.bottom = trackerImageInnerPadding+'px';
            trackerDecorate.left   = trackerImageInnerPadding+'px';
            trackerDecorate.right  = trackerImageInnerPadding+'px';
            trackerDecorate.borderRadius = trackerBorderRadius+'px';

            // handleDecorate
            handleDecorate.width = handleImageWidth+'px';
            handleDecorate.height = handleImageHeight+'px';
            handleDecorate.background = 'url("'+handleImage+'") no-repeat';
            handleDecorate.left = -handleImagePosLeft+'px';
            break;
    }

    return {sliderDecorate, bgDecorate, fillDecorate, trackerDecorate, handleDecorate}
}

var SuperSliderStyles = {
    purple: {
        trackerImageHorizontal: 'https://ooo.0o0.ooo/2016/07/22/5791ef7a09271.png',
        trackerImageVertical: 'https://ooo.0o0.ooo/2016/07/22/5791e8150a3f9.png',
        trackerImageSize: 20,

        trackerImageGap: 9,

        trackerBackgroundH: '#eee',
        trackerBackgroundV: '#eee',
        fillBackgroundH: 'linear-gradient(to right, #a4a8da 0%,#2648a2 100%)',
        fillBackgroundV: 'linear-gradient(to top, #a4a8da 0%,#2648a2 100%)',

        trackerBorderRadius: 8,

        handleImage: 'https://img.vim-cn.com/a5/af894dce5bbf7d3f725c36eda0e8385975abec.png',
        handleImageWidth: 22,
        handleImageHeight: 24
    },
    inner: {
        trackerImageHorizontal: 'https://ooo.0o0.ooo/2016/07/26/57973ca008798.png',
        trackerImageVertical: 'https://ooo.0o0.ooo/2016/07/26/57973cc67dfae.png',
        trackerImageSize: 24,

        trackerImageGap: 12,

        trackerBackgroundH: '#bdbdbd',
        trackerBackgroundV: '#bdbdbd',
        fillBackgroundH: '#87c886',
        fillBackgroundV: '#87c886',

        trackerBorderRadius: 8,

        handleImage: 'https://ooo.0o0.ooo/2016/07/24/5795863e80f88.png',
        handleImageWidth: 18,
        handleImageHeight: 20
    }
};

var SuperSlider = React.createClass({
    displayName: 'SuperSlider',
    propTypes: {
        min: React.PropTypes.number,
        max: React.PropTypes.number,
        step: React.PropTypes.number,
        orientation: React.PropTypes.string,
        value: React.PropTypes.number,
        theme: React.PropTypes.string,
        decorate: React.PropTypes.object,
    },
    getDefaultProps: function()
    {
        return {
            min: 0,
            max: 100,
            step: 1,
            orientation: 'horizontal',
            value: 0,
            theme: '',
            decorate: SuperSliderStyles.purple
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
    },
    render: function()
    {
        var {min, max, step, orientation, theme, value, width, height, decorate} = this.props;

        if (theme == '') {
            var {sliderDecorate, bgDecorate, fillDecorate, trackerDecorate, handleDecorate} = decorateSlider(orientation, decorate);
        }

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
                    theme={theme}
                    orientation={orientation}
                    sliderDecorate={sliderDecorate}
                    bgDecorate={bgDecorate}
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

export {SuperSlider, SuperSliderStyles}
