/**
 * @fileOverview Defines the global PRESENTATIONS object, which holds all slide
 * presentations. Defines Presentation, a "class" for functions and content of
 * slide presentations.
 * @author <a href="mailto:rene@foriam.de">René Hoffmann</a>
 */

/**
 * @class Global Object literal which holds the site's slide presentations.
 */
var PRESENTATIONS = {};

/**
 * Handles key up events for slide change.
 *
 * @param {Object} event The click event.
 */
PRESENTATIONS.keyPressed = function(event) {
    if (PRESENTATIONS.focus) {
        PRESENTATIONS.preventDefault(event);
        if (event.keyCode === 39) {//right arrow
            PRESENTATIONS[PRESENTATIONS.focus].next();
        } else if (event.keyCode === 37) {//left arrow
            PRESENTATIONS[PRESENTATIONS.focus].previous();
        }
    }
};

/**
 * Prevent the default browser action for a passed event.
 *
 * @param {Object} event The click event.
 */
PRESENTATIONS.preventDefault = function(event) {
    if (!event) {
        event = window.event;
    }
    if (event) {
        if (event && event.preventDefault) {
          event.preventDefault();
        } else {
            event.returnValue = false;
        }
    }
};

/**
 * @class Global Object literal which deals with url functionality.
 */
var URL = {};

/**
 * Variables from the url.
 */
URL.urlVariables = {};

/**
 * Get the variables from the url.
 * @param {string} fromUrl
 * @param {Object} callback
 */
URL.getUrlVariables = function(fromUrl) {
    var vars = {}, variable, i;
    fromUrl = fromUrl || window.location.href;
    var varStr = fromUrl.slice(
    fromUrl.indexOf('?') + 1).split('&');
    for (i = 0; i < varStr.length; i++) {
        variable = varStr[i].split('=');
        if (variable[1]) {
            vars[variable[0]] =
                variable[1].split('#')[0] || true;
        }
    }
    URL.urlVariables = vars;
};

/**
 * Adds the url variables to the location.
 * @return {string}
 */
URL.addUrlVariable = function(variable, value) {
    var strg = window.location.href.split('?')[0] + '?';
    var key;
    URL.urlVariables[variable] = value;
    for (key in URL.urlVariables) {
        if (URL.urlVariables.hasOwnProperty(key)) {
            strg += key + '=' + URL.urlVariables[key] + '&';
        }
    }
    return strg.slice(0, -1);
};

window.onpopstate = function(event) {
    var key;
    URL.getUrlVariables();
    for (key in URL.urlVariables) {
        if (URL.urlVariables.hasOwnProperty(key) && PRESENTATIONS[key]) {
            PRESENTATIONS[key].load(parseInt(URL.urlVariables[key], 10));
        }
    }
};

/**
 * Add / remove a CSS class to / from a dom element
 *
 * @param {Object} div
 * @param {string} className
 * @param {boolean} action If false, the className will be removed.
 */
function setCssClass(div, className, action) {
    var regExp;
    if (action === false) {
        if (div.classList) {
            div.classList.remove(className);
        } else {
            regExp = new RegExp(className, 'g');
            className = '(?:^|\\s) ' + className + '(?!\\S)';
            div.className = div.className.replace(regExp , '');
            div.className = div.className.replace('  ' , ' ');
        }
    } else {
        if (div.classList) {
            div.classList.add(className);
        } else if (!(div.className.indexOf(className) > -1)) {
            div.className += ' ' + className;
        }
    }
};



/**
 * Constructor of a Presentation object; each presentation of the site has one
 * assigned Presentation object.
 *
 * @constructor
 * @param {string} divId The id of the presentation div.
 * @param {string} path The path to the presentation.
 * @param {string} imagetype The file extension of the images (png, jpg, ...).
 * @param {number} lastSlide The number of slides.
 */
function Presentation(divId, path, imagetype, lastSlide) {
    var div;
    this.slide = 0;
    this.divId = divId;
    this.path = path;
    this.imagetype = imagetype;
    this.lastSlide = lastSlide;
    this.width = 100;
    this.ready = true;
    this.captions = [];
    this.caption = document.getElementById(divId + '-caption');
    this.longestCaption = 0;
    this.checkCaptions();
}

/**
 * Prototype function to load a slide from the server.
 *
 * @param {number} slidenumber The number of the slide to load.
 */
Presentation.prototype.load = function(slidenumber) {
    var div = document.getElementById(this.divId + '-pres');
    var divWidth = this.width + 20;
    var divHeight = div.parentNode.clientHeight || 600;
    var next = (slidenumber > this.slide) ? -1 : 1;
    var xmlhttp;
    var presentation = this;
    var speed = 400;
    var fileType;
    var button;

    var flyOut = function() {
        button = document.getElementById(presentation.divId + '-buttons').
            children[presentation.slide - 1];
        if (button) {
            setCssClass(button, 'presentation-button-loaded', false);
        }
        presentation.slide = slidenumber;
        //transiently fix the height
        div.parentNode.style.height = divHeight + 'px';
        try {
             presentation.caption.innerHTML = 
                document.getElementById(presentation.divId).parentNode.
                    children[0].children[slidenumber - 1].innerHTML;
        } catch (err) {
            console.error(err);
        }

        div.style.left = next * divWidth + '%';
        
        setCssClass(
            document.getElementById(presentation.divId + '-back'),
            'presentation-arrow-active',
            (slidenumber > 1)
        );

        setCssClass(
            document.getElementById(presentation.divId + '-forward'),
            'presentation-arrow-active',
            (slidenumber < presentation.lastSlide)
        );
  
        setTimeout(function() {
            presentation.animFinished = true;
            setCssClass(div, 'noTransition');
            div.style.left = (-next * divWidth) + '%';
            //needed to avoid caching of the css change
            div.clientHeight;
            setCssClass(div, 'noTransition', false);
            if(xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                flyIn();
            }
        }, speed);
    };

    var flyIn = function() {
        if (fileType === '.php') {
            div.innerHTML = xmlhttp.responseText;
        } else {
            div.innerHTML = '<img alt=""' +
                'src="' +
                presentation.path + slidenumber + fileType +
                '" id="' + 
                presentation.divId + '-pres img' +
                '"/>';
        }
        div.style.left = '0%';
        button = document.getElementById(presentation.divId + '-buttons').
            children[slidenumber - 1];
        setCssClass(button, 'presentation-button-loaded', true);

        setTimeout(function() {
            //adjust the height
            div.parentNode.style.height = 'auto';
            document.getElementById(presentation.divId).style.maxHeight =
                '2000px';
            presentation.ready = true;
            presentation.animFinished = false;  
        }, speed);
    };

    if (presentation.imagetypes && presentation.imagetypes[slidenumber]) {
        fileType = '.' + presentation.imagetypes[slidenumber];
    } else {
        fileType = '.' + presentation.imagetype;
    }

    if (presentation.ready  && presentation.slide != slidenumber) {
        presentation.ready = false;
        presentation.animFinished = false;
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4) {
                if (xmlhttp.status === 200) {
                    if (presentation.animFinished) {
                        flyIn();
                    }
                    if (window.history && window.history.pushState) {
                        window.history.pushState(
                            {state: presentation.divId},
                            document.title,
                            URL.addUrlVariable(presentation.divId,
                            presentation.slide)
                        );
                    }                 
                } else {
                    presentation.ready = true;
                }
                
            }
        };

        xmlhttp.open(
            'GET',
            presentation.path + slidenumber + fileType,
            true
        );
        xmlhttp.send();
        flyOut();
    }

};

/**
 * Prototype function to load the next slide.
 *
 */
Presentation.prototype.next = function() {
    if (this.slide < this.lastSlide) {
        this.load(this.slide + 1);
    }
};

/**
 * Prototype function to load the previous slide.
 *
 */
Presentation.prototype.previous = function(ev) {
    if (this.slide > 1) {
        this.load(this.slide - 1);
    }
};

/**
 * Find the maximum caption length and adjust the captions box.
 *
 */
Presentation.prototype.checkCaptions = function() {
    var i;
    var pres = document.getElementById(this.divId);
    var caps = pres.parentNode.children[0];
    var capHeight;
    for (i = 0; i < this.lastSlide; i++) {
        try {
            capHeight = caps.children[i].offsetHeight;
        } catch (err) {

        }
        if (capHeight > this.longestCaption) {
            this.longestCaption = capHeight;
        }
    }
    
    this.caption.style.height = this.longestCaption + 30 + 'px';
};


(function() {
    if (document.body.addEventListener) {
        document.body.addEventListener('keyup', function(event) {
            PRESENTATIONS.keyPressed(event);
        }, true);
    } else if (document.body.attachEvent) {
        document.body.attachEvent('onkeyup', function(event) {
            PRESENTATIONS.keyPressed(event);
        });
    }
})();

