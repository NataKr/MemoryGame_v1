//global variables
var Memory={};

var clicksCounter=0;
var image1;
var image2;
var image1id;
var image2id;
var guessedCards=[];
var flag=true;

var flipCountScore=0;
var cardsNumber=0;

Memory.start=function(){
  Memory.setGameField();
  document.getElementById("start-btn").addEventListener("click", Memory.getCards);
}

// creating the cards  -The function for creating cards can receive the random array from getRandom function

Memory.setGameField=function(){
  var h=window.innerHeight;
  document.getElementById("game-wrapper").style.height=h+"px";
  window.addEventListener("resize", Memory.changeLayout);
}

Memory.getCards=function(){

  //determine number of cards
  var x=document.getElementById("level").value;
  if (x=="easy"){
    cardsNumber=12;
    console.log("cards number " + cardsNumber + " first if");
  } else if (x==="hard"){
    cardsNumber=20;
    console.log("cards number " + cardsNumber + " else if");
  } else {
    cardsNumber=12;
    console.log("cards number " + cardsNumber + " else");
  }

  document.getElementById("flipsCounterHigh").value=JSON.parse(localStorage.getItem("High Score"));

  document.getElementById("flipsCounter").value=0;
  document.getElementById("scoreCounter").value=0;

  flipCountScore=0;
  document.getElementsByClassName("cards-container")[0].innerHTML="";
  console.log("I am here");
  var randomArray=Memory.getRandom();
  console.log(randomArray);
  for (var i=0; i<cardsNumber; i++){
    var card=document.createElement("div");
    card.className=randomArray[i];
    card.id=i;
    card.style.width="20%";
    card.style.height="120px";
    card.style.display="inline-block";
    card.style.marginBottom="10px";
    card.style.marginTop="10px";
    card.style.marginLeft="2.5%";
    card.style.marginRight="2.5%";
    card.style.backgroundImage="url('./images/download2.jpg')";
    card.style.backgroundSize="cover";
    card.style.backgroundRepeat="no-repeat";
    card.style.backgroundPosition="center";
    card.addEventListener("mousedown", Memory.flipCard);
    card.addEventListener("click", Memory.check);
    document.getElementsByClassName("cards-container")[0].appendChild(card);
  }
}

//function to flip the cards

Memory.flipCard=function(event){
  if (flag){
    var elementCl=this.className;
    var url="./images/"+elementCl+".jpg";

    this.style.backgroundImage='url('+url+')';
    flipCountScore++;
    document.getElementById("flipsCounter").value=flipCountScore;

    clicksCounter++;
    console.log(clicksCounter);
  }
}

Memory.check=function(event){

  if (clicksCounter==1){
    image1=this.className;
    image1id=this.id;
    console.log("first image class "+image1 + " id "+image1id);
  }
  else if (clicksCounter==2){
    clicksCounter=0;
    console.log("counter zeroed out "+clicksCounter);
    flag=false;

    image2=this.className;
    image2id=this.id;

    if (image1id==image2id){
        setTimeout(function(){
           document.getElementById(image1id).style.backgroundImage="url('./images/download2.jpg')";
           document.getElementById(image2id).style.backgroundImage="url('./images/download2.jpg')";
           flag=true;
         }, 1000);
    }
    else{

        if (image1==image2){
          document.getElementById(image1id).removeEventListener("mousedown", Memory.flipCard);
          document.getElementById(image2id).removeEventListener("mousedown", Memory.flipCard);
          document.getElementById(image1id).removeEventListener("click", Memory.check);
          document.getElementById(image2id).removeEventListener("click", Memory.check);

          document.getElementById(image1id).classList.add("guessed");
          document.getElementById(image2id).classList.add("guessed");

          var sound=new Audio("./images/success.wav");
          sound.play();
          setTimeout(function(){flag=true;}, 1000);
        }

         else if (image1!=image2){

           var sound=new Audio("./images/false.flac");
           sound.play();
           setTimeout(function(){
              document.getElementById(image1id).style.backgroundImage="url('./images/download2.jpg')";
              document.getElementById(image2id).style.backgroundImage="url('./images/download2.jpg')";
              flag=true;
            }, 1000);
         }
    }
  }
  Memory.checkGuessed();
}

Memory.checkGuessed=function(){
    var guessedNum=document.getElementsByClassName("guessed");
    if (guessedNum.length==cardsNumber){

      var sound=new Audio("./images/appause.wav");
      sound.play();
      var user=document.getElementById("playerName").value;
      var flips=parseInt(document.getElementById("flipsCounter").value);
      var currentLevel=document.getElementById("level").value;
      var score=(currentLevel=="easy" ? Math.floor((1000*(1/(2*flips)))) : Math.floor((1000*(1/flips))))
      console.log(score);
      document.getElementById("scoreCounter").value=score;

      document.getElementById("win-text").innerHTML="Conratulations, "+user+"! You completed the game with the score of "+score;
      $(document).ready(function(){
            $("#myModal").modal('show');
      });

      if (localStorage.length==0){
          localStorage.setItem(user, JSON.stringify(score));
          localStorage.setItem("High Score", JSON.stringify(score));
          document.getElementById("flipsCounterHigh").value=score;
      }
      else {
          if (JSON.parse(localStorage.getItem(user))==null){
            localStorage.setItem(user, JSON.stringify(score));
          } else {
            if (JSON.parse(localStorage.getItem(user))<score){
              localStorage.setItem(user, JSON.stringify(score));
            }
          }

          if (JSON.parse(localStorage.getItem("High Score"))<score){
              localStorage.setItem("High Score", JSON.stringify(score));
              document.getElementById("flipsCounterHigh").value=score;
          }
      }

    }
}

Memory.changeLayout=function(){
  var w=window.innerWidth;
  if (w<600){
    for (var i=0; i<cardsNumber; i++){
      if (document.getElementById(i)!=null) {
        document.getElementById(i).style.width="45%";
      }
    }
  } else {
    for (var i=0; i<cardsNumber; i++){
      if (document.getElementById(i)!=null){
        document.getElementById(i).style.width="20%";
      }
    }
  }
}

// random function for generating IDs
Memory.getRandom=function(){
  var numbersAlreadyGenerated=[];
  while (numbersAlreadyGenerated.length<cardsNumber){   //or use counter
    var rnd=Math.floor(Math.random()*(cardsNumber/2));
    counter=0;
      for (var i=0; i<numbersAlreadyGenerated.length; i++){
        if (numbersAlreadyGenerated[i]==rnd){
          counter++;
        }
      }
      if (counter<2){
        numbersAlreadyGenerated.push(rnd);
      }
  }
  return numbersAlreadyGenerated;
}

Memory.start();
