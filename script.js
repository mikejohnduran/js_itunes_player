$(document).ready(function () {
    $('.parallax').parallax();
    $("#loading").hide()
    $("form").submit(function (e) {
        e.preventDefault();
        $("#loading").show();
        var userInput = $("#search").val();
        $("form")[0].reset();
        $("input").blur();
        $.ajax({
            url: "http://itunes.apple.com/search?term=" + userInput,
            dataType: 'JSONP'
        })
            .done(function (data) {
                console.log(data);
                $("#loading").hide();
                // add code for when response from apple comes back.
                $('#songs').html("");
                $('.carousel').html("");
                $('.carousel').carousel('destroy');
                var seen = {};
                var ampArray = []
                for (var i = 0; i < data.results.length; i++) {
                    if(seen[data.results[i].artworkUrl100] === undefined){
                        var fullSize = data.results[i].artworkUrl100.replace("100x100bb.jpg", "1000x1000bb.jpg")
                        $('.carousel').append(`
                          <a class="carousel-item" href="#one!"><img src="${fullSize}"></a>
                        `)
                        seen[data.results[i].artworkUrl100] = true
                    }
                    ampArray.push(  {
                        "name": data.results[i].trackName,
                        "artist": data.results[i].artistName,
                        "album": data.results[i].collectionCensoredName,
                        "url": data.results[i].previewUrl,
                        "cover_art_url": data.results[i].artworkUrl100
                    })
                    $('#songs').append(`<li>${data.results[i].trackName}
                                    <p> 
                                        <i class="material-icons amplitude-play"  amplitude-song-index="${i}">play_arrow</i>
                                        <i class="material-icons amplitude-mute"> volume_mute </i>
                                        <i class="material-icons amplitude-pause" amplitude-song-index="${i}"> pause </i> 
                                    </p>                            
                             </li>`);
                }
                Amplitude.init({
                    "songs": ampArray })
                console.log(seen)
                $('.carousel').carousel();
            })
            .fail(function (data) {
                console.log(data);
                $('#songs').append(data.status);
            })

    })

});
