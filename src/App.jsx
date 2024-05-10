
const App = () => {
  var player_RGB = new Clappr.Player({
    source: "https://5caf24a595d94.streamlock.net:1937/fpwypnbmvp/fpwypnbmvp/playlist.m3u8",
    parentId: "#clappr_rgb",
    width: '100%',
    height: '100%',
    autoPlay: true,
  });
  var player_thermal = new Clappr.Player({
    source: "https://5caf24a595d94.streamlock.net:1937/fzkhwdrpee/fzkhwdrpee/playlist.m3u8",
    parentId: "#clappr_thermal",
    width: '100%',
    height: '100%',
    autoPlay: true,
  });
  return (
    <div>
    <div className="row">
      <div className="col-md-12">
        <div className="card ">
          <div className="card-header">
            <h4 className="card-title">RGB Camera</h4>
          </div>
          <div className="card-body">
            <div id="clappr_rgb"></div>

           {/* <iframe className="col-12" height="400" src="https://www.wowzacontrol.com/public/fpwypnbmvp?autoplay=1" frameborder="0" allowfullscreen></iframe> */}
          </div>
        </div>
      </div>
      <div className="col-md-12">
      <div className="card ">
        <div className="card-header">
          <h4 className="card-title">Thermal Camera</h4>
        </div>
        <div className="card-body">
          <div id="clappr_thermal"></div>
         {/* <iframe className="col-12" height="400" src="https://www.wowzacontrol.com/public/fzkhwdrpee?autoplay=1" frameborder="0" allowfullscreen></iframe>  */}
        </div>
      </div>
    </div>
    </div>
    <div className="row">
    
  </div>
  </div>

  )
}

export default App
