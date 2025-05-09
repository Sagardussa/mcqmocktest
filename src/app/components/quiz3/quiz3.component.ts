import { Component } from '@angular/core';
import { Question } from '../quiz2/question.model';
import { Quiz3Service } from './quiz3.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../quiz/quiz.service';
import { Quiz2Service } from '../quiz2/quiz2.service';

@Component({
  selector: 'app-quiz3',
  templateUrl: './quiz3.component.html',
  styleUrls: ['./quiz3.component.scss']
})
export class Quiz3Component {
  currentQuestionIndex: number = 0;  // Current question index
  selectedAnswers: string[] = [];     // Array to store selected answers for each question
  showResult: boolean = false;        // Flag to show the results
  score: number = 0;                  // User's score

  questions: Question[] = [];

  mockTitle = '';



  constructor(private quizService: QuizService, private quiz2Service: Quiz2Service , private quiz3Service: Quiz3Service, private router: Router,private route: ActivatedRoute) { }


  // Define the array of questions based on the Question interface
  // questions: Question[] = [
  //   {
  //     question: 'What is the capital of France?',
  //     answers: { 'A': 'Paris', 'B': 'London', 'C': 'Berlin' },
  //     correctAnswer: 'A'
  //   },
  //   {
  //     question: 'What is 2 + 2?',
  //     answers: { 'A': '3', 'B': '4', 'C': '5' },
  //     correctAnswer: 'B'
  //   }
  // ];

  ngOnInit(): void {
    const currentPath = this.router.url.replace('/', '');
    console.log("currentPath --> 1",currentPath);
    
    switch (currentPath) {
      case 'mock1':
        this.mockTitle = 'MOCk 1'
        this.loadQuestions();
        // this.loadMock1Questions();
        break;
      case 'mock2':
        this.mockTitle = 'MOCk 2'
        this.load2Questions();
        
        // this.loadMock2Questions();
        break;
      case 'mock3':
        this.mockTitle = 'MOCk 3'
        this.load3Questions();
        break;
      default:
        console.warn('Unknown mock path:', currentPath);
    // this.loadQuestions();
  }
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



  // Method to get the key-value pairs from the answers object
  objectEntries(obj: { [key: string]: string }) {
    return Object.entries(obj);  // Converts object to array of key-value pairs
  }

  // Method to select an answer
  selectAnswer(questionIndex: number, answerKey: string): void {
    this.selectedAnswers[questionIndex] = answerKey;
  }

  // Method to move to the next question
  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  // Method to move to the previous question
  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  // Method to submit the quiz and calculate the score
  submitQuiz(): void {
    this.showResult = true;
    this.score = this.selectedAnswers.filter((answer, index) => {
      return answer === this.questions[index].correctAnswer;
    }).length;  // Count how many answers are correct
  }

  // Method to play again (reset quiz)
  playAgain(): void {
    this.showResult = false;
    this.selectedAnswers = [];
    this.currentQuestionIndex = 0;
    this.score = 0;
  }
}
