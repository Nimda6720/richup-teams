import {readFileSync,writeFileSync} from 'node:fs';
const maps=readFileSync('public/game/maps.js','utf8');
let code=readFileSync('public/game/game.js','utf8').split("$('chat-form').onsubmit")[0];
code=code.replace('const pause=ms=>new Promise(r=>setTimeout(r,ms));','const pause=async()=>{};');
const pre=`// Generated from public/game by scripts/generate-engine.mjs.
export function createEngine(snapshot=null){
const localStorage={getItem:()=>null,setItem:()=>{}};
const document={getElementById:()=>({classList:{add(){},remove(){}},open:false}),querySelectorAll:()=>[]};
const Math=Object.create(globalThis.Math);Math.random=()=>crypto.getRandomValues(new Uint32Array(1))[0]/4294967296;
`;
const post=`
draw=()=>{};drawActions=()=>{};drawDice=()=>{};updateTokens=()=>{};sound=()=>{};purchaseEffect=()=>{};showProperties=()=>{};scheduleBot=()=>{};save=()=>{};toast=message=>{throw new Error(message)};
if(snapshot){game=structuredClone(snapshot);spaces=MAPS[game.map].spaces;}
return {get state(){return game},get spaces(){return spaces},newGame(mode,map,names,colors){game=newGame(mode,map,names);spaces=MAPS[map].spaces;game.teams.forEach((t,i)=>t.color=colors[i]);return game},async action(type,arg){if(type==='roll')await roll();else if(type==='buy')buy();else if(type==='pass')pass();else if(type==='end')endTurn();else if(type==='release') {if(!active().jail||team().cash<50)throw new Error('Cannot pay the jail fine');charge(active().team,50);active().jail=0;await roll()}else if(type==='build')build(arg);else if(type==='forfeit'){game.teams[active().team].cash=0;game.teams[active().team].out=true;game.owners.forEach((o,i)=>{if(o===active().team){game.owners[i]=null;game.houses[i]=0}});game.bonus=false;game.phase='end';log(esc(active().name)+' forfeited.');checkWinner();if(game.winner===null)endTurn()}else throw new Error('Unknown action');return game},canBuild,log};
}
`;
writeFileSync('server/engine.mjs',pre+maps+'\n'+code+post);
