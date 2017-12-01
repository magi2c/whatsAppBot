// ==UserScript==
// @name        whatsapp.bot
// @description Automatic click for "Click to Chat" from api.whatsapp.com
// @namespace   https://api.whatsapp.com
// @include     https://api.whatsapp.com/*
// @include     https://web.whatsapp.com/*
// @version     1
// ==/UserScript==
const buttonSelector = '#main > footer > div.block-compose > button';
const deliveredSelector = '#main > div.pane-body.pane-chat-tile-container [data-icon="msg-check"], [data-icon="msg-dblcheck"], [data-icon="msg-dblcheck-ack"]';
let timeWaitTotal = 0;

function apiSend() {
    const actionButton = document.getElementById('action-button');
    if (actionButton !== null) {
        actionButton.click();
    }
}

function webWaitForButton(time) {
    const previousUrl = document.referrer;
    if (previousUrl.includes("api.whatsapp.com") == false) {
        return false;
    }

    const sendB = document.querySelector(buttonSelector);
    if (sendB !== null) {
        const deliveredNum = document.querySelectorAll(deliveredSelector).length;
        sendB.click();
        return webWaitForClose(deliveredNum);
    } else {
        timeWaitTotal = timeWaitTotal + time;
        if (timeWaitTotal >= 15000) {
            return webError();
        }
        setTimeout(() => {
            webWaitForButton(time);
        }, time);
    }
}

function webWaitForClose(deliveredNum) {
    if (document.querySelectorAll(deliveredSelector).length > deliveredNum) {
        window.close();
    } else {
        setTimeout(() => {
            webWaitForClose(deliveredNum);
        }, 500);
    }
}

function webError() {
    window.close();
}

webWaitForButton(100);

apiSend();

