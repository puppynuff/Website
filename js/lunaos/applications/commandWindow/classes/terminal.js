/**
LunaOS - Web Desktop platform

BSD 2-Clause License

Copyright (c) 2023, LunaDevvv

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

* @author LunaDevvv <LunaDevvv@proton.me>
* @license Simplified BSD License
*/


class terminal {
    /**
     * @type {Array<Line>}
     */
    lines = [];
    currentPath = "";

    /**
     * 
     * @param {HTMLDivElement} div
     * @param {string} path 
     */
    constructor(div, path = "/") {
        this.terminalDiv = div;
        this.waiting = false;
        this.typing = false;
        this.currentPath = path
    }

    /**
     * 
     * @param {Line} line 
     */
    async loadLine(line) {
        this.lines.push(line);
    }

    async updateLineColors() {
        for(let i = 0 ; i < this.lines.length; i++) {
            this.lines[i].editText("");

            await sleep(10);
        }

        return;
    }

    async clearLines() {
        let CLEAR_SLEEP_TIME = 10;
        while(this.terminalDiv.firstChild) {
            this.terminalDiv.removeChild(this.terminalDiv.firstChild);
    
            await sleep(CLEAR_SLEEP_TIME);
        }
    }
}