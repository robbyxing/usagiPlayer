import Events from "./Events";

export default class Player {
  constructor(options) {
    /*
    options = {
                video : {

                }
                controller : {
                    playBtn : bool,

                },
                danmakuContainer : {

                }
    }
    */

    console.log('player constructor');

    this.video = document.getElementById(options.id);
    this.events = new Events();
  }

  on(event_name, callback) {
    let video_events = [
      "abort",
      "canplay",
      "canplaythrough",
      "durationchange",
      "emptied",
      "ended",
      "error",
      "loadeddata",
      "loadedmetadata",
      "loadstart",
      "mozaudioavailable",
      "pause",
      "play",
      "playing",
      "progress",
      "ratechange",
      "seeked",
      "seeking",
      "stalled",
      "suspend",
      "timeupdate",
      "volumechange",
      "waiting"
    ];
    let target = video_events.indexOf(event_name) > -1 ? this.video : this.events;
    target && target.on(event_name, callback);
  }

  init(){
    
  }
}

