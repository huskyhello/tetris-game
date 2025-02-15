export class MusicManager {
    constructor(path) {
        this.item = new Audio(path);
        this.item.playbackRate = 1.0;
        this.item.volume = 1.0;
    }

    setLoop(){
        this.item.loop = true;
    }

    setRate(rate){
        this.item.playbackRate = rate;
    }

    setTime(time){
        this.item.currentTime = time;
    }
    start(){
        this.item.currentTime = 0;
        this.item.play().catch(error => console.log("Music playing exists error.\n", error));
    }

    end(){
        this.item.pause();
        this.item.currentTime = 0;
    }

    muted(){
        this.item.muted = true;
    }
    
    unmuted(){
        this.item.muted = false;
    }
}