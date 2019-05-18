var SlideBar = function (min, max, parentNode, callback) {
    var _this = this;
    // _this.oValue=oValue;
    _this.min = min;
    _this.max = max;

    _this.parentNode = parentNode;

    var slideBar = document.createElement('div');
    slideBar.setAttribute('data-role', 'slidebar');
    slideBar.className = "slidebar";

    // var slideBar = document.querySelector('[data-role="slideBar"]');
    console.log(slideBar)
    slideBar.style.cssText = `
height: 0.3rem;
width: 90%;
display: flex;
align-items: center;
margin: 0 auto;
`;

    // var slideBar = document.querySelector('[data-role="slideBar"]');

    var stick = document.createElement('span');
    stick.classList.add('stick');
    stick.style.cssText = `            
position: absolute;
display: block;
width: 0.2rem;
height: 0.2rem;
background-color: rgb(98, 209, 40);
border: 2px solid rgb(98, 209, 40);
border-radius: 50%;
flex-shrink: 0;
opacity: 0.5;
margin-left: -0.1rem;
margin-top: -0.1rem;
left: 0;
transition: none 0s ease 0s;
`;
    var bar = document.createElement('div');
    bar.classList.add('bar');
    bar.style.cssText = `
    width: 100%;
display: block;
height: 2px;
background: rgb(98, 209, 40);
position: relative;
`
        ;

    bar.appendChild(stick);
    slideBar.appendChild(bar);
    parentNode.appendChild(slideBar);


    console.log(slideBar)

    this.slideBar = slideBar;
    this.stick = stick;
    this.bar = bar;

    this.finalValue = null;

    //滑块数值
    var persentNum;
    Object.defineProperty(this, 'persentNum', {
        set: function (n) {
            persentNum = n;
            slideBar.setAttribute('data-value', (n * 100).toFixed(0));

            var value = util.clamp(_this.min + (_this.max - _this.min) * n, _this.min, _this.max);
            this.finalValue = value;

            if (callback) {
                callback({
                    persent: n,
                    value: _this.finalValue
                });
            }
        },
        get: function () {
            return persentNum;
        }
    });

    _this.eventTodoBind = this.eventTodo.bind(_this);

    // slideBar.addEventListener('mousedown', this.eventTodo.bind(_this), false);
    slideBar.addEventListener('click', this.eventTodoBind, false);
    window.addEventListener('resize', function (e) {
        _this.stick.style.left = _this.persentNum * parseInt(util.getStyle(_this.bar).width) + 'px';
    }, false)

    slideBar.addEventListener('mousedown', this.eventTodoBind, false);
    slideBar.addEventListener('touchstart', this.eventTodoBind, false);
}

SlideBar.prototype.eventTodo = function (e) {
    if (e.type.match('touch') !== null) {
        e = e.touches[0];
    }
    var slideBar = this.slideBar, stick = this.stick, bar = this.bar;

    switch (e.type) {
        case 'click': {
            // if (e.target.className !== 'stick') {
            stick.style.transition = '0.5s ease left'
            var leftValue = e.clientX - slideBar.offsetLeft;
            stick.style.left = util.clamp(leftValue, 0, parseInt(util.getStyle(bar).width)) + 'px';
            stick.addEventListener('transitionend', function () {
                stick.style.transition = 'none';
            }, false);

            this.persentNum = parseInt(stick.style.left) / parseInt(util.getStyle(bar).width);
            // console.log(this.persentNum);

            // }
        }; break;

        case 'mousedown':
        case 'touchstart': {
            if (e.target.className == 'stick') {
                stick.style.transform='none';
                document.body.addEventListener('mousemove', this.eventTodoBind, false);
                document.body.addEventListener('mouseup', this.eventTodoBind, false);
                document.body.addEventListener('touchmove', this.eventTodoBind, false);
                document.body.addEventListener('touchend', this.eventTodoBind, false);
            }
        }; break;
        case 'mousemove':
        case 'touchmove': {
            console.log(e);
            // e.preventDefault();
            var leftValue = e.clientX - slideBar.offsetLeft;
            stick.style.left = util.clamp(leftValue, 0, parseInt(util.getStyle(bar).width)) + 'px';
            this.persentNum = parseInt(stick.style.left) / parseInt(util.getStyle(bar).width);
        }; break;
        case 'mouseup':
        case 'touchend': {
                document.body.removeEventListener('mousemove', this.eventTodoBind, false);
                document.body.removeEventListener('mouseup', this.eventTodoBind, false);
                document.body.removeEventListener('touchmove', this.eventTodoBind, false);
                document.body.removeEventListener('touchend', this.eventTodoBind, false);
        }; break;
    }

}
