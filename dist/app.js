const app=document.querySelector('#app');
let state={screen:'home',photo:null,goal:0,tasks:[],index:0,completed:[],description:'',distraction:false,seconds:0},timer=null,countdownTimer=null,breathTimer=null;
const goals=[['🧹','Clean this space'],['📚','Get ready to study'],['💻','Get ready to work'],['✨','Just make it feel less messy']];
const templates=[
 [{text:'Put 5 toys back in their tray.',time:120,icon:'🧸',instruction:'Pick up five toys from the rug and put them in the toy tray. Just five is enough.'},{text:'Gather the loose papers into one pile.',time:120,icon:'📄',instruction:'Collect the loose papers and cards from one small patch of the floor. Stack them together to sort later.'},{text:'Put 3 loose clothes in the laundry basket.',time:120,icon:'🧺',instruction:'Pick up three pieces of clothing from the floor and place them in the laundry basket.'},{text:'Stack the books in the basket.',time:120,icon:'📚',instruction:'Gather the books near the basket into one tidy stack. Leave a little more room to walk.'}],
 [{text:'Bring one book to your desk.',time:30,icon:'📚'},{text:'Find a pen and a notebook.',time:45,icon:'✏️'},{text:'Open to the page you need.',time:30,icon:'📖'},{text:'Read just the first paragraph.',time:60,icon:'🌱'}],
 [{text:'Clear one small spot on your desk.',time:30,icon:'✨'},{text:'Open the document you need.',time:30,icon:'💻'},{text:'Write down one thing to do.',time:45,icon:'✏️'},{text:'Spend one minute on that first thing.',time:60,icon:'🌱'}],
 [{text:'Put one piece of rubbish in the bin.',time:30,icon:'🗑️'},{text:'Put one item back where it belongs.',time:30,icon:'🌱'},{text:'Make a small pile of loose papers.',time:45,icon:'📄'},{text:'Clear one little corner.',time:60,icon:'✨'}]
];
function esc(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function milo(mode='normal'){
return `<svg viewBox="0 0 300 260" xmlns="http://www.w3.org/2000/svg" aria-label="Milo, a friendly little companion" role="img"><defs><radialGradient id="body"><stop stop-color="#fff6e6"/><stop offset="1" stop-color="#ffe5bf"/></radialGradient></defs><ellipse cx="150" cy="237" rx="90" ry="8" fill="#b68c5820"/><path d="M90 190 Q62 165 65 149 Q68 135 82 145 L99 158 C83 106 105 66 148 64 C192 61 218 94 208 147 L226 124 Q238 110 248 119 Q257 130 241 156 L216 190 Q216 229 191 232 L182 222 Q155 240 127 223 Q114 240 99 228 Q91 221 90 190Z" fill="url(#body)" stroke="#a87743" stroke-width="2.3" stroke-linecap="round"/><ellipse cx="122" cy="133" rx="4.5" ry="5.5" fill="#302b26"/><ellipse cx="169" cy="133" rx="4.5" ry="5.5" fill="#302b26"/><ellipse cx="111" cy="149" rx="10" ry="5" fill="#ffc59f" opacity=".55"/><ellipse cx="181" cy="149" rx="10" ry="5" fill="#ffc59f" opacity=".55"/><path d="M139 147 Q147 155 155 147 Q157 163 148 164 Q138 162 139 147Z" fill="#c87e50"/>${mode==='heart'?'<path d="M149 188 C125 165 110 183 124 196 L149 216 L174 195 C187 181 171 165 149 188" fill="#eea181" stroke="#c67e5d" stroke-width="1.5"/>':''}${mode==='work'?'<path d="M89 203H214L203 246H80Z" fill="#9e9a94" stroke="#5c5954" stroke-width="2"/><circle cx="147" cy="224" r="5" fill="#e8e4df"/><path d="M78 247H221" stroke="#5c5954" stroke-width="4" stroke-linecap="round"/>':''}</svg>`;
}
function scene(){return `<svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Milo sitting beside you at a warm, quiet desk"><defs><radialGradient id="glow"><stop stop-color="#fff7cc"/><stop offset="1" stop-color="#e9c9a3" stop-opacity="0"/></radialGradient></defs><circle cx="58" cy="78" r="95" fill="url(#glow)"/><path d="M39 51H75L87 93H27Z" fill="#ffe4a0" stroke="#c49b61"/><path d="M57 94V199" stroke="#ba8851" stroke-width="4"/><path d="M40 198H76" stroke="#ba8851" stroke-width="4"/><rect y="206" width="320" height="34" fill="#c89965"/><path d="M0 205H320" stroke="#af7d49" stroke-width="3"/><g transform="translate(46,35) scale(.76)">${milo('work').replace(/<svg[^>]*>|<\/svg>/g,'')}</g><g transform="translate(260,142)"><path d="M18 50V-14" stroke="#7d9251" stroke-width="3"/><ellipse cx="8" cy="3" rx="9" ry="19" fill="#8b9e5e" transform="rotate(-30 8 3)"/><ellipse cx="28" cy="-1" rx="9" ry="19" fill="#99aa64" transform="rotate(35 28 -1)"/><path d="M0 40H37L33 64H5Z" fill="#dca87b"/></g></svg>`}
function homeArt(){return `<div class="hero-art">${scene()}<div class="hand-note">DopaMind is here<br>when you're ready.</div></div>`}
function header(step=1){return `<div class="top"><button class="back" data-action="back" aria-label="Go back">‹</button><div class="dots">${[0,1,2,3].map(i=>`<i class="${i<step?'on':''}"></i>`).join('')}</div><span class="count">${['task','body','celebration'].includes(state.screen)?(state.index+1)+'/'+state.tasks.length:''}</span></div>`}
function photo(size=''){if(state.photo==='demo-camera')return `<div class="photo-wrap"><div class="demo-captured ${size}" role="img" aria-label="Captured room photo"></div><button class="change" data-action="photo">◎ Change photo</button></div>`;return state.photo?`<div class="photo-wrap"><img class="image ${size}" src="${state.photo}" alt="Your space"><button class="change" data-action="photo">◎ Change photo</button></div>`:`<div class="placeholder"><span>Your next little step starts here. 🌱</span></div>`}
function primary(text,action){return `<button class="primary" data-action="${action}">${text}</button>`}
function secondary(text,action){return `<button class="secondary" data-action="${action}">${text}</button>`}
function duration(t){return t<60?'About '+t+' seconds':'About 1 minute'}
function render(){
 const t=state.tasks[state.index];let content='';
 if(state.screen==='home')content=`<div class="top"><span class="wordmark">DopaMind</span></div><div class="home"><h2>I'm stuck.</h2><p>You don't have to figure<br>everything out.<br>Show me what's in front of you.</p>${homeArt()}</div><div class="bottom">${primary('◎ &nbsp; Take a photo','photo')}${secondary('✎ &nbsp; Tell me instead','tell')}</div>`;
 if(state.screen==='camera')content=`<div class="prototype-camera"><div class="camera-status"><span>9:41</span><span>▂▄▆ &nbsp; ◒ ▰</span></div><button class="camera-close" data-action="home" aria-label="Close camera">×</button><div class="camera-controls"><button class="camera-gallery" data-action="upload-photo" aria-label="Choose a photo from your album"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="8" cy="9" r="1.5"/><path d="m4 17 5-5 4 4 3-3 5 5"/></svg></button><button class="camera-shutter" data-action="capture-photo" aria-label="Take photo"></button><button class="camera-flip" data-action="refresh-camera" aria-label="Refresh camera"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 8a8 8 0 0 0-14-2L3 9m0-5v5h5M4 16a8 8 0 0 0 14 2l3-3m0 5v-5h-5"/></svg></button></div><span class="camera-flash" aria-hidden="true"></span></div>`;
 if(state.screen==='countdown')content=`<div class="countdown-content"><div class="countdown-circle" aria-live="polite" aria-atomic="true">${state.countdown||'GO!'}</div><h2>${state.countdown? 'Getting Ready...' : "You've got this!"}</h2><p>${state.countdown?'Next task:':'Focusing on'}<br><strong>“${esc(state.tasks[state.index].text)}”</strong><br><span class="countdown-duration">Your 2-minute timer starts after the countdown.</span></p><button class="skip-countdown" data-action="skip-countdown">Skip countdown</button></div>`;
 if(state.screen==='tell')content=header(1)+`<h2>What's in front of you?</h2><p>A few words are enough.<br>You don't have to explain it perfectly.</p><textarea class="text-input" id="description" placeholder="A messy desk, a pile of books, work I keep putting off…">${esc(state.description)}</textarea><div class="mini-milo">${milo()}</div><p class="help">Or write one small task per line to make your own plan.</p><div class="bottom">${primary('Find a little starting point →','description')}</div>`;
 if(state.screen==='goal')content=header(1)+photo('small')+`<h2>What are you trying to do?</h2><p>I'll help you get started.</p><div class="goals">${goals.map((g,i)=>`<button class="goal ${state.goal===i?'active':''}" data-goal="${i}" ><span>${g[0]}</span>${g[1]}</button>`).join('')}</div><div class="bottom">${primary('Make a simple plan →','plan')}</div>`;
 if(state.screen==='plan')content=header(2)+`<div class="plan-hero"><div class="plan-duration"><svg viewBox="0 0 24 26" aria-hidden="true"><path d="M8 2h8M18.5 6l2 2M12 11v6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><circle cx="12" cy="16" r="9" fill="none" stroke="currentColor" stroke-width="2.2"/></svg><span>2 mins</span></div><div class="plan-milo">${milo()}</div></div><h2>Here's the plan.</h2><p class="plan-copy">A few small things we can work on.<br>We'll do them one at a time.</p><ol class="plan">${state.tasks.map((x,i)=>`<li><span class="number">${i+1}</span><span>${esc(x.text)}</span></li>`).join('')}</ol><div class="bottom">${primary('Lets Start! &nbsp; →','start')}</div>`;
 if(state.screen==='edit')content=header(2)+`<h2>Your own little steps.</h2><p>One small action per line. Keep it easy.</p><textarea id="steps" class="text-input">${state.tasks.map(x=>esc(x.text)).join('\n')}</textarea><p class="help">Up to 8 steps. Each gets a gentle one-minute timer.</p><div class="bottom">${primary('Save my plan','save')}</div>`;
 if(state.screen==='task'||state.screen==='body'){
 const title=t.text;
 const instruction=t.instruction||'Just this one thing. Take it one small step at a time.';
 const remaining=Math.max(0,120-state.seconds);
 content=header(2)+`<div class="focus-task"><div class="target-badge">◷ &nbsp; TARGET: JUST 2 MINUTES!</div><h2>${esc(title)}</h2><p class="focus-instruction">${esc(instruction)}</p><div class="timer-ring"><svg viewBox="0 0 220 220" aria-hidden="true"><circle class="ring-track" cx="110" cy="110" r="103"/><circle id="ring-progress" class="ring-progress" cx="110" cy="110" r="103" pathLength="100" stroke-dasharray="100" stroke-dashoffset="${100-remaining/120*100}"/></svg><div class="timer-center"><div id="focus-time" class="focus-time">${focusClock(remaining)}</div><div id="timer-caption" class="timer-caption">⏱ ${remaining?'Time remaining':'Take your time'}</div></div></div><button class="pause-timer" data-action="pause-timer">${state.paused?'▶ &nbsp; Resume Timer':'Ⅱ &nbsp; Pause Timer'}</button></div><div class="bottom focus-bottom">${primary('✓ &nbsp; I Checked This Off! 🎉','done')}<div class="focus-links"><button data-action="distracted">♡ &nbsp; Feeling overwhelmed?</button><button data-action="recap">Not finished yet? (No guilt)</button></div></div>`;
 }
 if(state.screen==='celebration')content=header(3)+`<div class="celebration"><h2>Nice!</h2><h3>One little thing, done.</h3><div class="party">${milo()}${Array.from({length:18},(_,i)=>`<i class="confetti" style="left:${(i*37)%100}%;top:${(i*19)%80}%;background:${['#efb888','#a4cebc','#a7f3d0','#eea3aa'][i%4]};transform:rotate(${i*29}deg);animation-delay:${i*.1}s"></i>`).join('')}</div><p>You showed up. That counts.</p></div><div class="bottom">${primary(state.index+1<state.tasks.length?'Next task →':'Look what changed →','next')}${secondary("That's enough for now",'recap')}</div>`;
 if(state.screen==='recap')content=header(4)+`<h2>Look what changed.</h2><div class="recap-count">${state.completed.length} little ${state.completed.length===1?'step':'steps'} done.</div><ul class="checklist">${state.completed.map(i=>`<li><span class="tick">✓</span>${esc(state.tasks[i].text)}</li>`).join('')}</ul>${!state.completed.length?'<p>You took a moment for yourself.<br>You can start again when you are ready.</p>':''}<div class="mini-milo">${milo('heart')}</div><div class="bottom">${primary("That's enough for now",'end')}${state.completed.length<state.tasks.length?secondary('I have energy for one more','more'):''}</div>`;
 if(state.screen==='end')content=`<div class="top"><span class="wordmark">DopaMind</span></div><div class="end"><div class="end-art"><span class="moon">☾</span>${milo('heart')}</div><h2>You got<br>started.</h2><p>That's what matters.</p></div><div class="bottom">${secondary('Back to home','home')}</div>`;
 app.innerHTML=`<section class="phone ${state.screen==='goal'?'goal-view':state.screen==='camera'?'camera-view':state.screen==='plan'?'plan-view':state.screen==='countdown'?'countdown-view':['task','body'].includes(state.screen)?'focus-view':''}" aria-label="DopaMind app"><div class="screen">${content}</div></section>${state.distraction?calmDialog():''}`;
 app.querySelectorAll('[data-action]').forEach(el=>el.onclick=()=>act(el.dataset.action));
 app.querySelectorAll('[data-calm-tab]').forEach(el=>el.onclick=()=>{state.calmTab=el.dataset.calmTab;state.breathStartedAt=Date.now();render()});
 const dialog=document.querySelector('#calm-dialog');
 clearInterval(breathTimer);breathTimer=null;
 if(dialog){dialog.showModal();dialog.oncancel=e=>{e.preventDefault();act('close-calm')};dialog.querySelector('[aria-selected="true"]').focus();if(state.calmTab==='breathe'){updateBreath();breathTimer=setInterval(updateBreath,200)}}
 app.querySelectorAll('[data-goal]').forEach(el=>el.onclick=()=>{state.goal=Number(el.dataset.goal);render()});
}
function clockText(){const remaining=Math.max(0,(state.tasks[state.index]?.time||0)-state.seconds);return remaining?Math.floor(remaining/60)+':'+String(remaining%60).padStart(2,'0'):'Take your time ♡'}
function calmDialog(){
 const tab=state.calmTab||'breathe';let panel='';
 if(tab==='breathe')panel=`<div class="breath-exercise"><div class="breath-space"><div class="breath-orb" id="breath-orb"><strong id="breath-label">INHALE</strong><span id="breath-seconds">4s</span></div></div><p>Follow the circle. Breathe in as it grows,<br>and breathe out as it becomes smaller.</p><button class="chime-button" data-action="chime">♫ &nbsp; Play Calming Chime (432Hz)</button></div>`;
 if(tab==='anchors')panel=`<div class="room-anchors"><p>Things in your space to anchor your thoughts:</p><div class="calm-card"><span>✧</span>Notice a source of light in your room, and how it falls around you.</div><div class="calm-card"><span>✧</span>Feel the support of your chair, or the texture of something soft within reach.</div><div class="calm-card"><span>✧</span>Remember: you are not behind. You are taking one tiny step right now.</div></div>`;
 if(tab==='senses')panel=`<div class="sense-list">${['Things you can <strong>see</strong> around you right now','Things you can physically <strong>touch or feel</strong> (fabric, desk)','Sounds you can <strong>hear</strong> (hum of AC, distant birds)','Things you can <strong>smell</strong> or sense in the air','One thing you appreciate about <strong>yourself</strong> today'].map((text,i)=>`<div class="calm-card"><span>${5-i}</span><div>${text}</div></div>`).join('')}</div>`;
 return `<dialog id="calm-dialog" class="calm-dialog" aria-labelledby="calm-title"><div class="calm-header"><div class="calm-heart">♡</div><div><h2 id="calm-title">Grounding &amp; Calm Corner</h2><p>Pause with zero pressure. Take a moment for yourself.</p></div><button class="calm-close" data-action="close-calm" aria-label="Close calm corner">×</button></div><div class="calm-tabs" role="tablist" aria-label="Grounding exercises">${[['breathe','≋','Breathe'],['anchors','◎','Room Anchors'],['senses','✧','5-4-3-2-1']].map(([id,icon,label])=>`<button role="tab" id="tab-${id}" aria-controls="calm-panel" aria-selected="${tab===id}" data-calm-tab="${id}">${icon} &nbsp; ${label}</button>`).join('')}</div><div id="calm-panel" role="tabpanel" aria-labelledby="tab-${tab}" class="calm-panel">${panel}</div><div class="calm-footer"><span>Take as long as you need.</span><button data-action="close-calm">I Feel Grounded</button></div></dialog>`;
}
function updateBreath(){
 const elapsed=(Date.now()-state.breathStartedAt)/1000;
 const phase=elapsed%8,inhale=phase<4;
 const label=document.querySelector('#breath-label'),seconds=document.querySelector('#breath-seconds'),orb=document.querySelector('#breath-orb');
 if(label)label.textContent=inhale?'INHALE':'EXHALE';
 if(seconds)seconds.textContent=Math.max(1,Math.ceil(4-(phase%4)))+'s';
 if(orb){const scale=.76+.24*(inhale?phase/4:1-(phase-4)/4);orb.style.transform='scale('+scale+')';}
}
let chimeContext;
async function playChime(){try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;chimeContext ||= new Audio();await chimeContext.resume();const oscillator=chimeContext.createOscillator(),gain=chimeContext.createGain();oscillator.type='sine';oscillator.frequency.value=432;gain.gain.setValueAtTime(0,chimeContext.currentTime);gain.gain.linearRampToValueAtTime(.08,chimeContext.currentTime+.1);gain.gain.exponentialRampToValueAtTime(.0001,chimeContext.currentTime+2);oscillator.connect(gain);gain.connect(chimeContext.destination);oscillator.start();oscillator.stop(chimeContext.currentTime+2.1);}catch{const button=document.querySelector('[data-action="chime"]');if(button)button.textContent='Audio is unavailable in this browser';}}
function celebrationBurst(){
 const layer=document.createElement('div');layer.className='fireworks-layer';layer.setAttribute('aria-hidden','true');
 const colors=['#009b72','#009b91','#6ee7b7','#facc6b','#ff9f80','#fff'];
 for(let burst=0;burst<3;burst++){
  const x=[25,75,50][burst],y=[38,32,48][burst];
  for(let i=0;i<32;i++){
   const piece=document.createElement('i'),angle=i/32*Math.PI*2,distance=90+Math.random()*160;
   piece.className='firework-piece';piece.style.cssText=`left:${x}%;top:${y}%;--dx:${Math.cos(angle)*distance}px;--dy:${Math.sin(angle)*distance}px;--spin:${Math.random()*900-450}deg;--delay:${burst*.15}s;background:${colors[i%colors.length]};border-radius:${i%3===0?'50%':'2px'}`;
   layer.appendChild(piece);
  }
 }
 document.body.appendChild(layer);setTimeout(()=>layer.remove(),1900);
 try{
  const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;chimeContext ||=new Audio();
  void chimeContext.resume().then(()=>{
   [523.25,659.25,783.99,1046.5].forEach((frequency,i)=>{
    const o=chimeContext.createOscillator(),g=chimeContext.createGain(),start=chimeContext.currentTime+i*.08;
    o.type='triangle';o.frequency.value=frequency;g.gain.setValueAtTime(0,start);g.gain.linearRampToValueAtTime(.035,start+.025);g.gain.exponentialRampToValueAtTime(.0001,start+.42);o.connect(g);g.connect(chimeContext.destination);o.start(start);o.stop(start+.45);
   });
  }).catch(()=>{});
 }catch{}
}
function focusClock(remaining){remaining=Math.max(0,Math.ceil(remaining));return Math.floor(remaining/60)+':'+String(remaining%60).padStart(2,'0')}
function updateFocusTimer(){
 if(!state.paused)state.seconds=Math.min(120,(Date.now()-state.timerStartedAt)/1000);
 const remaining=Math.max(0,Math.ceil(120-state.seconds));
 const clock=document.querySelector('#focus-time');if(clock)clock.textContent=focusClock(remaining);
 const ring=document.querySelector('#ring-progress');if(ring)ring.setAttribute('stroke-dashoffset',String(100-Math.max(0,120-state.seconds)/120*100));
 if(!remaining){clearInterval(timer);timer=null;const caption=document.querySelector('#timer-caption');if(caption)caption.textContent='Take your time';}
}
function go(screen){clearInterval(countdownTimer);countdownTimer=null;clearInterval(timer);timer=null;const previous=state.screen;state.screen=screen;
 if(['task','body'].includes(screen)){
  if(!['task','body'].includes(previous)){state.seconds=0;state.paused=false;state.distraction=false;}
  state.timerStartedAt=Date.now()-state.seconds*1000;
 }
 render();if(['task','body'].includes(screen)&&!state.paused&&state.seconds<120)timer=setInterval(updateFocusTimer,100);
}
function act(action){
 switch(action){
 case 'photo':go('camera');break;
 case 'upload-photo':document.querySelector('#photo').value='';document.querySelector('#photo').click();break;
 case 'capture-photo':if(state.photo?.startsWith('blob:'))URL.revokeObjectURL(state.photo);state.photo='demo-camera';go('goal');break;
 case 'refresh-camera':go('camera');break;
 case 'tell':go('tell');break;
 case 'description':state.description=document.querySelector('#description').value.trim();go('goal');break;
 case 'plan':{const lines=state.description.split('\n').map(x=>x.trim()).filter(Boolean);state.tasks=lines.length>1?lines.slice(0,8).map(text=>({text,time:120,icon:'🌱'})):templates[state.goal].map(x=>({...x}));state.index=0;state.completed=[];go('plan');break;}
 case 'edit':go('edit');break;
 case 'save':{const lines=document.querySelector('#steps').value.split('\n').map(x=>x.trim()).filter(Boolean).slice(0,8);if(!lines.length){document.querySelector('#steps').setCustomValidity('Add at least one little step.');document.querySelector('#steps').reportValidity();break}state.tasks=lines.map(text=>({text,time:60,icon:'🌱'}));go('plan');break}
 case 'start':state.countdown=3;go('countdown');countdownTimer=setInterval(()=>{if(state.countdown>0){state.countdown--;render()}else go('task')},1000);break;
 case 'skip-countdown':go('task');break;
 case 'body':go('body');break;
 case 'pause-timer':if(!state.paused)updateFocusTimer();state.paused=!state.paused;go(state.screen);break;
 case 'distracted':if(!state.paused)updateFocusTimer();state.wasPaused=!!state.paused;state.paused=true;state.distraction=true;state.calmTab='breathe';state.breathStartedAt=Date.now();go(state.screen);break;
 case 'return':case 'close-calm':clearInterval(breathTimer);breathTimer=null;state.distraction=false;state.paused=!!state.wasPaused;go(state.screen);document.querySelector('[data-action="distracted"]')?.focus();break;
 case 'chime':playChime();break;
 case 'done':if(!['task','body'].includes(state.screen))break;if(!state.completed.includes(state.index))state.completed.push(state.index);if(state.index+1<state.tasks.length){state.index++;state.seconds=0;state.paused=false;state.distraction=false;act('start')}else go('recap');celebrationBurst();break;
 case 'next':if(state.index+1<state.tasks.length){state.index++;act('start')}else go('recap');break;
 case 'recap':go('recap');break;
 case 'more':state.index=state.tasks.findIndex((_,i)=>!state.completed.includes(i));go('task');break;
 case 'end':go('end');break;
 case 'home':if(state.photo)URL.revokeObjectURL(state.photo);state={screen:'home',photo:null,goal:0,tasks:[],index:0,completed:[],description:'',distraction:false,seconds:0};document.querySelector('#photo').value='';go('home');break;
 case 'back':go(({tell:'home',goal:'home',plan:'goal',edit:'plan',task:'plan',body:'task',celebration:'recap',recap:'end'})[state.screen]||'home');break;
 }
}
document.querySelector('#photo').onchange=e=>{const file=e.target.files[0];if(!file)return;if(!file.type.startsWith('image/')){alert('Please choose an image.');return}if(state.photo)URL.revokeObjectURL(state.photo);state.photo=URL.createObjectURL(file);if(['home','tell','camera'].includes(state.screen))go('goal');else render()};
render();
if(document.modelContext?.registerTool){try{document.modelContext.registerTool({name:'read_milo_progress',description:'Read the visible Milo session and current task.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>({screen:state.screen,currentTask:state.tasks[state.index]?.text||null,completed:state.completed.length,total:state.tasks.length})});document.modelContext.registerTool({name:'complete_current_milo_task',description:'Mark the active task as complete and open the celebration. Only available while a task timer is open.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:false},execute:()=>{if(!['task','body'].includes(state.screen))throw new Error('Start a task with Milo first.');act('done');return{screen:state.screen,completed:state.completed.length}}})}catch{}}
