import { render, Component } from 'preact';
import './style.css';
import {AllDecks, DeckNames} from './data.js';

class App extends Component {
  constructor() {
    super();
    let state = Object.fromEntries(Object.keys(AllDecks).map( key => [key+'_checked', true]));
    state.chosen = [];
    state.locked = [];
    this.state = state;
  }

  toggleCardLock = e => {
    const key = e.target.id.slice(0, -("_locked".length));

    let locked = this.state.locked;
    let index = locked.indexOf(key);
    if (index == -1) {
      locked.push(key);
    } else {
      locked.splice(index, 1);
    }
    this.setState( {locked});
  };

  toggleDeck = e => {
    const key = e.target.id + '_checked';

    const newState = {};
    newState[key] = !this.state[key];
    this.setState( newState );
  };

  shuffle = (a) => {
    let currentIndex = a.length;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      const temporaryValue = a[currentIndex];
      a[currentIndex] = a[randomIndex];
      a[randomIndex] = temporaryValue;
    }
  }

  pickCards = (_) => {
    const flatAll= Object.keys(AllDecks).flatMap(
      set => this.state[set+'_checked'] ?
        AllDecks[set].map( card => set + ' - ' + card) :
        []);

    this.shuffle(flatAll);
    let chosen= flatAll.filter(v => !this.state.locked.includes(v)).slice(0, 10-this.state.locked.length);
    chosen = this.state.locked.concat(chosen);
    chosen.sort();
    this.setState({chosen});
  }

	render() {
    return (
      <>
        <h1>DOMINON! randomizer</h1>
        <div>
           {
             Object.keys(DeckNames).sort().map( name => (
               <div>
                 <label>
                   <input id={DeckNames[name]} type='checkbox' checked={this.state[DeckNames[name]+'_checked']}
                   onclick={this.toggleDeck}/>
                   {name}
                 </label>
               </div>)
             )
           }
        </div>
        <button id='pickButton' onclick={this.pickCards}>Pick Cards</button>
        <div id='cards' >
          {
            this.state.chosen.map( v => (
              <div id={v+'_locked'} class='card' onclick={this.toggleCardLock}>
                <span class={this.state.locked.includes(v) ? 'locked' : 'unlocked' }>
                {this.state.locked.includes(v) ?  '🔒' : '🔓'}</span>
                {v}
              </div>
            ))
          }
        </div>
      </>
	);
  }
}

render(<App />, document.getElementById('app'));
