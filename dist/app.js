'use strict';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const clamp = (n, min = 0, max = 1) => Math.max(min, Math.min(max, n));

// Product mechanism preview; the primary action opens the live Helms demo.
const scenarios = {
  research:{title:'让团队完成一份行业研究',roles:['规划 Agent','研究 Agent','交付 Agent'],tasks:['理解目标 · 拆解任务','收集资料 · 交叉验证','整合结果 · 追溯依据']},
  plan:{title:'让团队协作一份产品方案',roles:['产品 Agent','方案 Agent','评审 Agent'],tasks:['定义问题 · 梳理边界','设计路径 · 拆分能力','检查一致性 · 整理交付']},
  document:{title:'让团队梳理一组企业文档',roles:['分析 Agent','知识 Agent','校验 Agent'],tasks:['识别主题 · 拆分问题','提炼要点 · 组织信息','核对依据 · 标记缺口']}
};
$$('.scenario').forEach(button=>button.addEventListener('click',()=>{
  $$('.scenario').forEach(tab=>{tab.classList.toggle('active',tab===button);tab.setAttribute('aria-pressed',String(tab===button));});
  const scenario=scenarios[button.dataset.scenario];$('#demo-task-title').textContent=scenario.title;
  scenario.roles.forEach((role,i)=>{$(`#role-${i}`).textContent=role;$(`#task-${i}`).textContent=scenario.tasks[i];});
}));

const meetingCopy = {
  summary:{heading:'把一次讨论，沉淀为可执行的信息。',description:'讨论要点、关键决策与潜在风险，\n以清晰结构呈现。'},
  todo:{heading:'把会议决策，转化为下一步行动。',description:'提取待办事项与责任信息；\n未明确的内容保留为待确认项。'}
};
const meetingTabs=$$('[data-meeting-tab]');
function selectMeetingTab(button){
  meetingTabs.forEach(tab=>{tab.setAttribute('aria-selected',String(tab===button));tab.tabIndex=tab===button?0:-1;});
  const panel=$('#meeting-panel');const copy=meetingCopy[button.dataset.meetingTab];
  panel.setAttribute('aria-labelledby',button.id);$('strong',panel).textContent=copy.heading;$('p',panel).textContent=copy.description;$('p',panel).style.whiteSpace='pre-line';
}
meetingTabs.forEach((button,i)=>{
  button.addEventListener('click',()=>selectMeetingTab(button));
  button.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();const index=event.key==='Home'?0:event.key==='End'?meetingTabs.length-1:(i+(event.key==='ArrowRight'?1:-1)+meetingTabs.length)%meetingTabs.length;
    selectMeetingTab(meetingTabs[index]);meetingTabs[index].focus();
  });
});
for(let i=0;i<47;i++){
  const bar=document.createElement('i');
  const envelope=Math.sin(i/46*Math.PI)*.78+.17;
  const height=(8+Math.abs(Math.sin(i*1.7)*Math.cos(i*.53))*45)*envelope;
  bar.style.setProperty('--height',`${height}px`);bar.style.setProperty('--scale',String(.7+Math.abs(Math.sin(i*.9))*.7));
  $('#waveform').append(bar);
}

const cases={
  helms:{category:'AI 原生产品 · 多智能体协作',title:'Helms',subtitle:'从单一助手，到具备身份、记忆与协作机制的数字组织。',meta:['2025.07 — 至今','产品规划 + AI Coding','多 Agent / Skills / MCP'],sections:[
    {title:'真实问题',text:'复杂任务需要连续执行、角色分工与结果追踪。将所有工作放在单次对话中，难以持续管理上下文、职责和执行边界。Helms 围绕企业数字员工组织与可管理的任务协作展开产品设计。'},
    {title:'我的关键设计',items:['数字员工模型：定义岗位、职责、持久身份、长期记忆、专属工作空间与技能工具。','协作机制：贯通任务理解、目标拆解、角色分工、执行与反馈，在关键节点引入人工确认。','企业治理：规划组织与角色权限、共享知识、工具授权、敏感操作审批与执行审计。','工程实践：结合 AI Coding 推进产品设计、研发、测试与迭代，围绕执行轨迹与 Bad Case 优化运行效果。']},
    {title:'正在研究的架构方向',text:'研究结合 Jev / JevAgentHarness 的任务复杂度判断开展分层模型路由；探索 DeepSeek Harness / Cordis 插件化架构，将 Agent Loop、会话、模型适配、工具与沙箱等能力模块化解耦。以上属于研究与规划方向，区别于已完成的产品机制设计。',highlight:true},
    {title:'产品取舍',text:'以任务的可控、可追踪和组织协作为设计重点。保留人工决策入口，关注 Agent 自主性与企业管理边界之间的平衡。网页中的协作流程用于说明产品机制。'}]},
  helmskb:{category:'企业 AI 产品 · 知识管理',title:'HelmsKB',subtitle:'将非结构化资料，转化为可检索、可引用、可持续维护的企业知识资产。',meta:['2025.07 — 至今','产品规划 + AI Coding','RAG / OCR / 私有化部署'],sections:[
    {title:'真实问题',text:'企业资料分散、文档结构复杂，知识难以检索与复用。直接接入大模型无法自动解决文档解析、召回质量、引用准确性与知识权限问题。'},
    {title:'我的关键设计',items:['完整 RAG 链路：规划数据接入、文档解析、知识索引、召回、重排序与生成。','复杂文档处理：面向 PDF、Word 与扫描件设计 OCR、结构解析、切分和向量化流程，关注表格与标题层级。','可信问答：结合语义检索、关键词匹配与重排序，设计带原文引用的回答机制。','知识边界：规划业务域知识库隔离、本地模型、私有知识存储与分级访问控制。']},
    {title:'以评测驱动迭代',text:'基于已有 RAGFlow 工程实践，以固定测试问题、引用准确性检查、幻觉分析与 Bad Case 复盘，分层排查解析、切分、Embedding、检索和生成环节。',highlight:true},
    {title:'产品取舍',text:'把回答依据、知识安全与问题定位能力作为企业知识服务的重要组成。网页中的文档与回答画面是机制示意，不代表生产系统的真实截图或评测数据。'}]},
  zhihui:{category:'本地 AI 产品 · 智能会议',title:'ZhiHui',subtitle:'让会议数据留在可控的环境，让每一次讨论沉淀为可用的信息。',meta:['2026.03 — 至今','产品规划 + AI Coding','本地 ASR / LLM / 桌面应用'],sections:[
    {title:'真实问题',text:'隐私敏感会议需要兼顾语音处理效率、内容沉淀与数据自主控制。ZhiHui 以本地优先为产品原则，在纯本地模型模式下，让会议数据在用户设备内完成处理。'},
    {title:'我的关键设计',items:['端到端链路：从音频采集、实时转写、AI 分析到结构化纪要、历史检索与内容导出。','语音架构：设计麦克风与系统音频双路采集，结合 VAD、重采样与异步转写队列，适配多种本地 ASR 模型。','模型接入：统一 LLM Provider 接口，支持 Ollama 本地模型及可选的云端兼容模型；长会议采用分段处理、分层摘要与结果聚合。','内容管理：设计项目会议、客户沟通、汇报与复盘模板，通过结构化提示词约束输出，支持编辑和 PDF / DOCX 导出。']},
    {title:'从原型到独立交付',text:'负责桌面应用构建与版本发布，建设基于设备标识的许可证管理服务，覆盖授权、后台审计、安装包发布与签名更新等商业化基础能力。',highlight:true},
    {title:'产品取舍',text:'本地优先与可选云端接入并存，纯本地模式的数据处理边界明确。通过结构化模板与分层摘要，让会议结果更清晰，并减少无依据生成。网页画面用于说明产品机制。'}]}
};
const dialog=$('#case-dialog');
let dialogTrigger;
function openCase(key,trigger){
  const info=cases[key];if(!info)return;
  dialogTrigger=trigger;$('#case-category').textContent=info.category;$('#case-title').textContent=info.title;$('#case-subtitle').textContent=info.subtitle;
  $('#case-meta').replaceChildren(...info.meta.map(text=>{const span=document.createElement('span');span.textContent=text;return span;}));
  const sections=info.sections.map(item=>{
    const section=document.createElement('section');if(item.highlight)section.className='case-highlight';
    const heading=document.createElement('h3');heading.textContent=item.title;section.append(heading);
    if(item.text){const p=document.createElement('p');p.textContent=item.text;section.append(p);}
    if(item.items){const list=document.createElement('ul');item.items.forEach(text=>{const li=document.createElement('li');li.textContent=text;list.append(li);});section.append(list);}
    return section;
  });
  $('#case-body').replaceChildren(...sections);dialog.showModal();dialog.scrollTop=0;document.body.classList.add('modal-open');$('.close-dialog').focus({preventScroll:true});
}
$$('[data-case]').forEach(button=>button.addEventListener('click',()=>openCase(button.dataset.case,button)));
$('.close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();});
dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');dialogTrigger?.focus({preventScroll:true});});

let toastTimer;
function toast(message){clearTimeout(toastTimer);$('#toast').textContent=message;$('#toast').classList.add('show');toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),2600);}
$('#copy-email').addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText('hbululei@126.com');toast('邮箱已复制：hbululei@126.com');}
  catch{toast('邮箱：hbululei@126.com，可长按选择复制');}
});

let scrollQueued=false;
function updateScroll(){
  scrollQueued=false;
  if(!reducedMotion.matches&&window.innerWidth>760){const rect=$('#workspace').getBoundingClientRect();const progress=clamp((window.innerHeight-rect.top)/(window.innerHeight*.6));$('#workspace').style.transform=`perspective(1400px) rotateX(${(1-progress)*4}deg) scale(${.97+progress*.03})`;}
  else $('#workspace').style.transform='';
  const location=window.scrollY+160;
  let active='';for(const section of $$('#work, #impact, #about'))if(section.offsetTop<=location)active=section.id;
  $$('.nav-links a').forEach(link=>{const selected=link.hash===`#${active}`;link.classList.toggle('active',selected);if(selected)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
}
window.addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateScroll);}},{passive:true});
window.addEventListener('resize',updateScroll);reducedMotion.addEventListener('change',updateScroll);updateScroll();
