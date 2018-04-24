import Events from "./Events";

export default class Player {
  constructor(options) {
    console.log("player constructor");
    this.options = options;
    this.events = new Events();
    this.createDom();
  }

  createDom() {
    let context = this;

    let video = document.getElementById(this.options.id);
    let df = document.createDocumentFragment();

    let container = this.createEl("div", "usagi-player");
    container.appendChild(video.cloneNode(true));

    let danmaku_canvas = this.createEl("canvas", "usagi-player-danmaku-canvas");
    danmaku_canvas.width = "882";
    danmaku_canvas.height = "496";
    danmaku_canvas.style.position = "absolute";
    danmaku_canvas.style.left = 0;
    
    danmaku_canvas.style.height = video.style.height;
    container.appendChild(danmaku_canvas);

    let controls = this.createEl("ul", "usagi-player-controls");

    let play_btn = this.createEl("li", "usagi-player-play-btn");
    play_btn.innerHTML = '<div class="icon icon-play"></div>';

    controls.appendChild(play_btn);

    let current_time = this.createEl("li", "usagi-player-current-time");
    current_time.innerHTML = this.timeConvert(0);
    controls.appendChild(current_time);

    let progress_bar = this.createEl("li", "usagi-player-progressbar");

    let progress_bar_slot = this.createEl(
      "div",
      "usagi-player-progressbar-slot"
    );
    progress_bar.appendChild(progress_bar_slot);

    let progress_bar_played = this.createEl(
      "div",
      "usagi-player-progressbar-played"
    );
    progress_bar.appendChild(progress_bar_played);

    let progress_bar_buffered = this.createEl(
      "div",
      "usagi-player-progressbar-buffered"
    );
    progress_bar.appendChild(progress_bar_buffered);

    controls.appendChild(progress_bar);

    let total_time = this.createEl("li", "usagi-player-total-time");
    total_time.innerHTML = "--:--:--";
    controls.appendChild(total_time);

    let volume_btn = this.createEl("li", "usagi-player-volume-btn");
    volume_btn.innerHTML = '<div class="icon icon-volume-high"></div>';
    controls.appendChild(volume_btn);

    container.appendChild(controls);

    df.appendChild(container);
    video.before(df);

    document.body.removeChild(video);

    this.video = document.getElementById(this.options.id);

    let play_fn = () => {
      this.video.play();
    };

    let pause_fn = () => {
      this.video.pause();
    };

    play_btn.addEventListener("click", play_fn);

    this.on("canplay", () => {
      total_time.innerHTML = this.timeConvert(parseInt(this.video.duration));

      var ctx = danmaku_canvas.getContext("2d");
      ctx.font="22px Georgia";

      ctx.fillStyle = '#fff';

      ctx.fillText('我小猪佩奇就是不服!', 20, 100);


      ctx.translate(400,0);  
 
    });

    let progress_timer;

    this.on("play", () => {
      play_btn.setAttribute("class", "usagi-player-pause-btn");
      play_btn.innerHTML = '<div class="icon icon-pause"></div>';
      play_btn.removeEventListener("click", play_fn);
      play_btn.addEventListener("click", pause_fn);

      

      progress_timer = setInterval(function() {
        let current_time_value = parseInt(context.video.currentTime);
        current_time.innerHTML = context.timeConvert(current_time_value);
        let cent = current_time_value / parseInt(context.video.duration) * 100;
        progress_bar_played.style.width = cent + "%";
      }, 500);
    });

    this.on("pause", () => {
      play_btn.setAttribute("class", "usagi-player-play-btn");
      play_btn.innerHTML = '<div class="icon icon-play"></div>';
      play_btn.removeEventListener("click", pause_fn);
      play_btn.addEventListener("click", play_fn);

      progress_timer && clearInterval(progress_timer);
    });
  }

  createEl(tag, class_name) {
    let temp = document.createElement(tag);
    temp.className = class_name;
    return temp;
  }

  timeConvert(_seconds) {
    let pad_zero = (num, n) => {
      return (Array(n).join(0) + num).slice(-n);
    };
    let hours = parseInt(_seconds / 3600),
      minutes = parseInt((_seconds - 3600 * hours) / 60),
      seconds = _seconds - 3600 * hours - minutes * 60;
    return (
      pad_zero(hours, 2) +
      ":" +
      pad_zero(minutes, 2) +
      ":" +
      pad_zero(seconds, 2)
    );
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

    video_events.indexOf(event_name) > -1
      ? this.video.addEventListener(event_name, callback)
      : this.events.on(event_name, callback);
  }

  init() {}
}
