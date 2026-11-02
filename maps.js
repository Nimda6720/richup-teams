'use strict';
// Clockwise from START. Each row is one side, excluding the next corner.
const MAPS = (() => {
  const city=(name,flag,price,group)=>({name,flag,price,group,type:'property'});
  const special=(name,icon,type)=>({name,icon,type});
  const start=()=>special('START','▶▶','go'), jail=()=>special('Passing by','▥','jail'), vacation=()=>special('Vacation','🏝','parking'), prison=()=>special('Go to prison','☠','gotojail');
  const surprise=()=>special('Surprise','❔','chance'), treasure=()=>special('Treasure','🧰','community');
  const tax=()=>({...special('Earnings Tax','%','tax'),rate:.1}), premium=()=>({...special('Premium Tax','♧','luxury'),amount:75});
  const airport=name=>({...city(name+' Airport','✈',200,8),type:'station'});
  const utility=(name,icon)=>({...city(name+' Company',icon,150,9),type:'utility'});
  const c=city;
  return {
    lucky:{name:'Lucky Wheel',icon:'🍀',description:'A continent of cities. A world of surprises.',spaces:[
      start(),c('Antalya','🇹🇷',60,0),c('Istanbul','🇹🇷',80,0),c('Brasov','🇷🇴',100,1),c('Bucharest','🇷🇴',120,1),airport('TLV'),c('Milan','🇮🇹',140,2),c('Rome','🇮🇹',160,2),c('Munich','🇩🇪',180,3),c('Berlin','🇩🇪',200,3),
      jail(),treasure(),tax(),surprise(),treasure(),airport('MUC'),surprise(),treasure(),premium(),surprise(),
      vacation(),c('Beijing','🇨🇳',220,4),c('Shanghai','🇨🇳',240,4),c('Belfast','🇮🇪',260,5),c('Dublin','🇮🇪',280,5),airport('CDG'),c('Manchester','🇬🇧',300,6),c('London','🇬🇧',320,6),c('San Francisco','🇺🇸',350,7),c('New York','🇺🇸',400,7),
      prison(),treasure(),surprise(),premium(),treasure(),airport('JFK'),surprise(),{...special('Tax Refund','🎁','refund'),amount:50},treasure(),surprise()
    ]},
    death:{name:'Death Valley',icon:'☠',description:'Four countries. Fierce competition.',spaces:[
      start(),c('Ottawa','🇨🇦',60,0),treasure(),c('Quebec City','🇨🇦',60,0),tax(),airport('YYZ'),c('Montreal','🇨🇦',100,1),surprise(),c('Vancouver','🇨🇦',100,1),c('Toronto','🇨🇦',120,1),
      jail(),c('Wolfsburg','🇩🇪',140,2),utility('Energy','ϟ'),c('Cologne','🇩🇪',140,2),c('Hamburg','🇩🇪',160,2),airport('MUC'),c('Frankfurt','🇩🇪',180,3),treasure(),c('Munich','🇩🇪',180,3),c('Berlin','🇩🇪',200,3),
      vacation(),c('Glasgow','🇬🇧',220,4),surprise(),c('Cambridge','🇬🇧',220,4),c('Liverpool','🇬🇧',240,4),airport('LHR'),c('Birmingham','🇬🇧',260,5),c('Manchester','🇬🇧',260,5),utility('Water','♒'),c('London','🇬🇧',280,5),
      prison(),c('Boston','🇺🇸',300,6),c('Seattle','🇺🇸',300,6),treasure(),c('Chicago','🇺🇸',320,6),airport('JFK'),surprise(),c('San Francisco','🇺🇸',350,7),premium(),c('New York','🇺🇸',400,7)
    ]},
    world:{name:'Mr. Worldwide',icon:'🌐',description:'48 spaces. Ten countries. One global empire.',spaces:[
      start(),c('Salvador','🇧🇷',60,0),treasure(),c('Rio','🇧🇷',60,0),tax(),c('Tel Aviv','🇮🇱',100,1),airport('TLV'),c('Haifa','🇮🇱',100,1),c('Jerusalem','🇮🇱',110,1),surprise(),c('Mumbai','🇮🇳',120,2),c('New Delhi','🇮🇳',130,2),
      jail(),c('Venice','🇮🇹',140,3),c('Bologna','🇮🇹',140,3),utility('Energy','ϟ'),c('Milan','🇮🇹',160,3),c('Rome','🇮🇹',160,3),airport('MUC'),c('Frankfurt','🇩🇪',180,4),treasure(),c('Munich','🇩🇪',180,4),utility('Gas','♨'),c('Berlin','🇩🇪',200,4),
      vacation(),c('Shenzhen','🇨🇳',220,5),surprise(),c('Beijing','🇨🇳',220,5),treasure(),c('Shanghai','🇨🇳',240,5),airport('CDG'),c('Toulouse','🇫🇷',260,6),c('Paris','🇫🇷',260,6),utility('Water','♒'),c('Yokohama','🇯🇵',280,7),c('Tokyo','🇯🇵',280,7),
      prison(),c('Liverpool','🇬🇧',300,10),c('Manchester','🇬🇧',300,10),treasure(),c('Birmingham','🇬🇧',310,10),c('London','🇬🇧',320,10),airport('JFK'),c('Los Angeles','🇺🇸',330,11),surprise(),c('San Francisco','🇺🇸',380,11),premium(),c('New York','🇺🇸',400,11)
    ]}
  };
})();
