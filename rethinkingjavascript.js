var currentStates = ['default'];
var currentItems = [];

var currentRoomId;

var currentEventId;
var currentDescription;

var currentChoiceDescription;
var currentChoiceId;

var choiceIds = [];
var choiceArray;

/*Questionable Variables*/
var currentProcess;
var inEvent;
var placeInStory=1;

var storyRoomList = [7,8,14,15,16,17,18];
var randomRoomList = [];
var currentRoomIndex = 0;

var storedEvents = [];
var currentEventIndex;
var storyRoomIndex = 0;

var test;
var ending = false;

 

var readyToEvaluate = false;

function startUp()
{currentRoomId = 7;
    getEvents();
    $('p').hide();
    $('.hiddenstart').hide();
    $.getJSON('http://143.44.10.35/gameTwo/api/room').done(getRandomRooms);
}

function getRandomRooms(data)
{ test = data;
    var length = data.length;
    for(n=0; n<length; n++)
    {randomRoomList[n] = data[n].idroom;}
    $('#result').text(randomRoomList[1].description);
    
randomRoomList = $.grep(randomRoomList, function(value) {
    return $.inArray(value, storyRoomList) < 0;});}

function getEvents()
{storedEvents = [];
choiceIds = [];
    $.getJSON('http://143.44.10.35/gameTwo/api/event?room=' + currentRoomId).done(storeEvents);}

function storeEvents(data)
{
    if($.isArray(data)){length = data.length;
    for (n=0; n<length; n++){storedEvents.push(data[n]);}
}
else {storedEvents[0] = data;}
    currentEventIndex = 0;
}


function evaluateEvent()
    {currentEventId = storedEvents[currentEventIndex].idevent;
    $.getJSON('http://143.44.10.35/gameTwo/api/event/' + currentEventId).done(checkEventStates);
}  
  
function checkEventStates(data){
    var statesRequired;
    var itemsRequired;
    
    if (data.requiresState !== undefined)
    {statesRequired = data.requiresState.split('&');}
    else statesRequired = [];
    
    if (data.requiresItem !== undefined)
    {itemsRequired = data.requiresItem.split('&');}
    else itemsRequired = [];
    
    currentDescription = data.description;
    
    if ((containsAll(statesRequired, currentStates)) &&(containsAll(itemsRequired, currentItems)))
        {$('#description').text(data.description);
    runEvent();}

else {nextEvent();}}  
        
function runEvent()
{$.getJSON('http://143.44.10.35/gameTwo/api/choice?event=' + currentEventId).done(checkChoiceStates);}


function checkChoiceStates(data){
    $('p').show();
inEvent = true;

var length = data.length;
currentChoiceNumber = 1; 
choiceIds = [];
    for (n=0; n < length; n++)   /* need to check if this gives number of objects*/
    {currentChoiceId = data[n].idchoice;
    currentChoiceDescription = data[n].description;
    
    var statesRequired;
    var itemsRequired;
    
    if (data.requiresState !== undefined)
    {statesRequired = data.requiresState.split('&');}
    else statesRequired = [];
    
    if (data.requiresItem !== undefined)
    {itemsRequired = data.requiresItem.split('&');}
    else itemsRequired = [];
    
    if ((containsAll(statesRequired, currentStates)) &&(containsAll(itemsRequired, currentItems)))
        {addChoice(currentChoiceId, currentChoiceDescription);}}
    
    length++;
    while(length<6)
    {$('#c' + length).hide();
    $('#choice' + length).hide();
    length++;}
 
    
function addChoice(choiceId, description)
{choiceIds.push(choiceId);
$('#choice' + currentChoiceNumber).show();
$('#choice' + currentChoiceNumber).text(description);
$('#c' + currentChoiceNumber).show();

currentChoiceNumber++;
    }
} 


/*Listener functions for making choices. Should set up new room*/
    function nextEvent()
    {if (storedEvents[currentEventIndex + 1])
    {currentEventIndex++;
    evaluateEvent();
}

else {inEvent = false;
    storedEvents = []; 
    setUpRoomChoice();}}


function makeChoice1()
{if (inEvent){$.getJSON('http://143.44.10.35/gameTwo/api/choice/' + choiceIds[0]).done(changeStates);}
    else nextEvent();
}

function makeChoice2()
{if (inEvent){$.getJSON('http://143.44.10.35/gameTwo/api/choice/' + choiceIds[1]).done(changeStates);}
    else nextEvent();
}

function makeChoice3()
{if (inEvent){$.getJSON('http://143.44.10.35/gameTwo/api/choice/' + choiceIds[2]).done(changeStates);}
    else nextEvent();
}

function makeChoice4()
{if (inEvent){$.getJSON('http://143.44.10.35/gameTwo/api/choice/' + choiceIds[3]).done(changeStates);}
    else nextEvent();
}

function changeStates(data){
    var statesProvided, itemsProvided, statesRemoved, itemsRemoved;
    
    if (data.providesState !== undefined)
    {statesProvided = data.providesState.split('&');}
    else {statesProvided = [];}
    var length = statesProvided.length;
    for (n=0; n<length; n++) {currentStates.push(statesProvided[n]);}
    
    
    if (data.providesItem !== undefined)
    {itemsProvided = data.providesItem.split('&');}
    else {itemsProvided = [];}
    length = itemsProvided.length;
    for (n=0; n<length; n++){currentItems.push(itemsProvided[n]);}
    
    if (data.removesState !== undefined)
    {statesRemoved = data.removesState.split('&');
    currentStates = $.grep(currentStates, function(value) {
    return $.inArray(value, statesRemoved) < 0;});}
    else statesRemoved = [];
    
    if (data.removesItem !== undefined)
    {itemsRemoved = data.removesItem.split('&');
    currentItems = $.grep(currentItems, function(value) {
    return $.inArray(value, itemsRemoved) < 0;});}
    else itemsRemoved= [];
    
displayEffect(data.effect);

    if($.inArray('death', currentStates) > -1) { 
        alert('YOU DIED TRY AGAIN');
        location.reload();
}
else { nextEvent();
/*location.reload();*/}
    
}
   
   function displayEffect(description)
   {$('#result').text(description);}


 function containsAll(needles, haystack){ 
  for(var i = 0 , len = needles.length; i < len; i++){
     if($.inArray(needles[i], haystack) === -1) return false;
  }
  return true;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;}
  
function setUpListeners()
{$('#c1').on('click', makeChoice1);
 $('#c2').on('click', makeChoice2);
 $('#c3').on('click', makeChoice3);
 $('#c4').on('click', makeChoice4);
 
 $('#c5').on('click', evaluateEvent);
 startUp();
 currentProcess = 'storyRoomChoice';
}

function setUpRoomChoice()
{if((storyRoomIndex ===3)&&(containsAll(currentStates, ['wizardHead'])))
    {storyRoomIndex = storyRoomIndex + 2;}
    if (storyRoomIndex >3){storyRoomChoice();}
    else 
    {if (currentProcess === 'storyRoom')
    {storyRoomChoice();
    currentProcess = 'randomRoom';}
    else {randomRoom();
    currentProcess = 'storyRoom';}}
    }

function storyRoomChoice()
{storyRoomIndex++;
currentRoomId= storyRoomList[storyRoomIndex];
$.getJSON('http://143.44.10.35/gameTwo/api/room/' + currentRoomId).done(storyRoomChoice1);}


function storyRoomChoice1(data)
{$('#description').text(data.description);
    $.getJSON('http://143.44.10.35/gameTwo/api/event?room=' + currentRoomId).done(storyRoomChoice2);}
    
function storyRoomChoice2(data)
{choiceIds = [];
storeEvents(data);
$('button').hide();
$('.hiddenstart').hide();
$('#c5').show();
$('#c5').text('Make a decision');
$('choice5').show();
$('choice5').text('Move to the next room');
$('#c5').off('click',evaluateEvent);
$('#c5').off('click',runRoom);
$('#c5').on('click', runRoom);
}

function randomRoom(){
var random= getRandomInt(0,randomRoomList.length);
currentRoomId= randomRoomList[random];
randomRoomList.splice(random, 1);
$.getJSON('http://143.44.10.35/gameTwo/api/room/' + currentRoomId).done(randomRoom1);}


function randomRoom1(data)
{$('#description').text(data.description);
    $.getJSON('http://143.44.10.35/gameTwo/api/event?room=' + currentRoomId).done(randomRoom2);}

function randomRoom2(data)
{choiceIds = [];
storeEvents(data);
currentEventId = 
$('button').hide();
$('.hiddenstart').hide();
$('#c5').show();
$('#c5').text('Make a decision');
$('choice5').show();
$('choice5').text('Move to the next room');
$('#c5').off('click',evaluateEvent);
$('#c5').off('click',runRoom);
$('#c5').on('click', runRoom);
}

function runRoom()
{evaluateEvent();
    $('#result').text('');}

/*-----------------------------------------------------*/





$(window).on('load', setUpListeners);
