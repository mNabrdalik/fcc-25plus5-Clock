import React from 'react';
import './App.css';

function App() {
  const padRef = React.useRef(null)
  const[breakTime, setBreakTime] = React.useState(5)
  const[sessionTime, setSessionTime] = React.useState(25)
  const[timerStatus, setTimerStatus] = React.useState({
    minutes: sessionTime,
    seconds: 0,
    start: false,
    isSession: true,
    sessionString: "Session"
  })

  function resetTime() {
    setBreakTime(5)
    setSessionTime(25)
    setTimerStatus({
      minutes: sessionTime,
      seconds: 0,
      start: false,
      isSession: true,
      sessionString: "Session"
    })

    const audio = padRef.current
    audio.pause() 
    audio.currentTime = 0;

  }

  function decBreak() {
    if(breakTime > 1) {
      setBreakTime(prevBreakTime => prevBreakTime - 1)
    }
  }

  function incBreak() {
    if(breakTime < 60) {
      setBreakTime(prevBreakTime => prevBreakTime + 1)
    }
  }

  function decSession() {
    if(sessionTime > 1) {
      setSessionTime(prevSessionTime => prevSessionTime - 1)
    }
  }


  function incSession() {
    if(sessionTime < 60) {
      setSessionTime(prevSessionTime => prevSessionTime + 1)
    }
  }

  function startStop() {
    setTimerStatus((prevStatus) => ({
      ...prevStatus,
      start: !prevStatus.start
      
    }));
  }

  function delay(ms ) {
    new Promise(
      resolve => setTimeout(resolve, ms)
    )
  }

  function playSound() {
    const audio = padRef.current
    audio.play()  
  }

  React.useEffect(() => {
    setTimerStatus((prevStatus) => ({
      ...prevStatus,
      minutes: sessionTime
    }));
  }, [sessionTime]);


  React.useEffect(() => {

    let interval = null;
    let timerSeconds = null;

    if(timerStatus.start && (timerStatus.seconds !== 0 || timerStatus.minutes !== 0) ) {

      if(timerStatus.seconds === 0) {
        timerSeconds = 60;
        interval = setInterval(() => {

          setTimerStatus((prevStatus) => ({
            ...prevStatus,
            seconds: timerSeconds - 1,
            minutes: prevStatus.minutes - 1
          }));

        }, 1000);
      } else {
        interval = setInterval(() => {
          setTimerStatus((prevStatus) => ({
            ...prevStatus,
            seconds: prevStatus.seconds - 1,
          }));
        }, 1000);
      }
    } else if(timerStatus.seconds === 0 && timerStatus.minutes === 0) {

        function changeTo() {

          setTimerStatus((prevStatus) => ({
            ...prevStatus,
            start: false,
            isSession: !prevStatus.isSession,
          }))
          
          playSound()
      
          setTimerStatus((prevStatus) => ({
            ...prevStatus,
            minutes: prevStatus.isSession ? sessionTime : breakTime,
            seconds: 0,
            start: true,
            sessionString: prevStatus.sessionString === "Session" ? "Break": "Session"        
          }));          
        }
      
        changeTo()
        
    }
    
    return () => clearInterval(interval);


  }, [timerStatus.start, timerStatus.seconds, timerStatus.minutes, breakTime, sessionTime, timerStatus.isSession]);



  return (
    <div className="App">

        <div id="session-label">Session Length</div>
        <div className="session">
          <button id="session-decrement" onClick={decSession}>-</button>
          <div id="session-length">{Math.abs(sessionTime)}</div>
          <button id="session-increment" onClick={incSession}>+</button>
        </div>

        <div id="break-label">Break Length</div>
        <div className="break">
          <button id="break-decrement" onClick={decBreak}>-</button>
          <div id="break-length">{Math.abs(breakTime)}</div>
          <button id="break-increment" onClick={incBreak}>+</button>
        </div>

        <div className="timer">
          <div id="timer-label">{timerStatus.sessionString}</div>
          <div id="time-left"><span className='minutes'>{Math.abs(timerStatus.minutes) < 10 ? "0" : ""}{Math.abs(timerStatus.minutes)}</span>:<span className='seconds'>{Math.abs(timerStatus.seconds) < 10 ? "0" : ""}{Math.abs(timerStatus.seconds)}</span></div>
          <div className='control'>
            <button id="reset" onClick={resetTime}>reset</button>
            <button id="start_stop" onClick={startStop}>start/stop</button>
          </div>

          <audio ref={padRef} className="clip" id="beep" src="453183__bolkmar__bell-sharp-a.wav" controls>
                Your browser does not support the audio element.
            </audio>
          
        </div>

    </div>
  );
}

export default App;
