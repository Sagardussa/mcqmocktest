// src/app/quiz/quiz.service.ts

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Question } from './question.model';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  constructor() { }

  private questions: Question[] = [
      {
        question: 'Q 1. For units of Equity Linked Savings Scheme (ELSS), the lock-in period is ______ .',
        answers: {
          'A': 'three years from the date of original investment, even in case of subsequent purchases by SIP',
          'B': 'three years from the date of original investment for each individual unit for purchases made by SIP',
          'C': 'There is no lock-in period if tax exemption is claimed'
        },
        correctAnswer: 'B'
      },
      {
        question: 'Q2. In the usual course of events, a fund manager will have to provide the maximum liquid assets for _______ .',
        answers: { 'A': 'Gold ETFs', 'B': 'Equity ETFs', 'C': 'Close-end fund', 'D': 'Open-end fund' },
        correctAnswer: 'D'
      },
      {
        question: 'Q3. The __________ is used by the fund manager to communicate their views on the economy and the markets to the investors.',
        answers: {
          'A': 'Key Information Memorandum (KIM)',
          'B': 'Statement of Additional Information (SAI)',
          'C': 'Scheme Information Document (SID)',
          'D': 'Fund Factsheet'
        },
        correctAnswer: 'D'
      },
      {
        question: 'Q4. What is the disadvantage of company fixed deposits when compared to bank fixed deposits?',
        answers: {
          'A': 'Lower rate of interest',
          'B': 'Lower safety',
          'C': 'Highly volatile',
          'D': 'Difficult to liquidate'
        },
        correctAnswer: 'B',
      },
      {
        question: 'Q5. The equity share prices of gold mining companies can depend on:\n1. The gold reserves of the company\n2. The operational efficiency and management of the company\n3. International prices of gold',
        answers: {
          'A': 'Only 1 and 2',
          'B': 'Only 2 and 3',
          'C': 'Only 1 and 3',
          'D': 'All 1, 2 and 3'
        },
        correctAnswer: 'D',
      },
      {
        question: 'Q6. Identify the INCORRECT statement with respect to SEBI Complaint Redress System (SCORES).',
        answers: {
          'A': 'SCORES enables the market intermediaries and listed companies to receive complaints from investors.',
          'B': 'SCORES is a web-based centralized grievance redress system.',
          'C': 'SCORES is completely online, so an investor cannot lodge a physical complaint.',
          'D': 'If an investor lodges a physical complaint then such complaints are scanned and then uploaded in SCORES for processing.'
        },
        correctAnswer: 'C',
      },
      {
        question: `Q7. Identify the false statement(s) with respect to a New Fund Offer (NFO):\n
    1. A Closed-ended mutual fund NFO will have a NFO opening date, a NFO closing date and a scheme Re-opening date.\n
    2. An Open-ended mutual fund NFO will have a NFO opening date, a NFO closing date and a scheme Re-opening date.`,
        answers: {
          'A': 'Only 1 is false',
          'B': 'Only 2 is false',
          'C': 'Both 1 and 2 are false',
          'D': 'None of the above'
        },
        correctAnswer: 'A',
      },
      {
        question: `Q8. In which of the following case can a mutual fund charge the additional expense of 0.30% of daily net assets of the scheme?`,
        answers: {
          'A': 'When the new inflows from beyond top 30 cities is at least i) 30% of the gross new inflows in the scheme OR ii) 15% of the average AUM (Year To Date) of the scheme, which ever is higher',
          'B': 'When the new inflows from beyond top 25 cities is at least 30% of the gross new inflows',
          'C': 'When the new inflows from beyond top 30 cities is at least 10% of the gross new inflows',
          'D': 'When the new inflows from beyond top 15 cities is at least 20% of the gross new inflows'
        },
        correctAnswer: 'A',
      },

      {
        question: 'Q9. A Closed-end fund will have a _______.',
        answers: {
          'A': 'Fixed Dividend pay-out ratio',
          'B': 'Fixed Unit Capital',
          'C': 'Fixed Net Asset Value (NAV)',
          'D': 'Fixed Asset Under Management (AUM)'
        },
        correctAnswer: 'B',
      },
      {
        question: 'Q 10. Identify the CORRECT statement/s. A. Valuation gains are ignored. But valuation losses need to be adjusted against the profits while calculating distributable surplus. B. The Mark-to-market gains form a part of the distributable reserves in case of mutual fund Income Distribution Cum Capital Withdrawal plan',
        answers: {
          'A': 'Only A is correct',
          'B': 'Only B is correct',
          'C': 'Both A and B is correct',
          'D': 'Both A and B are incorrect'
        },
        correctAnswer: 'A',

      },
      {
        question: "Q 11. The return from a mutual fund scheme is 8.3% and the Standard Deviation is 0.6. The risk-free rate of return is 5%. Calculate the Sharpe ratio.",
        answers: {
          "A": "3.5",
          "B": "5.5",
          "C": "4",
          "D": "2.87"
        },
        correctAnswer: "B",
      },
      {
        question: 'Q 12. Opening of time stamping machine needs to be documented and reported to the Asset Management Company (AMC) - State whether True or False?',
        answers: {
          "A": "true",
          "B": "false",
        },
        correctAnswer: "B",
      },
      {
        question: "Q 13. While the SID, SAI and KIM need to be updated periodically, the interim changes are updated by the AMC through the issuance _______.",
        answers: {
          "A": "Fact Sheet",
          "B": "Director's Report",
          "C": "Auditor's Report",
          "D": "Addendum"
        },
        correctAnswer: "D"
      },
      {
        question: "Q 14. In case of an Index Fund, the minimum investment in securities of a particular index (which is being replicated/ tracked) shall be ________.",
        answers: {
          "A": "80% of the total assets",
          "B": "85% of the total assets",
          "C": "90% of the total assets",
          "D": "95% of the total assets"
        },
        correctAnswer: "D"
      },
      {
        question: "Q 15. _____ investment styles means buying stocks which are priced lower in the markets than the assessment based on fundamental analysis.",
        answers: {
          "A": "Growth",
          "B": "Blend",
          "C": "Value",
          "D": "Cyclical"
        },
        correctAnswer: "C"
      },
      {
        question: "Q 16. Which is the Source Scheme in a Systematic Transfer Plan?",
        answers: {
          "A": "It is the scheme with the lower NAV",
          "B": "It is the scheme from which funds are transferred",
          "C": "It is the scheme to which funds are transferred",
          "D": "It is the scheme with the higher NAV"
        },
        correctAnswer: "B"
      },
      {
        question: "Q 17. Dividing an individual’s portfolio allocation between Core portfolio and Satellite portfolio is dependent on the risk profile of the investor – State whether True or False?",
        answers: {
          "A": "True",
          "B": "False"
        },
        correctAnswer: "A"
      },
      {
        question: "Q 18. How can the empanelment of a mutual fund distributor be terminated?",
        answers: {
          "A": "The empanelment gets automatically terminated on the completion of the term of empanelment",
          "B": "Asset Management Company can terminate the empanelment at any time",
          "C": "When all the clients of the distributor shift to Direct Plans",
          "D": "All of the above"
        },
        correctAnswer: "B"
      },
      {
        question: "Q 19. Identify the TRUE statement. A) While calculating scheme returns for an investor, if there is an entry load, then the initial value of the Net Asset Value (NAV) is taken as NAV minus Entry Load B) While calculating scheme returns for an investor, if there is an exit load, then the later value of the Net Asset Value (NAV) is taken as NAV minus Exit Load",
        answers: {
          "A": "Only A is true",
          "B": "Only B is true",
          "C": "Both A and B are true"
        },
        correctAnswer: "B"
      },
      {
        question: "Q 20. Identify the CORRECT statement/s with respect to Conservative hybrid funds. A. A Conservative hybrid fund cannot invest in debt securities for which the Macaulay Duration is more than 1 year B. A Conservative hybrid fund cannot invest more than 25% of their total assets in equity instruments C. A Conservative hybrid fund cannot invest in debt securities which have lower than AAA rating",
        answers: {
          "A": "Only A and B are correct",
          "B": "Only B is correct",
          "C": "Only A and C are correct",
          "D": "All A, B and C are correct"
        },
        correctAnswer: "B"
      },
      {
        question: "Q 21. The dividends declared on units which are under a lien will be paid to _______.",
        answers: {
          "A": "The unit holder only",
          "B": "The lien holder only",
          "C": "The unit holder or lien holder as per the agreement",
          "D": "The unit holder or lien holder as per the terms of issue of mutual fund units"
        },
        correctAnswer: "C"
      },
      {
        question: 'Q 22. Stamp duty is required to be paid for which of these mutual fund transactions? A. New purchases B. Systematic Investment Plan (SIP) C. Dividend reinvestment D. Systematic Transfer Plan (STP)',
        answers: {
          A: "A,B and D",
          B: "Only A",
          C: "B and D",
          D: "A,B,C and D"
        },
        correctAnswer: "C"
      },
      {
        question: "Q 23. Which of these statements are TRUE with respect to time stamping on mutual fund documents?",
        answers: {
          "A": "A and B are true",
          "B": "B and C are true",
          "C": "A and C are true",
          "D": "A, B and C are true"
        },
        correctAnswer: "B"
      },
      {
        question: "Q 24. Identify the true statement with respect to measuring returns for Mutual Fund schemes.",
        answers: {
          "A": "1 and 2",
          "B": "2 and 3",
          "C": "3 and 1",
          "D": "1, 2 and 3"
        },
        correctAnswer: "B"
      },
      {
        question: "Q 25. Mr. Suresh invests Rs 2,00,000 in a mutual fund with a face value of Rs 10 and NAV of Rs. 50. How many units will be allotted to him?",
        answers: {
          "A": "4000 units",
          "B": "20000 units",
          "C": "Will be lower than 4000 units due to entry load",
          "D": "Will be lower than 20000 units due to entry load"
        },
        correctAnswer: "A"
      },
      {
        question: "Q 26. What is the Total Expense Ratio for an Index fund or an ETF?",
        answers: {
          "A": "Total Expense Ratio shall not exceed 1.00 per cent of the daily net assets.",
          "B": "Total Expense Ratio shall not exceed 2.00 per cent of the daily net assets.",
          "C": "Total Expense Ratio shall not exceed 1.5 per cent of the daily net assets.",
          "D": "Total Expense Ratio shall not exceed 0.50 per cent of the daily net assets."
        },
        correctAnswer: "A"
      },
      {
        question: "Q 27. In which document is a commentary on the current state of economy and markets is also generally provided?",
        answers: {
          "A": "Statement of Additional Information (SAI)",
          "B": "Key Information Memorandum (KIM)",
          "C": "Fund Fact Sheet",
          "D": "Scheme Information Document (SID)"
        },
        correctAnswer: "C"
      },
      {
        question: "Q 28. Identify the duty of a SPONSOR of a mutual fund -",
        answers: {
          "A": "Guards the interest of the mutual fund unit holders",
          "B": "Contributes to the capital of the Asset Management Company",
          "C": "Looks after the day to day administration of the mutual fund",
          "D": "Regularly report to SEBI on the working of the fund"
        },
        correctAnswer: "B"
      },
    {
      question: "Q 29. _____ is not a fair selling practice by a mutual fund distributor.",
      answers: {
        "A": "Informing the investor of the various investment options",
        "B": "Carefully understanding the clients financial needs",
        "C": "Encouraging the churning of investments",
        "D": "Giving personalised after sales service"
      },
      correctAnswer: "C"
    },
    {
      question: "Q 30. The loss booked from a equity investment of 18 months can be set off against ________",
      answers: {
        "A": "Long term capital loss only",
        "B": "Long term capital gain only",
        "C": "Short term capital gain only",
        "D": "Short term capital gain or long term capital gain"
      },
      correctAnswer: "B"
    },
    {
      question: "Q 31. Investments have to be made only through authorized signatories for investments by _______ .",
      answers: {
        "A": "Institutional investors",
        "B": "Hindu Undivided Family (HUF)",
        "C": "Non Resident Indians (NRI)",
        "D": "High net worth individuals (HNI)"
      },
      correctAnswer: "A"
    },
    {
      question: "Q 32. Identify the TRUE statement with respect to 'Tracking Error'. A. Tracking error is calculated as the standard deviation of the excess returns generated by the fund B. While comparing different index funds, one should invest in a fund with high tracking error",
      answers: {
        A: "Only A is true",
        B: "Ony B is true",
        C: "Both A and B are true",

      },
      correctAnswer: "A"
    },
    {
      question: "Q 33. Mr. Sonu reads about the risk factors given in the offer document and invests in an equity mutual fund scheme. After a few days the stock market crashes and NAV of the equity fund goes down. What can Mr. Sonu do in such a situation?",
      answers: {
        "A": "He can appeal to SEBI and get a remedy",
        "B": "He can get a remedy from the AMC",
        "C": "He is not likely to get any remedy from the AMC",
        "D": "He is likely to get a remedy from the trustees of the AMC"
      },
      correctAnswer: "C"
    },
    {
      question: "Q 34. Identify the TRUE statement - A) The AMC is not liable for any losses suffered by the foreign portfolio investors due to adverse currency movements B) The AMC has to compensate to foreign portfolio investors for any losses suffered due to adverse currency movements ",
      answers: {
        A: "Only A",
        B: "Only B",
        C: "Both A and B",
      },
      correctAnswer: "A"
    },
    {
      question: "Q 35. Which document has the statutory information about the mutual fund or AMC, that is offering the scheme.",
      answers: {
        "A": "Scheme Information Document (SID)",
        "B": "Statement of Additional Information (SAI)",
        "C": "Red Herring Prospectus",
        "D": "Fund Fact Sheet"
      },
      correctAnswer: "B"
    },
    {
      question: "Q 36. The form for registering a change in the default bank account has to be signed _____ .",
      answers: {
        "A": "by the first holder only",
        "B": "by all the holders of the folio",
        "C": "according to the mode of holding of the folio",
        "D": "by all the holders of the bank account"
      },
      correctAnswer: "C"
    },
    {
      question: "Q 37. _______ risk arises because of difference in price movement of the derivative vis-a-vis that of the security being hedged.",
      answers: {
        "A": "Model Risk",
        "B": "Basis Risk",
        "C": "Market Liquidity Risk",
        "D": "Credit Risk"
      },
      correctAnswer: "B"
    },
    {
      question: "Q 38. To measure the fund managers’ performance, the difference between scheme’s actual return and its optimal return is calculated and this is known as _____ .",
      answers: {
        "A": "Alpha",
        "B": "Beta",
        "C": "Sharpe",
        "D": "Treynor"
      },
      correctAnswer: "A"
    },
    {
      question: "Q 39. Which of these is an advantage of Mutual Funds?",
      answers: {
        "A": "Portfolio Customization",
        "B": "Choice Overload",
        "C": "Control Over Costs",
        "D": "Economies of scale"
      },
      correctAnswer: "D"
    },
    {
      question: "Q 40. Identify the TRUE statement/s -\nRolling return are the average annualized returns calculated for alternate holding period\nHolding period returns (HPR) do not provide an accurate picture of returns of fund if its initial value is too high or low.",
      answers: {
        "A": "Rolling return are the average annualized returns calculated for alternate holding period",
        "B": "Holding period returns (HPR) do not provide an accurate picture of returns of fund if its initial value is too high or low.",
        "C": "Both 1 and 2",
        "D": "None of the above"
      },
      correctAnswer: "B"
    },
    {
      question: "Q 41. Ms. Janhvi invests Rs 2,00,000 in an equity fund. The face value of this scheme is Rs 10 and the NAV is Rs 40. The exit load is 1%. How many units will be allotted to Ms. Janhvi?",
      answers: {
        "A": "4950",
        "B": "5000",
        "C": "7474.66",
        "D": "20000"
      },
      correctAnswer: "B"
    },

    {
      question: "Q 42. Identify the FALSE statement/s. A) When dividend is declared on mutual fund units which are under a lien, this dividend can be paid either to the unit-holder or to the lender depending on the agreement between them. B) Mutual Fund units cannot be pledged by individual investors.",
      answers: {
        "A": "Only A is false",
        "B": "Only B is false",
        "C": "Both A and B are false",
        "D": "Neither A nor B are false"
      },
      correctAnswer: "B"
    },
    {
      question: "Q 43. Can an investor change his mutual fund distributor?",
      answers: {
        "A": "Yes, but a permission from AMFI and SEBI is needed for the same",
        "B": "Yes, but the investor has to give a written request to the fund house",
        "C": "Yes, but an upfront fees have to be paid to the existing distributor to cover up his loss of income",
        "D": "No, a change of distributor is not permitted by SEBI"
      },
      correctAnswer: "B"
    },
    {
      question: "Q 44. According to the AMFI's code of conduct for mutual fund intermediaries, if a second violation against the intermediary is proved, their registration will be ______ .",
      answers: {
        "A": "Suspended for 1 year",
        "B": "Suspended for 3 years",
        "C": "With held",
        "D": "Cancelled"
      },
      correctAnswer: "D"
    },
    {
      question: "Q 45. Identify the CORRECT statement with respect to a Fund Factsheet.",
      answers: {
        "A": "A Fund Factsheet has to be published only at the time of a New Fund Offer (NFO)",
        "B": "As per SEBI regulations, a Fund Factsheet has to be published on a monthly basis by the AMCs",
        "C": "A Fund Factsheet is published by AMCs on a voluntary basis",
        "D": "All mutual fund distributors have to mandatorily read the Fund Factsheet before recommending a scheme to their investors"
      },
      correctAnswer: "C"
    },
    {
      "question": "Q 46. The additional Total Expense Ratio (TER) charged has to be credited back to the Mutual Fund if the inflows from beyond the top 30 cities are redeemed within a period of 1 year from the date of investment. State whether True or False?",
      "answers": {
        "A": "True",
        "B": "False"
      },
      "correctAnswer": "A"
    },
    {
      "question": "Q 47. Identify the TRUE statement with respect to Trustees of mutual funds.",
      "answers": {
        "A": "The Trustees can legally change the Asset Management Company (AMC)",
        "B": "The Asset Management Company (AMC) appoints the Trustees",
        "C": "The Trustees appoint the Sponsors of the Asset Management Company (AMC)",
        "D": "The Trustees have to approve the appointment of the distributors of its mutual fund schemes"
      },
      "correctAnswer": "A"
    },
    {
      "question": "Q 48. ______ is NOT a function of AMFI.",
      "answers": {
        "A": "Representing the mutual fund industry to the Government, RBI etc.",
        "B": "Undertaking studies and research of the mutual fund industry",
        "C": "Undertaking investor awareness programs",
        "D": "Conducting certification exams for mutual fund distributors"
      },
      "correctAnswer": "D"
    },
    {
      "question": "Q 49. Identify the plan which could be used in lieu of income distribution cum capital withdrawal pay-outs?",
      "answers": {
        "A": "Systematic Withdrawal Plan",
        "B": "Systematic Transfer Plan",
        "C": "Systematic Investment Plan",
        "D": "None of the above"
      },
      "correctAnswer": "A"
    },
    {
      "question": "Q 50. The decision to Opt-out from transaction charges can be taken by distributors at each individual client level depending on his relationship with the client. State whether True or False?",
      "answers": {
        "A": "True",
        "B": "False"
      },
      "correctAnswer": "B"
    }
  ];

  // Simulate async fetch
  getQuestions(): Observable<Question[]> {
    return of(this.questions);
  }
}
