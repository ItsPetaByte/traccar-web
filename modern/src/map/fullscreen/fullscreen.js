import './fullscreen.css';

export class FullscreenControl {

  constructor() {
    this.fullscreen = false;
  }

  getDefaultPosition () {
    return 'botttom-right';
  }

  onAdd(map) {
    this.map = map;
    this.controlContainer = document.createElement('div');
    this.controlContainer.classList.add('maplibregl-ctrl');
    this.controlContainer.classList.add('maplibregl-ctrl-group');

    this.span = document.createElement('span');
    this.span.classList.add('maplibregl-ctrl-icon');

    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.classList.add('maplibregl-ctrl-fullscreen');

    this.button.appendChild(this.span);
    this.controlContainer.appendChild(this.button);

    this.button.addEventListener('click', this.onButtonClick.bind(this));

    return this.controlContainer;
  }

  onRemove () {
    if (!this.controlContainer || !this.controlContainer.parentNode || !this.map || !this.button) {
      return;
    }
    this.button.removeEventListener('click', this.onButtonClick.bind(this));
    this.map = undefined;
  }


  onButtonClick() {

    this.fullscreen = !this.fullscreen;

    if (this.fullscreen) {
      this._exitFullscreen(document);
      this.button.classList.add('maplibregl-ctrl-fullscreen');
      this.button.classList.remove('maplibregl-ctrl-shrink');
    }
    else {
      this._enterFullScreen(document.documentElement);
      this.button.classList.remove('maplibregl-ctrl-fullscreen');
      this.button.classList.add('maplibregl-ctrl-shrink');
    }

  }


  _enterFullScreen (element) {
    if(element.requestFullscreen) {
      element.requestFullscreen();
    }else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();     // Firefox
    }else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();  // Safari
    }else if(element.msRequestFullscreen) {
      element.msRequestFullscreen();      // IE/Edge
    }
  };


  _exitFullscreen (element) {
    if(document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  };


}
