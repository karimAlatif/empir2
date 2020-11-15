var playerM, myTimer, playerL;

jQuery(document).ready(function ($) {

    $(document).on('click', '.play_control', function (e) {
        clearInterval(myTimer);
        if ($(this).closest('.video_wrap').hasClass('video_playing')) {
            if($('.modal.open').hasClass('youtube') && playerM !== undefined) playerM.pauseVideo();
            if($('.modal.open').hasClass('local')) playerL.pause();
            $(this).closest('.video_wrap').removeClass('video_playing');
        } else {
            if($('.modal.open').hasClass('youtube') && playerM !== undefined) playerM.playVideo();
            if($('.modal.open').hasClass('local')) playerL.play();
            $(this).closest('.video_wrap').addClass('video_playing');
        }
    });

    var videoPosDrag = false;
    $(document).on('mousedown', '.video-progress-wrap', function (e) {
        videoPosDrag = true;
        var parEl = $(this).closest('.video_wrap');
        updatePos(e.pageX, parEl);
    }).on('mouseup', '.video-progress-wrap', function (e) {
        var parEl = $(this).closest('.video_wrap');
        if (videoPosDrag) {
            videoPosDrag = false;
            updatePos(e.pageX, parEl);
        }
    }).on('mousemove', '.video-progress-wrap', function (e) {
        var parEl = $(this).closest('.video_wrap');
        if (videoPosDrag) {
            updatePos(e.pageX, parEl);
        }
    });

    $(document).on('click', '.sound_control', function () {
        $(this).toggleClass('muted');
        if(!$(this).hasClass('muted')) {
            if($('.modal.open').hasClass('youtube') && playerM !== undefined) playerM.unMute();
            if($('.modal.open').hasClass('local')) playerL.muted = true;
        } else {
            if($('.modal.open').hasClass('youtube') && playerM !== undefined) playerM.mute();
            if($('.modal.open').hasClass('local')) playerL.muted = false;
        }
    });

    var updatePos = function (x, elem) {

        var volume = elem.find('.video-progress');
        var percentage;
        var position = x - volume.offset().left;
        percentage = position / volume.width();

        if (percentage > 100) {
            percentage = 100;
        }
        if (percentage < 0) {
            percentage = 0;
        }

        if($('.modal.open').hasClass('youtube') && $('.video_wrap').hasClass("video_playing"))  {
            var playerTotalTime = playerM.getDuration();
            playerM.seekTo(percentage*playerTotalTime, true);
        }
        if($('.modal.open').hasClass('local')) {
            var playerLocalTotalTime = playerL.duration;
            playerL.currentTime = playerLocalTotalTime * percentage;
            volume.find('.draggable-point').css("left", percentage*100 + "%");
            volume.find('.video-progress-bar').css('width', percentage*100 + '%');
        }
    };

    $(document).on('mouseenter', '.video-overlay, .modal__overlay, .cookie_msg__accept', function () {
        $('.cursor').attr('data-pointer', 'close');
    }).on('mouseleave', '.video-overlay, .modal__overlay, .cookie_msg__accept', function () {
        $('.cursor').attr('data-pointer', '');
    });

    $(document).on('mouseenter', 'a, button', function () {
        $('.cursor').attr('data-pointer', 'eye');
    }).on('mouseleave', 'a, button', function () {
        $('.cursor').attr('data-pointer', '');
    });

    $(document).on('click', '.modal__close, .video-overlay, .modal__overlay', function (e) {
        e.preventDefault();
        closeModal();
        $('.cursor').attr('data-pointer', '');
    });


    $(".js-btn_2").click(function (){
        $(".text_block_2").removeClass('text_block--active').fadeOut();
        playerL.play();
        document.getElementsByClassName('video_wrap')[0].classList.add('video_playing');
    });

    $(".js-btn_3").click(function (){
        $(".text_block_3").removeClass('text_block--active').fadeOut();
        playerL.play();
        document.getElementsByClassName('video_wrap')[0].classList.add('video_playing');
    });

    $(".button_next").click(function (){
        var thIn = parseInt($(this).attr('data-index'));
        if(thIn === 7) {
            closeModal();
            $(".text_block_"+thIn).fadeOut();
            $("#video_local_"+(thIn+1)).hide();
            return false;
        }
        videoLoop(thIn, thIn+2);
        $(".text_block_"+thIn).fadeOut();
        $("#video_local_"+(thIn+1)).hide().removeClass('playing');
    });

    $(document).on('click', '.cookie_msg__accept', function (e) {
        e.preventDefault();
        $('#cookie_msg').removeClass('active');
    });

    $(document).on('click', '.share_link', function (e) {
        e.preventDefault();
        var thL = $(this);
        var tempCopy = $("<input type='text'>");
        $(".share_text").append(tempCopy);
        tempCopy.val(window.location.href).select();
        thL.addClass('link_copied');
        document.execCommand('copy');
        setTimeout(function () {
            thL.removeClass('link_copied');
            $('.share_text').html('');
        }, 600);
    });

});

var playerL1, playerL2;
function videoLoop(index, indexV) {
    playerL1 = document.getElementById('video_local_'+indexV);
    playerL2 = document.getElementById('video_local_'+(indexV+1));

    $("#video_local_"+indexV).show();
    playerL1.play();

    playerL1.addEventListener('timeupdate', function() {
        if(!isNaN(this.duration)) {
            var currentPos = playerL1.currentTime;
            var maxduration = playerL1.duration;

            if(currentPos == maxduration) {
                $(".text_block_"+indexV).fadeIn();
                playerL2.play();
                setTimeout(function () {
                    $("#video_local_"+indexV).hide();
                    $("#video_local_"+(indexV+1)).show();
                }, 300)
            }

        }
    });
}

function videoYT(id) {
    if(document.getElementById("www-widgetapi-script")) {
        youtubeL();
    } else {
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        window.onYouTubePlayerAPIReady = function () {
            youtubeL();
        }
    }

    function youtubeL() {
        clearInterval(myTimer);
        if($('#video_player').length == 0) {
            $('.video_wrap').append('<div id="video_player" class="video_item"></div>');
        }
        playerM = new YT.Player('video_player', {
            videoId: id,
            playerVars: {rel: 0, ecver: 2, controls: 0},
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    }

    function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING) {
            var volume = $('.video-progress');
            var playerTotalTime = playerM.getDuration();

            myTimer = setInterval(function () {
                if(playerM !== undefined) {
                    var playerCurrentTime = playerM.getCurrentTime();
                    var playerTimeDifference = (playerCurrentTime / playerTotalTime) * 100;

                    volume.find('.draggable-point').css("left", playerTimeDifference + "%");
                    volume.find('.video-progress-bar').css('width', playerTimeDifference + '%');
                } else {
                    clearInterval(myTimer);
                }
            }, 300);
        }
        if (event.data == YT.PlayerState.ENDED) {
            $('.video_playing').removeClass('video_playing');
            playerM.stopVideo();
            clearInterval(myTimer);
        }
    }
    function onPlayerReady() {
        $('.modal.open .video_wrap').addClass('video_playing');
        playerM.mute();
        $('.sound_control').addClass('muted');
        playerM.playVideo();
        if ($('#jsModal').hasClass('video3D')) {
            setTimeout(function () {
                $('.video_info').fadeOut();
            }, 1500)
        }
    }
}

var animation = bodymovin.loadAnimation({
    container: document.getElementById('loading-item'),
    path: 'images/loading1.json',
    renderer: 'svg',
    loop: false,
    autoplay: false
});

function videoLocal(path) {
    playerL = document.getElementById('video_local');
    playerL.setAttribute('src', path);
    if (document.getElementById('jsModal').classList.contains('videoHTML')) playerL.muted = true;
    playerL.play();
    playerL.currentTime = 0;

    document.getElementsByClassName('video_wrap')[0].classList.add('video_playing');


    playerL.addEventListener('timeupdate', function() {
        if(!isNaN(this.duration)) {
            var currentPos = playerL.currentTime;
            var maxduration = playerL.duration;
            var perc = 100 * currentPos / maxduration;
            document.getElementsByClassName('video-progress-bar')[0].style.width = perc + '%';
            document.getElementsByClassName('draggable-point')[0].style.left = perc + "%";


            if (document.getElementById('jsModal').classList.contains('videoHTML')) {
                var stopTime1 = document.getElementsByClassName('text_block_2')[0].getAttribute('data-time');
                var stopTime2 = document.getElementsByClassName('text_block_3')[0].getAttribute('data-time');

                if(currentPos >= stopTime1 && $(".video_wrap").hasClass("video_playing") && $(".text_block_2").hasClass('text_block--active')) {
                    playerL.pause();
                    $(".text_block_2").fadeIn();
                    document.getElementsByClassName('video_wrap')[0].classList.remove('video_playing');
                }
                if(currentPos >= stopTime2 && $(".video_wrap").hasClass("video_playing") && $(".text_block_3").hasClass('text_block--active')) {
                    playerL.pause();
                    $(".text_block_3").fadeIn();
                    document.getElementsByClassName('video_wrap')[0].classList.remove('video_playing');
                }
                if(currentPos == maxduration) {
                    setTimeout(function () {
                        $(".text_block").addClass('text_block--active');
                        closeModal();
                    }, 500)
                }
            }

        }
    });
    playerL.addEventListener('ended', function() {
        playerL.pause();
        document.getElementsByClassName('video_wrap')[0].classList.remove('video_playing');
    });
}

function openModal(videoData, callback) {
    document.body.classList.add('modal_open');
    document.getElementById('video-desc').innerHTML= videoData.description;
    if(videoData.link !== undefined && videoData.link.length > 0)  {
        document.getElementById('video-link').querySelector('a').href= videoData.link;
        document.getElementById('video-link').style.display = 'block';
    }

    var modalWindow = document.getElementById('jsModal');

    if(videoData.videoType3D === 'threeD') {
        modalWindow.classList.add('video3D');
        document.getElementsByClassName('video_info')[0].style.display = 'block';
    }
    if(videoData.videoTypeHTML === 'videoHTML') modalWindow.classList.add('videoHTML');
    if(videoData.videoTypeHTML === 'videoHTMLloop') modalWindow.classList.add('videoHTMLloop');
    if(videoData.mode !== 'fullScreen') modalWindow.classList.add('modal_sm');

    if(videoData.videoType === 'youtube') videoYT(videoData.videoId);
    if(videoData.videoType === 'local' && videoData.videoTypeHTML !== 'videoHTMLloop') videoLocal(videoData.videoId);
    if(videoData.videoTypeHTML === 'videoHTMLloop')  videoLoop(1, 1);

    modalWindow.classList ? modalWindow.classList.add('open', videoData.videoType) : modalWindow.className += ' ' + 'open';
    if(callback)
        callback();
}

function closeModal(){
    var modalWindow = document.getElementById('jsModal');
    var modalVideo = document.getElementsByClassName('video_wrap');

    if (modalWindow.classList.contains('youtube')){
        if(playerM !== undefined) {
            clearInterval(myTimer);
            playerM.stopVideo();
            playerM.destroy();
            playerM = null;
        } else {
            return false;
        }
    }

    if (modalWindow.classList.contains('local') && !modalWindow.classList.contains('videoHTMLloop')){
        playerL.pause();
        playerL.currentTime = 0;
    }

    document.body.classList.remove('modal_open');
    document.getElementById('video-desc').innerHTML= '';
    document.getElementById('video-link').href= '';
    document.getElementById('video-link').style.display = 'none';

    modalWindow.classList ? modalWindow.classList.remove('open', 'modal_sm', 'local', 'youtube', 'video3D') : modalWindow.className = modalWindow.className.replace(new RegExp('(^|\\b)' + 'open'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    modalWindow.classList ? modalWindow.classList.remove('open', 'modal_sm', 'local', 'youtube', 'video3D', 'videoHTML', 'videoHTMLloop') : modalWindow.className = modalWindow.className.replace(new RegExp('(^|\\b)' + 'open'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    modalVideo[0].classList.remove('video_playing');
    document.getElementsByClassName('video-progress-bar')[0].style = '';
    document.getElementsByClassName('draggable-point')[0].style = "";
    clearInterval(myTimer);
}
