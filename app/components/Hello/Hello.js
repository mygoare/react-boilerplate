import React from 'react'

let Hello = ({name})=> {
    return (
        <h1>Hello {name}</h1>        
    )
}
Hello.propTypes = {name: React.PropTypes.string}
Hello.defaultProps = {name: 'world!'}

export {Hello}
