import { _decorator, Component, Label, Layout, Node, Vec2, Animation } from 'cc';
import { EventsManager } from './EventsManager';
const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {
    
    @property(Node)
    private gridContainer: Node = null;

    @property(Label)
    private turnsValTxt: Label = null;

    @property(Label)
    private scoreValTxt: Label = null;

    @property(Node)
    private gameOverTxt: Node = null;

    @property(Label)
    private summaryTxt: Label = null;

    @property(Node)
    private matchesTxt: Node = null;

    @property(Node)
    private turnTxt: Node = null;


    public renderGrid(cards: Node[]): void
    {
        cards.forEach(card => {
            card.setParent(this.gridContainer);
        });   
    }

    protected start(): void
    {
        EventsManager.event.on("GameStarted", this.onGameStarted, this);
        EventsManager.event.on("IncrTurns", this.incrTurns, this);
        EventsManager.event.on("IncrScore", this.incrScore, this);
        EventsManager.event.on("GameOver", this.onGameover, this);
    }

    private onGameStarted(): void
    {
        this.gridContainer.getComponent(Layout).enabled = false;
    }

    private incrTurns(): void
    {
        let _turnVal = parseInt(this.turnsValTxt.string);
        _turnVal++;

        this.turnsValTxt.string = _turnVal.toString();
    }

    private incrScore(): void
    {
        let _scoreVal = parseInt(this.scoreValTxt.string);
        _scoreVal += 2;

        this.scoreValTxt.string = _scoreVal.toString();

        this.scoreValTxt.node.getComponent(Animation).play();
    }

    private onGameover(gridSize: Vec2): void
    {
        // console.log("Game Completed");

        this.gridContainer.active = false;

        this.turnTxt.active = false;
        this.matchesTxt.active = false;
        this.scoreValTxt.node.active = false;
        this.turnsValTxt.node.active = false;

        this.summaryTxt.string = "You've completed this "+gridSize.x+" x "+gridSize.y+" board in "+this.turnsValTxt.string+" turns.";
        this.gameOverTxt.active=true;
        this.summaryTxt.node.active=true;
        
    }
}


