import { _decorator, Component, Label, Layout, Node, Vec2, Animation, director, Button, sys } from 'cc';
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

    @property(Button)
    private homeBtn: Button = null;

    private currGridSize: Vec2 = null;

    @property(Node)
    private bg: Node = null;

    @property(Node)
    private saveBtnNode: Node = null;


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
        this.saveBtnNode.active = true;
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

        this.saveBtnNode.active = false;
        this.gridContainer.active = false;

        this.turnTxt.active = false;
        this.matchesTxt.active = false;
        this.scoreValTxt.node.active = false;
        this.turnsValTxt.node.active = false;

        this.summaryTxt.string = "You've completed this "+gridSize.x+" x "+gridSize.y+" board in "+this.turnsValTxt.string+" turns.";
        this.gameOverTxt.active=true;
        this.summaryTxt.node.active=true;

        this.homeBtn.node.setPosition(0, -194);
        
    }

    private onHomeBtnClick(): void
    {
        EventsManager.event.emit("Tap");
        this.homeBtn.interactable = false;
        director.loadScene("mainMenuScene");
    }

    public setGridSize(gridSize: Vec2)
    {
        this.currGridSize = gridSize;
    }

    private onSaveGameBtnClick(): void
    {
        EventsManager.event.emit("Tap");

        let _grid: { name: string; isActive: boolean }[] = [];

        this.gridContainer.children.forEach(card => {
            _grid.push({ name: card.name, isActive: card.activeInHierarchy });
        });

        let saveData = {
            gridSize: { x: this.currGridSize.x, y: this.currGridSize.y },
            score: parseInt(this.scoreValTxt.string),
            turns: parseInt(this.turnsValTxt.string),
            grid: _grid,
        };

        sys.localStorage.setItem("MemoryQuestSave", JSON.stringify(saveData));
    }

    public renderPreLoadedGrid(cards: Node[], alreadyMatchedItems: Node[]): void
    {
        this.bg.setSiblingIndex(10);
        
        cards.forEach(card => {
            card.setParent(this.gridContainer);
        });
        
        this.scheduleOnce(function(){
            this.onGameStarted();
            

            alreadyMatchedItems.forEach(card => {
                card.active = false;
            });

            this.bg.setSiblingIndex(1);
        }, 0.5);
    }

    public setPreLoadedScore(score: number): void
    {
        this.scoreValTxt.string = score.toString();
    }

    public setPreLoadedTurns(turns: number): void
    {
        this.turnsValTxt.string = turns.toString();
    }
}


