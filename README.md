# 😁 UI 준비하기

- 리덕스를 사용하는 가낭 흔한 패턴은 프레젠테이셔널 컴포넌트와 컨테이너 컴포넌트를 분리하는 것이다.
- 프레젠테이셔널 컴포넌트란 상태 관리가 이루어지지 않고 그저 props를 받아와서 화면에 UI를 보여주기 위한 컴포넌트이다.
- 컨테이너 컴포넌트는 리덕스로쿠터 상태를 받아 오기도 하고 액션을 디스패치하기도 하는 컴포넌트이다.
- 이번 글에서는 src/components 경로에 프레젠테이셔널 컴포넌트를 작성하고 src/containers 컨테이너 컴포넌트를 작성하겠습니다.

# 😂 리덕스 코드 작성하기

## 폴더 구조

![](https://images.velog.io/images/devgosunman/post/a3882767-d40e-408f-8311-e452f394dc85/image.png)

## package.json

```json
{
  "name": "react-redux",
  "version": "1.0.0",
  "description": "",
  "keywords": [],
  "main": "src/index.js",
  "dependencies": {
    "immer": "7.0.8",
    "react": "16.12.0",
    "react-dom": "16.12.0",
    "react-redux": "7.2.1",
    "react-scripts": "3.0.1",
    "redux": "4.0.5",
    "redux-actions": "2.6.5",
    "redux-devtools-extension": "2.13.8"
  },
  "devDependencies": {
    "typescript": "3.8.3"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  },
  "browserslist": [">0.2%", "not dead", "not ie <= 11", "not op_mini all"]
}
```

## App.js

```js
import React from "react";
import "./styles.css";
import CounterContainer from "./containers/CounterContainer";
import TodosContainer from "./containers/TodosContainer";

export default function App() {
  return (
    <div className="App">
      <CounterContainer />
      <hr />
      <TodosContainer />
    </div>
  );
}
```

## index.js

```js
import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./modules";

import App from "./App";

const store = createStore(rootReducer, composeWithDevTools());

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  rootElement
);
```

## CounterContainer.js

```js
import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import Counter from "../components/Counter";
import { increase, decrease } from "../modules/counter";

const CounterContainer = () => {
  const number = useSelector((state) => state.counter.number);
  const dispatch = useDispatch();
  const onIncrease = useCallback(() => dispatch(increase()), [dispatch]);
  const onDecrease = useCallback(() => dispatch(decrease()), [dispatch]);
  return (
    <Counter number={number} onIncrease={onIncrease} onDecrease={onDecrease} />
  );
};

export default React.memo(CounterContainer);
```

## TodosContainer.js

```js
import React from "react";
import { useSelector } from "react-redux";
import { changeInput, insert, toggle, remove } from "../modules/todos";
import Todos from "../components/Todos";
import useActions from "../lib/useActions";

const TodosContainer = () => {
  const { input, todos } = useSelector(({ todos }) => ({
    input: todos.input,
    todos: todos.todos
  }));

  const [onChangeInput, onInsert, onToggle, onRemove] = useActions(
    [changeInput, insert, toggle, remove],
    []
  );

  return (
    <Todos
      input={input}
      todos={todos}
      onChangeInput={onChangeInput}
      onInsert={onInsert}
      onToggle={onToggle}
      onRemove={onRemove}
    />
  );
};

export default TodosContainer;
```

## modules/counter.js

```js
import { createAction, handleActions } from "redux-actions";

// 액션 타입 정의
const INCREASE = "counter/INCREASE";
const DECREASE = "counter/DECREASE";

export const increase = createAction(INCREASE);
export const decrease = createAction(DECREASE);

// 초기 상태 및 리듀서
const initialState = {
  number: 0
};

const counter = handleActions(
  {
    [INCREASE]: (state, action) => ({ number: state.number + 1 }),
    [DECREASE]: (state, action) => ({ number: state.number - 1 })
  },
  initialState
);

export default counter;
```

## modules/todos.js

```js
import { createAction, handleActions } from "redux-actions";
import produce from "immer";

const CHANGE_INPUT = "todos/CHANGE_INPUT";
const INSERT = "todos/INSERT";
const TOGGLE = "todos/TOGGLE";
const REMOVE = "todos/REMOVE";

export const changeInput = createAction(CHANGE_INPUT, (input) => input);

let id = 3;

export const insert = createAction(INSERT, (text) => ({
  id: id++,
  text,
  done: false
}));

export const toggle = createAction(TOGGLE, (id) => id);

export const remove = createAction(REMOVE, (id) => id);

const initialState = {
  input: "",
  todos: [
    {
      id: 1,
      text: "learning basic redux",
      done: true
    },
    {
      id: 2,
      text: "using redux and react",
      done: false
    }
  ]
};

const todos = handleActions(
  {
    [CHANGE_INPUT]: (state, { payload: input }) =>
      produce(state, (draft) => {
        draft.input = input;
      }),
    [INSERT]: (state, { payload: todo }) =>
      produce(state, (draft) => {
        draft.todos.push(todo);
      }),
    [TOGGLE]: (state, { payload: id }) =>
      produce(state, (draft) => {
        const todo = draft.todos.find((todo) => todo.id === id);
        todo.done = !todo.done;
      }),
    [REMOVE]: (state, { payload: id }) =>
      produce(state, (draft) => {
        const index = draft.todos.findIndex((todo) => todo.id === id);
        draft.todos.splice(index, 1);
      })
  },
  initialState
);

export default todos;
```

## modules/index.js

```js
import { combineReducers } from "redux";
import counter from "./counter";
import todos from "./todos";

const rootReducer = combineReducers({
  counter,
  todos
});

export default rootReducer;
```

## components/Counter.js

```js
import React from "react";

const Counter = ({ number, onIncrease, onDecrease }) => {
  return (
    <div>
      <h1>{number}</h1>
      <div>
        <button onClick={onIncrease}>+1</button>
        <button onClick={onDecrease}>-1</button>
      </div>
    </div>
  );
};

export default Counter;
```

## components/Todos.js

```js
import React from "react";

const TodoItem = ({ todo, onToggle, onRemove }) => {
  return (
    <div>
      <input
        type="checkbox"
        onClick={() => onToggle(todo.id)}
        checked={todo.done}
        readOnly={true}
      />
      <span style={{ textDecoration: todo.done ? "line-through" : "none" }}>
        {todo.text}
      </span>
      <button onClick={() => onRemove(todo.id)}> delete </button>
    </div>
  );
};

const Todos = ({
  input,
  todos,
  onChangeInput,
  onInsert,
  onToggle,
  onRemove
}) => {
  const onSubmit = (e) => {
    e.preventDefault();
    onInsert(input);
    onChangeInput("");
  };
  const onChange = (e) => onChangeInput(e.target.value);

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input value={input} onChange={onChange} />
        <button type="submit">enroll</button>
      </form>
      <div>
        {todos.map((todo) => {
          return (
            <TodoItem
              todo={todo}
              key={todo.id}
              onToggle={onToggle}
              onRemove={onRemove}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Todos;
```

# 😍 Hooks를 사용하여 컨테이너 컴포넌트 만들기

- 액션 생성 함수를 액션을 디스패치 하는 함수로 변환해 준다.
- 액션 생성 함수를 사용하여 액션 객체를 만들고,
- 이를 스토어에 디스패치하는 작업을 자동으로 만들어 주는 것
- 두 가지 파라미터가 필요하다
- 첫 번째 파라미터는 액션 생성 함수로 이루어진 배열이다.
- 두 번째 파라미터는 deps 배열이며, 액션을 디스패치 하는 함수를 새로만드는 기준이다.
-

* connect 함수와 useSelector + useDispatch를 사용할 때 차이점
* connect 함수를 사용하면 부모 컴포넌트가 리렌더링 되더라도 props가 바뀌지 않는다면,
* 리렌더링이 자동으로 방지되어 성능이 최적화된다.

* 반면 useSelector를 사용하여 리덕스 상태를 조회했을 때는 최적화가 자동으로 이루어지지 않음
* 성능최적화를 위해서는 React.memo를 사용해주어야 한다.

## lib/useActions.js

```js
import { bindActionCreators } from "redux";
import { useDispatch } from "react-redux";
import { useMemo } from "react";

export default function useActions(actions, deps) {
  const dispatch = useDispatch();
  return useMemo(
    () => {
      if (Array.isArray(actions)) {
        return actions.map((a) => bindActionCreators(a, dispatch));
      }
      return bindActionCreators(actions, dispatch);
    },
    deps ? [dispatch, ...deps] : deps
  );
}
```
