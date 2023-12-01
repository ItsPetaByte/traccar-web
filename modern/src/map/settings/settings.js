import './settings.css';
export class SettingsControl {

  constructor(navigate) {
    this.navigate = navigate;
  }

  onAdd(map) {
    this.map = map;
    this.controlContainer = document.createElement('div');
    this.controlContainer.classList.add('maplibregl-ctrl');
    this.controlContainer.classList.add('maplibregl-ctrl-group');

    this.span = document.createElement('span');
    this.span.classList.add('maplibregl-ctrl-settings');

    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.classList.add('maplibregl-ctrl-icon');

    this.button.appendChild(this.span);
    this.controlContainer.appendChild(this.button);

    this.button.addEventListener('click', this._onButtonClick.bind(this));

    return this.controlContainer;
  }

  onRemove () {
    if (!this.controlContainer || !this.controlContainer.parentNode || !this.map || !this.button) {
      return;
    }
    this.button.removeEventListener('click', this._onButtonClick.bind(this));
    this.map = undefined;
  }


  _onButtonClick() {
    this.navigate();
  }

}
