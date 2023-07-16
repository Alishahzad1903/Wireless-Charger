window.onload = function() {
    var timerElement = document.querySelector('.timer');
    var startTime;
    var elapsedTime = 0;
    var timerInterval;
  
    function startTimer() {
      startTime = Date.now() - elapsedTime;
      timerInterval = setInterval(updateTimer, 1000);
    }
  
    function updateTimer() {
      var currentTime = Date.now();
      elapsedTime = currentTime - startTime;
      var formattedTime = formatTime(elapsedTime);
  
      if (timerElement.textContent !== formattedTime) {
        timerElement.classList.add('timer-change');
        setTimeout(function() {
          timerElement.classList.remove('timer-change');
        }, 300);
      }
  
      timerElement.classList.add('new-second');
      setTimeout(function() {
        timerElement.classList.remove('new-second');
        timerElement.textContent = formattedTime;
      }, 300);
    }
  
    function formatTime(time) {
      var totalSeconds = Math.floor(time / 1000);
      var hours = Math.floor(totalSeconds / 3600);
      var minutes = Math.floor((totalSeconds % 3600) / 60);
      var seconds = totalSeconds % 60;
  
      var formattedHours = String(hours).padStart(2, '0');
      var formattedMinutes = String(minutes).padStart(2, '0');
      var formattedSeconds = String(seconds).padStart(2, '0');
  
      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }
  
    startTimer();
  };
  