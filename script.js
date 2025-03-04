 console.log("Lets start with some JS")
 let curentSong= new Audio();
 let songs;
 let currFolder;
 function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00"; //jjwjw
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0'); 

    return `${formattedMinutes}:${formattedSeconds}`;
}


 async function getSongs(folder) {         //getting songs from folder
  currFolder=folder;
  let a = await fetch(`http://127.0.0.1:5501/${folder}/`)  
  let response= await a.text();
  let div=document.createElement("div")
  div.innerHTML=response;
  let as=div.getElementsByTagName("a")
  songs=[]
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
        songs.push(element.href.split(`/${folder}/`)[1])
    }

    
  }
  let songUL=document.querySelector(".songList").getElementsByTagName("ul")[0]
  songUL.innerHTML=""
    for (const song of songs) {                //dispalying songs in library. 
        songUL.innerHTML=songUL.innerHTML+ `
        <li>
                            <img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20"," ")}</div>
                                <div>Song Artist</div>
                            </div>
                            <div class="playnow">
                                <span>Play now</span>
                                <img class="invert" src="play.svg" alt="">
                            </div>
                        </li>
        
        ` ;
    }
    //Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
    })
 }
 const playMusic=(track,pause=false)=>{
    curentSong.src= `/${currFolder}/`+track;
    if (!pause) {
        curentSong.play()
        play.src="pause.svg"
    }
    document.querySelector(".songinfo").innerHTML=decodeURI(track)
    document.querySelector(".songtime").innerHTML="00:00 / 00:00"
 }

 async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:5501/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors=div.getElementsByTagName("a")
    Array.from(anchors).forEach(e=>{
        if (e.href.includes("/songs")) {
            console.log(e.href.split("/").slice(-2)[0])
        }
    })
 }

 async function main(){
    await getSongs("songs/ncs")         
    playMusic(songs[0],true)
    //Display all albums in page
     displayAlbums()

    

    //Attach event listener to prev,play and next button
    play.addEventListener("click",()=>{
        if (curentSong.paused) {
            curentSong.play()
            play.src="pause.svg"
        }
        else{
            curentSong.pause()
            play.src="play.svg"
        }
    })

    //Listen for timeupdate event , timeupdate events works if time gets updated of a particular things , only works for audioo or video. 
    curentSong.addEventListener("timeupdate",()=>{
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(curentSong.currentTime)} / ${secondsToMinutesSeconds(curentSong.duration)}`
        document.querySelector(".circle").style.left=(curentSong.currentTime/curentSong.duration)*100+"%";
    })

    //Event listener for seekbar
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent= e.offsetX/e.target.getBoundingClientRect().width*100
        document.querySelector(".circle").style.left=percent +"%";
        curentSong.currentTime=((curentSong.duration)*percent)/100
        })

    //Event Listners for clicking Hamburger icon
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0%";
    })

    //Event Listners for clicking Close icon
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-120%";
    })

    //Event listener for previous and next buttons
    previous.addEventListener("click",()=>{
        let index=songs.indexOf(curentSong.src.split("/").slice(-1)[0])
        if ((index-1)>=0) {
            playMusic(songs[index-  1])
        }}
    )
    next.addEventListener("click",()=>{
        let index=songs.indexOf(curentSong.src.split("/").slice(-1)[0])
        if ((index+1)<songs.length) {
            playMusic(songs[index+1])
        }
    })

    //Event listner to volume button
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        curentSong.volume=parseInt(e.target.value)/100
    })

    //Event listener for loading playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click",async item=>{
            songs=await getSongs(`songs/${item.currentTarget.dataset.folder}`)     //currentTarget is the element that the event listener is attached to,if selected target is what part of card we clicked on
        })
    });
 }
 main()