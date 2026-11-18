const MODULES = [
  {id:1,key:'Module 1 · Licensing',en:'Module 1: Licensing',ar:'الوحدة الأولى: الترخيص',introEn:'Licences, authorised inspections and the taxi/PHC comparison.',introAr:'الرخص والتفتيش المخوّل والمقارنة بين التاكسي وسيارة النقل الخاصة.'},
  {id:2,key:'Module 2 · Vehicle',en:'Module 2: Vehicle',ar:'الوحدة الثانية: المركبة',introEn:'Vehicle condition, safety checks, signage and damage reporting.',introAr:'حالة المركبة وفحوصات السلامة واللافتات والإبلاغ عن الأضرار.'},
  {id:3,key:'Module 3 · Driver',en:'Module 3: Driver',ar:'الوحدة الثالثة: السائق',introEn:'Driver wellbeing, disability access and respectful assistance.',introAr:'سلامة السائق وإتاحة الخدمة لذوي الإعاقة وتقديم المساعدة باحترام.'},
  {id:4,key:'Module 4 · Service',en:'Module 4: Service',ar:'الوحدة الرابعة: الخدمة',introEn:'Customer service, fares, lost property, complaints and safety.',introAr:'خدمة العملاء والأجور والمفقودات والشكاوى والسلامة.'}
];
const ANSWERS = window.SUGGESTED_ANSWERS || {};
const GUIDE = window.COURSE_GUIDE || {};
const questionList=document.querySelector('#question-list');
const moduleIndex=Number(document.body.dataset.module||0);
const currentModule=MODULES.find(m=>m.id===moduleIndex);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const bilingual=(en,ar,kind='text')=>`<div class="bilingual ${kind}"><p lang="en" dir="ltr">${esc(en)}</p><p lang="ar" dir="rtl">${esc(ar)}</p></div>`;
function moduleCards(){
  const target=document.querySelector('#module-cards');
  if(!target)return;
  target.innerHTML=MODULES.map(m=>{const count=QUESTION_BANK.filter(q=>q.module===m.key).length;return `<a class="module-card" href="module-${m.id}.html"><span class="module-number">${m.id}</span><div><h2 lang="en" dir="ltr">${m.en}</h2><h2 lang="ar" dir="rtl">${m.ar}</h2><p lang="en" dir="ltr">${m.introEn}</p><p lang="ar" dir="rtl">${m.introAr}</p><strong>${count} questions / ${count} سؤالاً</strong></div></a>`}).join('');
}
function answerFor(q){
  if(q.options){const option=q.options[q.answer];return {en:option[0],ar:option[1],explanationEn:q.feedback||'',explanationAr:q.feedbackAr||q.feedback||''};}
  return ANSWERS[q.id]||{en:'Suggested answer: review the matching course page and current licensing conditions.',ar:'إجابة مقترحة: راجع صفحة المادة ذات الصلة وشروط الترخيص الحالية.'};
}
function renderQuestion(q,index){
  const answer=answerFor(q);
  const choices=q.options?`<fieldset class="options"><legend>Choose one / اختر إجابة واحدة</legend>${q.options.map((o,i)=>`<label class="option"><input type="radio" name="${q.id}" value="${i}"><span><b lang="en" dir="ltr">${esc(o[0])}</b><b lang="ar" dir="rtl">${esc(o[1])}</b></span></label>`).join('')}</fieldset>`:`<label class="response-label"><span lang="en" dir="ltr">Your answer</span><span lang="ar" dir="rtl">إجابتك</span><textarea data-note="${q.id}" rows="3"></textarea></label>`;
  const answerHtml=`<details class="answer"><summary><span lang="en" dir="ltr">Show answer</span><span lang="ar" dir="rtl">إظهار الإجابة</span></summary><div class="answer-body"><h3><span lang="en" dir="ltr">Answer</span><span lang="ar" dir="rtl">الإجابة</span></h3>${bilingual(answer.en,answer.ar,'answer-text')}${answer.explanationEn?`<h4><span lang="en" dir="ltr">Explanation</span><span lang="ar" dir="rtl">التوضيح</span></h4>${bilingual(answer.explanationEn,answer.explanationAr||'', 'explanation-text')}`:''}</div></details>`;
  return `<article class="question-card" id="${esc(q.id)}"><div class="meta"><span>Q${index+1} / السؤال ${index+1}</span><span>Course page / صفحة المادة ${esc(q.page)}</span></div><div class="question-prompt"><span class="language-label">Question / السؤال</span>${bilingual(q.en,q.ar,'question-text')}</div>${choices}<div class="actions">${q.options?`<button class="check-button" data-check="${esc(q.id)}">Check / تحقّق</button><output class="result" id="result-${esc(q.id)}" aria-live="polite"></output>`:''}</div>${answerHtml}</article>`;
}
function renderGuide(){
  const target=document.querySelector('#guide-list');
  if(!target||!currentModule)return;
  const topics=GUIDE[currentModule.id]||[];
  target.innerHTML=topics.map((topic,i)=>`<article class="guide-card"><div class="meta"><span>Topic ${i+1} / الموضوع ${i+1}</span><span>Course pages / صفحات المادة ${esc(topic.pages)}</span></div><h3><span lang="en" dir="ltr">${esc(topic.en)}</span><span lang="ar" dir="rtl">${esc(topic.ar)}</span></h3>${bilingual(topic.enText,topic.arText,'guide-text')}</article>`).join('');
}
function renderModule(){
  if(!currentModule||!questionList)return;
  document.title=`${currentModule.en} / ${currentModule.ar} | Taxi & PHC Practice`;
  const heading=document.querySelector('#module-title');
  const intro=document.querySelector('#module-intro');
  if(heading)heading.innerHTML=`<span lang="en" dir="ltr">${currentModule.en}</span><span lang="ar" dir="rtl">${currentModule.ar}</span>`;
  if(intro)intro.innerHTML=`<p lang="en" dir="ltr">${currentModule.introEn}</p><p lang="ar" dir="rtl">${currentModule.introAr}</p>`;
  const items=QUESTION_BANK.filter(q=>q.module===currentModule.key);
  document.querySelector('#question-count').textContent=`${items.length} questions / ${items.length} سؤالاً`;
  questionList.innerHTML=items.map(renderQuestion).join('');
  renderGuide();
  document.querySelectorAll('[data-note]').forEach(el=>{el.value=localStorage.getItem('note-'+el.dataset.note)||'';el.addEventListener('input',()=>localStorage.setItem('note-'+el.dataset.note,el.value));});
  document.querySelectorAll('[data-check]').forEach(button=>button.addEventListener('click',()=>checkAnswer(button.dataset.check)));
}
function checkAnswer(id){
  const q=QUESTION_BANK.find(item=>item.id===id);const selected=document.querySelector(`input[name="${id}"]:checked`);const output=document.querySelector(`#result-${id}`);
  if(!selected){output.innerHTML='<span lang="en">Choose an answer first.</span><span lang="ar" dir="rtl">اختر إجابة أولاً.</span>';return;}
  const right=Number(selected.value)===q.answer;output.className='result '+(right?'correct':'incorrect');output.innerHTML=right?'<span lang="en">Correct</span><span lang="ar" dir="rtl">إجابة صحيحة</span>':'<span lang="en">Not correct</span><span lang="ar" dir="rtl">إجابة غير صحيحة</span>';
}
moduleCards();renderModule();
