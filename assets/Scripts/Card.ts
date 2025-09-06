import { _decorator, CCInteger, Component, Node, Animation } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Card')
export class Card extends Component {
    
    @property(CCInteger)
    private cardType: number = 1;

    private animComp: Animation = null;

    protected start(): void
    {
        this.animComp = this.node.getComponent(Animation);
    }

    public getType(): number
    {
        return this.cardType;
    }

    public revealCard(): void
    {
        this.animComp.play("cardReveal");
    }
    
    public hideCard(): void
    {
        this.animComp.play("cardHide");
    }
}


