import { _decorator, CCInteger, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Card')
export class Card extends Component {
    
    @property(CCInteger)
    private cardType: number = 1;

    public getType(): number
    {
        return this.cardType;
    }
}


