import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components'

const height = 300;

const Container = styled.div`
display: flex;
border: 1px solid red;
position: relative;
height: ${height}px;
width: ${height * 16/9}px;
z-index: 0;
`;

const Controls = styled.div`
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
z-index: 1;
opacity: ${props => props.hidden ? 0 : 1};
`;

function useDelayableState(initialState) {
  const [state, setState] = useState(initialState)
  const timeout = useRef()
  function _clearTimeout() {
    clearTimeout(timeout.current)
  }
  useEffect(() => _clearTimeout, [])
  function setStateWithDelay(state, delay) {
    _clearTimeout()
    if (!delay) {
      setState(state)
    } else {
      const timeoutId = setTimeout(() => setState(state), delay)
      timeout.current = timeoutId
    }
  }
  return [state, setStateWithDelay, _clearTimeout]
}

function VideoPlayer({src}) {
  const videoRef = useRef();
  const [state, setState] = useState('');
  const [showControls, setShowControls, clearControlsTimeout] = useDelayableState(false)

  function togglePlaying() {
    const video = videoRef.current;
    if (video.paused) {
      video.play()
    } else {
      video.pause()
    }
  }
  function notifyState(state) {
    return () => setState(state)
  }
  function setTime(value, relative) {
    const video = videoRef.current;
    if (relative) {
      video.currentTime = Math.min(Math.max(0, video.currentTime + value), video.duration)
    } else {
      video.currentTime = Math.min(Math.max(0, value), video.duration)
    }
  }
  return (
    <Container    onMouseEnter={() => console.log('mouse enter') || setShowControls(true)}
    onMouseLeave={() => setShowControls(false, 2000)}
    onMouseMove={() => {
      setShowControls(true)
      setShowControls(false, 2000)
      }}
    >
      <video
        ref={videoRef}
        src={src}
        onPlay={notifyState('playing')}
        onPause={notifyState('paused')}
        onEnded={notifyState('ended')}
        height="100%"
        width="100%"

      ></video>
      <Controls hidden={!showControls}
    >
        <button onClick={() => setTime(-5, true)}>
          &lt;- 5s
        </button>
        <button onClick={togglePlaying}>
          {state === 'playing' ? 'Pause' : 'Play'}
        </button>
        <button onClick={() => setTime(5, true)}>
          5s -&gt;
        </button>
      </Controls>
      </Container>

  );
}

export default VideoPlayer;
