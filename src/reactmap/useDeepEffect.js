import {useState, useEffect, useRef} from 'react'
import {isEqual} from 'lodash'
export function useDeepEffect(fn, deps){
    const isFirst = useRef(true);
    const prevDeps = useRef(deps);
    console.log("Deepeffect used")
    console.log("isFirst:")
    console.log(isFirst)
    console.log("prevDeps:")
    console.log(prevDeps)
    console.log("deps:")
    console.log(deps)
    useEffect(() => {
      const isSame = prevDeps.current.every((obj, index) =>
        isEqual(obj, deps[index])
      );
      if (isFirst.current || !isSame) {
        fn();
      }
  
      isFirst.current = false;
      prevDeps.current = deps;
    }, deps);
  }