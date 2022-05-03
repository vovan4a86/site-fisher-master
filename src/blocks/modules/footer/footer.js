/*
 *  Tiny Modal - v0.1.0
 *  Clean, Fast, Modular and customizable Modal Window controller.
 *  https://github.com/juanbrujo/tinyModal
 *  Demo: http://juanbrujo.github.io/tinyModal/
 */
const tinyModal = (function(){

    if (!document.querySelector || !("className" in document.body)) {
        return false;
    }

    var container = document.body,
        popup = document.querySelector(".tinymodal-window-open"),
        status = null;

    container.className = container.className.replace(/\s+$/gi, "") + " tinymodal-ready";

    // utils
    function addClass(element, name) {
        element.className = element.className.replace(/\s+$/gi,"") + " " + name;
    }
    function removeClass(element, name) {
        if( element ) {
            element.className = element.className.replace(name, "");
        }
    }

    // add cover
    function addCover(){
        var newCover = document.createElement("div");
        addClass(newCover,"tinymodal-cover");
        document.body.appendChild(newCover);
    }
    // remove cover
    function removeCover(){
        var actualCover = document.querySelector(".tinymodal-cover");
        if( actualCover ) {
            actualCover.parentNode.removeChild(actualCover);
        }
    }
    // deactivate on ESC key
    function onEscKey(event) {
        if(event.keyCode === 27) {
            deactivate();
        }
    }
    // deactivate on cover click
    function onCoverClick(event) {
        if(event.target === 'cover' || event.target === close) {
            deactivate();
        }
    }

    // get and set modal size by data-size
    function getSize(element){
        var size = element.getAttribute("data-size");
        if(size) {
            var sizes = size.split(",");
            console.log(sizes)
            element.setAttribute("style", "width:" + sizes[0] + ";height:" + sizes[1] + ";");
        }
    }

    // get and set modal class if available, by data-classname
    function getNewClass(element){
        var newClass = element.getAttribute("data-newclass");
        if(newClass) {
            addClass(element, newClass);
        }
    }

    // activate function
    function activate(state) {
        addCover();
        var cover = document.querySelector(".tinymodal-cover"),
            close = document.querySelectorAll(".tinymodal-close");
        if(close.length) {
            for (var i = 0; i < close.length; i++) {
                close[i].addEventListener("click", deactivate, false);
            }
        }
        document.addEventListener("keyup", onEscKey, false);
        cover.addEventListener("click", deactivate, false);
        cover.addEventListener("touchstart", deactivate, false);
        removeClass(popup,status);
        addClass(popup,state);
        getSize(popup);
        getNewClass(popup);
        setTimeout(function(){
            addClass(container, "tinymodal-active");
        }, 0);
        status = state;
    }

    // deactivate function
    function deactivate() {
        document.removeEventListener("keyup", onEscKey, false);
        document.removeEventListener("click", onCoverClick, false);
        document.removeEventListener("touchstart", onCoverClick, false);
        removeCover();
        removeClass(container, "tinymodal-active");
        removeClass(popup, "tinymodal-window-open");
        if(popup) {
            if(popup.classList.contains("tinymodal-new")) {
                setTimeout(function(){
                    popup.parentNode.removeChild(popup);
                }, 300);
            }
        }
        unfreezeModal()
        // if (!window.matchMedia("(max-width: 992px)").matches) {
        //     unfreezeModal()
        // }
    }

    //freezeModalWindow *********************
    function getScrollWidth() {
        const div = document.createElement('div');
        let scrollBarWidth;

        div.setAttribute('style', [
            'width: 100px',
            'height: 100px',
            'overflow: scroll',
            'position: absolute',
            'top: -9999px'
        ].join(';'));

        document.body.appendChild(div);
        scrollBarWidth = div.offsetWidth - div.clientWidth;
        document.body.removeChild(div);

        return scrollBarWidth;
    }

    const scrollWidth = (getScrollWidth());

    function freezeModal() {
        document.body.style.overflow = 'hidden';
        if (!scrollWidth) { return; } else {
            document.body.style.paddingRight = scrollWidth + 'px';
        }
    }
    function unfreezeModal() {
        document.body.style.overflow = '';
        if (!scrollWidth) { return; } else {
            document.body.style.paddingRight = '';
        }
    }
    //*********************end freezeModalWindow

    // openModal public method, w/ onOpen callback
    function openModal(selector, onOpen){
        if (selector.indexOf("#") > -1) {
            popup = document.querySelector(selector);
        } else if (selector.match(/[.jpg|.JPG|.png|.PNG|.gif|.GIF|.webp|.WEBP]/)) {
            popup = document.createElement("aside");
            popup.setAttribute("class","tinymodal-window tinymodal-new");
            popup.innerHTML = "<div class=\"tinymodal-inner\"><img src=\"" + selector + "\"/></div>";
            document.body.appendChild(popup);
        }
        addClass(popup, "tinymodal-window-open");
        activate("");
        if(onOpen && typeof(onOpen) === "function"){
            onOpen.call(popup);
        }
        freezeModal()
        //freeze body only 992px and higher
        // if (!window.matchMedia("(max-width: 992px)").matches) {
        //     freezeModal() // unfreeze -> deactivate (потому что закрываем собственной кнопкой и closeModal не работает)
        // }
        return this;
    }

    // closeModal public method, w/ onClose callback
    function closeModal(onClose) {
        deactivate();
        if(onClose && typeof(onClose) === "function"){
            onClose.call(popup);
        }
    }

    return {
        openModal: openModal,
        closeModal: closeModal
    };

})();

document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('.tinymodal-modal');

    for (let i = 0; links.length > i; i++) {
        links[i].addEventListener("click", function(event){  // callback
            event.preventDefault();
            const element = this.getAttribute("href");
            tinyModal.openModal(element, function(){
            });
        });
    }

    //переход к форме
    const smoothLink = document.querySelector('.header-order-btn');
    smoothLink.addEventListener('click', function (e) {
        e.preventDefault();
        const id = smoothLink.getAttribute('href');
        document.querySelector(id).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });

    //go-top
    const goTopBtn = document.querySelector('#go-top')
    goTopBtn.addEventListener('click', (e) => {
        e.preventDefault()
        window.scrollTo(pageYOffset, 0)
        //css -> html {scroll-behavior: smooth;}

    })

    window.addEventListener('scroll', () => {
        if(window.pageYOffset > 200)  {
            goTopBtn.style.opacity = '1'
        } else {
            goTopBtn.style.opacity = '0'
        }
    })

    const form = document.querySelector('#form')
    form.addEventListener('input', function() {
        this.btnSubmit.disabled = !this.checkValidity()

        Array.from(form.elements).forEach(input => {
            if(input.required && input.type !== 'checkbox') {
                input.addEventListener('change', ()=> {
                    if(input.checkValidity()) {
                        input.classList.remove('invalid')
                        input.classList.add('valid')
                    } else {
                        input.classList.remove('valid')
                        input.classList.add('invalid')
                        input.reportValidity()
                    }
                })
            }
        })
    });

    //telephone mask
    [].forEach.call( document.querySelectorAll('.tel'), function(input) {
        let keyCode;
        function mask(event) {
            event.keyCode && (keyCode = event.keyCode);
            let pos = this.selectionStart;
            if (pos < 3) event.preventDefault();
            let matrix = "+7 (___) ___ ____",
                i = 0,
                def = matrix.replace(/\D/g, ""),
                val = this.value.replace(/\D/g, ""),
                new_value = matrix.replace(/[_\d]/g, function(a) {
                    return i < val.length ? val.charAt(i++) || def.charAt(i) : a
                });
            i = new_value.indexOf("_");
            if (i != -1) {
                i < 5 && (i = 3);
                new_value = new_value.slice(0, i)
            }
            let reg = matrix.substr(0, this.value.length).replace(/_+/g,
                function(a) {
                    return "\\d{1," + a.length + "}"
                }).replace(/[+()]/g, "\\$&");
            reg = new RegExp("^" + reg + "$");
            if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
            if (event.type === "blur" && this.value.length < 5)  this.value = ""
        }

        input.addEventListener("input", mask, false);
        input.addEventListener("focus", mask, false);
        input.addEventListener("blur", mask, false);
        input.addEventListener("keydown", mask, false)
    });

    //ОТПРАВКА ФОРМЫ FETCH
    form.addEventListener('submit', function (e) {
        e.preventDefault()

        const formData = new FormData(form);

        fetch('/php/send.php', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if(response.status == 200) {
                    tinyModal.openModal('#modal-submit');
                    form.reset();
                    form.btnSubmit.disabled = !this.checkValidity();
                    Array.from(form.elements).forEach(input => {
                        input.classList.remove('valid')
                    })
                } else {
                    alert('Ошибка при отправке...')
                }
            })
            .catch(error => console.error(error));
    });

});
