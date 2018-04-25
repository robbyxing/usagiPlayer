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


    let video_container = this.createEl("div", "usagi-player-video");
    video_container.appendChild(video.cloneNode(true));
    let danmaku_container = this.createEl("div", "usagi-player-danmaku-container");
    video_container.appendChild(danmaku_container);
    let info_container = this.createEl("div", "usagi-player-info-container");
    video_container.appendChild(info_container);

    container.appendChild(video_container);


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

    video.parentNode.removeChild(video);

    this.video = document.getElementById(this.options.id);

    let center_play_btn = this.createEl("div", "icon icon-play-circle center-play-btn");


    let play_fn = () => {
      this.video.play();
      //this.video.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    };

    let pause_fn = () => {
      this.video.pause();
    };

    play_btn.addEventListener("click", play_fn);



    this.on("canplay", () => {
      total_time.innerHTML = this.timeConvert(parseInt(this.video.duration));

      //danmaku_container.style.height = video.style.height;
      console.log(this.video.height)

    });

    let progress_timer;

    this.on("play", () => {

      info_container.style.opacity = 0;
      try{
        info_container.removeChild(center_play_btn);
      }catch(e){

      }

      play_btn.setAttribute("class", "usagi-player-pause-btn");
      play_btn.innerHTML = '<div class="icon icon-pause"></div>';
      play_btn.removeEventListener("click", play_fn);
      play_btn.addEventListener("click", pause_fn);

      context.createDanmaku("弹幕测试", "#fff");

      progress_timer = setInterval(function () {
        let current_time_value = parseInt(context.video.currentTime);
        current_time.innerHTML = context.timeConvert(current_time_value);
        let cent = current_time_value / parseInt(context.video.duration) * 100;
        progress_bar_played.style.width = cent + "%";
      }, 500);
    });

    this.on("pause", () => {

      info_container.style.opacity = 1;
      info_container.appendChild(center_play_btn);

      play_btn.setAttribute("class", "usagi-player-play-btn");
      play_btn.innerHTML = '<div class="icon icon-play"></div>';
      play_btn.removeEventListener("click", pause_fn);
      play_btn.addEventListener("click", play_fn);

      progress_timer && clearInterval(progress_timer);
    });

    if(this.options.controller.embed){
      container.addEventListener("mousemove", () => {
        controls.setAttribute("class", 'usagi-player-controls animated fadeIn');
      });
  
      container.addEventListener("mouseleave", () => {
        controls.setAttribute("class", 'usagi-player-controls animated fadeOut');
      });
    }else{
      controls.style.opacity = 1;
      controls.style.bottom = "-40px";
    }



  }

  createDanmaku(text, color) {
    let danmaku = this.createEl("div", "usagi-player-danmaku");


    /*
    let ctx = this.danmaku_canvas.getContext("2d");
    ctx.font="22px Georgia";
    ctx.fillStyle = color;
    ctx.fillText(text, 700, 20);
    ctx.current_x = 700;
    ctx.current_y = 0;
    
    console.log(ctx);
    
    let timer = setInterval(function(){
      if(ctx.current_x > 0){
        ctx.current_x -= 10;
        console.log(ctx.current_x);
        ctx.translate(-10,0); 
      }else{
        clearInterval(timer);
      }
        
    }, 50);
    */



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

    video_events.indexOf(event_name) > -1 ?
      this.video.addEventListener(event_name, callback) :
      this.events.on(event_name, callback);
  }

  init() {}
}