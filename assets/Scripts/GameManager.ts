import { _decorator, Component, instantiate, Layout, Node, Prefab, Size, UITransform, Vec2 } from 'cc';
import { Card } from './Card';
import { UIManager } from './UIManager';
const { ccclass, property } = _decorator;

const elementXSize: number = 128.5;
const elementYSize: number = 201;
const maxColSize: number = 7;
const maxRowSize: number = 4;


@ccclass('GameManager')
export class GameManager extends Component {
    
    @property(Vec2)
    private gridSize: Vec2 = null;

    @property(UIManager)
    private uiManager: UIManager = null;

    @property(Prefab)
    private cards: Prefab[] = [];
    
    @property(Layout)
    private gridContainer: Layout = null;

    private instantiatedCards: Node[] = [];


    protected start(): void
    {
        this.initGame();
        this.shuffleCards();
        this.uiManager.renderGrid(this.instantiatedCards);
        
        this.scheduleOnce(function(){
            this.hideAllCards();
        }, 4);
    }

    private initGame(): void
    {
        this.gridContainer.cellSize = new Size(elementXSize, elementYSize);
        this.gridContainer.constraintNum = this.gridSize.y;

        let _totalCards = this.gridSize.x * this.gridSize.y;
        if(_totalCards % 2 != 0)
        {
            _totalCards -= 1;
        }
        
        for(let i=0; i<(_totalCards/2); i++)
        {
            let _card1 = instantiate(this.cards[i]);
            _card1.getComponent(UITransform).contentSize = new Size(elementXSize, elementYSize);
            _card1.children.forEach(element => {
                element.getComponent(UITransform).contentSize = new Size(elementXSize, elementYSize);
            });
            this.instantiatedCards.push(_card1);

            let _card2 = instantiate(this.cards[i]);
            _card2.getComponent(UITransform).contentSize = new Size(elementXSize, elementYSize);
            _card2.children.forEach(element => {
                element.getComponent(UITransform).contentSize = new Size(elementXSize, elementYSize);
            });
            this.instantiatedCards.push(_card2);
        }

        let _colDif = maxColSize - this.gridSize.y;
        let _rowDif = maxRowSize - this.gridSize.x;

        if(_colDif != 0)
        {
            let _gridpos = this.gridContainer.node.getPosition();
            this.gridContainer.node.setPosition(_gridpos.x + _colDif * (elementXSize/4 + this.gridContainer.paddingLeft), _gridpos.y);
        }
        if(_rowDif != 0)
        {
            let _gridpos = this.gridContainer.node.getPosition();
            this.gridContainer.node.setPosition(_gridpos.x, _gridpos.y - _rowDif * (elementYSize/2 + this.gridContainer.paddingTop));
        }
    }

    private shuffleCards(): void
    {
        for (let i = this.instantiatedCards.length - 1; i > 0; i--)
        {
            const j = Math.floor(Math.random() * (i + 1));
            [this.instantiatedCards[i], this.instantiatedCards[j]] = [this.instantiatedCards[j], this.instantiatedCards[i]];
        }

    }

    private hideAllCards(): void
    {
        this.instantiatedCards.forEach(card => {
            card.getComponent(Card).hideCard();
        });
    }


}


