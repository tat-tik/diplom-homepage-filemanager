import './ProgressBar.css';

function ProgressBar({progress }) {

  return (
    <div className='progress-bar'>
      {progress ? <><div className='progress-overlay'></div>
      <div className='progress' style={{width: Math.floor((progress.loaded * 100 / progress.total)) + '%'}}></div>
      <div  className='progress-percent'>{Math.floor((progress.loaded * 100 / progress.total))}%</div></>
      : ''}
    </div>

  )
}

export default ProgressBar;