import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components'
import { ReactComponent as PlayIcon } from './icons/play.svg'
import { ReactComponent as PauseIcon } from './icons/pause.svg'
import { ReactComponent as Rwd10 } from './icons/rwd10.svg'
import { ReactComponent as Fwd10 } from './icons/fwd10.svg'
import { ReactComponent as FullscreenIcon } from './icons/fullscreen.svg'
import { ReactComponent as PictureInPictureIcon } from './icons/pip.svg'

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
top: 0;
bottom: 0;
left: 0;
right: 0;
opacity: ${props => props.hidden ? 0 : 1};
`;

const MainControls = styled.div`
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
z-index: 1;

display: inline-flex;

& > :not(:last-child) {
  margin-right: 25px;
}
& svg {
  transform: scale(0.9);
  transition: transform 100ms ease-in-out;
  cursor: pointer;
}
& > :hover svg, & > svg:hover  {
  transform: scale(1);
}
`;
const RightBottomControls = styled.div`
position: absolute;
right: 0;
bottom: 0;
display: inline-flex;
margin-bottom: 10px;

& > * {
  margin-right: 10px;
}
& > svg {
   fill: #fff;
   width: 20px;
   height: 20px;
   transform: scale(0.9);
   transition: transform 100ms ease-in-out;
   cursor: pointer;
}
& > svg:hover {
  transform: scale(1);
}

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
    setShowControls(true)
    setShowControls(false, 2000)
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
  async function enterPictureInPicture() {
    if (videoRef.current !== document.pictureInPictureElement) {
        await videoRef.current.requestPictureInPicture();
    } else {
      await document.exitPictureInPicture();
    }
  }
  async function enterFullscreen(e) {
    console.log(e);
    const video = videoRef.current;
    if (video.requestFullscreen)
      video.requestFullscreen();
    else if (video.webkitRequestFullscreen)
      video.webkitRequestFullscreen();
    else if (video.mozRequestFullscreen)
      video.mozRequestFullscreen();
    else if (video.msRequestFullscreen)
      video.msRequestFullscreen();
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
        id={Math.random()}
        ref={videoRef}
        src={src}
        onPlay={notifyState('playing')}
        onPause={notifyState('paused')}
        onEnded={notifyState('ended')}
        height="100%"
        width="100%"
      ></video>
      <Controls hidden={!showControls && false}
    >
        <MainControls>
        <Rwd10 onClick={() => setTime(-5, true)} fill="white" height="50px" width="50px">
          &lt;- 5s
        </Rwd10>
        <div onClick={togglePlaying}>
          {state === 'playing' ? <PauseIcon fill="white" height="50px"/> : <PlayIcon fill="white" height="50px" width="50px"/>}
        </div>
        <Fwd10 onClick={() => setTime(5, true)} fill="white" height="50px" width="50px">
          5s -&gt;
        </Fwd10>
        </MainControls>
        <RightBottomControls>
          {document.pictureInPictureEnabled && <PictureInPictureIcon onClick={enterPictureInPicture}></PictureInPictureIcon>}
          <FullscreenIcon onClick={enterFullscreen}></FullscreenIcon>
        </RightBottomControls>
      </Controls>
      </Container>

  );
}

export default VideoPlayer;
