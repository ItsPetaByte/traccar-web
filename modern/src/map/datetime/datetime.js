import './datetime.css';
export class DatetimeControl {

  onAdd(map) {
    this.map = map;
    this.controlContainer = document.createElement('div');
    this.controlContainer.classList.add('maplibregl-ctrl');
    this.controlContainer.classList.add('maplibregl-ctrl-date-group');

    this.span = document.createElement('span');
    this.span.classList.add('maplibregl-ctrl-datetime');
    this.span.innerHTML = new Date().toLocaleString();

    this.controlContainer.appendChild(this.span);

    this.interval = setInterval(this.updateDatetime.bind(this), 1000);

    return this.controlContainer;
  }

  onRemove () {
    this.controlContainer.parentNode.removeChild(this.controlContainer);
    this.controlContainer = undefined;
    this.interval && clearInterval(this.interval);
    this.map = undefined;
  }


    updateDatetime() {
        this.span.innerHTML = new Date().toLocaleString();
    }



}
