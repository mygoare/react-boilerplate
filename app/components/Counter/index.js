import React from 'react'

var Counter = React.createClass({
    render: function()
    {
      var {value, handleIncrease, handleDecrease} = this.props;
      return (
        <div>
          <p>{value}</p>
          <button onClick={handleIncrease}>add</button>
          <button onClick={handleDecrease}>minus</button>
        </div>
      )
    }
});

export {Counter}
