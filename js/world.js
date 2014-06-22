var scene;

(function () {
    'use strict';

    var world = document.getElementById('world'),
        camera = document.getElementById('camera'),

        viewAngleBase = {
            x: null,
            y: null
        },
        view = {
            x: 0,
            y: 0,
            z: 0,
            angleX: 0,
            angleY: 0
        },

        speed = 0.1, //px per millisecond
        modifiers = {
            moving: {
                move: 0,
                strafe: 0
            },
            collision: {
                left: 1,
                right: 1,
                ahead: 1,
                back: 1,
                offset: 50
            }
        },
        moveDisabled = false,
        lookDisabled = false,

        objectsX = document.querySelectorAll('[real-x]'),
        objectsZ = document.querySelectorAll('[real-z]'),

        jumpHeight = 50,
        jumpTime = 500,
        jumpFPS = 30,

        Sound, sounds,
        
        repaint, time,
        computeCollisions,

        move = {},
        
        notify, observers;

    HTMLCollection.prototype.forEach = Array.prototype.forEach;
    NodeList.prototype.forEach = Array.prototype.forEach;
    
    repaint = function () {
        var now,
            dt, dx, dz,
            viewCos, viewSin,
            viewRotate = { x: 0, y: 0, z: 0 },
            moveStep,
            collisionModifierX, collisionModifierZ;
        
        requestAnimationFrame(repaint);
        now = new Date().getTime();
        dt = now - (time || now);
        moveStep = speed * dt;
        time = now;
        
        viewCos = Math.cos(view.angleX);
        viewSin = Math.sin(view.angleX);

        if (!moveDisabled) {        
            dz = Math.round(viewCos * modifiers.moving.move * moveStep + viewSin * modifiers.moving.strafe * moveStep);
            dx = Math.round(viewCos * modifiers.moving.strafe * moveStep - viewSin * modifiers.moving.move * moveStep);

            computeCollisions(dz, dx);
    
            collisionModifierZ = 1;
            collisionModifierZ = 1;
            if (dz > 0) collisionModifierZ = modifiers.collision.ahead;
            else collisionModifierZ = modifiers.collision.back;
            if (dx < 0) collisionModifierX = modifiers.collision.right;
            else collisionModifierX = modifiers.collision.left;

            view.z = view.z + dz * collisionModifierZ;
            view.x = view.x + dx * collisionModifierX;

            world.style.WebkitTransform = 'translateZ(' + view.z + 'px) translateX(' + view.x + 'px) translateY(' + view.y + 'px)';
            world.style.MozTransform =    'translateZ(' + view.z + 'px) translateX(' + view.x + 'px) translateY(' + view.y + 'px)';
            world.style.transform =       'translateZ(' + view.z + 'px) translateX(' + view.x + 'px) translateY(' + view.y + 'px)';
        }

        if (!lookDisabled) {
            viewRotate.y = view.angleX / Math.PI * 180;
            viewRotate.x = viewCos * (-view.angleY / Math.PI * 180);
            viewRotate.z = viewSin * (-view.angleY / Math.PI * 180);

            camera.style.WebkitTransform = 'translateZ(800px) rotateY(' + viewRotate.y + 'deg) rotateX(' + viewRotate.x + 'deg) rotateZ(' + viewRotate.z + 'deg)';
            camera.style.MozTransform =    'translateZ(800px) rotateY(' + viewRotate.y + 'deg) rotateX(' + viewRotate.x + 'deg) rotateZ(' + viewRotate.z + 'deg)';
            camera.style.transform =       'translateZ(800px) rotateY(' + viewRotate.y + 'deg) rotateX(' + viewRotate.x + 'deg) rotateZ(' + viewRotate.z + 'deg)';
        }
        
        !(moveDisabled && lookDisabled) && notify('move', {
            x: -view.x,
            z: view.z,
            angleY: view.angleY / Math.PI * 180,
            sin: viewSin,
            cos: viewCos
        });
    };
    
    computeCollisions = function (dz, dx) {
        var objX, objZ, objWidth,
            dataset,
            collisionFound = false;

        if (!(modifiers.moving.move || modifiers.moving.strafe)) return;
        
        modifiers.collision.ahead = 1;
        modifiers.collision.back = 1;
        modifiers.collision.left = 1;
        modifiers.collision.right = 1;

        objectsX.forEach(function (obj) {
            if (collisionFound) return;

            dataset = obj.dataset;
            objX = dataset.x - 0;
            objZ = dataset.z - 0;
            objWidth = dataset.w / 2;

            if (objZ - objWidth > view.z || objZ + objWidth < view.z) return;

            if (view.x < objX) {
                if (view.x + dx + modifiers.collision.offset >= objX) {
                    modifiers.collision.left = 0;
                    collisionFound = true;
                }
            } else {
                if (view.x - dx - modifiers.collision.offset <= objX) {
                    modifiers.collision.right = 0;
                    collisionFound = true;
                }
            }
        });

        collisionFound = false;
        objectsZ.forEach(function (obj) {
            if (collisionFound) return;

            dataset = obj.dataset;
            objX = dataset.x - 0;
            objZ = dataset.z - 0;
            objWidth = dataset.w / 2;

            if (objX - objWidth > view.x || objX + objWidth < view.x) return;

            if (view.z < objZ) {
                if (view.z + dz + modifiers.collision.offset >= objZ) {
                    modifiers.collision.ahead = 0;
                    collisionFound = true;
                }
            } else {
                if (view.z - dz - modifiers.collision.offset <= objZ) {
                    modifiers.collision.back = 0;
                    collisionFound = true;
                }
            }
        });
    };

    move.start = {
        forward: function () {
            if (moveDisabled) return;
            sounds.walk.start();
            modifiers.moving.move = 1;
        },
        backward: function () {
            if (moveDisabled) return;
            sounds.walk.start();
            modifiers.moving.move = -1;
        },
        left: function () {
            if (moveDisabled) return;
            sounds.walk.start();
            modifiers.moving.strafe = 1;
        },
        right: function () {
            if (moveDisabled) return;
            sounds.walk.start();
            modifiers.moving.strafe = -1;
        }
    };
    move.jump = function (t) {
        if (moveDisabled) return;
        t = t || 0; 
        view.y = Math.sin(t) * jumpHeight;
        if (t < Math.PI) {
            setTimeout(function () {
                move.jump(t + Math.PI * (1000/jumpFPS/jumpTime));
            }, 1000 / jumpFPS);
        } else {
            view.y = 0;
        }
    };
    move.stop = function (isStrafe) {
        modifiers.moving[isStrafe ? 'strafe' : 'move'] = 0;
        if (!modifiers.moving.move && !modifiers.moving.strafe) {
            sounds.walk.stop();
        }
    };
    
    
    function keyDownObserver(e) {
        switch (e.keyCode) {
            case 87: //w
                move.start.forward();
                break;
            case 65: //a
                move.start.left();
                break;
            case 83: //s
                move.start.backward();
                break;
            case 68: //d
                move.start.right();
                break;
            case 32: // space
                move.jump();
                break;
        }
    };
    function keyUpObserver(e) {
        switch (e.keyCode) {
            case 87: //w
                move.stop();
                break;
            case 65: //a
                move.stop(true);
                break;
            case 83: //s
                move.stop();
                break;
            case 68: //d
                move.stop(true);
                break;
        }
    };
    function mouseMoveObserver(e) {
        if (lookDisabled) return;
        if (viewAngleBase.x === null) {
            viewAngleBase.x = e.clientX;
            viewAngleBase.y = e.clientY;
        }
        view.angleX = Math.PI * 2 * (e.clientX - viewAngleBase.x) / viewAngleBase.x;
        view.angleY = Math.PI / 2 * (e.clientY - viewAngleBase.y) / viewAngleBase.y;
    };


    Sound = function (url, options) {
        var self = this;
        options = options || {};
        var sound = new Audio('audio/' + url);
        sound.autoplay = !!options.autoplay;
        options.volume && (sound.volume = options.volume);
        if (options.stopAfter) {
            sound.addEventListener('timeupdate', function () {
                if (this.currentTime >= options.stopAfter) {
                    this.pause();
                    this.src = this.src;
                    !!options.loop && this.play();
                }
            });
        }
        sound.addEventListener('ended', function () {
            this.src = this.src;
            !!options.loop && this.play();
        }, false);
        sound.controls = true;
        this.sound = sound;
    };
    Sound.prototype.start = function () {
        this.sound.play();
        return this;
    };
    Sound.prototype.stop = function () {
        this.sound.pause();
        return this;
    };

    sounds = {
        wind: new Sound('wind.mp3', { autoplay: true, loop: true }),
        ambient: new Sound('ambient.mp3', { autoplay:true, loop:true, volume:0.6 }),
        walk: new Sound('deep_snow.mp3', { loop: true }),
        pipe: new Sound('pipe_2.mp3', { stopAfter: 7 }),
        scary: new Sound('scary.mp3'),
        doorShut: new Sound('doorshut.mp3'),
        laugh: new Sound('hohoho.mp3')
    };
    
    observers = {
        move: []
    };
    scene = {
        onMove: function (o) {
            observers.move.push(o);
        },
        disableMove: function () {
            moveDisabled = true;
        },
        enableMove: function () {
            moveDisabled = false;
        },
        disableLook: function () {
            lookDisabled = true;
        },
        enableLook: function () {
            lookDisabled = false;
        },
        sounds: sounds
    };
    
    notify = function (type, data) {
        for (var i in observers[type]) {
            observers[type][i](data);
        }
    };


    document.addEventListener('keydown', keyDownObserver, false);
    document.addEventListener('keyup', keyUpObserver, false);
    document.addEventListener('mousemove', mouseMoveObserver, false);
    
    requestAnimationFrame(repaint);
})();
