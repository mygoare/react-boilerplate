import {combineReducers} from 'redux'

function counter(state = 0, action)
{
  switch(action.type)
  {
      case 'INCREASE':
        return state + 1;
        break;
      case 'DECREASE':
        return state - 1;
        break;
      default:
        return state;
  }
}

function visibility(state = 'initial', action)
{
  switch(action.type)
  {
    case 'SHOW':
      return 'initial'
    case 'HIDE':
      return 'none'
    default:
      return state;
  }
}

let reducers = combineReducers({
  counter,
  visibility
});

export {reducers}
