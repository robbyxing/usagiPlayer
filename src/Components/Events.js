import EventEmitter from '../Utils/EventEmitter';
import Observer from '../Utils/Observer';

export default class Events  {

    constructor (){
        this.observable = new EventEmitter();
        this.observer = new Observer('player', this.observable);
    }

    emit(event_name, data){
        this.observer.emit(event_name, data);
    }

    on(event_name, callback){
        this.observer.on(event_name, callback);
    }
    
}