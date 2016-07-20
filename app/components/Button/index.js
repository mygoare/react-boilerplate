import React from 'react'

var Button = function({type, value, onClick, onChange})
{
    return (
        <input type={type} value={value} onClick={onClick} onChange={onChange} />
    )
}

export {Button}
