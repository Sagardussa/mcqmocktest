import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Question } from '../quiz3/question.model';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  private questions: Question[] = [

    {
      question: "Q1. In which of the following options does an investor receive the distribution in hand?",
      answers: {
        A: "Income Distribution cum capital withdrawal option only",  // ✅ Correct
        B: "Income distribution cum capital withdrawal reinvestment plan only",
        C: "Income Distribution cum capital withdrawal option and Income distribution cum capital withdrawal reinvestment plan both",
        D: "Growth"
      },
      correctAnswer: "A",
      explanation: "In a Pay-out of Income Distribution cum Capital Withdrawal option, the investor receives the dividend directly in their bank account. In the reinvestment plan, the amount is reinvested. In the Growth option, no dividend is declared."
    },
    {
      question: "Q2. Identify the TRUE statement/s with respect to the risks associated with short selling and stock lending.\n1. There is counterparty risk and liquidity risk in short selling\n2. There is no risk associated with stock lending as the transaction is done through an approved intermediary",
      answers: {
        A: "Only 1 is true", // ✅ Correct
        B: "Only 2 is true",
        C: "Both 1 and 2 are true"
      },
      correctAnswer: "A",
      explanation: "Short selling carries both counterparty and liquidity risks. Stock lending, though conducted through approved intermediaries, still carries risks such as borrower default and intermediary failure."
    },
    {
      question: "Q3. Which of the following is INCORRECT with respect to advertisements of Mutual Funds by AMCs?",
      answers: {
        A: "The advertisements can use celebrities for endorsements",
        B: "The advertisements can show past performance of the scheme",
        C: "The advertisements can show the return numbers",
        D: "All of the above are incorrect" // ✅ Correct
      },
      correctAnswer: "A",
      explanation: "As per the SEBI Advertisement Code for Mutual Funds - No celebrities shall form part of the advertisement. (AMFI can use celebrities but individual mutual funds cannot use celebrities)"
    },
    {
      question: "Q4. Tactical Asset Allocation decisions are based on which of these factor/s?",
      answers: {
        A: "Likely behaviour of the markets", // ✅ Correct
        B: "Age of the investor",
        C: "Income of the investor",
        D: "All of the above"
      },
      correctAnswer: "A",
      explanation: "Tactical Asset Allocation is a short-term investment strategy that allows fund managers to adjust portfolio allocations based on expected market movements. It is driven by market outlook rather than investor demographics like age or income."
    }


  ]

  // Simulate async fetch
  getQuestions(): Observable<Question[]> {
    return of(this.questions);
  }
}
