import React from 'react'
import ReactDOM from 'react-dom'
import PubSub from 'pubsub-js'

import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router'

import 'normalize.css'

import {Hello} from './components/Hello'
import {Button} from './components/Button'
import {Img} from './components/Image'
import {Volumn, SuperSlider, SuperSliderStyles} from './components/RangeSlider'

import CropperJS from 'react-cropperjs'

import {Provider} from 'react-redux'
import {Counter} from './components/Counter'
import {AddCounter} from './containers/AddCounter'
import {createStore} from 'redux'
import {reducers} from './reducers'

var store = createStore(reducers);
store.subscribe(()=> console.log(store.getState()));

import {CircularProgress} from './components/CircularProgress'
import {CircleProgress} from './components/CircularProgress/circleProgress.js'
import {SuperLamp} from './components/SuperLamp'

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
            value: 78,
            arc: 270,
            thickness: 9
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
    thickness: function(e)
    {
        var val = e.target.value;

        this.setState({thickness: val});
    },
    componentDidMount: function()
    {
        // var self = this;
        // setInterval(function(){
        //     self.setState({value: Math.floor(Math.random() * 100)})
        // }, 500);
        this.setState({value: 100})
    },
    render: function()
    {
        return (
            <div>
                value: <input onBlur={this.handleValue}/>
                arc: <input onBlur={this.handleArc}/>
                thickness: <input onBlur={this.thickness}/>

                <div>
                    <p>ABC</p>

                    <CircleProgress
                        clip={false}
                        thickness={parseInt(this.state.thickness)}
                        radius={41}
                        arc={parseInt(this.state.arc)}
                        bgStrokeColor='#404042'
                        fgStrokeColor={
                            {
                                green    : 2,
                                orange   : 1,
                                red      : 6,
                                purple   : 3,
                                '#cc0000': 2
                            }
                        }
                        colorGradient={false}
                        value={parseInt(this.state.value)}
                        onChange={function(){console.log('haha')}}
                        background='https://ooo.0o0.ooo/2016/08/09/57aaa23f47f80.png'
                        foreground='https://ooo.0o0.ooo/2016/08/09/57aaa23f6bc53.png'
                    />

                    <SuperLamp/>
                    <SuperLamp color='blue' />
                    <SuperLamp value={34} />
                    <SuperLamp color='blue' value={34} />
                    <SuperLamp color='blue' value={34} size={48} />

                    <div style={{display: 'flex'}}>
                        <div>
                            <SuperLamp color='red' value={0} />
                            <SuperLamp color='red' value={10} />
                            <SuperLamp color='red' value={20} />
                            <SuperLamp color='red' value={30} />
                            <SuperLamp color='red' value={40} />
                            <SuperLamp color='red' value={50} />
                            <SuperLamp color='red' value={60} />
                            <SuperLamp color='red' value={70} />
                            <SuperLamp color='red' value={80} />
                            <SuperLamp color='red' value={90} />
                            <SuperLamp color='red' value={100} />
                        </div>
                        <div>
                            <SuperLamp color='#3c7eab' value={0} />
                            <SuperLamp color='#3c7eab' value={10} />
                            <SuperLamp color='#3c7eab' value={20} />
                            <SuperLamp color='#3c7eab' value={30} />
                            <SuperLamp color='#3c7eab' value={40} />
                            <SuperLamp color='#3c7eab' value={50} />
                            <SuperLamp color='#3c7eab' value={60} />
                            <SuperLamp color='#3c7eab' value={70} />
                            <SuperLamp color='#3c7eab' value={80} />
                            <SuperLamp color='#3c7eab' value={90} />
                            <SuperLamp color='#3c7eab' value={100} />
                        </div>
                        <div>
                            <SuperLamp color='green' value={0} />
                            <SuperLamp color='green' value={10} />
                            <SuperLamp color='green' value={20} />
                            <SuperLamp color='green' value={30} />
                            <SuperLamp color='green' value={40} />
                            <SuperLamp color='green' value={50} />
                            <SuperLamp color='green' value={60} />
                            <SuperLamp color='green' value={70} />
                            <SuperLamp color='green' value={80} />
                            <SuperLamp color='green' value={90} />
                            <SuperLamp color='green' value={100} />
                        </div>
                        <div>
                            <SuperLamp color='purple' value={0} />
                            <SuperLamp color='purple' value={10} />
                            <SuperLamp color='purple' value={20} />
                            <SuperLamp color='purple' value={30} />
                            <SuperLamp color='purple' value={40} />
                            <SuperLamp color='purple' value={50} />
                            <SuperLamp color='purple' value={60} />
                            <SuperLamp color='purple' value={70} />
                            <SuperLamp color='purple' value={80} />
                            <SuperLamp color='purple' value={90} />
                            <SuperLamp color='purple' value={100} />
                        </div>
                        <div>
                            <SuperLamp color='yellow' value={0} />
                            <SuperLamp color='yellow' value={10} />
                            <SuperLamp color='yellow' value={20} />
                            <SuperLamp color='yellow' value={30} />
                            <SuperLamp color='yellow' value={40} />
                            <SuperLamp color='yellow' value={50} />
                            <SuperLamp color='yellow' value={60} />
                            <SuperLamp color='yellow' value={70} />
                            <SuperLamp color='yellow' value={80} />
                            <SuperLamp color='yellow' value={90} />
                            <SuperLamp color='yellow' value={100} />
                        </div>
                    </div>





                </div>

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
                if (el != null) el.style.fontSize = '24px'
            }}
            >
        <Hello
            name='SuperSlider'/>
        <Volumn/>
        <p>default:</p>
        <SuperSlider
            value={10}
            orientation='vertical'
            theme='default'/>
        <SuperSlider
            min={-10}
            max={40}
            step={5}
            value={5}
            theme='default'/>
        <p>black:</p>
        <SuperSlider
            value={15}
            width={200}
            decorate={SuperSliderStyles.inner}
            theme='black'/>
        <div style={{height: '100px'}}>
            <SuperSlider
                value={75}
                orientation='vertical'
                decorate={SuperSliderStyles.inner}
                theme='black'/>
        </div>
            <p>purple</p>
            <SuperSlider
                value={55}
                width={400}
                decorate={SuperSliderStyles.purple}
                />
            <SuperSlider
                value={85}
                width={200}
                theme='purple'/>
            <SuperSlider
                value={35}
                height={120}
                orientation='vertical'
                theme='purple'/>
            <SuperSlider
                value={50}
                height={60}
                orientation='vertical'
                theme='purple'/>
            <p>inner</p>
            <SuperSlider
                value={15}
                theme='inner'/>
            <div style={{height: '100px'}}>
                <SuperSlider
                    value={75}
                    orientation='vertical'
                    theme='inner'/>
            </div>
            <div className="container">
                <div className="row-fixed">
                    <SuperSlider
                        value={5}
                        theme='inner'/>
                </div>
                <div className="row-grow">
                    <SuperSlider
                        value={5}
                        theme='inner'/>
                </div>
            </div>
            <hr/>
            <div className="container">
                <div className="row-fixed">
                    <SuperSlider
                        value={5}
                        orientation='vertical'
                        theme=''/>
                </div>
                <div className="row-grow">
                    <SuperSlider
                        value={5}
                        orientation='vertical'
                        theme=''/>
                </div>
            </div>
        </div>
    )
}
function CircleProgresses(props)
{
    return (
        <div>
            <CircleProgress
            />
            <CircleProgress
                clip={true}
                radius={48}
                value={100}
                thickness={14}
                arc={180}
                bgStrokeColor='#404042'
                fgStrokeColor={
                {
                    green  : 2,
                    orange : 1,
                    red    : 6,
                    purple : 2
                }
                }
                colorGradient={false}
                foreground='https://ooo.0o0.ooo/2016/08/16/57b2b62296dbe.png'
            />
            <CircleProgress
                colorGradient={true}
                value={98}
                thickness={20}
                bgStrokeColor='white'
                fgStrokeColor={{
                    green  : 2,
                    orange : 1,
                    red    : 6,
                    purple : 2
                }}
            />
            <CircleProgress
                radius = {52}
                arc = {270}
                thickness = {11}
                colorGradient = {true}
                bgStrokeColor ='#404042'
                fgStrokeColor = {['green', 'orange', 'red']}
                background = 'https://ooo.0o0.ooo/2016/08/21/57ba690e5ec79.png'
                foreground =  'https://ooo.0o0.ooo/2016/08/21/57ba690ec7ce7.png'
            />
            <CircleProgress
                clip = {true}
                value = {100}
                thickness = {14}
                radius = {48}
                arc = {180}
                colorGradient = {false}
                foreground ='https://ooo.0o0.ooo/2016/08/16/57b2b62296dbe.png'
                fgStrokeColor = {
                    {
                        '#3ec1e8': 1,
                        '#47a905': 2,
                        '#9adc1f': 3,
                        '#fdca00': 4,
                        orange   : 5,
                        red      : 6
                    }
                }
            />
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
                <li><Link to="/circleProgresses">CircleProgresses</Link></li>
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
              <Route path="circleProgresses" component={CircleProgresses} />
          </Route>
      </Router>
    </Provider>,
    document.getElementById('container')
);
