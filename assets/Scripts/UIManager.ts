import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {
    
    @property(Node)
    private gridContainer: Node = null;


    public renderGrid(cards: Node[]): void
    {
        cards.forEach(card => {
            card.setParent(this.gridContainer);
        });   
    }
}


