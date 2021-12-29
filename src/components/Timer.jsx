import React, { useCallback, useEffect, useState } from "react";
import { interval, Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'


export default function Timer(){
    const [go, setGo] = useState(false)
    const [time, setTime] = useState(0)

    useEffect(()=>{
        const stream$ = new Subject()
        interval(1000)
        .pipe(takeUntil(stream$))
        .subscribe(() => {
            if(go){
                setTime(val => val + 1000)
            }
        });
        return () => {
            stream$.next();
            stream$.complete();
          };
    },[go])

    
    const start = useCallback(() => {
        setGo(true);
    }, []);
    const stop = useCallback(() => {
      setGo(false);
      setTime(0);
    }, []);
    const wait = useCallback(() => {
      setGo(false);
    }, []);
    const reset = useCallback(() => {
      setTime(0);
    }, []);

    return(
        <div>
            <Time time={time}/>
            <Btns go={go} start={start} wait={wait} stop={stop} reset={reset}/>
        </div>
    )
}


function Time(props){
    
    return(
        <div>
            <h1>
                <span>{new Date(props.time).toISOString().slice(11, 19)}</span>
            </h1>
        </div>
    )
}



function Btns(props){    
    const go = props.go
    return(
        <div>
            {go ? <button className="btn stop" onClick={()=> props.stop()}>Стоп</button> : <button className="btn start" onClick={()=> props.start()}>Старт</button>}
            <button className="btn" onDoubleClick={()=> props.wait()}>Wait</button>
            <button className="btn" onClick={()=> props.reset()}>Reset</button>
        </div>
    )
}