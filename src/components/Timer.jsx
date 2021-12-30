import React, { useCallback, useEffect, useState } from "react";
import {  interval, Subject,debounceTime,Observable, timer,fromEvent,} from 'rxjs'
import { takeUntil,scan,filter,tap,timeInterval,exhaustMap,buffer} from 'rxjs/operators'


export default function Timer(){
    const [go, setGo] = useState(false)
    const [time, setTime] = useState(0)

    useEffect(()=>{
        const stream$ = new Subject()
        interval(100)
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

    useEffect(()=>{
        let wait = document.querySelector('#wait')
        var mouseDowns = fromEvent(wait, "click");

        var doubleClicks = mouseDowns.
        pipe(
            timeInterval(),
            scan((acc, val) => val.interval < 250 ? acc + 1 : 0, 0),
            filter(val => val == 1),
        )      
        doubleClicks.subscribe({
            next(){
                setGo(false)   
            }
        })
    },[])
  
    const reset = useCallback(() => {
      setTime(0);
    }, []);

    return(
        <div>
            <Time time={time}/>
            <Btns go={go} start={start} stop={stop} reset={reset}/>
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
            <button className="btn" id="wait">Wait</button>
            <button className="btn" onClick={()=> props.reset()}>Reset</button>
        </div>
    )
}