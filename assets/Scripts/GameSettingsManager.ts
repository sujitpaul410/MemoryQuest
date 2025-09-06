import { _decorator, Component, director, Button, Vec2 } from 'cc';
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

    protected onLoad(): void
    {
        director.addPersistRootNode(this.node);
    }

    private startGameBtnClick(): void
    {
        EventsManager.event.emit("Tap");

        this.startBtn.interactable = false;
        this.rowsDropDown.node.children[0].getComponent(Button).interactable = false;
        this.columnsDropDown.node.children[0].getComponent(Button).interactable = false;

        this.numRows = this.rowsDropDown.getCurrVal();
        this.numCols = this.columnsDropDown.getCurrVal();

        director.loadScene("mainScene");
    }

    public getGridDimension(): Vec2
    {
        return new Vec2(this.numRows, this.numCols);
    }
}


