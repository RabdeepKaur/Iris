import React, { useState } from 'react'

// game confu=igurtation
export const GAME_START_TIME=20;
export const GAME_EXTEND_TIME=10;
export const GAME_MAX_ITEMS=10;
 const SPEAKING_DELAY=2500;
 const GAME_TIMER_DELAY=1000;

 interface EmojiItem{
name:string;
path:string;
 }
interface EmojiLevelLookUp{
    [index:String]:Array<EmojiItem>;
}
interface Player{
    id:string;
    name:string;
    score:number;
    emojiFound:Array<EmojiItem>;
    emojiGamePhotos:Array<HTMLImageElement>;
}

interface AudioSources{
    [index:string]:HTMLAudioElement;
}

const Audio={
    GAME_LOOP:'gameloop',
    TIME_RUNNING_LOW:'timerunningout',
    COUNTDOWN:'countdown',
    FAIL:'fail',
    FOUND_IT:'foundit',
    END:'endofgame',
    TIMER_INCREASE:'timerincrease',
    IOS_SPEECH_SPRITE:'iosspeechsprite'
};




const game = () => {
    const [isRunning,setRunning]=useState<boolean>(false);
    const[cameraPaused,setCameraPaused]=useState<boolean>(false);
    const[score,setScore]=useState<number>(0);
    const [timer,setTimer]=useState<number>(GAME_START_TIME);
    const [timerAtStart,setTimerAtStart]=useState<number>(GAME_START_TIME);
    const [emojiFound,setEmojiFound]=useState<Array<EmojiItem>>([]);
    const [endGamePhotos,setEndGamePhotos]=useState<Array<HTMLImageElement>>([]);
const [topItemsGuess,setTopItemsGuess]=useState<string |null>(null);
const [currentEmoji,setCurrentEmoji]=useState<EmojiItem|null>(null);






  return (
    <div>
      
    </div>
  )
}

export default game
