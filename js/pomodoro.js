// Pomodoro timer for focused learning sessions

let pomodoroInterval = null;
let pomodoroTimeLeft = 25 * 60; // 25 minutes in seconds
let pomodoroIsRunning = false;
let pomodoroSessionCount = 0;

export function initPomodoro() {
  return {
    timeLeft: pomodoroTimeLeft,
    isRunning: pomodoroIsRunning,
    sessionCount: pomodoroSessionCount
  };
}

export function startPomodoro(duration = 25, onTick, onComplete) {
  if (pomodoroIsRunning) return;
  
  pomodoroTimeLeft = duration * 60;
  pomodoroIsRunning = true;
  
  pomodoroInterval = setInterval(() => {
    pomodoroTimeLeft--;
    
    if (onTick) {
      onTick(pomodoroTimeLeft);
    }
    
    if (pomodoroTimeLeft <= 0) {
      stopPomodoro();
      pomodoroSessionCount++;
      
      if (onComplete) {
        onComplete();
      }
      
      // Show notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Pomodoro Complete! 🎉', {
          body: 'Take a 5-minute break!',
          icon: '/favicon.ico'
        });
      }
    }
  }, 1000);
}

export function pausePomodoro() {
  if (pomodoroInterval) {
    clearInterval(pomodoroInterval);
    pomodoroInterval = null;
    pomodoroIsRunning = false;
  }
}

export function stopPomodoro() {
  pausePomodoro();
  pomodoroTimeLeft = 25 * 60;
}

export function resetPomodoro() {
  stopPomodoro();
  pomodoroTimeLeft = 25 * 60;
  pomodoroSessionCount = 0;
}

export function getPomodoroState() {
  return {
    timeLeft: pomodoroTimeLeft,
    isRunning: pomodoroIsRunning,
    sessionCount: pomodoroSessionCount,
    minutes: Math.floor(pomodoroTimeLeft / 60),
    seconds: pomodoroTimeLeft % 60
  };
}

export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Request notification permission
export async function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    await Notification.requestPermission();
  }
}

