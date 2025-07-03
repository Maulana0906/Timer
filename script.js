const progres = document.getElementById('progress-ring');
const timeDisplay = document.getElementById('time-display');
const timerContainer = document.querySelector('.timer-container');
const modal = document.getElementById('modal');
let values,reqTime,repeat,timeLeft;
let zero = (x) => (x<10) ? `0${x}`: x;
var timer;

// logika stroke timer
const radius = 110;
const keliling = 2*Math.PI*radius;
let milisecond = 1000;
progres.style.strokeDasharray = keliling;
progres.style.strokeDashoffset = 0;

// start & end

const buttonTimer = document.querySelector('.start-end');
const iconButtonTimer = buttonTimer.children[0];
buttonTimer.addEventListener('click', () => {
    if(progres.classList.contains('on')){
        stop();
        iconButtonTimer.classList.replace('fa-stop', 'fa-play');
        iconButtonTimer.children[0].textContent = 'Start';
        progres.classList.remove('on')
    }else{
        timer = setInterval(updateTimer,100);
        iconButtonTimer.classList.replace('fa-play', 'fa-stop');
        iconButtonTimer.children[0].textContent = 'Stop';
        progres.classList.add('on')
    }
    
})

// modal timer
timerContainer.addEventListener('click', ()=> {
    modal.style.display = 'flex';
    document.querySelector('.backdrop').style.display = 'block'

    document.addEventListener('click', function (e) {
        if(e.target.classList.contains('backdrop') || e.target.classList.contains('cancel')){
            modal.style.display='none';
            document.querySelector('.backdrop').style.display = 'none';
        }else if(e.target.classList.contains('save')){
            modal.style.display='none';
            document.querySelector('.backdrop').style.display = 'none';
            let save = document.querySelectorAll('.number-time h2');
            let p = Array.from(save).map(e => e.textContent).join('');
            timeDisplay.textContent = p;
            values= timeDisplay.textContent.split(':').map(e => Number(e));
            reqTime =(values[0]*3600 + values[1]*60 + values[2])*1000;
            timeLeft = reqTime;
            repeat = Array.from(save).filter(e=> e.textContent!=':').map(e => Number(e.textContent));
        }
    })

})

// Edit time
document.addEventListener("click", (el)=> {
    let temp = el.target.classList[1]==='fa' ? el.target.classList[0] : '-';
    if(temp.split('-')[0] === 'plus'){
        editTimer(temp.split('-')[1], 'plus');
    }else if(temp.split('-')[0] === 'minus'){
        editTimer(temp.split('-')[1], 'minus');
    }
})
//repeat
document.addEventListener('click', (el)=> {
    if(el.target.classList.contains('repeat')){
        stop();
        fcRepeat();
    }
})
const stroke = () => {
  timeLeft -=100;
  const offset = keliling * (1-timeLeft/reqTime);
  progres.style.strokeDashoffset = offset;
}
function uiTime(){
    if(values[2]==0){
        if(values[1] ==0){
            values[0]-=1;
            values[1] =59;
        }else{
            values[1] -= 1;
        }
        values[2] = 59;
    }else{
        values[2] -=1;

    }
    milisecond +=1000;
}
function updateTimer(){
    milisecond -=100;
        if(milisecond==0){
        uiTime();
        timeDisplay.textContent = values.map(e => zero(e)).join(':');
    }

    (timeLeft>0)?stroke():null;    
    (values.reduce((a,b)=>a+b)<=0)?stop():null;
    
}
function stop(){
    clearInterval(timer)  
}
function editTimer(type,x){
    let element = document.getElementById(type);
    let hour = (x,y) => {
        if(y=='plus'){
           return (x==99) ? 0 : x+1;
        }else{
           return (x==0) ? 99 : x-1;
        }
    }
    let secondOrMinute = (x,y) => {
        if(y==='plus'){
            return (x==59) ? 0 : x+1;
        }else{
            return (x==0) ? 59 : x-1;
        }
    }
        let cache= (type=='hour') ? hour(Number(element.textContent) ||0, x) : secondOrMinute(Number(element.textContent)||0, x);
        element.textContent = zero(cache)
}
function fcRepeat(){
    if(!progres.classList.contains('on')){
        progres.classList.add('on');
        iconButtonTimer.classList.replace('fa-play', 'fa-stop');
        iconButtonTimer.children[0].textContent = 'Stop';
    }
    progres.style.strokeDashoffset = 0;
    timeLeft=reqTime;
    values = [...repeat];
    milisecond =1000;
    timeDisplay.textContent = repeat.map(e => zero(e)).join(':');
    timer = setInterval(updateTimer,100);
}