const {readFileSync}=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const context=vm.createContext({console,setTimeout:fn=>{fn();return 0},clearTimeout:()=>{},localStorage:{getItem:()=>null,setItem:()=>{}},document:{getElementById:()=>({open:false})}});
vm.runInContext(readFileSync('maps.js','utf8')+'\n'+readFileSync('game.js','utf8').split("$('chat-form').onsubmit")[0],context);
vm.runInContext('draw=()=>{};toast=()=>{};sound=()=>{};purchaseEffect=()=>{};updateTokens=()=>{};drawActions=()=>{};drawDice=()=>{};',context);
const run=code=>vm.runInContext(code,context);
function fresh(mode='solo',map='lucky'){run(`game=newGame('${mode}','${map}');spaces=MAPS[game.map].spaces;busy=false;`)}
for(const map of ['lucky','death','world','classic']){
 for(const mode of ['solo','teams']){
  fresh(mode,map);
  assert.equal(run('spaces.length'),map==='world'?48:40);
  assert.equal(run('game.teams.length'),mode==='solo'?6:3);
  assert.equal(run('team().cash'),mode==='solo'?1500:3000);
  assert.equal(run('new Set(spaces.map((s,i)=>coordinate(i).join(","))).size'),run('spaces.length'));
  assert.equal(run('spaces.filter(s=>s.type==="jail").length'),1);
  assert.equal(run('spaces.filter(s=>s.type==="station").length'),4);
  run('active().pos=1;land();buy()');
  assert.equal(run('game.owners[1]'),0);
  const cash=run('team().cash');
  run('game.turn=3;active().pos=1;land()');
  assert.equal(run('game.teams[0].cash'),mode==='solo'?cash+6:cash);
  run('sendToJail()');
  assert.equal(run('active().pos'),map==='world'?12:10);
 }
}
fresh();run('charge(0,2000)');assert.equal(run('game.teams[0].out'),true);assert.equal(run('game.teams[3].out'),false);
run("game.phase='end';endTurn()");assert.equal(run('game.turn'),1);
run('game.teams.forEach((t,i)=>t.out=i!==4);checkWinner()');assert.equal(run('game.winner'),4);
fresh('teams');run('charge(0,4000)');assert.equal(run('game.teams[game.players[3].team].out'),true);
fresh('solo','world');run('spaces.forEach((s,i)=>{if(s.group===10)game.owners[i]=0})');assert.equal(run('completeSet(10,0)'),true);assert.equal(run('canBuild(37)'),true);
run('game.houses[37]=1');assert.equal(run('canBuild(37)'),false);
fresh('solo','world');run('game.owners[15]=0;game.owners[22]=0;game.owners[33]=0');assert.equal(run('rent(15,7)'),70);
fresh();run('active().pos=12;land()');assert.equal(run('team().cash'),1350);
fresh();run('active().pos=37;land()');assert.equal(run('team().cash'),1550);
fresh('solo','world');run('localStorage.getItem=()=>JSON.stringify(game)');assert.equal(run('loadGame().map'),'world');assert.equal(run('loadGame().owners.length'),48);
run("localStorage.getItem=()=>JSON.stringify({...newGame('teams','classic'),version:1,map:undefined,mode:undefined})");assert.equal(run('loadGame().map'),'classic');
// Exercise the asynchronous roll at the board boundary with deterministic dice.
fresh('solo','world');
run("document.getElementById=()=>({classList:{add(){},remove(){}}});Math.random=()=>0;active().pos=47;");
(async()=>{await run('roll()');assert.equal(run('active().pos'),1);assert.equal(run('team().cash'),1700);assert.equal(run('game.phase'),'buy');console.log('Passed: all maps/modes, coordinates, buying/rent, elimination, victory, building, utilities, taxes/refund, save migration, and 48-space wraparound.');})().catch(e=>{console.error(e);process.exitCode=1});

