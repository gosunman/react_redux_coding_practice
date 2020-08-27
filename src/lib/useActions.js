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

// 액션 생성 함수를 액션을 디스패치 하는 함수로 변환해 준다.
// 액션 생성 함수를 사용하여 액션 객체를 만들고,
// 이를 스토어에 디스패치하는 작업을 자동으로 만들어 주는 것
// 두 가지 파라미터가 필요하다
// 첫 번째 파라미터는 액션 생성 함수로 이루어진 배열이다.
// 두 번째 파라미터는 deps 배열이며, 액션을 디스패치 하는 함수를 새로만드는 기준이다.

// connect 함수와 useSelector + useDispatch를 사용할 때 차이점
// connect 함수를 사용하면 부모 컴포넌트가 리렌더링 되더라도 props가 바뀌지 않는다면,
// 리렌더링이 자동으로 방지되어 성능이 최적화된다.

// 반면 useSelector를 사용하여 리덕스 상태를 조회했을 때는 최적화가 자동으로 이루어지지 않음
// 성능최적화를 위해서는 React.memo를 사용해주어야 한다.
