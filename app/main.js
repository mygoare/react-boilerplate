import React from 'react'
import ReactDOM from 'react-dom'
import PubSub from 'pubsub-js'

import {Hello} from './components/Hello/Hello.js'


import CropperJS from 'react-cropperjs'

var Cropper = React.createClass({
    getDefaultProps: function()
    {
        return {
            src: null,
            size: {
                width: 300,
                height: 300
            }
        }
    },
    _built: function()
    {
        let base64 = this.refs.cropper.getCroppedCanvas().toDataURL();
        this.props.parentCallback(base64);
    },
    _cropend: function()
    {
        let base64 = this.refs.cropper.getCroppedCanvas().toDataURL();
        this.props.parentCallback(base64);
    },
    render: function()
    {
        return (
            <CropperJS
                ref="cropper"
                src={this.props.src}
                style={this.props.size}

                // Cropper js options
                aspectRatio={1/1}
                guides={true}
                built={this._built}
                cropend={this._cropend}
            />
        )
    }
});

var Button = function({type, value, onClick, onChange})
{
    return (
        <input type={type} value={value} onClick={onClick} onChange={onChange} />
    )
}

var Img = function({width="100", src=""})
{
    return (
        <img width={width} src={src} />
    )
}


var FileZone = React.createClass({
    handleChange: function(e)
    {
        e.preventDefault();

        var file = e.target.files[0];

        this.getFileBase64(file);

    },
    handleDragOver: function(e)
    {
        e.preventDefault();

        return false;
    },
    handleDragLeave: function(e)
    {
        e.preventDefault();

        return false;
    },
    handleDrop: function(e)
    {
        e.preventDefault();

        var file = e.dataTransfer.files[0];

        this.getFileBase64(file);

    },

    getFileBase64: function(file)
    {
        var reader = new FileReader();
        reader.onload =(upload)=> {
            this.sendFileBase64(upload.target.result)
        };
        reader.readAsDataURL(file);
    },
    sendFileBase64: function(base64)
    {
        this.props.sendFileBase64(base64)
    },
    render: function()
    {
        return (
            <label style={{width: 400, height: 300, backgroundColor: '#eee', border: '1px solid #ccc', display: 'inline-block'}} onDragOver={this.handleDragOver} onDragLeave={this.handleDragLeave} onDrop={this.handleDrop}>
                <input type="file" style={{visibility: 'hidden'}} onChange={this.handleChange} />
                <div>Click or drag & drop your file here</div>
            </label>
        )
    }
})


// container components
var ImgCropper = React.createClass({
    getInitialState: function()
    {
        return {
            src: null,
            avatarSrc: null
        }
    },
    // componentWillMount: function()
    // {
    //     this.pubsubCrop = PubSub.subscribe('cropIt', function(topic, msg){
    //         let base64 = this.refs.cropper.getCroppedCanvas().toDataURL();
    //
    //         this.props.parentCallback(base64);
    //
    //
    //     }.bind(this))
    // },
    // componentWillUnmount: function()
    // {
    //     PubSub.unsubscribe(this.pubsubCrop)
    // },
    doCrop: function()
    {
        // PubSub.publish('cropIt')

        console.log(this.state.avatarSrc);
        // send the base64 to avatar server
    },
    setSrc: function(src)
    {
        this.setState({src: src})
    },
    setAvatar: function(src)
    {
        this.setState({avatarSrc: src})
    },
    render: function()
    {
        return (
            <div>
                <FileZone sendFileBase64={this.setSrc} />
                <hr />
                <Cropper parentCallback={this.setAvatar} src={this.state.src} />
                <Img src={this.state.avatarSrc} />
                <Button type="button" onClick={this.doCrop} value='set your new avatar' />
            </div>
        )
    }
})

ReactDOM.render(
    <ImgCropper />,
    document.getElementById('container')
)
