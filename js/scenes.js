(function () {
    'use strict';

    var steps, step = 0, stepsLen, stepsEnded = false;
    
    steps = [
        {
            condition: function (d) {
                return d.z >= 2000;
            },
            action: function (d) {
                document.getElementById('santa').classList.add('santa_moved');
                scene.sounds.scary.start();
            }
        },
        {
            condition: function (d) {
                return d.z >= 2750 && d.cos > 0 && Math.abs(d.angleY) < 15;
            },
            action: function (d) {
                scene.disableMove();
                scene.disableLook();
                document.getElementById('door').classList.add('door_closed');
                document.getElementById('santa').classList.add('santa_hidden');
                document.getElementById('road').classList.add('road_hidden');
                scene.sounds.doorShut.start();
                setTimeout(function () {
                    scene.sounds.laugh.start();
                    document.getElementById('text').classList.add('text_0_visible');
                    document.getElementById('pic').classList.add('pic_visible');
                    scene.enableLook();
                }, 4000);
            }
        },
        {
            condition: function (d) {
                return d.cos < 0 && d.angleY < -30;
            },
            action: function () {
                scene.enableMove();
                scene.sounds.pipe.start();
                document.getElementById('text').classList.remove('text_0_visible');
                document.getElementById('text_1').classList.add('text_1_visible');              
            }
        }
    ];
    stepsLen = steps.length;
    
    scene.onMove(function (d) {
        if (!stepsEnded && steps[step].condition(d)) {
            steps[step++].action(d);
            if (step == stepsLen) {
                stepsEnded = true;
            }
        }
    });
})();
