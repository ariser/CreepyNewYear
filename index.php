<?php
    $style1 = '';
    $style2 = '';
    $text1 = 'С Новым годом! =^__^=';
    $text2 = '';
    switch ($_GET['p']) {
        case 'y':
            $text1 = 'Юююль, с Новым годом! :-)<br><br>Великолепности повседневности,<br>превосходности окружающести<br>и покоряемости непокорённостей.';
            $text2 = 'ушедшегодные сомненья<br>и контррадости гоня<br>тебе желаю в новом годе<br>коня';
            $style1 = ' style="margin-top: -100px"';
            $style2 = ' style="margin-top: -300px"';
            break;
        case 'u':
            $text1 = 'С Новым годом, чувак! Х)<br><br>Чтоб оно всё!';
            break;
        case 'v':
            $text1 = 'Ва-а-а-аля-я-я-я-я.<br>С Новым годом!<br>Вот.';
            $text2 = 'непревзойдённейший подарок<br>из кочерги тебе согнул<br>куда бежишь ты стой зараза<br>взбзднул';
            $style1 = ' style="margin-left: -100px"';
            $style2 = ' style="margin-left: 200px; margin-top: -200px"';
            break;
        case 'j':
            $text1 = 'С Новым годом, Лёх. :-D';
            break;
    }
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>Creepy New Year</title>
        <link rel="stylesheet" href="css/world.css">
    </head>
    <body>
        <div class="crosshair"></div>
        <div class="help">WASD, Spacebar, Mouse</div>
        <div class="viewport">
            <div id="camera">
                <div id="world">
                    <div class="space">
                        <div class="pic" id="pic"></div>
                        <div class="text text_0" id="text">не смотри назад</div>
                        <div class="text text_1" id="text_1"<?=$style1?>><div class="text_content"><?=$text1?></div></div>
                        <div class="text text_2" id="text_2"<?=$style2?>><div class="text_content"><?=$text2?></div></div>
                        <div class="door" id="door"></div>
                        <div class="santa" id="santa"></div>
                        <div class="road" id="road"></div>
                    </div>
                </div>
            </div>
        </div>
        <script src="js/world.js"></script>
        <script src="js/scenes.js"></script>
    </body>
</html>