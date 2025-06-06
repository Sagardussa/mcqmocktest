import { Component, OnInit } from '@angular/core';
import { Quiz2Service } from './quiz2.service';
import { Question } from './question.model';

@Component({
  selector: 'app-quiz2',
  templateUrl: './quiz2.component.html',
  styleUrls: ['./quiz2.component.scss']
})
export class Quiz2Component implements OnInit {
  currentQuestionIndex: number = 0;  // Current question index
  selectedAnswers: string[] = [];     // Array to store selected answers for each question
  showResult: boolean = false;        // Flag to show the results
  score: number = 0;                  // User's score

  questions: Question[] = [];


  constructor(private quiz2Service: Quiz2Service) { }


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
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.quiz2Service.getQuestions().subscribe((data) => {
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
