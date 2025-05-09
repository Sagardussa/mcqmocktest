import { Component, OnInit, OnDestroy } from '@angular/core';
import { Question } from './question.model';
import { QuizService } from './quiz.service';
import { Subscription } from 'rxjs';
import { NavigationStart, NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { Quiz2Service } from '../quiz2/quiz2.service';
import { Quiz3Service } from '../quiz3/quiz3.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit, OnDestroy {

  timer: any;
  totalTime: number = 3600; // Default time: 60 minutes in seconds
  minutes: number = 60;
  seconds: number = 0;

  currentQuestionIndex: number = 0;
  selectedAnswers: string[] = [];
  showResult: boolean = false;
  score: number = 0;

  questions: Question[] = [];
  quizStarted: boolean = false;
  private routerSubscription!: Subscription;
  private quizPaused: boolean = false;

  constructor(private quizService: QuizService, private quiz2Service: Quiz2Service , private quiz3Service: Quiz3Service, private router: Router,private route: ActivatedRoute) { }

  ngOnInit(): void {

    const currentPath = this.router.url.replace('/', '');
    console.log("currentPath --> 1",currentPath);
    
    switch (currentPath) {
      case 'mock1':
        this.loadQuestions();
        // this.loadMock1Questions();
        break;
      case 'mock2':
        this.load2Questions();
        console.log("mock 2");
        
        // this.loadMock2Questions();
        break;
      case 'mock3':
        console.log("mock 3");
        this.load3Questions();
        break;
      default:
        console.warn('Unknown mock path:', currentPath);
    }

    // Check if quiz was previously started and resume if necessary
    const started = localStorage.getItem('quizStarted') === 'true';
    const startTime = Number(localStorage.getItem('quizStartTime'));
    const remainingTime = Number(localStorage.getItem('remainingTime'));

    // if (started && startTime && !Number.isNaN(remainingTime)) {
    //   this.quizStarted = true;
    //   this.resumeTimerFromStorage(remainingTime);
    // }

    // this.routerSubscription = this.router.events.subscribe(event => {
    //   if (event instanceof NavigationStart) {
    //     if (this.quizStarted && this.totalTime > 0) {
    //       this.pauseQuiz();
    //     }
    //   }

    //   if (event instanceof NavigationEnd) {
    //     if (event.urlAfterRedirects === '/mock1' && this.quizPaused) {
    //       this.resumeQuiz();
    //     }
    //   }
    // });
  }

  loadQuestions(): void {
    this.quizService.getQuestions().subscribe((data) => {
      this.questions = data;
    });
  }

  load2Questions(): void {
    this.quiz2Service.getQuestions().subscribe((data) => {
      this.questions = data;
    });
  }

  load3Questions(): void {
    this.quiz3Service.getQuestions().subscribe((data) => {
      this.questions = data;
    });
  }

  pauseQuiz(): void {
    clearInterval(this.timer);
    this.quizPaused = true;
    localStorage.setItem('remainingTime', this.totalTime.toString()); // Store remaining time
  }

  resumeQuiz(): void {
    this.quizPaused = false;
    this.resumeTimerFromStorage(this.totalTime);
  }

  resumeTimerFromStorage(remainingTime: number): void {
    if (remainingTime > 0) {
      this.totalTime = remainingTime;
      this.startTimer(this.totalTime);
    } else {
      this.submitQuiz(); // Submit the quiz if time is up
    }
  }

  startTimer(duration: number): void {
    this.totalTime = duration;
    this.updateTimeDisplay();

    this.timer = setInterval(() => {
      if (this.totalTime > 0) {
        this.totalTime--;
        // 🔥 Live update remaining time in localStorage every second
        localStorage.setItem('remainingTime', this.totalTime.toString());

        this.updateTimeDisplay();
      } else {
        clearInterval(this.timer);
        this.submitQuiz(); // Auto-submit quiz when time is up
      }
    }, 1000);
  }

  updateTimeDisplay(): void {
    this.minutes = Math.floor(this.totalTime / 60);
    this.seconds = this.totalTime % 60;
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    clearInterval(this.timer);
  }

  startQuiz(): void {
    this.quizStarted = true;
    const startTimestamp = new Date().getTime();
    localStorage.setItem('quizStarted', 'true');
    localStorage.setItem('quizStartTime', startTimestamp.toString());
    this.startTimer(this.totalTime);
  }

  

  selectAnswer(questionIndex: number, answerKey: string): void {
    this.selectedAnswers[questionIndex] = answerKey;
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  submitQuiz(): void {
    clearInterval(this.timer);
    this.showResult = true;

    localStorage.removeItem('quizStarted');
    localStorage.removeItem('quizStartTime');
    localStorage.removeItem('remainingTime');

    this.score = this.selectedAnswers.filter((answer, index) => {
      return answer === this.questions[index].correctAnswer;
    }).length;
  }

  playAgain(): void {
    this.showResult = false;
    this.selectedAnswers = [];
    this.currentQuestionIndex = 0;
    this.score = 0;

    localStorage.removeItem('quizStarted');
    localStorage.removeItem('quizStartTime');
    localStorage.removeItem('remainingTime');

    this.totalTime = 3600;
    this.minutes = 59;
    this.seconds = 0;

    this.quizStarted = false;
  }

  objectEntries(obj: { [key: string]: string }) {
    return Object.entries(obj);  // Converts object to array of key-value pairs
  }
}
