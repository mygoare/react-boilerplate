import React from 'react'
import ReactDOM from 'react-dom'

import {Hello} from './components/Hello/Hello.js'

ReactDOM.render(
    <div>
        <Hello name={'world'}/>
    </div>,
    document.getElementById('container')
)
