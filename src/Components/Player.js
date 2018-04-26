import Events from "./Events";
import Fullscreen from "./Fullscreen";

export default class Player {
  constructor(options) {
    console.log("player constructor");
    this.options = options;
    this.events = new Events();
    this.fullscreen = new Fullscreen();
    this.createDom();
  }

  createDom() {
    let context = this;

    let video = document.getElementById(this.options.id);
    let df = document.createDocumentFragment();

    let container = this.createEl("div", "usagi-player");

    let video_container = this.createEl("div", "usagi-player-video");
    video_container.appendChild(video.cloneNode(true));
    let danmaku_container = this.createEl(
      "div",
      "usagi-player-danmaku-container"
    );
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

    progress_bar_played.draggable = false;

    window.usagiplayerglobal.progressbar_down = false;

    progress_bar_played.addEventListener("mousedown", function(e) {
      e.stopPropagation();
      console.log("鼠标按下");
      window.usagiplayerglobal.progressbar_down = true;
    });

    window.addEventListener(
      "mouseup",
      function(e) {
        e.stopPropagation();
        console.log("鼠标抬起");

        let percent = progress_bar_played.style.width.split(".")[0] / 100;
        try {
          if (window.usagiplayerglobal.progressbar_down) {
            context.video.currentTime = parseInt(
              percent * context.video.duration
            );
          }
        } catch (e) {}

        window.usagiplayerglobal.progressbar_down = false;
      },
      false
    );

    let drag_progress = e => {
      e.stopPropagation();
      if (window.usagiplayerglobal.progressbar_down) {
        let percent = e.offsetX / progress_bar_slot.clientWidth * 100;
        progress_bar_played.style.width = percent + "%";
      }
    };

    progress_bar_played.addEventListener("mousemove", e => {
      drag_progress(e);
    });

    progress_bar.addEventListener("mousemove", e => {
      drag_progress(e);
    });

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

    //---------------音量

    window.usagiplayerglobal.ismute = false;

    let volume_btn = this.createEl("li", "usagi-player-volume-btn");
    volume_btn.innerHTML = '<div class="icon icon-volume_on"></div>';

    volume_btn.addEventListener("click", e => {
      if (window.usagiplayerglobal.ismute) {
        window.usagiplayerglobal.ismute = false;
        volume_btn.innerHTML = '<div class="icon icon-volume_on"></div>';
      } else {
        window.usagiplayerglobal.ismute = true;
        volume_btn.innerHTML = '<div class="icon icon-volume_mute"></div>';
      }
    });

    controls.appendChild(volume_btn);

    //---------------音量end

    //---------------清晰度
    let clarity_btn = this.createEl("li", "usagi-player-clarity-btn");
    clarity_btn.innerHTML = "LD";

    let clarity_list = this.createEl("ul", "usagi-player-clarity-list");

    let clarity_list_current = this.createEl("li", "current");
    let clarity_list_hd = this.createEl("li", "hd");
    let clarity_list_sd = this.createEl("li", "sd");
    let clarity_list_ld = this.createEl("li", "ld");

    /*
    "OD" : "原画"
    "FD" : "流畅"
    "LD" : "标清"
    "SD" : "高清"
    "HD" : "超清"
    "2K" : "2K"
    "4K" : "4K"
    */
    clarity_list_current.innerHTML = "LD";
    clarity_list_ld.innerHTML = "LD";
    clarity_list_sd.innerHTML = "SD";
    clarity_list_hd.innerHTML = "HD";

    clarity_list.appendChild(clarity_list_hd);
    clarity_list.appendChild(clarity_list_sd);
    clarity_list.appendChild(clarity_list_ld);
    clarity_list.appendChild(clarity_list_current);

    window.addEventListener(
      "mousemove",
      event => {
        if (
          event.target == clarity_btn ||
          event.target == clarity_list_current ||
          event.target == clarity_list_ld ||
          event.target == clarity_list_sd ||
          event.target == clarity_list_hd
        ) {
          clarity_list.style.display = "block";
        } else {
          clarity_list.style.display = "none";
        }
      },
      false
    );

    clarity_btn.appendChild(clarity_list);
    controls.appendChild(clarity_btn);

    //---------------清晰度end

    //---------------全屏

    let fullscreen_btn = this.createEl("li", "usagi-player-fullscreen-btn");
    fullscreen_btn.innerHTML = '<div class="icon icon-fullscreen"></div>';
    fullscreen_btn.addEventListener("click", function() {
      context.fullscreen.toggleFullscreen(container);
      controls.style.bottom = "0px";
    });

    controls.appendChild(fullscreen_btn);

    //---------------全屏end

    container.appendChild(controls);

    df.appendChild(container);
    video.before(df);

    video.parentNode.removeChild(video);

    this.video = document.getElementById(this.options.id);
    this.danmaku_container = danmaku_container;

    let center_play_btn = this.createEl(
      "div",
      "icon icon-play_circle center-play-btn"
    );

    let play_fn = () => {
      this.video.play();
    };

    let pause_fn = () => {
      this.video.pause();
    };

    play_btn.addEventListener("click", play_fn);

    this.on("canplay", () => {
      total_time.innerHTML = this.timeConvert(parseInt(this.video.duration));
    });

    let progress_timer;

    this.on("play", () => {
      info_container.style.opacity = 0;
      try {
        info_container.removeChild(center_play_btn);
      } catch (e) {}

      play_btn.setAttribute("class", "usagi-player-pause-btn");
      play_btn.innerHTML = '<div class="icon icon-pause"></div>';
      play_btn.removeEventListener("click", play_fn);
      play_btn.addEventListener("click", pause_fn);

      progress_timer = setInterval(function() {
        let current_time_value = parseInt(context.video.currentTime);
        current_time.innerHTML = context.timeConvert(current_time_value);
        if (!window.usagiplayerglobal.progressbar_down) {
          let cent =
            current_time_value / parseInt(context.video.duration) * 100;
          progress_bar_played.style.width = cent + "%";
        }
      }, 500);

      context.createDanmaku("弹幕测试", "#fff");
      context.createDanmaku("弹幕测试弹幕测试", "#fff");
      context.createDanmaku("弹幕测试弹幕测试弹幕测试", "#fff");
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

    if (this.options.controller.embed) {
      container.addEventListener("mousemove", () => {
        controls.setAttribute("class", "usagi-player-controls animated fadeIn");
      });

      container.addEventListener("mouseleave", () => {
        controls.setAttribute(
          "class",
          "usagi-player-controls animated fadeOut"
        );
      });
    } else {
      controls.style.opacity = 1;
      controls.style.bottom = "-40px";
    }
  }

  createDanmaku(text, color) {
    let getTextLength = str => {
      if (str == null) return 0;
      if (typeof str != "string") {
        str += "";
      }
      return str.replace(/[^\x00-\xff]/g, "01").length;
    };
    let danmaku = this.createEl("div", "usagi-player-danmaku");
    danmaku.style.color = color;
    danmaku.style.fontSize = this.options.danmaku.font_size + "px";
    let factor = this.options.danmaku.font_size / 2;
    danmaku.style.top = Math.random() * (this.video.clientHeight - 20) + "px";
    danmaku.style.right = "-" + getTextLength(text) * factor + "px";
    danmaku.innerHTML = text;
    danmaku.style.animation = "danmaku-run " + getTextLength(text) + "s";

    this.danmaku_container.appendChild(danmaku);
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
