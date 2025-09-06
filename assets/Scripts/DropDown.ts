import { _decorator, Button, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DropDown')
export class DropDown extends Component {
    
    @property(Button)
    private primaryBtn: Button = null;

    @property(Label)
    private primaryBtnLabel: Label = null;

    @property(Button)
    private secondaryButtons: Button[] = [];

    private listNode: Node = null;

    private isListNodeActive = false;

    private currVal: number = 2;

    protected start(): void
    {
        this.listNode = this.node.getChildByName("List");
    }
    
    private onPrimaryButtonClick(): void
    {
        if(!this.isListNodeActive)
        {
            this.listNode.active = true;
            this.isListNodeActive = true;

            this.primaryBtnLabel.string = "        "+this.currVal+"      "+"▼";
        }
        else
        {
            this.listNode.active = false;
            this.isListNodeActive = false;

            this.primaryBtnLabel.string = "        "+this.currVal+"      "+"▲";
        }
    }

    private onSecondaryBtnClick(event: Event, customEventData: string): void
    {
        this.currVal = parseInt(customEventData);

        this.listNode.active = false;
        this.isListNodeActive = false;

        this.primaryBtnLabel.string = "        "+this.currVal+"      "+"▲";

    }

    public getCurrVal(): number
    {
        return this.currVal;
    }
}


