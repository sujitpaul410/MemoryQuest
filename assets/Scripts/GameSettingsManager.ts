import { _decorator, Component, director, Button, Vec2, sys, Node } from 'cc';
import { DropDown } from './DropDown';
import { EventsManager } from './EventsManager';
const { ccclass, property } = _decorator;

@ccclass('GameSettingsManager')
export class GameSettingsManager extends Component {
    
    @property(DropDown)
    private rowsDropDown: DropDown = null;

    @property(DropDown)
    private columnsDropDown: DropDown = null;

    @property(Button)
    private startBtn: Button = null;

    private numRows: number = 2;

    private numCols: number = 2;

    public savedGame: string = null;

    @property(Node)
    private loadGameBtnNode: Node = null;

    public needsToLoadSavedGame: boolean = false;

    protected onLoad(): void
    {
        director.addPersistRootNode(this.node);
    }

    protected start(): void
    {
        this.savedGame = sys.localStorage.getItem("MemoryQuestSave");
        if (!this.savedGame)
        {
            return;
        }
        else
        {
            this.loadGameBtnNode.active = true;
        }
    }

    private startGameBtnClick(): void
    {
        EventsManager.event.emit("Tap");

        this.startBtn.interactable = false;
        this.rowsDropDown.node.children[0].getComponent(Button).interactable = false;
        this.columnsDropDown.node.children[0].getComponent(Button).interactable = false;
        this.loadGameBtnNode.getComponent(Button).interactable=false;

        this.numRows = this.rowsDropDown.getCurrVal();
        this.numCols = this.columnsDropDown.getCurrVal();

        director.loadScene("mainScene");
    }

    public getGridDimension(): Vec2
    {
        return new Vec2(this.numRows, this.numCols);
    }

    private loadGameBtnClick(): void
    {
        this.needsToLoadSavedGame = true;
        this.startGameBtnClick();
    }
}


