document.addEventListener('DOMContentLoaded', () => {
    const audioPlayer = document.getElementById('audio-player');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playerSongTitle = document.getElementById('player-song-title');
    const playerArtist = document.getElementById('player-artist');
    const playerAlbumArt = document.getElementById('player-album-art');
    const volumeSlider = document.getElementById('volume-slider');
    const songItems = document.querySelectorAll('.song-item');
    const searchInput = document.getElementById('search-input');

    // New elements for the full-screen player
    const mainPlayerBar = document.getElementById('player-bar');
    const fullScreenPlayer = document.getElementById('full-screen-player');
    const closePlayerBtn = document.getElementById('close-player-btn');
    const fsAlbumArt = document.getElementById('fs-album-art-img');
    const fsSongTitle = document.getElementById('fs-song-title');
    const fsArtistName = document.getElementById('fs-artist-name');
    const lyricsText = document.getElementById('lyrics-text');
    const fsRecommendations = document.getElementById('fs-recommendations');

    let isPlaying = false;
    
    // Function to handle play/pause
    function togglePlayPause() {
        if (isPlaying) {
            audioPlayer.pause();
            playPauseBtn.classList.remove('fa-pause');
            playPauseBtn.classList.add('fa-play');
        } else {
            audioPlayer.play();
            playPauseBtn.classList.remove('fa-play');
            playPauseBtn.classList.add('fa-pause');
        }
        isPlaying = !isPlaying;
    }

    // Event listener for the main play/pause button
    playPauseBtn.addEventListener('click', togglePlayPause);

    // Event listeners for individual song items
    songItems.forEach(item => {
        const playBtn = item.querySelector('.play-btn');

        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const songSrc = item.getAttribute('data-src');
            const songTitle = item.querySelector('.details h3').textContent;
            const songArtist = item.querySelector('.details p').textContent;
            const albumArt = item.querySelector('img').src;

            // Update the player bar and full-screen player
            audioPlayer.src = songSrc;
            playerSongTitle.textContent = songTitle;
            playerArtist.textContent = songArtist;
            playerAlbumArt.src = albumArt;
            fsAlbumArt.src = albumArt;
            fsSongTitle.textContent = songTitle;
            fsArtistName.textContent = songArtist;

            // Fetch and display lyrics
            const lyricsFile = item.getAttribute('data-lyrics');
            fetch(lyricsFile)
                .then(response => response.text())
                .then(text => {
                    lyricsText.textContent = text;
                })
                .catch(error => {
                    lyricsText.textContent = "Lyrics not found.";
                });

            // Populate recommendations
            populateRecommendations(item);

            if (!isPlaying) {
                togglePlayPause();
            } else {
                audioPlayer.pause();
                audioPlayer.load();
                audioPlayer.play();
                playPauseBtn.classList.remove('fa-play');
                playPauseBtn.classList.add('fa-pause');
                isPlaying = true;
            }
        });
    });

    // Event listener for volume control
    volumeSlider.addEventListener('input', () => {
        audioPlayer.volume = volumeSlider.value;
    });

    // Functionality for horizontal scrolling
    const playlistContainers = document.querySelectorAll('.playlist-container');
    playlistContainers.forEach(container => {
        const songList = container.querySelector('.song-list');
        const prevBtn = container.querySelector('.prev-btn');
        const nextBtn = container.querySelector('.next-btn');
        const scrollAmount = 270;

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                songList.scrollLeft -= scrollAmount;
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                songList.scrollLeft += scrollAmount;
            });
        }
    });

    // Functionality for the search bar
    searchInput.addEventListener('keyup', (e) => {
        const searchText = e.target.value.toLowerCase();
        
        songItems.forEach(item => {
            const songTitle = item.querySelector('h3').textContent.toLowerCase();
            const artistName = item.querySelector('p').textContent.toLowerCase();
            
            if (songTitle.includes(searchText) || artistName.includes(searchText)) {
                item.style.display = 'flex'; // Use flex to maintain layout
            } else {
                item.style.display = 'none';
            }
        });
    });

    // Expand the player to full-screen
    mainPlayerBar.addEventListener('click', () => {
        fullScreenPlayer.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Close the full-screen player
    closePlayerBtn.addEventListener('click', () => {
        fullScreenPlayer.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    // Function to populate recommendations (basic logic for demonstration)
    function populateRecommendations(currentSongItem) {
        fsRecommendations.innerHTML = '';
        const allSongs = Array.from(songItems);
        const currentSongTitle = currentSongItem.querySelector('.details h3').textContent;

        const recommendedSongs = allSongs.filter(song => {
            return song.querySelector('.details h3').textContent !== currentSongTitle;
        }).slice(0, 5); // Show top 5 recommendations

        recommendedSongs.forEach(song => {
            const clone = song.cloneNode(true);
            clone.style.display = 'flex';
            clone.addEventListener('click', () => {
                // Play the recommended song when clicked
                const playBtn = clone.querySelector('.play-btn');
                playBtn.click();
            });
            fsRecommendations.appendChild(clone);
        });
    }
});

