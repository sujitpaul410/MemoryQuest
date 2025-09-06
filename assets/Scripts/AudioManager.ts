import { _decorator, AudioClip, AudioSource, Component } from 'cc';
import { EventsManager } from './EventsManager';
const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager extends Component {
    
    @property(AudioSource)
    private audioSource: AudioSource = null

    @property(AudioClip)
    private audioClips: AudioClip[] = [];

    protected start(): void
    {
        EventsManager.event.on("IncrScore", this.onMatch, this);
        EventsManager.event.on("GameOver", this.onCompletion, this);
        EventsManager.event.on("NoMatch", this.onNoMatch, this);
        EventsManager.event.on("CardSelected", this.onFlip, this);
        EventsManager.event.on("Tap", this.onTap, this);
    }

    private onCompletion(): void
    {
        this.audioSource.playOneShot(this.audioClips[1]);
    }

    private onMatch(): void
    {
        this.audioSource.playOneShot(this.audioClips[0]);
    }

    private onNoMatch(): void
    {
        this.audioSource.playOneShot(this.audioClips[2]);
    }

    private onFlip(): void
    {
        this.audioSource.playOneShot(this.audioClips[3]);
    }

    private onTap(): void
    {
        this.audioSource.playOneShot(this.audioClips[4]);
    }


}


