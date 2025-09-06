import { _decorator, Component, Layout, Node } from 'cc';
import { EventsManager } from './EventsManager';
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

    protected start(): void
    {
        EventsManager.event.on("GameStarted", this.onGameStarted, this);
    }

    private onGameStarted(): void
    {
        this.gridContainer.getComponent(Layout).enabled = false;
    }
}


