import { _decorator, Component, director, instantiate, Layout, Node, Prefab, Size, sys, UITransform, Vec2 } from 'cc';
import { Card } from './Card';
import { UIManager } from './UIManager';
import { EventsManager } from './EventsManager';
import { GameSettingsManager } from './GameSettingsManager';
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

    private isLoadingSavedGame: boolean = false;

    private savedData: any = null;

    private loadGameMatchedItems: Node[] = [];

    protected onLoad(): void
    {
        let _gameSettingsManager = director.getScene().getChildByName("GameSettingsManager");
        if(_gameSettingsManager)
        {
            let _gameSettingsManagerComp = _gameSettingsManager.getComponent(GameSettingsManager);

            if(_gameSettingsManagerComp.needsToLoadSavedGame)
            {
                let saved = sys.localStorage.getItem("MemoryQuestSave");
                if (saved)
                {
                    this.isLoadingSavedGame = true;
                    this.savedData = JSON.parse(saved);
                    // console.log("Loaded save:", saveData);
                    this.gridSize = this.savedData.gridSize;
                    this.matchedCards = this.savedData.score;
                }
            }
            else
            {
                this.gridSize = _gameSettingsManagerComp.getGridDimension();
            }
            director.removePersistRootNode(_gameSettingsManager);
        }
    }

    protected start(): void
    {
        this.initGame();
        if(!this.isLoadingSavedGame)
        {
            this.shuffleCards();
            this.uiManager.renderGrid(this.instantiatedCards);
        }
        else
        {
            this.uiManager.renderPreLoadedGrid(this.instantiatedCards, this.loadGameMatchedItems);
            this.uiManager.setPreLoadedScore(this.savedData.score);
            this.uiManager.setPreLoadedTurns(this.savedData.turns);
        }
        this.uiManager.setGridSize(this.gridSize);
        
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
        
        if(!this.isLoadingSavedGame)
        {
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
        }
        else
        {
            this.instantiateCardsFromSavedData();
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
            EventsManager.event.emit("NoMatch");
        }

        this.selectedCards.pop();
        this.selectedCards.pop();

        // console.log("matched cards: "+this.matchedCards+" instantiated cards: "+(this.instantiatedCards.length));
        if(this.matchedCards >= this.instantiatedCards.length)
        {
            EventsManager.event.emit("IncrTurns");
            EventsManager.event.emit("GameOver", this.gridSize);
        }
    }

    private instantiateCardsFromSavedData(): void
    {

        this.savedData.grid.forEach((item: { name: string; isActive: boolean }) => {
            
            // console.log(item.name, ":", item.isActive);

            let _num = parseInt(item.name.split("_")[1]);

            let _card1 = instantiate(this.cards[_num-1]);
            _card1.getComponent(UITransform).contentSize = new Size(elementXSize, elementYSize);
            _card1.children.forEach(element => {
                element.getComponent(UITransform).contentSize = new Size(elementXSize, elementYSize);
            });
            
            this.instantiatedCards.push(_card1);

            if(!item.isActive)
            {
                // console.log(item.name);
                this.loadGameMatchedItems.push(_card1);
            }
        });

    }


}


