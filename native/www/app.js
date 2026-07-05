const API='http://139.224.211.170:3000/api/coach';
const vocab=[
['meet a deadline','按时完成；赶上截止时间','I reorganised my schedule to meet the deadline.'],['raise a concern','提出担忧','Residents raised concerns about traffic noise.'],['play a vital role','发挥重要作用','Public transport plays a vital role in large cities.'],['pose a threat','构成威胁','Plastic waste poses a threat to marine life.'],['take responsibility for','为……负责','Individuals should take responsibility for their choices.'],['a growing number of','越来越多的','A growing number of people work remotely.'],['have access to','有机会使用','Every child should have access to education.'],['strike a balance','取得平衡','It is difficult to strike a balance between work and rest.'],['address the issue','处理问题','The government must address the issue promptly.'],['long-term benefits','长期益处','Exercise brings substantial long-term benefits.'],['a practical solution','可行方案','Flexible hours may be a practical solution.'],['broaden one\'s horizons','开阔眼界','Travel can broaden young people\'s horizons.'],['from my perspective','在我看来','From my perspective, the advantages outweigh the drawbacks.'],['in contrast','相比之下','In contrast, rural areas are usually quieter.'],['as a consequence','因此','Fuel prices rose; as a consequence, travel costs increased.'],['be exposed to','接触到','Children are exposed to advertising online.'],['a sense of belonging','归属感','Community events create a sense of belonging.'],['make an informed decision','作出明智决定','Consumers need clear labels to make an informed decision.'],['place pressure on','给……造成压力','Rapid growth places pressure on public services.'],['improve quality of life','改善生活质量','Green spaces improve quality of life.'],['a significant proportion','很大比例','A significant proportion of commuters use buses.'],['be likely to','很可能','Young adults are likely to change jobs more often.'],['contribute to','促成；导致','Regular reading contributes to language development.'],['deal with','处理','Cities need better ways to deal with waste.'],['in the short term','短期来看','The policy may be expensive in the short term.'],['outweigh the drawbacks','利大于弊','The benefits clearly outweigh the drawbacks.'],['provide an opportunity','提供机会','Volunteering provides an opportunity to gain experience.'],['reach a conclusion','得出结论','The researchers reached a similar conclusion.'],['remain a priority','仍是重点','Public safety must remain a priority.'],['there is no doubt that','毫无疑问','There is no doubt that technology has changed communication.']
];

// Full question bank with IDs for no-repeat tracking
const questionBank={
 reading:[
  {id:'read-001',difficulty:'medium',source:'original practice',title:'Remote Work Survey',passage:'A recent study of 2,000 office workers found that 68% prefer hybrid arrangements over returning to the office five days a week. The main reasons cited were reduced commute time, better work-life balance, and fewer interruptions. However, 42% of managers expressed concern about team cohesion, while only 12% of employees shared this worry.',questions:[{id:'read-001-q1',text:'What proportion of workers prefer hybrid arrangements?',opts:['42%','Over two thirds','Just over half','Less than a third'],a:1,why:'68% 即 over two thirds。42% 是 managers 的比例。'},{id:'read-001-q2',text:'Which concern is shared by both managers and employees?',opts:['Commute time','Work-life balance','Team cohesion','Fewer interruptions'],a:2,why:'原文说 employees 只有 12% 担心 team cohesion，说明不是主要顾虑。'}]},
  {id:'read-002',difficulty:'medium',source:'original practice',title:'Urban Green Spaces',passage:'City planners in Singapore have increased park coverage from 36% to 47% over the past decade. A 2024 study linked this expansion to a 15% reduction in urban heat island effect. Residents living within 300 metres of a green space reported 22% lower stress levels. The government plans to extend the programme to industrial zones by 2027.',questions:[{id:'read-002-q1',text:'Park coverage in Singapore exceeded 50% after the expansion.',opts:['TRUE','FALSE','NOT GIVEN'],a:1,why:'原文说从 36% 增加到 47%，没有超过 50%。'},{id:'read-002-q2',text:'The study was conducted jointly with a foreign university.',opts:['TRUE','FALSE','NOT GIVEN'],a:2,why:'原文只提到 National University of Singapore，没有说是否与国外大学合作。'}]},
  {id:'read-003',difficulty:'hard',source:'original practice',title:'The Future of Public Libraries',passage:'The traditional role of public libraries as book repositories is evolving. In Oslo, the Deichman Library opened a new building in 2020 that includes recording studios, a maker space with 3D printers, and a cafe operated by local youth. Attendance has tripled since the move. Critics argue that converting libraries into community hubs dilutes their core educational mission. Supporters counter that attracting new audiences ensures long-term funding and relevance.',questions:[{id:'read-003-q1',text:'What is the main impact of adding creative spaces to libraries?',opts:['More books are sold','Programme participation increased significantly','Operating costs decreased','Staff numbers doubled'],a:1,why:'2023 年报告明确指出增加创意空间后项目参与度增加了 40%。'}]},
  {id:'read-004',difficulty:'easy',source:'original practice',title:'Company Relocation',passage:'BrightWave Technologies will relocate its headquarters from Cambridge to Bristol in September 2025. The move will affect approximately 450 employees. A voluntary redundancy package is available for those who do not wish to relocate. The new office, located in the Temple Quarter Enterprise Zone, will feature a childcare centre and bicycle storage for 200 bikes.',questions:[{id:'read-004-q1',text:'When is the company relocation scheduled?',opts:['August 2025','September 2025','October 2025','2026'],a:1,why:'原文明确写 September 2025。'},{id:'read-004-q2',text:'What facility is NOT mentioned for the new office?',opts:['A childcare centre','Bicycle storage','A gym','None of the above'],a:2,why:'原文提到 childcare centre 和 bicycle storage，没有提到 gym。'}]},
  {id:'read-005',difficulty:'medium',source:'original practice',title:'Ocean Plastic Cleanup',passage:'The Ocean Cleanup project, founded by Boyan Slat in 2013, aims to remove 90% of floating ocean plastic by 2040. Their System 03 uses a U-shaped barrier that concentrates debris for collection. Critics point out that the system only captures surface plastic and misses microplastics below. The organisation now also deploys Interceptors in rivers to stop plastic before it reaches the ocean.',questions:[{id:'read-005-q1',text:'What is a key criticism of the Ocean Cleanup system?',opts:['It is too expensive','It only catches surface plastic','It harms marine life','It is too slow'],a:1,why:'Critics 认为系统只收集 surface plastic，misses microplastics below。'}]},
  {id:'read-006',difficulty:'hard',source:'original practice',title:'AI in Healthcare',passage:'Diagnostic AI systems can now detect certain cancers from medical images with accuracy comparable to experienced radiologists. However, a 2024 Lancet study warned that over-reliance on AI could lead to skill atrophy among junior doctors. The study\'s lead author stated: \'AI should augment, not replace, clinical judgement.\' Hospitals in Helsinki have piloted an AI-assisted triage system that reduced waiting times by 30%, but patient satisfaction surveys showed a slight decline in trust.',questions:[{id:'read-006-q1',text:'What was the effect of the AI triage system in Helsinki?',opts:['Waiting times increased and satisfaction rose','Waiting times decreased and satisfaction slightly declined','Both waiting times and satisfaction improved','No measurable effect'],a:1,why:'Helsinki 试点减少了 30% 等待时间，但满意度因知道是机器做的初步评估而略有下降。'}]},
  {id:'read-007',difficulty:'easy',source:'original practice',title:'Railway Upgrade',passage:'The CrossRail extension between Reading and Abbey Wood is expected to open in phases starting May 2025. The full route will connect 41 stations and reduce journey times across London by up to 30 minutes. A new fleet of 66 trains will operate at a frequency of up to 24 trains per hour in central sections. Night-time engineering work on weekends will continue until the line is fully operational.',questions:[{id:'read-007-q1',text:'How many trains per hour will the new fleet operate at peak?',opts:['12','18','24','30'],a:2,why:'原文明确写 up to 24 trains per hour。'}]},
  {id:'read-008',difficulty:'medium',source:'original practice',title:'Honeybee Decline',passage:'Honeybee populations in Europe fell by 25% between 2010 and 2020, according to data from the European Food Safety Authority. Pesticides known as neonicotinoids were identified as a major contributing factor. However, the decline in wild bee species has been even steeper at an estimated 40% over the same period. Conservation groups called for a ban on all outdoor use of neonicotinoids, which the EU partially implemented in 2018.',questions:[{id:'read-008-q1',text:'The EU completely banned neonicotinoids in 2018.',opts:['TRUE','FALSE','NOT GIVEN'],a:1,why:'原文说 partially implemented（部分实施），不是 completely banned。'}]},
  {id:'read-009',difficulty:'hard',source:'original practice',title:'Education Technology Trends',passage:'Adaptive learning platforms use algorithms to personalise content for each student, adjusting difficulty based on performance data. Virtual reality field trips allow students to explore historical sites. Micro-credentialing platforms offer bite-sized certifications that can be stacked into full degrees. AI-powered plagiarism detectors now analyse writing style to distinguish between student work and AI-generated text with 92% accuracy.',questions:[{id:'read-009-q1',text:'Which technology is described as using performance data to adjust content difficulty?',opts:['Virtual reality field trips','Micro-credentialing platforms','Adaptive learning platforms','AI plagiarism detectors'],a:2,why:'Adaptive learning platforms 使用算法根据 performance data 调整内容难度。'}]},
  {id:'read-010',difficulty:'medium',source:'original practice',title:'Urban Farming',passage:'Rooftop farming has gained popularity in cities from New York to Tokyo. Advocates say it reduces the distance food travels, cuts carbon emissions, and provides insulation that lowers building energy costs. Detractors argue that structural reinforcement costs and limited sunlight make rooftop farms economically unviable for most buildings. A 2024 study found that a rooftop farm in Chicago produced enough vegetables for 40 households.',questions:[{id:'read-010-q1',text:'What is a benefit of rooftop farming?',opts:['Eliminates all transport costs','Provides building insulation','Requires no structural changes','Works on any building type'],a:1,why:'Advocates 提到 rooftop farms 提供 insulation，降低建筑能耗。'}]}
 ],
 listening:[
  {id:'listen-001',difficulty:'easy',source:'original practice',title:'Dentist Appointment',say:'Hello, this is Smile Dental Clinic calling about your appointment. We need to reschedule from Thursday the twenty-third of April to Friday the twenty-fifth at two fifteen in the afternoon. Please call us back on zero one six one, seven two eight, four five nine three if this doesn\'t suit you.',questions:[{id:'listen-001-q1',text:'What is the new appointment date and time?',opts:['4月23日周四 14:15','4月25日周五 14:15','4月24日周五 14:15','4月25日周四 2:15'],a:1,why:'注意 Friday the twenty-fifth 和 two fifteen。'},{id:'listen-001-q2',text:'What is the callback phone number?',opts:['0161 7284 593','0161 728 4593','0161 782 4593','01617 284 593'],a:1,why:'英国号码按三组读：0161（区号）728（中间）4593（结尾）。'}]},
  {id:'listen-002',difficulty:'medium',source:'original practice',title:'Campus Directions',say:'The library is straight ahead from the main entrance, then take the first left after the fountain. The computer lab is on the third floor, room three-oh-two. If you need the careers centre, it\'s opposite the cafeteria, next to the student union office. The medical centre has moved to the ground floor of building seven, near the north gate.',questions:[{id:'listen-002-q1',text:'Where is the computer lab?',opts:['Ground floor','Second floor','Third floor room 302','First floor room 3'],a:2,why:'third floor, room three-oh-two 即 三楼 302 室。'},{id:'listen-002-q2',text:'Where is the medical centre now?',opts:['Building 7 ground floor, near north gate','Opposite the cafeteria','Next to the student union','Building 3 room 302'],a:0,why:'moved to 表示新地点：building seven, ground floor, near the north gate。'}]},
  {id:'listen-003',difficulty:'medium',source:'original practice',title:'Conference Booking',say:'The early bird rate for the annual marketing conference is one hundred and fifty pounds per person if you book before the end of May. Standard tickets from June onwards will be one hundred and ninety-five pounds. Group bookings of five or more receive a 20% discount. The student rate is seventy pounds with a valid university ID card.',questions:[{id:'listen-003-q1',text:'What is the early bird rate per person?',opts:['£95','£150','£195','£70'],a:1,why:'early bird rate 是 £150，standard 才是 £195。'},{id:'listen-003-q2',text:'How many people are needed for a group discount?',opts:['3 or more','4 or more','5 or more','10 or more'],a:2,why:'原文写 five or more receive a 20% discount。'}]}
 ],
 writing:[
  'Some people believe that university education should be free for everyone. To what extent do you agree or disagree?',
  'You recently purchased a piece of equipment for your home office but it arrived damaged. Write a letter to the company. Explain the problem, say what you would like them to do, and give your contact details.',
  'Many countries are experiencing a decline in the number of people visiting museums and art galleries. What are the reasons for this, and how can it be solved?',
  'Some employers think that academic qualifications are more important than experience and personal qualities when hiring new staff. Discuss both views and give your opinion.',
  'You have been asked to organise a two-day training event for your department. Write a letter to the training provider. Include what the training should cover, the preferred dates, and the number of attendees.',
  'In many countries, fast food is becoming cheaper and more widely available. Do the advantages of this trend outweigh the disadvantages?',
  'Write a letter to your neighbour complaining about noise from their recent renovation. Suggest a reasonable solution.',
  'Some people argue that all young people should be required to stay in full-time education until they are 18. To what extent do you agree?',
  'You received an email from an international colleague inviting you to visit their city for a conference. Write a reply accepting the invitation. Ask about the schedule, accommodation, and any preparation needed.',
  'In some countries, the average weight of people is increasing while their levels of health and fitness are decreasing. What are the causes, and what measures could be taken to address this?',
  'Some people think that governments should ban dangerous sports, while others believe individuals should have the freedom to participate. Discuss both views and give your opinion.',
  'You stayed at a hotel last weekend and left a valuable item in your room. Write to the hotel manager. Describe the item, explain why it is important, and suggest what the hotel should do if it is found.',
  'University students should pay the full cost of their studies because education benefits individuals rather than society as a whole. To what extent do you agree?',
  'The world has many towns and cities constructed in previous centuries that were suitable for living in at the time. What problems do these cause today, and how can they be solved?',
  'Write a letter to a friend who is planning to visit your country. Recommend the best time to come, suggest places to visit, and offer to accommodate them.',
  'Some people claim that not enough of the waste from homes is recycled. They say that the only way to increase recycling is for governments to make it a legal requirement. To what extent do you agree?',
  'You applied for a job advertised in a newspaper last week but have not received any response. Write to the recruitment agency. Introduce yourself, remind them of your application, and ask for an update.',
  'Many people choose to live alone in recent years. What are the advantages and disadvantages of this trend?',
  'Write a letter to the manager of a restaurant where you celebrated an important event recently. Thank them for the service, describe what made the evening special, and suggest one improvement.',
  'Some people think that printed books are no longer necessary in the digital age. Others believe printed books still play an important role. Discuss both views and give your opinion.'
 ],
 speaking:[
  {id:'spk-001',difficulty:'medium',part:2,prompt:'Describe a time when you received good advice. You should say who gave you the advice, what the advice was about, and explain why you think it was good advice.'},
  {id:'spk-002',difficulty:'easy',part:2,prompt:'Describe a popular product made in your country that is often bought by foreigners. You should say what the product is, how it is made, and explain why it is popular with overseas buyers.'},
  {id:'spk-003',difficulty:'medium',part:2,prompt:'Describe a place in your country that you think tourists should visit. You should say where it is, what visitors can do there, and explain why it is worth visiting.'},
  {id:'spk-004',difficulty:'hard',part:2,prompt:'Describe a historical building in your city or area. You should say what it looks like, what it was used for in the past, and explain how you feel about it.'},
  {id:'spk-005',difficulty:'easy',part:2,prompt:'Describe a skill that you learned from a family member. You should say what the skill is, how you learned it, and explain why it is useful to you.'},
  {id:'spk-006',difficulty:'medium',part:2,prompt:'Describe a change that improved your local area. You should say what the change was, how long it took to happen, and explain how it affected local people.'},
  {id:'spk-007',difficulty:'medium',part:2,prompt:'Describe someone you know who has recently been successful. You should say who they are, what they achieved, and explain how you felt about their success.'},
  {id:'spk-008',difficulty:'hard',part:2,prompt:'Describe a book you read that had a significant impact on you. You should say what the book was about, when you read it, and explain why it influenced you.'},
  {id:'spk-009',difficulty:'easy',part:2,prompt:'Describe a festival or traditional celebration in your country. You should say when it happens, what people do, and explain why it is important.'},
  {id:'spk-010',difficulty:'medium',part:2,prompt:'Describe a time when you helped a friend or family member with a problem. You should say what the problem was, how you helped, and explain how it affected your relationship.'}
 ]
};

// --- No-repeat question engine ---
const ANSWERED_KEY='senthee-ielts:answered:v2';
function loadAnswered(){try{const raw=localStorage.getItem(ANSWERED_KEY);return raw?JSON.parse(raw):{}}catch{return{}}}
function saveAnswered(d){localStorage.setItem(ANSWERED_KEY,JSON.stringify(d))}
function shuffle(a){const s=[...a];for(let i=s.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[s[i],s[j]]=[s[j],s[i]]}return s}
function nextQuestion(skill){
 const answered=loadAnswered(), all=questionBank[skill], done=new Set(answered[skill]||[]);
 if(done.size>=all.length){saveAnswered({...answered,[skill]:[]});return shuffle(all)[0]}
 const pool=all.filter(x=>!done.has(x.id));
 return pool[Math.floor(Math.random()*pool.length)]
}
function markAnswered(skill,qid){
 const a=loadAnswered();if(!a[skill])a[skill]=[];
 if(!a[skill].includes(qid)){a[skill].push(qid);saveAnswered(a)}
}

const today=()=>new Date().toLocaleDateString('en-CA');
const initial={attempts:[],vocabIndex:0,vocabReviewed:0,practice:{reading:0,listening:0,writing:0,speaking:0},bookLogs:[],messages:[{role:'agent',text:'把你刚做的题、作文或卡住的地方发给我。我只给具体修改和下一步。'}]};
let state=Object.assign({},initial,JSON.parse(localStorage.getItem('senthee-native')||'{}'));
let tab='home',sub='reading',readingQ=null,listeningQ=null,readingAns={},listeningAns={};
const save=()=>localStorage.setItem('senthee-native',JSON.stringify(state));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function shell(title,desc,body){return `<main class="screen"><header class="top"><div><h1>${title}</h1><p>${desc}</p></div><span class="tag">Senthee</span></header>${body}</main>`}

function loadReadingQ(){readingQ=nextQuestion('reading');readingAns={}}
function loadListeningQ(){listeningQ=nextQuestion('listening');listeningAns={}}

function home(){const mine=state.attempts.filter(x=>x.date===today()),mins=mine.reduce((s,x)=>s+x.minutes,0),days=new Set(state.attempts.map(x=>x.date)).size;return shell('今天先做这一组','完成后有空再继续。',`<section class="task"><small>下一项</small><h3>阅读定位练习</h3><p>完成一篇短文和一道同义替换题。</p><button class="primary" data-go="practice">开始练习</button></section><section class="panel"><h2>学习记录</h2><div class="heat">${Array.from({length:56},(_,i)=>`<i class="${i>=56-Math.min(state.attempts.length,56)?'on':''}"></i>`).join('')}</div><div class="stats"><div class="stat"><strong>${mine.length}</strong><span>今日完成</span></div><div class="stat"><strong>${mins}</strong><span>今日分钟</span></div><div class="stat"><strong>${days}</strong><span>学习天数</span></div></div></section><section class="panel"><h2>今日学习 diff</h2>${mine.length?mine.slice(-5).reverse().map(x=>`<div class="question"><strong>+ ${esc(x.detail)}</strong><div class="muted">${x.minutes} 分钟</div></div>`).join(''):'<div class="empty">完成第一项后，这里会出现记录。</div>'}</section>`)

function practice(){
 const names={reading:'阅读',listening:'听力',writing:'写作',speaking:'口语'};
 let body=`<div class="tabs">${Object.keys(names).map(k=>`<button data-sub="${k}" class="${sub===k?'active':''}">${names[k]}</button>`).join('')}</div>`;
 if(sub==='reading'||sub==='listening'){
  const q=sub==='reading'?(readingQ||(loadReadingQ(),readingQ)):(listeningQ||(loadListeningQ(),listeningQ));
  if(!q)return shell('分科练习','题目、作答、订正一次完成。',body+'<p class="muted">暂无题目</p>');
  const ans=sub==='reading'?readingAns:listeningAns;
  if(sub==='listening'){
   body+=`<section class="question"><span class="tag">${q.title}</span><div class="muted">难度：${q.difficulty} · 来源：${q.source}</div><button class="secondary" id="speak">▶ 播放听力</button><p class="listening-text muted">听力原文：${esc(q.say)}</p>`;
  }else{
   body+=`<section class="question"><span class="tag">${q.title}</span><div class="muted">难度：${q.difficulty} · 来源：${q.source}</div><div class="passage">${esc(q.passage)}</div>`;
  }
  q.questions.forEach((qu,i)=>{
   body+=`<h2>${i+1}. ${esc(qu.text)}</h2><div class="options">${qu.opts.map((o,oi)=>`<label class="option"><input type="radio" name="ans-${qu.id}" value="${oi}" ${ans[qu.id]===oi?'checked':''}>${o}</label>`).join('')}</div>`;
  });
  body+=`<button class="primary" id="check">检查答案</button><div id="feedback"></div></section>`;
 }else if(sub==='writing'){
  const list=questionBank.writing;
  const w=state.practice.writing%list.length;
  body+=`<section class="question"><span class="tag">写作题</span><div class="prompt">${esc(list[w])}</div><textarea id="work" placeholder="在这里完成正文…"></textarea><div class="row spread"><span id="count" class="muted">0 words</span><button class="primary" id="submit-work">提交给 Agent</button></div><div id="feedback"></div></section>`;
 }else{
  const list=questionBank.speaking;
  const s=list[state.practice.speaking%list.length];
  body+=`<section class="question"><span class="tag">口语题 · Part ${s.part}</span><div class="prompt">${esc(s.prompt)}</div><p class="muted">准备 1 分钟，连续回答 1–2 分钟。完成后记录，再做下一题。</p><button class="primary" id="done-speak">完成并记录</button></section>`;
 }
 return shell('分科练习','题目、作答、订正一次完成。',body)
}

function vocabulary(){const i=state.vocabIndex%vocab.length,v=vocab[i];return shell('词库','听、认、看例句，再进入下一个。',`<section class="vocab-card"><div class="row spread"><span class="tag">雅思高频词块</span><span>${i+1} / ${vocab.length}</span></div><h2>${v[0]}</h2><button class="secondary" id="v-speak">▶ 播放发音</button><div id="v-answer" hidden><p class="meaning">${v[1]}</p><p class="example">${v[2]}</p></div><div class="vocab-actions"><button class="secondary" id="reveal">显示释义</button><button class="primary" id="v-next" hidden>下一个</button></div></section><section class="panel"><strong>已复习 ${state.vocabReviewed} 个</strong><p class="muted">当前内置 ${vocab.length} 个高频词块，复习记录会进入首页看板。</p></section>`)}

function books(){return shell('真题记录','Cambridge 书的答案与错因记录在手机里。',`<section class="panel"><div class="book-grid"><label>Book<select id="book">${[19,18,17,16,15].map(x=>`<option>Cambridge IELTS ${x}</option>`).join('')}</select></label><label>Test<select id="test">${[1,2,3,4].map(x=>`<option>Test ${x}</option>`).join('')}</select></label><label>科目<select id="skill"><option>Listening</option><option>Reading</option><option>Writing</option><option>Speaking</option></select></label><label>部分<select id="part"><option>Section 1</option><option>Section 2</option><option>Section 3</option><option>Section 4</option></select></label></div></section><section class="panel"><h2>答案</h2><div class="answer-grid">${Array.from({length:10},(_,i)=>`<label>${i+1}<input type="text" data-answer="${i+1}"></label>`).join('')}</div></section><section class="panel stack"><label>错题号<input id="wrong" type="text" placeholder="例如：3, 7, 9"></label><label>错因与订正<textarea id="note" placeholder="写清楚定位词、同义替换、拼写或审题问题"></textarea></label><button class="primary" id="save-book">保存本次记录</button></section><section class="panel"><h2>最近记录</h2>${state.bookLogs.length?state.bookLogs.slice(-3).reverse().map(x=>`<div class="question"><strong>${esc(x.book)} · ${esc(x.test)} · ${esc(x.skill)}</strong><div class="muted">错题：${esc(x.wrong||'无')}</div></div>`).join(''):'<div class="empty">还没有记录。</div>'}</section>`)}

function coach(){return shell('Agent','让反馈落到下一次练习。',`<section class="chat" id="chat">${state.messages.map(m=>`<div class="bubble ${m.role}">${esc(m.text)}</div>`).join('')}</section><div class="composer"><textarea id="coach-input" placeholder="粘贴作文、错因或问题…"></textarea><button class="primary" id="send">发送</button></div>`)}

const pages={home,practice,books,vocabulary,coach};
function render(){
 document.querySelector('#app').innerHTML=pages[tab]();
 document.querySelector('#nav').innerHTML=[['home','⌂','首页'],['practice','✓','练习'],['books','▤','真题'],['vocabulary','Aa','词库'],['coach','✦','Agent']].map(x=>`<button data-tab="${x[0]}" class="${tab===x[0]?'active':''}"><span>${x[1]}</span>${x[2]}</button>`).join('');
 bind()
}
function bind(){
 document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.tab;render()});
 document.querySelector('[data-go]')?.addEventListener('click',()=>{tab='practice';loadReadingQ();render()});
 document.querySelectorAll('[data-sub]').forEach(b=>b.onclick=()=>{sub=b.dataset.sub;if((sub==='reading'||sub==='listening')&&tab==='practice'){if(sub==='reading'&&!readingQ)loadReadingQ();if(sub==='listening'&&!listeningQ)loadListeningQ()}render()});

 // Reading / Listening answer checking with no-repeat
 if((sub==='reading'||sub==='listening')&&tab==='practice'){
  const q=sub==='reading'?(readingQ||(loadReadingQ(),readingQ)):(listeningQ||(loadListeningQ(),listeningQ));
  if(!q)return;
  document.querySelector('#speak')?.addEventListener('click',()=>{if(sub==='listening'&&q.say)speechSynthesis.speak(new SpeechSynthesisUtterance(q.say))});
  document.querySelector('#check').onclick=()=>{
   const f=document.querySelector('#feedback');
   let allAnswered=true,allCorrect=true;
   q.questions.forEach(qu=>{
    const sel=document.querySelector(`input[name="ans-${qu.id}"]:checked`);
    if(sel){const v=Number(sel.value);if(sub==='reading')readingAns[qu.id]=v;else listeningAns[qu.id]=v;if(v!==qu.a)allCorrect=false}
    else allAnswered=false
   });
   if(!allAnswered){f.className='feedback bad';f.textContent='请回答所有题目再检查。';return}
   f.className=`feedback ${allCorrect?'':'bad'}`;
   f.textContent=allCorrect?'全部正确！':'部分答错，看解析订正后再做下一题。';
   q.questions.forEach(qu=>{
    const sel=document.querySelector(`input[name="ans-${qu.id}"]:checked`);
    if(sel){const v=Number(sel.value);if(v!==qu.a){
     const hint=document.createElement('div');hint.className='explanation';hint.textContent=`第 ${q.questions.indexOf(qu)+1} 题：${qu.why}`;f.appendChild(hint)
    }}}
   );
   record(allCorrect?'完成练习':'完成订正',`${sub==='reading'?'阅读':'听力'}：${q.title}`);
   markAnswered(sub,q.id);
   if(sub==='reading'){state.practice.reading++}else{state.practice.listening++}
   save();
   const nextBtn=document.createElement('button');nextBtn.className='secondary';nextBtn.textContent='下一题';nextBtn.onclick=()=>{if(sub==='reading'){loadReadingQ()}else{loadListeningQ()}render()};document.querySelector('#feedback').after(nextBtn)
  }
 }

 document.querySelector('#work')?.addEventListener('input',e=>document.querySelector('#count').textContent=`${e.target.value.trim()?e.target.value.trim().split(/\s+/).length:0} words`);
 document.querySelector('#submit-work')?.addEventListener('click',async()=>{
  const text=document.querySelector('#work').value.trim();if(!text)return;
  record('完成输出','写作练习',20);
  const f=document.querySelector('#feedback');f.className='feedback';f.textContent='分析中…';
  try{const r=await fetch(API,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({mode:'writing',content:text})}),d=await r.json();f.textContent=d.feedback||'已记录。'}catch{f.textContent='已保存练习；网络恢复后再提交 Agent。'}
  state.practice.writing++;save()
 });
 document.querySelector('#done-speak')?.addEventListener('click',()=>{record('完成输出','口语练习',10);state.practice.speaking++;if(sub==='speaking'){const list=questionBank.speaking;state.practice.speaking=state.practice.speaking%list.length}save();render()});

 document.querySelector('#v-speak')?.addEventListener('click',()=>speechSynthesis.speak(new SpeechSynthesisUtterance(vocab[state.vocabIndex%vocab.length][0])));
 document.querySelector('#reveal')?.addEventListener('click',()=>{document.querySelector('#v-answer').hidden=false;document.querySelector('#reveal').hidden=true;document.querySelector('#v-next').hidden=false});
 document.querySelector('#v-next')?.addEventListener('click',()=>{record('完成练习',`词块：${vocab[state.vocabIndex%vocab.length][0]}`,3);state.vocabIndex++;state.vocabReviewed++;save();render()});

 document.querySelector('#save-book')?.addEventListener('click',()=>{const log={book:document.querySelector('#book').value,test:document.querySelector('#test').value,skill:document.querySelector('#skill').value,wrong:document.querySelector('#wrong').value,note:document.querySelector('#note').value,date:today()};state.bookLogs.push(log);record('完成订正',`${log.book} ${log.test} ${log.skill}`,20);save();render()});
 document.querySelector('#send')?.addEventListener('click',async()=>{const el=document.querySelector('#coach-input'),text=el.value.trim();if(!text)return;state.messages.push({role:'user',text},{role:'agent',text:'正在分析…'});save();render();try{const r=await fetch(API,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({mode:'coach',content:text})}),d=await r.json();state.messages[state.messages.length-1].text=d.feedback||'请先记录一个具体错因。'}catch{state.messages[state.messages.length-1].text='网络暂时不可用。内容已保留，稍后再发。'}save();render()})
 }
}
render();
