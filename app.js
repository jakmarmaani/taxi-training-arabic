const UI = {
  ar: {eyebrow:'مراجعة تدريب إدنبرة',title:'تدرّب على الأسئلة',intro:'أسئلة للمراجعة مستخرجة من ملفات التدريب المرفقة. اختر إجابة أو اكتب ملاحظاتك، ثم اكشف الإجابة المرجعية عند توفرها.',notice:'ملاحظة: هذه المادة مبنية على دليل تدريبي إصدار 2020. تحقّق من شروط الترخيص الحالية قبل الاعتماد عليها في اختبار رسمي أو عمل فعلي.',searchLabel:'بحث',searchPlaceholder:'ابحث في الأسئلة…',moduleLabel:'الوحدة',allModules:'كل الوحدات',typeLabel:'النوع',allTypes:'الكل',quizOnly:'اختيار من متعدد',writtenOnly:'إجابة كتابية',footer:'للمراجعة التعليمية. راجع النسخة الأصلية وشروط المجلس الحالية عند الحاجة.',showing:'عرض',of:'من',questions:'سؤالاً',score:'النتيجة',check:'تحقّق من الإجابة',showAnswer:'عرض الإجابة المرجعية',hideAnswer:'إخفاء الإجابة المرجعية',writeHint:'اكتب إجابتك هنا. تُحفظ هذه الملاحظات في هذا المتصفح فقط.',choose:'اختر إجابة أولاً.',right:'إجابة صحيحة',wrong:'إجابة غير صحيحة',answer:'الإجابة الصحيحة',noResults:'لا توجد أسئلة تطابق بحثك.',written:'إجابة كتابية',choice:'اختيار من متعدد',source:'صفحة المادة'},
  en: {eyebrow:'Edinburgh training review',title:'Practise the questions',intro:'Review questions drawn from the supplied training files. Choose an answer or write notes, then reveal the reference answer where one is available.',notice:'Note: this material is based on a 2020 training guide. Check current licensing conditions before relying on it for a formal assessment or work.',searchLabel:'Search',searchPlaceholder:'Search questions…',moduleLabel:'Module',allModules:'All modules',typeLabel:'Type',allTypes:'All',quizOnly:'Multiple choice',writtenOnly:'Written response',footer:'For study and revision. Refer to the original material and current Council conditions when needed.',showing:'Showing',of:'of',questions:'questions',score:'Score',check:'Check answer',showAnswer:'Show reference answer',hideAnswer:'Hide reference answer',writeHint:'Write your answer here. Notes are saved in this browser only.',choose:'Choose an answer first.',right:'Correct',wrong:'Not correct',answer:'Correct answer',noResults:'No questions match your search.',written:'Written response',choice:'Multiple choice',source:'Course page'}
};
let lang='ar';
const answers=new Map();
const questionList=document.querySelector('#question-list');
const moduleFilter=document.querySelector('#module-filter');
const typeFilter=document.querySelector('#type-filter');
const search=document.querySelector('#search');
const tr=key=>UI[lang][key];
function setupLanguage(){
  document.documentElement.lang=lang;
  document.documentElement.dir=lang==='ar'?'rtl':'ltr';
  document.body.dataset.lang=lang;
  document.querySelector('#language-toggle').textContent=lang==='ar'?'English':'العربية';
  document.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=tr(el.dataset.i18n));
  search.placeholder=tr('searchPlaceholder');
  const modules=[...new Set(QUESTION_BANK.map(q=>q.module))];
  moduleFilter.innerHTML=`<option value="all">${tr('allModules')}</option>`+modules.map((m,i)=>`<option value="${i}">${lang==='ar'?m.replace('Module','الوحدة'):m}</option>`).join('');
  render();
}
function visibleQuestions(){
  const modules=[...new Set(QUESTION_BANK.map(q=>q.module))];
  const query=search.value.trim().toLocaleLowerCase();
  return QUESTION_BANK.filter(q=>(moduleFilter.value==='all'||q.module===modules[Number(moduleFilter.value)])&&(typeFilter.value==='all'||q.kind===typeFilter.value)&&(!query||(q.en+' '+q.ar+' '+q.module).toLocaleLowerCase().includes(query)));
}
function render(){
  const items=visibleQuestions();
  document.querySelector('#count-label').textContent=`${tr('showing')} ${items.length} ${tr('of')} ${QUESTION_BANK.length} ${tr('questions')}`;
  document.querySelector('#score-label').textContent=`${tr('score')}: ${[...answers.values()].filter(Boolean).length}/${answers.size}`;
  if(!items.length){questionList.innerHTML=`<div class="empty">${tr('noResults')}</div>`;return;}
  questionList.innerHTML=items.map((q,index)=>{
    const module=lang==='ar'?q.module.replace('Module','الوحدة'):q.module;
    const options=q.options?`<div class="options">${q.options.map((option,i)=>`<label class="option"><input type="radio" name="${q.id}" value="${i}"><span>${lang==='ar'?option[1]:option[0]}</span></label>`).join('')}</div>`:`<div class="written"><textarea data-note="${q.id}" placeholder="${tr('writeHint')}"></textarea></div>`;
    const answer=q.options?`${tr('answer')}: ${lang==='ar'?q.options[q.answer][1]:q.options[q.answer][0]}. `:'';
    const feedback=lang==='ar'?(q.feedbackAr||q.feedback):q.feedback;
    return `<article class="card"><div class="card-head"><span class="tag">${module} · ${q.kind==='choice'?tr('choice'):tr('written')}</span><span class="source">${tr('source')} ${q.page}</span></div><h2 class="question">${index+1}. ${lang==='ar'?q.ar:q.en}</h2>${options}<div class="actions">${q.options?`<button class="primary" data-check="${q.id}">${tr('check')}</button><span class="result" id="result-${q.id}"></span>`:''}<button class="secondary" data-reveal="${q.id}">${tr('showAnswer')}</button></div><div class="feedback" id="feedback-${q.id}" hidden>${answer}${feedback}</div></article>`;
  }).join('');
  document.querySelectorAll('[data-note]').forEach(el=>{el.value=localStorage.getItem('note-'+el.dataset.note)||'';el.addEventListener('input',()=>localStorage.setItem('note-'+el.dataset.note,el.value));});
  document.querySelectorAll('[data-check]').forEach(btn=>btn.addEventListener('click',()=>checkAnswer(btn.dataset.check)));
  document.querySelectorAll('[data-reveal]').forEach(btn=>btn.addEventListener('click',()=>{const box=document.querySelector('#feedback-'+btn.dataset.reveal);box.hidden=!box.hidden;btn.textContent=box.hidden?tr('showAnswer'):tr('hideAnswer');}));
}
function checkAnswer(id){
  const q=QUESTION_BANK.find(item=>item.id===id);
  const selected=document.querySelector(`input[name="${id}"]:checked`);
  const result=document.querySelector('#result-'+id);
  if(!selected){result.textContent=tr('choose');result.className='result';return;}
  const correct=Number(selected.value)===q.answer;
  answers.set(id,correct);
  result.textContent=correct?tr('right'):tr('wrong');
  result.className='result '+(correct?'correct':'incorrect');
  document.querySelector('#score-label').textContent=`${tr('score')}: ${[...answers.values()].filter(Boolean).length}/${answers.size}`;
}
document.querySelector('#language-toggle').addEventListener('click',()=>{lang=lang==='ar'?'en':'ar';setupLanguage();});
moduleFilter.addEventListener('change',render);
typeFilter.addEventListener('change',render);
search.addEventListener('input',render);
setupLanguage();
