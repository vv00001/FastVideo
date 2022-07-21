var speed;
var setting;
var maxspeed;

chrome.action.onClicked.addListener(async (tab)=>{
    if(speed!="undefined"){
       chegespeed(tab.id);
    }else{
    }
});
function chegespeed(id){
    speed+=.25;
    if(setting==1){
        if(speed>maxspeed){
            speed=1;
        }
    }else{
        if(speed>2)
        speed=1;
    }
    if(id>0){
        chrome.scripting.executeScript({
            target:{tabId:id},        
            function: changeBackgroundColor
        });
    }
    let nnn=[{speed:speed,settings:setting,maxspeed:maxspeed}];
    chrome.storage.local.set({'myspeed':nnn});    
    callseticon(id);
}
const initStorageCache =  getAllStorageSyncData().then(items => {
    if(speed==undefined){
        speed=items.myspeed[0].speed;
        setting=items.myspeed[0].settings;
        maxspeed=items.myspeed[0].maxspeed;
    }
});
function getAllStorageSyncData() {
    return new Promise((resolves, rejects) => {
        chrome.storage.local.get('myspeed', (itemss) => {
        if (chrome.runtime.lastError) {
            return rejects(chrome.runtime.lastError);
        }
        resolves(itemss);
        });
    });
}
chrome.runtime.onInstalled.addListener(function(details){
    speed=2;
    setting=0;
    maxspeed=2;
    let mmm=[];
    mmm.push({speed:2,settings:0,maxspeed:2});
    chrome.storage.local.set({'myspeed':mmm});
});
function callseticon(id){
    if(speed==1.25)
        chrome.action.setIcon({ tabId: id,path: 'icons/125.png'});
    else if (speed==1.5)
        chrome.action.setIcon({ tabId: id,path: 'icons/150.png'});
    else if (speed==1.75)
        chrome.action.setIcon({ tabId: id,path: 'icons/175.png'});
    else if (speed==2)
        chrome.action.setIcon({ tabId: id,path: 'icons/200.png'});
    else if(speed==1){
        chrome.action.setIcon({ tabId: id,path: 'icons/100.png'});
    }
    if(speed>2)
        chrome.action.setIcon({ tabId: id,path: 'icons/supermax.png'});
}
chrome.tabs.onUpdated.addListener(async(tabId)=>{
    if(speed=="undefined"){
    }
    chrome.scripting.executeScript({
        target:{tabId:tabId},        
        function: changeBackgroundColor
    })
    callseticon(tabId.id);
});
chrome.runtime.onStartup.addListener(async () =>{
});
function changeBackgroundColor(){
    const myselector=document.querySelector('video');
    if(myselector!=null){
        myselector.addEventListener('loadedmetadata', function () {
            chrome.runtime.sendMessage ({message: "get"},
            (response) =>{                
                document.querySelector('video').playbackRate =response.message;
            });
        }, false);
        chrome.runtime.sendMessage ({message: "get"}, (response) => {                
        document.querySelector('video').playbackRate =response.message;
        });
    }
}
chrome.runtime.onMessage.addListener(async(requst,sender,sendResponse)=>{
    console.log(requst);
    if(requst.message=='get'){
        sendResponse({
            message:speed
        });
    }
    if("set"===requst.message){
        maxspeed=requst.value;
        setting=requst.setting
    }
});