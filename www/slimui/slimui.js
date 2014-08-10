/**
 *      SlimUI 1.0.0
 *  https://github.com/hobbyquaker/SlimUI
 *
 *  a very lightweight framework for CCU.IO WebUIs - made for old Browsers and slow Clients
 *
 *  Vanilla JavaScript, no use of jQuery or other Libraries
 *
 *  requires CCU.IO version >= 1.0.21
 *
 *  Copyright (c) 2014 Hobbyquaker
 *  License: CC BY-NC 3.0 - http://creativecommons.org/licenses/by-nc/3.0/
 */

(function () {

    var SlimUI = function() {
        this.init();
        this.pollValues();
        var that = this;
        setInterval(function () {
            that.pollValues();
        }, 3000);
    };

    SlimUI.prototype = {
        /**
         *  Array aller verwendeter Datenpunkte
         */
        dps: [],
        /**
         *  Array aller Elemente die mit einem Datenpunkt verknüpft sind
         */
        dpElems: [],
        /**
         *  Startet SlimUI
         */
        init: function () {
            this.getElements(document);
        },
        /**
         *  durchsucht das DOM nach Elementen mit dem Attribut data-dp, füllt die Arrays dps und dpElems
         *
         * @param start
         *  DOM Objekt unter welchem Elemente gesucht werden - üblicherweise: document
         */
        getElements: function (start) {
            var elems = start.getElementsByTagName('*');
            var count = 0;
            for (var i = 0, l = elems.length; i < l; i++) {
                var elem = elems[i];
                if (elem.getAttribute("data-dp")) {

                    /**
                     * id Attribut hinzufügen falls nötig
                     */
                    if (!elem.getAttribute("id")) {
                        elem.setAttribute("id", "slim"+count++);
                    }

                    /**
                     *  Objekt das alle relevanten Informationen zu einem Element enthält.
                     *  Wird dem Array dpElems hizugefügt
                     */
                    var elemObj = {
                        id: elem.getAttribute("id"),
                        dp: elem.getAttribute("data-dp"),
                        val: elem.getAttribute("data-val"),
                        digits: parseInt(elem.getAttribute("data-digits"), 10),
                        timestamp: elem.getAttribute("data-timestamp"),
                        css: elem.getAttribute("data-class"),
                        name: elem.nodeName,
                        type: elem.type
                    };
                    this.dpElems.push(elemObj);

                    /**
                     *  Liste der verwendeten Datenpunkte erzeugen
                     */
                    if (this.dps.indexOf(elemObj.dp) == -1) {
                        this.dps.push(elemObj.dp);
                    }

                    /**
                     *  Event-Handler hinzufügen
                     */
                    this.addHandler(elem, elemObj);

                }
            }
        },
        /**
         * Fügt einen onClick oder onChange Event-Handler zu INPUT und SELECT Elementen hinzu
         *
         * @param elem
         * @param elemObj
         */
        addHandler: function (elem, elemObj) {

            var ieOn = "";

            // IE <= 8
            if (!elem.addEventListener) {
                elem.addEventListener = elem.attachEvent;
                ieOn = "on";
            }

            var that = this;
            switch (elemObj.name) {
                case "SELECT":
                    elem.addEventListener(ieOn+"change", function () {
                        that.setValue(elem.getAttribute("data-dp"), elem.options[elem.selectedIndex].value);
                    }, false);
                    break;
                case "BUTTON":
                    var val = elem.getAttribute("data-val"),
                        toggle = elem.getAttribute("data-toggle");
                    if (toggle) {
                        elem.addEventListener(ieOn+"click", function () {
                            that.toggleValue(elem.getAttribute("data-dp"));
                        }, false);
                    } else {
                        elem.addEventListener(ieOn+"click", function () {
                            that.setValue(elem.getAttribute("data-dp"), val);
                        }, false);
                    }
                    break;
                case "INPUT":
                    switch (elemObj.type) {
                        case "button":
                            var val = elem.getAttribute("data-val"),
                                toggle = elem.getAttribute("data-toggle");
                            if (toggle) {
                                elem.addEventListener(ieOn+"click", function () {
                                    that.toggleValue(elem.getAttribute("data-dp"));
                                }, false);
                            } else {
                                elem.addEventListener(ieOn+"click", function () {
                                    that.setValue(elem.getAttribute("data-dp"), val);
                                }, false);
                            }
                            break;
                        case "text":
                        case "number":
                            elem.addEventListener(ieOn+"change", function () {
                                that.setValue(elem.getAttribute("data-dp"), elem.value);
                            }, false);
                            break;
                        case "checkbox":
                            elem.addEventListener(ieOn+"click", function (event) {
                                that.setValue(elem.getAttribute("data-dp"), elem.checked ? 1 : 0);
                            }, false);
                            break;
                    }
                    break;
            }
        },
        /**
         * Setzt einen Datenpunkt auf einen bestimmten Wert
         *
         * @param dp
         *   die ID des Datenpunkts
         * @param val
         *   der Wert
         */
        setValue: function (dp, val) {
            this.ajaxGet("/api/set/"+dp+"?value="+val);
        },
        /**
         * Datenpunkt Toggle
         *
         * @param dp
         *   die ID des Datenpunkts
         */
        toggleValue: function (dp) {
            this.ajaxGet("/api/toggle/"+dp+"?");
        },
        /**
         * Fragt den Wert aller Datenpunkte von CCU.IO ab und aktualisiert die Elemente
         *
         */
        pollValues: function () {
            var _this = this;
            var dps = _this.dps.join(",");
            this.ajaxGet("/api/getBulk/"+dps+"?", function (res) {
                for (var i = 0, l = _this.dpElems.length; i<l; i++) {
                    var elemObj = _this.dpElems[i];
                    if (res[elemObj.dp] !== undefined) {
                        _this.updateElement(elemObj, res[elemObj.dp]);
                    }
                }
            });
        },
        /**
         *  Wert eines Elements updaten
         *
         * @param elemObj
         * @param val
         */
        updateElement: function (elemObj, val) {
            var elem = document.getElementById(elemObj.id);
            if (elemObj.timestamp) {
                val = val.ts;
            } else {
                val = val.val;
            }
            switch (elemObj.name) {
                case "SELECT":
                    var options = elem.getElementsByTagName("OPTION");
                    for (var i = 0, l = options.length; i < l; i++) {
                        if (options[i].value == val) {
                            elem.selectedIndex = i;
                            break;
                        }
                    }
                    break;
                case "INPUT":
                    if (elem === document.activeElement) break;
                    switch (elemObj.type) {
                        case "text":
                        case "number":
                            if (!isNaN(elemObj.digits)) {
                                val = parseFloat(val).toFixed(elemObj.digits);
                            }
                            elem.value = val;
                            break;
                        case "checkbox":
                            elem.checked = val;
                            break;
                    }
                    break;
                case "SPAN":
                case "DIV":
                    if (elemObj.css) {
                        val = val.toString().replace(/\./, "_");
                        var classes = elem.className.replace(new RegExp("(?:^|[ ]*)"+elemObj.css+"-[0-9a-zA-Z_-]+(?!\S)", "g"), "");
                        elem.className = classes += " "+elemObj.css+"-"+val;
                    } else {
                        if (!isNaN(elemObj.digits)) {
                            val = parseFloat(val).toFixed(elemObj.digits);
                        }
                        elem.innerHTML = val;
                    }
                    break;
            }
        },
        /**
         * ajaxGet() - einen HTTP GET request durchführen
         *
         * @param url - muss ein Fragezeichen beinhalten!
         * @param cb
         */
        ajaxGet: function (url, cb) {
            var ts = (new Date()).getTime();
            url = url + "&ts" + ts;
            xmlHttp = new XMLHttpRequest();
            xmlHttp.open('GET', url, true);
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState == 4) {
                    if (cb) {
                        cb(JSON.parse(xmlHttp.responseText));
                    }
                }
            };
            xmlHttp.send(null);
        }
    };

    /**
     * Falls der Browser Array.indexOf nicht unterstützt wird diese Methode ergänzt
     */
    if (!Array.indexOf){
        Array.prototype.indexOf = function(obj){
            for(var i=0; i<this.length; i++){
                if(this[i]==obj){
                    return i;
                }
            }
            return -1;
        }
    }

    /**
     *  XMLHttpRequest ergänzen für Internet Explorer
     */
    if (typeof XMLHttpRequest === "undefined") {
        XMLHttpRequest = function () {
            try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); }
            catch (e) {}
            try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); }
            catch (e) {}
            try { return new ActiveXObject("Msxml2.XMLHTTP"); }
            catch (e) {}
            try { return new ActiveXObject("Microsoft.XMLHTTP"); }
            catch (e) {}
            alert("Dieser Browser unterstützt kein AJAX.");
            throw new Error("This browser does not support AJAX.");
        };
    }

    /**
     *  JSON.parse ergänzen falls nicht vom Browser unterstützt
     *  gekürzte Version von Douglas Crockfords json2.js - https://github.com/douglascrockford/JSON-js
     */
    if (typeof JSON !== 'object') {
        JSON = {};
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

            var j;
            function walk(holder, key) {
                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

            if (/^[\],:{}\s]*$/
                .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                    .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                    .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

                j = eval('(' + text + ')');

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

            throw new SyntaxError('JSON.parse');
        };
    }

    /**
     *  SlimUI initialisieren
     */
    var slim = new SlimUI();

})();
