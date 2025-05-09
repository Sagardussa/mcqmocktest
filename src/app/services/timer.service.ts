// src/app/services/timer.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private elapsedSeconds = 0;
  private timerSubscription: Subscription | null = null;
  private timerSubject = new BehaviorSubject<number>(0);
  timer$ = this.timerSubject.asObservable();

  constructor() {
    // Restore time from localStorage (optional)
    const savedTime = Number(localStorage.getItem('examTime'));
    if (!isNaN(savedTime)) {
      this.elapsedSeconds = savedTime;
      this.timerSubject.next(savedTime);
    }
  }

  startTimer() {
    if (!this.timerSubscription) {
      this.timerSubscription = interval(1000).subscribe(() => {
        this.elapsedSeconds++;
        this.timerSubject.next(this.elapsedSeconds);
        localStorage.setItem('examTime', this.elapsedSeconds.toString());
      });
    }
  }

  stopTimer() {
    this.timerSubscription?.unsubscribe();
    this.timerSubscription = null;
  }

  resetTimer() {
    this.stopTimer();
    this.elapsedSeconds = 0;
    this.timerSubject.next(0);
    localStorage.removeItem('examTime');
  }

  getCurrentTime(): number {
    return this.elapsedSeconds;
  }

  setTime(seconds: number) {
    this.elapsedSeconds = seconds;
    this.timerSubject.next(seconds);
    localStorage.setItem('examTime', seconds.toString());
  }
}
