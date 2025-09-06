import { _decorator, CCInteger, Component, Animation, Input, EventTouch } from 'cc';
import { EventsManager } from './EventsManager';
const { ccclass, property } = _decorator;

@ccclass('Card')
export class Card extends Component {
    
    @property(CCInteger)
    private cardType: number = 1;

    private animComp: Animation = null;

    private isRevealed: boolean = true;

    protected start(): void
    {
        this.animComp = this.node.getComponent(Animation);
        EventsManager.event.on("GameStarted", this.onGameStarted, this);
    }

    public getType(): number
    {
        return this.cardType;
    }

    public revealCard(): void
    {
        if(!this.isRevealed)
        {
            this.animComp.play("cardReveal");
            this.isRevealed = true;

            EventsManager.event.emit("CardSelected", this);
        }
    }
    
    public hideCard(): void
    {
        this.animComp.play("cardHide");
        this.isRevealed = false;
    }

    private onTouchStart(event: EventTouch)
    {
        // console.log("Node tapped:", this.node.name);
        this.revealCard();
    }

    protected onDestroy(): void
    {
        this.node.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }

    private onGameStarted(): void
    {
        this.hideCard();
        this.scheduleOnce(function(){
            this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        }, 0.19);
    }
}


