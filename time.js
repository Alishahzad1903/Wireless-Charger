  var timerElement = document.querySelector('.timer');
  var startTime;
  var elapsedTime = 0;
  var timerInterval;

  function startTimer() {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(updateTimer, 1000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
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

  window.electronAPI.handleConnection((event, signal) => {
    if (signal == false) {
      stopTimer();
      //change color to gray
      document.querySelector(".status-text").style.color = "#d6d4d0";
      document.querySelector(".spin-container").style.setProperty("--spinner-color", "#F00000");

    } else {
      elapsedTime = 0;
      startTimer();
      //change color to green
      document.querySelector(".status-text").style.color = "#00F000";
      document.querySelector(".spin-container").style.setProperty("--spinner-color", "#00F000");

    } 
  });
