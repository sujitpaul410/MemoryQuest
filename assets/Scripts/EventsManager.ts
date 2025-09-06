import { _decorator, Component, EventTarget } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EventsManager')
export class EventsManager extends Component {
    
    static event: EventTarget = new EventTarget();
}


