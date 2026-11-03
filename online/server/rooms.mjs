import {createEngine} from './engine.mjs';
const COLORS=['purple','orange','teal','blue','pink','yellow','red','green'];
const fail=(message,status=400)=>{throw Object.assign(new Error(message),{status})};
const id=()=>crypto.randomUUID().replaceAll('-','');
const response=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
function profile(room,body,seat=-1){
 if(typeof body.name!=='string'||!body.name.trim()||body.name.trim().length>18)fail('Choose a name of 1–18 characters.');
 if(!COLORS.includes(body.color))fail('Choose a valid color.');const name=body.name.trim(),index=seat<0?room.seats.length:seat,color=room.mode==='teams'&&index>=3?room.seats[index%3].color:body.color;
 if(room.seats.some((s,i)=>i!==seat&&s.name.toLowerCase()===name.toLowerCase()))fail('That name is already taken.');
 if(room.seats.some((s,i)=>i!==seat&&s.color===color&&(room.mode==='solo'||i%3!==index%3)))fail('That color is already taken.');return {name,color};
}
const view=(room,token)=>({id:room.id,version:room.version,mode:room.mode,map:room.map,started:!!room.game,you:room.seats.findIndex(s=>s.token===token),seats:room.seats.map(({token,...seat})=>seat),game:room.game,trade:room.trade??null});
export async function handleRooms(request,db){try{
 const url=new URL(request.url),path=url.pathname.replace(/^\/api\/rooms\/?/,'').split('/').filter(Boolean),token=request.headers.get('Authorization')?.replace(/^Bearer /,'')??'';
 if(!db)fail('Room storage unavailable.',503);
 async function load(){if(!/^[a-f0-9]{24}$/.test(path[0]??''))fail('Room not found.',404);const row=await db.prepare('SELECT data,version FROM rooms WHERE id=? AND expires>?').bind(path[0],Date.now()).first();if(!row)fail('This room has expired or does not exist.',404);return row;}
 if(request.method==='GET'){const row=await load(),room=JSON.parse(row.data);room.version=row.version;const result=view(room,token);if(room.game&&result.you<0)fail('This game has already started. Rejoin using the browser you joined with.',403);return response(result)}
 if(request.method!=='POST')fail('Method not allowed.',405);
 if(request.headers.get('Origin')&&request.headers.get('Origin')!==url.origin)fail('Use the game website to send moves.',403);
 const raw=await request.text();if(raw.length>8192)fail('Request too large.',413);let body;try{body=JSON.parse(raw)}catch{fail('Invalid request.')}
 if(!body||typeof body!=='object')fail('Invalid request.');
 if(path.length===0){
  if(!['solo','teams'].includes(body.mode)||!['lucky','death','world','classic'].includes(body.map))fail('Choose a game mode and map.');
  const room={id:id().slice(0,24),version:0,mode:body.mode,map:body.map,seats:[],game:null,commands:[]};const seat={...profile(room,body),token:id(),joined:Date.now()};room.seats.push(seat);
  await db.prepare('INSERT INTO rooms(id,version,data,expires) VALUES(?,?,?,?)').bind(room.id,0,JSON.stringify(room),Date.now()+7*86400000).run();return response({...view(room,seat.token),token:seat.token},201);
 }
 const action=path[1];if(!['join','profile','start','action','chat','trade','reply','skip','leave'].includes(action))fail('Unknown room action.',404);
 if(typeof body.requestId!=='string'||!/^[a-zA-Z0-9-]{16,64}$/.test(body.requestId))fail('Missing request identifier.');
 for(let attempt=0;attempt<5;attempt++){
  const row=await load(),room=JSON.parse(row.data);room.version=row.version;const actor=room.seats.findIndex(s=>s.token===token);let returnToken=token;
  const previous=room.commands.find(c=>c.key===body.requestId&&c.token===token);if(previous)return response({...view(room,previous.joinToken??token),...(previous.joinToken?{token:previous.joinToken}:{})});
  if(action==='join'){
   if(actor>=0)return response(view(room,token));if(room.game)fail('This game has already started.');if(room.seats.length>=6)fail('This room is full.');const seat={...profile(room,body),token:id(),joined:Date.now()};room.seats.push(seat);returnToken=seat.token;
  }else{
   if(actor<0)fail('Join this room first.',401);
   if(action==='profile'){if(room.game)fail('Names and colors are locked during the game.');Object.assign(room.seats[actor],profile(room,body,actor));if(room.mode==='teams'&&actor<3&&room.seats[actor+3])room.seats[actor+3].color=room.seats[actor].color;}
   else if(action==='leave'){if(room.game)fail('Use Forfeit on your turn to leave a running game.');if(actor===0)fail('The host must stay in the lobby.');room.seats.splice(actor,1);}
   else if(action==='start'){
    if(actor!==0)fail('Only the host can start.',403);if(room.game)fail('Already started.');if(room.seats.length<2||(room.mode==='teams'&&room.seats.length!==6))fail(room.mode==='teams'?'Team games need exactly six players.':'At least two players must join.');
    room.game=createEngine().newGame(room.mode,room.map,room.seats.map(s=>s.name),room.mode==='teams'?room.seats.slice(0,3).map(s=>s.color):room.seats.map(s=>s.color));room.turnSince=Date.now();room.game.status='Everyone has joined. Roll to begin.';
   }else await gameCommand(room,actor,action,body);
  }
  room.commands.push({key:body.requestId,token,...(action==='join'?{joinToken:returnToken}:{})});room.commands=room.commands.slice(-100);room.version=row.version+1;
  const result=await db.prepare('UPDATE rooms SET data=?,version=?,expires=? WHERE id=? AND version=?').bind(JSON.stringify(room),room.version,Date.now()+7*86400000,room.id,row.version).run();
  if(result.meta.changes===1)return response({...view(room,returnToken),...(action==='join'?{token:returnToken}:{})});
 }
 fail('Another player just updated the room. Try again.',409);
}catch(error){return response({error:error.status?error.message:(error.message?.includes('vault')?error.message:'Unable to complete that action. Please refresh and try again.')},error.status??400)}}
async function gameCommand(room,actor,action,body){
 if(!room.game)fail('The host has not started yet.');const g=room.game,engine=createEngine(g);
 if(action==='chat'){if(typeof body.text!=='string'||!body.text.trim()||body.text.length>220)fail('Messages must be 1–220 characters.');g.messages.push({name:room.seats[actor].name,text:body.text.trim()});g.messages=g.messages.slice(-50);return}
 if(g.winner!==null)fail('This game is finished.');
 if(action==='reply'){
  const o=room.trade;if(!o||o.id!==body.offerId||!(o.to===actor||(o.from===actor&&body.accept===false)))fail('That offer is no longer available.');
  if(body.accept===true){applyTrade(engine.state,engine.spaces,o);engine.log('Trade accepted.','⇄');room.game=engine.state}room.trade=null;return;
 }
 if(action==='skip'){
  if(actor!==0)fail('Only the host can skip an absent player.',403);if(Date.now()-room.turnSince<120000)fail('Wait two minutes before skipping an absent player.');engine.state.phase='end';engine.state.bonus=false;await engine.action('end');room.game=engine.state;room.trade=null;room.turnSince=Date.now();return;
 }
 if(actor!==g.turn)fail('It is not your turn.',403);if(body.version!==room.version)fail('The room changed. Review the latest board and try again.',409);
 if(action==='trade'){
  if(room.trade)fail('Resolve the current offer first.');const to=Number(body.to);if(!Number.isInteger(to)||!room.seats[to]||to===actor||g.players[to].team===g.players[actor].team||g.teams[g.players[to].team].out)fail('Choose an opposing player.');
  const offer={id:id(),from:actor,to,give:body.give,get:body.get,cashGive:body.cashGive,cashGet:body.cashGet};validateTrade(g,engine.spaces,offer);room.trade=offer;return;
 }
 if(room.trade)fail('Wait for the trade response first.');const phases={roll:'roll',release:'roll',buy:'buy',pass:'buy',end:'end'};
 if(![...Object.keys(phases),'build','forfeit'].includes(body.type))fail('Unknown game action.');if(phases[body.type]&&g.phase!==phases[body.type])fail('That action is not available now.');
 if(body.type==='build'&&(!Number.isInteger(body.space)||!engine.spaces[body.space]||g.owners[body.space]!==g.players[actor].team||!engine.canBuild(body.space)))fail('You cannot build there.');
 await engine.action(body.type,body.space);room.game=engine.state;if(room.game.turn!==g.turn)room.turnSince=Date.now();
}
function validateTrade(g,spaces,o){const from=g.players[o.from].team,to=g.players[o.to].team;for(const [value,owner] of [[o.give,from],[o.get,to]]){if(!Number.isInteger(value)||value< -1||value>=spaces.length)fail('Invalid property.');if(value>=0&&(g.owners[value]!==owner||spaces.some((s,i)=>s.group===spaces[value].group&&g.houses[i]>0)))fail('Only owned properties without buildings in their set can be traded.');}for(const [cash,owner] of [[o.cashGive,from],[o.cashGet,to]])if(!Number.isSafeInteger(cash)||cash<0||cash>g.teams[owner].cash)fail('Invalid cash offer.');if(o.give===-1&&o.get===-1&&o.cashGive===o.cashGet)fail('Add something to the trade.');}
function applyTrade(g,spaces,o){validateTrade(g,spaces,o);const from=g.players[o.from].team,to=g.players[o.to].team;if(o.give>=0)g.owners[o.give]=to;if(o.get>=0)g.owners[o.get]=from;g.teams[from].cash+=o.cashGet-o.cashGive;g.teams[to].cash+=o.cashGive-o.cashGet;}
