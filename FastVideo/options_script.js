var seton=0;
var maxspeed;
var speed;
var mysorry=0;
var firstCall=!0;

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("myButton").addEventListener("click", myFunction);
    document.getElementById("super").addEventListener("click", callmysorry);

    document.getElementById('buttonCountPlus').addEventListener('click',function(){
        changeMaxSpeed(0.25);
    });
    document.getElementById('buttonCountMinus').addEventListener('click',function(){
        changeMaxSpeed(-0.25);
    });    
    document.getElementById('enableSettings').innerHTML=chrome.i18n.getMessage("enableSettings");
    document.getElementById('onSuperSet').innerHTML=chrome.i18n.getMessage("onSuperSet");
    document.getElementById('mytext3').innerHTML=chrome.i18n.getMessage("knowbugs");
    document.getElementById('mytext4').innerHTML=chrome.i18n.getMessage("knowiss");
    showall();
});
function callmysorry(){
    if(mysorry==0){
        mysorry=1;
        document.getElementById('mytext2').innerHTML =chrome.i18n.getMessage("mysorrytxt");      
        }else{
            mysorry=0;
            document.getElementById('mytext2').innerHTML = "";
        }
}
function changeMaxSpeed(val){
    if(seton==1){
        maxspeed+=val;
        if(maxspeed>6)
            maxspeed=6;
        if(maxspeed<2)  
            maxspeed=2;
        save();
        showmax(maxspeed);
        sendMess();
    }else{
    }
}
async function myFunction(){
    callmysorry();
    if(seton==0){
        seton=1;
        document.getElementById('mytext1').innerHTML= chrome.i18n.getMessage("readAboutSpeed");
        iCallAnswer();
        sendMess();
    }
    else{
        seton=0;
        save();
        sendMess();
        document.getElementById("buttonCountNumber").innerHTML = "2.00";        
        clearset();
    }
}

function save(){
    console.log("save");
    chrome.runtime.sendMessage ({
        message:"get"
    },function(receive){
        console.log(receive);
        let lastError = chrome.runtime.lastError;
        if(lastError){
            console.log(lastError);
        }
        chrome.storage.local.set({
        'myspeed':[{
            settings:seton,
            speed:receive.message,
            maxspeed:maxspeed
    }]
    });});
    
}

async function showall(){
    console.log("entterSowAll");
    if(maxspeed){
        showRadio();
        showmax();
    }else{
        console.log("call init ctor showall");
        iCallAnswer();
    }
}
function showmax(){
    if(maxspeed){
        if(seton>0){
            let kkk=maxspeed.toString().length;
            let innertext=maxspeed;
            if(kkk==1)
                innertext+=".00";
            if(kkk==3)
                innertext+="0";
            document.getElementById("buttonCountNumber").innerHTML = innertext;
        }else{
            document.getElementById("buttonCountNumber").innerHTML = "2.00";
        }
    }
}
function showRadio(){
    console.log(seton);
    if(seton!="undefined"){
        if(seton>0){
            document.getElementById("myButton").checked=true;
            document.getElementById('mytext1').innerHTML=chrome.i18n.getMessage("readAboutSpeed");
        }else{
            document.getElementById("myButton").checked=false;
        }
    }else{
        console.log("call init ctor showRadio");
        iCallAnswer();
    }
}

function sendMess(){
    if(mysorry==1){
        mysorry=0;
        document.getElementById('mytext2').innerHTML = "";
        document.getElementById('super').checked=false;
    }
    chrome.runtime.sendMessage ({
        message:"set",
        value:maxspeed,
        setting:seton
    },() =>{});
}


function clearset(){
    let fff=document.getElementById('mytext1');
    fff.innerHTML = chrome.i18n.getMessage("maxspeed");
    document.getElementById('mytext2').innerHTML = "";
    document.getElementById('mytext3').innerHTML = "";
    document.getElementById('mytext4').innerHTML = "";
}

function iCallAnswer(){
    getAllStorageSyncDataOp().then(items => {
        console.log(firstCall);
        speed=items.myspeed[0].speed;
        maxspeed=items.myspeed[0].maxspeed;
        if(firstCall){
            seton=items.myspeed[0].settings;
            firstCall=!1;
        }else{
            save();
        }
        console.log(items);
        showall();
    });
    
    function getAllStorageSyncDataOp() {
        return new Promise((resolves, rejects) => {
            chrome.storage.local.get('myspeed', (items) => {
            if (chrome.runtime.lastError) {
                return rejects(chrome.runtime.lastError);
            }
            resolves(items);
            });
        });
    }
}