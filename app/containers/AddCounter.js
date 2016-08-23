import React from 'react'
import {connect} from 'react-redux'

import {Counter} from '../components/Counter'

const mapStateToProps = (state, ownProps) => {
  return {
    value: state.counter
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    handleIncrease: () => {
      dispatch({type: 'INCREASE'})
    },
    handleDecrease: () => {
      dispatch({type: 'DECREASE'})
    }
  }
}

const AddCounter = connect(
  mapStateToProps,
  mapDispatchToProps
)(Counter);


export {AddCounter}
