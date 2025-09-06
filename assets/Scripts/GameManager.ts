import { _decorator, Component, instantiate, Layout, Node, Prefab, Size, UITransform, Vec2 } from 'cc';
import { Card } from './Card';
import { UIManager } from './UIManager';
import { EventsManager } from './EventsManager';
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

    private selectedCards: Node[] = [];

    private matchedCards: number = 0;

    protected start(): void
    {
        this.initGame();
        this.shuffleCards();
        this.uiManager.renderGrid(this.instantiatedCards);
        
        this.scheduleOnce(function(){
            EventsManager.event.emit("GameStarted");
        }, 4);

        EventsManager.event.on("CardSelected", this.onCardRevealed, this);
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

    private onCardRevealed(selectedCard: Node)
    {
        // console.log("Selected Card Type: "+selectedCard.getComponent(Card).getType());

        this.selectedCards.push(selectedCard);
        if(this.selectedCards.length >= 2)
        {
            this.checkForMatch();
        }
        
        EventsManager.event.emit("IncrTurns");
    }

    private checkForMatch(): void
    {
        let _len = this.selectedCards.length;

        if(this.selectedCards[_len-1].getComponent(Card).getType() == this.selectedCards[_len-2].getComponent(Card).getType())
        {
            // console.log("Match");
            this.selectedCards[_len-1].getComponent(Card).vansihCard();
            this.selectedCards[_len-2].getComponent(Card).vansihCard();

            EventsManager.event.emit("IncrScore");

            this.matchedCards += 2;
        }
        else
        {
            let _card1 = this.selectedCards[_len-1];
            let _card2 = this.selectedCards[_len-2];
            this.scheduleOnce(function(){
                _card1.getComponent(Card).hideCard();
                _card2.getComponent(Card).hideCard();
            }, 0.4);
        }

        this.selectedCards.pop();
        this.selectedCards.pop();

        if(this.matchedCards >= this.instantiatedCards.length - 1)
        {
            EventsManager.event.emit("GameOver", this.gridSize);
        }
    }


}


