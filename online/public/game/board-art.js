'use strict';
// Inline vector flags render consistently on Windows, where flag emoji show letters.
function flagArt(flag){
 const rect=(x,y,w,h,c)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;
 const stripes=(colors,vertical=false)=>colors.map((c,i)=>rect(vertical?i*30/colors.length:0,vertical?0:i*30/colors.length,vertical?30/colors.length:30,vertical?30:30/colors.length,c)).join('');
 const circle=(x,y,r,c)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;
 const flags={
  '🇮🇹':stripes(['#209653','#fff','#df3d42'],true),'🇮🇪':stripes(['#70a648','#fff','#ed8939'],true),'🇫🇷':stripes(['#0753a0','#fff','#e33b45'],true),'🇷🇴':stripes(['#1648a3','#fcd94a','#ee3c44'],true),
  '🇩🇪':stripes(['#17141b','#dd3043','#ffce37']),'🇭🇺':stripes(['#d72944','#fff','#369966']),'🇳🇱':stripes(['#dd3043','#fff','#2258a7']),
  '🇺🇸':stripes(Array.from({length:13},(_,i)=>i%2?'white':'#e74b5a'))+rect(0,0,16,16,'#2854a1')+Array.from({length:9},(_,i)=>circle(3+i%3*5,3+Math.floor(i/3)*5,.9,'white')).join(''),
  '🇬🇧':rect(0,0,30,30,'#17438d')+'<path d="M0 0L30 30M30 0L0 30" stroke="white" stroke-width="7"/><path d="M0 0L30 30M30 0L0 30" stroke="#e43850" stroke-width="3"/><path d="M15 0V30M0 15H30" stroke="white" stroke-width="10"/><path d="M15 0V30M0 15H30" stroke="#e43850" stroke-width="6"/>',
  '🇯🇵':rect(0,0,30,30,'white')+circle(15,15,8,'#d93050'),
  '🇹🇷':rect(0,0,30,30,'#e61840')+circle(13,15,8,'white')+circle(16,13,6,'#e61840')+'<path d="m23 10 1.3 3.5H28l-3 2 1 3.5-3-2-3 2 1-3.5-3-2h3.7z" fill="white"/>',
  '🇨🇳':rect(0,0,30,30,'#e61640')+'<path d="m10 5 2 5h5l-4 3 1.5 5-4.5-3-4.5 3L7 13l-4-3h5z" fill="#ffda50"/>',
  '🇨🇦':stripes(['#e51e43','white','#e51e43'],true)+'<path d="m15 6 2 6 3-2-1 5 3 1-6 5v4h-2v-4l-6-5 3-1-1-5 3 2z" fill="#e51e43"/>',
  '🇧🇷':rect(0,0,30,30,'#62a439')+'<path d="m15 3 13 12-13 12L2 15z" fill="#ffe357"/>'+circle(15,15,7,'#24558c')+'<path d="M8 13q7-2 14 5" stroke="white" fill="none" stroke-width="2"/>',
  '🇮🇱':rect(0,0,30,30,'white')+rect(0,5,30,4,'#2972cf')+rect(0,22,30,4,'#2972cf')+'<path d="m15 10 5 9H10zm0 11-5-9h10z" fill="none" stroke="#2972cf" stroke-width="1.2"/>',
  '🇮🇳':stripes(['#f7a23d','white','#5a9b40'])+circle(15,15,3,'#315ba0'),
 };
 return flags[flag]?`<svg class="country-flag" viewBox="0 0 30 30" role="img" aria-label="${flag}">${flags[flag]}</svg>`:flag;
}
function tileArt(s){if(s.flag)return flagArt(s.flag);if(s.type==='community')return '<svg class="treasure-art" viewBox="0 0 40 40" aria-hidden="true"><rect x="5" y="8" width="30" height="27" rx="5" fill="#a96509" stroke="#ffc44a" stroke-width="3"/><path d="M6 21h28M13 9v25M28 9v25" stroke="#ffb733" stroke-width="3"/><rect x="17" y="18" width="7" height="9" rx="2" fill="#ffdf67"/><path d="M20.5 21v3" stroke="#7a4500" stroke-width="2"/></svg>';if(s.type==='chance')return '?';return s.icon;}
