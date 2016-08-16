import React from 'react'
import ReactDOM from 'react-dom'
import PubSub from 'pubsub-js'

import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router'

import 'normalize.css'

import {Hello} from './components/Hello'
import {Button} from './components/Button'
import {Img} from './components/Image'
import {Volumn, SuperSlider} from './components/RangeSlider'

import CropperJS from 'react-cropperjs'

import {Provider} from 'react-redux'
import {Counter} from './components/Counter'
import {AddCounter} from './containers/AddCounter'
import {createStore} from 'redux'
import {reducers} from './reducers'

var store = createStore(reducers);
store.subscribe(()=> console.log(store.getState()));

import {CircularProgress} from './components/CircularProgress'

import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

var TodoList = React.createClass({
  getInitialState: function() {
    return {items: ['hello', 'world', 'click', 'me']};
  },
  handleAdd: function() {
    var newItems =
      this.state.items.concat([prompt('Enter some text')]);
    this.setState({items: newItems});
  },
  handleRemove: function(i) {
    var newItems = this.state.items.slice();
    newItems.splice(i, 1);
    this.setState({items: newItems});
  },
  render: function() {
    var items = this.state.items.map(function(item, i) {
      return (
        <div key={item} onClick={this.handleRemove.bind(this, i)}>
          {item}
        </div>
      );
    }.bind(this));
    return (
      <div>
        <button onClick={this.handleAdd}>Add Item</button>
        <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
          {items}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
});

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
            this.sendFileBase64(upload.target.result);
        };
        reader.readAsDataURL(file);
    },
    sendFileBase64: function(base64)
    {
        this.props.sendFileBase64(base64);
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
});

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
        var avatarSrc = this.state.avatarSrc;

        fetch('http://127.0.0.1:3001/uploadImageData', {
            method: 'POST',
            // headers: {'Content-Type': 'application/json'},
            // body: JSON.stringify({imageData: avatarSrc}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: "imageData="+avatarSrc
        })
        .then(function(res){
            return res.json()
        })
        .then(function(data){
            console.log('data', data)
        })
        .catch(function(err){
            console.log('fetch request err', err)
        });
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
                <Hello />
                <hr />
                <FileZone sendFileBase64={this.setSrc} />
                <hr />
                <Cropper parentCallback={this.setAvatar} src={this.state.src} />
                <Img src={this.state.avatarSrc} />
                <Button type="button" onClick={this.doCrop} value='set your new avatar' />
            </div>
        )
    }
});

var CircleControl = React.createClass({
    getInitialState: function()
    {
        return {
            value: 0,
            arc: 120,
            strokeWidth: 10
        }
    },
    handleValue: function(e)
    {
        var val = e.target.value;

        this.setState({value: val});
    },
    handleArc: function(e)
    {
        var val = e.target.value;

        this.setState({arc: val});
    },
    handleStrokeWidth: function(e)
    {
        var val = e.target.value;

        this.setState({strokeWidth: val});
    },
    render: function()
    {
        return (
            <div>
                value: <input onBlur={this.handleValue}/>
                arc: <input onBlur={this.handleArc}/>
                strokeWidth: <input onBlur={this.handleStrokeWidth}/>

                <CircularProgress
                    width={180}
                    height={180}
                    strokeWidth={this.state.strokeWidth}
                    value={this.state.value}
                    min={-10}
                    max={20}
                    arc={this.state.arc}
                    fgStrokeColor='green'
                    bgStrokeColor='#ddd'
                    />
            </div>
        )
    }
});

function Home(props)
{
    return (
        <div>
            <Button type="button" value="Hello world"/>
            <Img src="https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png" />
            <AddCounter />
            <TodoList/>
            <CircleControl/>
            <CircularProgress
                width={180}
                height={180}
                strokeWidth={10}
                value={20}
                min={-10}
                max={30}
                arc={120}
                fgStrokeColor='green'
                bgStrokeColor='#ddd'
                />
            <Button type="button" value="Hello world"/>
        </div>
    )
}
function Inbox(props)
{
  var {children} = props;

  function c()
  {
    return (
      <ul>
        <li>{props.children}</li>
      </ul>
    )
  }
  return (
    <div>
      <h1>Inbox:</h1>
      <p>See messages here:</p>
      <Link to="/inbox/messages/here I am!">want to see?</Link>
      {children || ''}
    </div>
  )
}
function Message(props)
{
  return (
    <div>Message: {props.params.msg}</div>
  )
}
function Sliders(props)
{
    return (
        <div
            ref={(el)=>{
                el.style.fontSize = '24px'
            }}
            >
        <Hello
            name='SuperSlider'/>
        <p>default:</p>
        <SuperSlider
            value={10}
            trackerDecorate={{backgroundColor:'purple'}}
            fillDecorate={{backgroundColor:'yellow'}}
            handleDecorate={{backgroundColor:'red'}}
            orientation='vertical'/>
        <SuperSlider
            min={-10}
            max={40}
            step={5}
            value={5}/>
        <p>metal slider 1:</p>
        <SuperSlider
            value={15}
            width={200}
            trackerDecorate={{}}
            fillDecorate={{}}
            handleDecorate={{}}
            theme='metal-slider-1'/>
        <div style={{height: '100px'}}>
            <SuperSlider
                value={75}
                orientation='vertical'
                theme='metal-slider-1'/>
        </div>
            <p>metal slider 2:</p>
            <SuperSlider
                value={55}
                width={400}
                theme='metal-slider-2'/>
            <SuperSlider
                value={85}
                width={200}
                theme='metal-slider-2'/>
            <SuperSlider
                value={35}
                height={120}
                orientation='vertical'
                theme='metal-slider-2'/>
            <SuperSlider
                value={50}
                height={60}
                orientation='vertical'
                theme='metal-slider-2'/>
            <p>metal slider 3:</p>
            <SuperSlider
                value={15}
                theme='metal-slider-3'/>
            <div style={{height: '100px'}}>
                <SuperSlider
                    value={75}
                    orientation='vertical'
                    theme='metal-slider-3'/>
            </div>
            <div className="container">
                <div className="row-fixed">
                    <SuperSlider
                        value={5}
                        theme='metal-slider-1'/>
                </div>
                <div className="row-grow">
                    <SuperSlider
                        value={5}
                        theme='metal-slider-1'/>
                </div>
            </div>
            <hr/>
            <div className="container">
                <div className="row-fixed">
                    <SuperSlider
                        value={5}
                        orientation='vertical'
                        theme='metal-slider-1'/>
                </div>
                <div className="row-grow">
                    <SuperSlider
                        value={5}
                        orientation='vertical'
                        theme='metal-slider-1'/>
                </div>
            </div>
        </div>
    )
}
function App(props)
{
    return (
        <div>
            <h1>App</h1>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/inbox">Inbox</Link></li>
                <li><Link to="/sliders">Sliders</Link></li>
            </ul>
            {props.children}
        </div>
    )
}

ReactDOM.render(
    <Provider store={store}>
      <Router history={hashHistory}>
          <Route path="/" component={App}>
              <IndexRoute component={Home} />
              <Route path="inbox" component={Inbox}>
                  <Route path="messages/:msg" component={Message} />
              </Route>
              <Route path="sliders" component={Sliders} />
          </Route>
      </Router>
    </Provider>,
    document.getElementById('container')
);
