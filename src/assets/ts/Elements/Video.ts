import { IPartner } from "../Partner/IPartner";
import { Translator } from "../Utils/Translator";

declare var Vue: any;

export class Video{

    element: HTMLElement;
    partner: IPartner;

    videoVueObject: any;

    constructor(element: HTMLElement, partner: IPartner){
        this.element = element;
        this.partner = partner;
        this.addCodeToVideoElement();
        this.setVueElement();
    }

    addCodeToVideoElement(){
        $(this.element).find(".video-wrap").append(`
            <div class="video-info-wrap" v-on:dblclick="expand" v-bind:class="{'cammeraoff': cameraOff  && !screenSharing}">
                <div class="video-name">{{name}} 
                <span v-bind:class="{'on': !listener}" class="listener fas fa-eye"></span>
                <span v-bind:class="{'on': !muted || listener}" class="microphone fas fa-microphone-slash"></span> 
                <span v-bind:class="{'on': !cameraOff || listener}" class="camera fas fa-video-slash"></span>
                <span v-bind:class="{'on': !screenSharing}" class="screen fas fa-desktop"></span>
                </div>
                <div class="menu">
                    <span class="menu-icon fas fa-ellipsis-h"></span>
                    <ul>
                        <li v-if="!expanded" v-on:click="expand"><i class="fas fa-expand-arrows-alt"></i>${Translator.get("fullscreenon")}</li>
                        <li v-if="expanded" v-on:click="expand"><i class="fas fa-compress-arrows-alt"></i>${Translator.get("fullscreenoff")}</li>
                        <li v-if="!self && !muted" v-on:click="setToMute"><i class="fas fa-microphone-slash"></i>${Translator.get("mute")}</li>
                    </ul>
                </div>
                <div class="connect">
                    <span class="fas fa-sync"></span>
                    <span class="text">${Translator.get("connect")}</span>
                </div>
            </div>
        `);
    }

    setVueElement(){
        let cla = this;
        this.videoVueObject = new Vue({
            el: $(this.element).find(".video-info-wrap").get(0),
            data: {
                name: cla.partner ? cla.partner.getName() : Translator.get("You"),
                expanded: false,
                muted: false,
                cameraOff: false,
                screenSharing: false,
                listener: false,
                self: cla.partner ? false : true
            },
            methods: {
                expand: function(){
                    $(cla.element).toggleClass("big");
                    this.expanded = !this.expanded;
                },
                setToMute: function(){
                    cla.partner.sendMessage({type: cla.partner.controls.muteType, message: ""});
                }
            }
        });
    }
}