import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Question } from './question.model';

@Injectable({
  providedIn: 'root'
})
export class Quiz2Service {


  constructor() { }

  private questions: Question[] = [
    {
      question: 'Q 1. Unitholders have the right to inspect key document/s like ________ with respect to their mutual fund investments.',
      answers: {
        'A': 'Memorandum & Articles of Association',
        'B': 'RTA agreement',
        'C': 'Custodial Services Agreement',
        'D': 'All of the above'
      },
      correctAnswer: 'D'
    },
    {
      question: "Q 2. Once the mutual fund units are pledged, the unit holder/s _______ .",
      answers: {
        A: "Cannot sell the units",
        B: "Can sell the units bit after a period of 3 months",
        C: "Cannot sell the units but can switch the units to another scheme",
        D: "Cannot do additional purchase in the same account"
      },
      correctAnswer: "A"
    },
    {
      question: "Q 3. Among equity funds, Focused funds carry _______ risks as compared to diversified funds due to ______ .",
      answers: {
        A: "Lower ; highly concentrated portfolio",
        B: "Higher ; highly concentrated portfolio",
        C: "Lower ; lower expenses of the fund",
        D: "Higher ; investments in debt securities"
      },
      correctAnswer: "B"
    },
    {
      question: "Q 4. Which of the following function can an Asset Management Company (AMC) do in-house?",
      answers: {
        A: "Custodial Services",
        B: "Broking",
        C: "Registrar and Transfer Agent"
      },
      correctAnswer: "C"
    },
    {
      question: "Q 5. Which debt schemes of mutual funds invest only in debt securities where moneys will be repaid within 91 days?",
      answers: {
        A: "Money Market Funds",
        B: "Medium term debt funds",
        C: "Fixed Maturity Plans",
        D: "Liquid Funds"
      },
      correctAnswer: "D"
    },
    {
      question: "Q 6. Which exam has to be cleared to get the Employee Unique Identification Number (EUIN) from AMFI?",
      answers: {
        A: "SEBI - VA Mutual Fund Distributors Certification Examination",
        B: "AMFI - VA Mutual Fund Distributors Certification Examination",
        C: "NISM - VA Mutual Fund Distributors Certification Examination",
        D: "NISM - VB Mutual Fund Distributors Certification Foundation"
      },
      correctAnswer: "C"
    },
    {
      question: "Q 7. Who manages the contributions from investors and takes investment decisions in a mutual fund company?",
      answers: {
        A: "The Investors",
        B: "The Trustees",
        C: "The Asset Management Company (AMC)",
        D: "The Sponsors"
      },
      correctAnswer: "C"
    },
    {
      question: "Q 8. Identify which among the following is the first step in the sequence of creating a mutual fund product?",
      answers: {
        A: "Launching the New Fund Offer (NFO)",
        B: "Filing of Scheme Information Document (SID) with SEBI for observation",
        C: "Launch of advertising and public relations campaigns by AMC",
        D: "Approval of Trustees and AMC board for the new product and drafting of SID"
      },
      correctAnswer: "D"
    },
    {
      question: "Q 9. The investment objective of a/an ______ is to seek capital appreciation.",
      answers: {
        A: "Growth Fund",
        B: "Income Fund",
        C: "Arbitrage Fund",
        D: "Liquid Fund"
      },
      correctAnswer: "A"
    },
    {
      question: "Q 10. Which of these are considered as Institutional group of investors?",
      answers: {
        A: "Non-Resident Indians (NRIs)",
        B: "Hindu Undivided Families (HUFs)",
        C: "High Networth Individuals (HNIs)",
        D: "Companies"
      },
      correctAnswer: "D"
    },
    {
      question: "Q 11. For a VALUE FUND, the minimum investment in equity and equity related instruments is 50% of the total assets. State whether True or False?",
      answers: {
        A: "True",
        B: "False"
      },
      correctAnswer: "B"
    },
    {
      question: "Q 12. Mr. Amit want to invest in a mutual fund scheme. He has to give the request for purchase specifying the _____ .",
      answers: {
        A: "Units he wants",
        B: "Amount he wants to invest",
        C: "Lots he wants"
      },
      correctAnswer: "B"
    },
    {
      question: "Q 13. Which of the following is true for unclaimed dividend in mutual fund schemes?",
      answers: {
        A: "Asset Management Company is expected to make a continuous effort to remind the investors to claim their dues",
        B: "The responsibility for ensuring that the dues are claimed lies with the distributor in a dividend plan",
        C: "The responsibility for ensuring that the dues are claimed lies solely with the investor"
      },
      correctAnswer: "A"
    },
    {
      question: "Q 14. When a mutual fund distributor empanels with an AMC, he/she has to sign a declaration for ______ .",
      answers: {
        A: "Declaring the rebates given back to the investors",
        B: "Ensuring that all employees who are selling mutual funds will have more than one ARN code",
        C: "Guarantee of adding a minimum of 25 investors every month",
        D: "Commitment to abide by statutory codes, guidelines and circulars"
      },
      correctAnswer: "D"
    },
    {
      question: "Q 15. In the Mutual Fund industry - every AMC gives an ARN code number to the mutual fund distributor which is to be renewed every three years - True or False?",
      answers: {
        A: "True - this is as per SEBI rules",
        B: "False - AMFI issues the ARN code number."
      },
      correctAnswer: "B"
    },
    {
      question: "Q 16. Which of the following have the highest credit risk?",
      answers: {
        A: "Money Market Fund",
        B: "Junk Bonds",
        C: "G-Sec Fund",
        D: "Income Fund"
      },
      correctAnswer: "B"
    },
    {
      question: "Q 17. Which information has to be included in the mutual fund application form when a Non-Resident Indian (NRI) subscribes for the units?",
      answers: {
        A: "Passport details",
        B: "Countries of residence in the past one year",
        C: "Details of investments made in the last one year",
        D: "Current overseas address"
      },
      correctAnswer: "D"
    },
    {
      question: "Q 18. In which of the following cases can Goods and Service Tax (GST) be charged to the mutual fund scheme over and above the Total Expense Ratio of the scheme?",
      answers: {
        A: "GST applicable on AMC fees only can be charged to the scheme over and above the Total Expense Ratio",
        B: "GST applicable on any fees must be within the Total Expense Ratio",
        C: "GST applicable on distributor commission only can be charged to the scheme over and above the Total Expense Ratio",
        D: "GST applicable on AMC fees as well as distributor commission can be charged to the scheme over and above the Total Expense Ratio"
      },
      correctAnswer: "A"
    },
    {
      question: "Q 19. Identify the false statement/s:\nA. While evaluating the mutual fund schemes, the expense ratio matters more in debt funds than equity funds\nB. An Ultra-short term debt fund has to mandatorily invest in high credit quality debt securities",
      answers: {
        A: "Only A is false",
        B: "Only B is false",
        C: "Both A and B are false"
      },
      correctAnswer: "B"
    },
    {
      question: "Q 20. Which of these statement/s is/are TRUE?\n1. Mutual Funds offer various options like Growth, Income distribution cum capital withdrawal / Reinvestment etc. as different investors have different preferences on how profits are to be handled\n2. Interval funds offer better liquidity to investors as compared to Close-Ended mutual fund",
      answers: {
        A: "Only 1 is True",
        B: "Only 2 is True",
        C: "Both 1 and 2 are true"
      },
      correctAnswer: "C"
    },
    {
      question: "Q 21. Identify the true statement with respect to Total Expense Ratio?",
      answers: {
        A: "The AMC is not allowed to change the Total Expense Ratio of a scheme during its entire lifetime",
        B: "The AMC can change the Total Expense Ratio and it need not be communicated to the unit holders as it's an internal matter",
        C: "The AMC can change the Total Expense Ratio and it has to be communicated to all the unit holders",
        D: "There is no term as - Total Expense Ratio for a mutual fund scheme"
      },
      correctAnswer: "C"
    },
    {
      question: "Q 22. Identify the true statement(s):\nA) Beta is a measure of risk only for equity schemes\nB) Variance is a measure of risk for both debt and equity schemes\nC) A fall in prices of the debt securities due to default etc is known as a 'credit event'",
      answers: {
        A: "Only A and B are true",
        B: "Only A and C are true",
        C: "Only B and C are true",
        D: "All A, B and C are true"
      },
      correctAnswer: "D"
    },
    {
      question: "Q 23. If a person has to trade in units of a closed-ended mutual fund on the stock exchange platform then the units have to be held in _______.",
      answers: {
        A: "Dematerialized form",
        B: "Physical form"
      },
      correctAnswer: "A"
    },
    {
      question: "Q 24. Which of these is an important criteria for choosing either Growth option or Dividend option in the same mutual fund scheme?",
      answers: {
        A: "Returns on the scheme",
        B: "Fund Manager",
        C: "Tax status of the investor",
        D: "Assets Managed by the scheme"
      },
      correctAnswer: "C"
    },
    {
      question: "Q 25. A mutual fund scheme can invest _____ of its net assets in the equity instruments of a single company",
      answers: {
        A: "5%",
        B: "10%",
        C: "15%",
        D: "25%"
      },
      correctAnswer: "B"
    },
    {
      question: "Q 26. If an investor claims his unclaimed redemption amount after 3 years then the payment will be based on the ________.",
      answers: {
        A: "Average of the NAVs i.e. current NAV and NAV at the time of original redemption",
        B: "Current NAV",
        C: "NAV at the end of three years",
        D: "NAV at the time of original redemption"
      },
      correctAnswer: "C"
    },
    {
      question: "Q 27. Identify the TRUE statement(s):\na) In an Assured Return scheme, if the scheme is not able to pay the assured return amount then the guarantor has to pay the same\nb) Investor returns might vary from the scheme returns on account of choices regarding investment schedule\nc) The returns published in a mutual fund advertisement factor the entry or exit load, as may be applicable.",
      answers: {
        A: "'b' and 'c' are true",
        B: "'a' and 'c' are true",
        C: "'a' and 'b' are true",
        D: "All 'a', 'b' and 'c' are true"
      },
      correctAnswer: "C"
    },
    {
      question: "Q 28. The choice of benchmark for a Debt Scheme could be chosen on the basis of : 1. Scheme Size 2. Scheme Type 3. Investment Universe",
      answers: {
        A: "Both 1 and 2",
        B: "Both 2 and 3",
        C: "Both 1 and 3",
        D: "All 1, 2 and 3"
      },
      correctAnswer: "B"
    },
    {
      question: "Q 29. Identify the TRUE statement:\nA) While calculating scheme returns for an investor, if there is an entry load, then the initial value of the Net Asset Value (NAV) is taken as NAV plus Entry Load\nB) While calculating scheme returns for an investor, if there is an exit load, then the later value of the Net Asset Value (NAV) is taken as NAV plus Exit Load",
      answers: {
        A: "Only A",
        B: "Only B",
        C: "Both A and B"
      },
      correctAnswer: "A"
    },
    {
      question: "Q 30. Asset allocation must primarily match ________.",
      answers: {
        A: "Long term value creation",
        B: "Investment needs",
        C: "Financial goals",
        D: "Tax saving needs"
      },
      correctAnswer: "B"
    },

    {
      question: "Q 31. If there is a breach of the Code of Conduct by an intermediary and a second violation by the intermediary is proved then the registration of the intermediary is _______.",
      answers: {
        A: "Not renewed",
        B: "Cancelled",
        C: "Suspended",
        D: "Withheld"
      },
      correctAnswer: "B"
    },
    {
      question: "Q 32. What is the maximum number of joint holders allowed per mutual fund application?",
      answers: {
        A: "3",
        B: "4",
        C: "5",
        D: "6"
      },
      correctAnswer: "A"
    },
    {
      question: "Q 33. Which transaction of an open ended fund is based on the Net Asset Value (NAV) pricing?",
      answers: {
        A: "Purchase of units",
        B: "Redemption of units",
        C: "Both purchase and redemption of units"
      },
      correctAnswer: "C"
    },
    {
      question: "Q 34. The minimum investment limit in equity/equity related instruments of large cap companies for a Large Cap mutual fund scheme is ______ of total assets.",
      answers: {
        A: "70%",
        B: "80%",
        C: "85%",
        D: "90%"
      },
      correctAnswer: "B"
    },
    {
      question: "Q 35. As per SEBI regulations, a mutual fund scheme should have at least ________ investors.",
      answers: {
        A: "10",
        B: "15",
        C: "20",
        D: "25"
      },
      correctAnswer: "C"
    },
    {
      question: "Q 36. Which of these is NOT included in the Key Information Memorandum (KIM)?",
      answers: {
        A: "Dates of Issue Opening, Issue Closing and Re-opening",
        B: "Investment Objective",
        C: "Risk profile of the scheme",
        D: "Functions of the sponsor, trustee and AMC"
      },
      correctAnswer: "D"
    },
    {
      question: "Q 37. Decisions in Tactical Asset Allocation are taken on the basis of _____ .",
      answers: {
        A: "likely behaviour of the markets",
        B: "risk profile of the investor",
        C: "income level of the investor",
        D: "All of the above"
      },
      correctAnswer: "A"
    },
    {
      question: "Q 38. The expenses on ________ cannot be charged to the mutual fund scheme.",
      answers: {
        A: "Custodian fees",
        B: "Depreciation on fixed assets of the Asset Management Company",
        C: "Trustee Fees",
        D: "Marketing Expenses"
      },
      correctAnswer: "B"
    },
    {
      question: "Q 39. What is the role of the custodian of a mutual fund?",
      answers: {
        A: "To issue statement of funds holding to the investors",
        B: "To execute the buy and sell orders in the stock market",
        C: "To keep the safe custody of the securities of the mutual fund scheme",
        D: "To issue account statements to the Mutual Fund unit holders"
      },
      correctAnswer: "C"
    },
    {
      question: "Q 40. What is the investment range for the mutual fund house to invest in debt instruments for a Balanced Hybrid Fund?",
      answers: {
        A: "20 percent and 40 percent",
        B: "40 percent and 60 percent",
        C: "10 percent and 30 percent",
        D: "20 percent and 50 percent"
      },
      correctAnswer: "B"
    },
    {
      question: "Q 41. While giving the mutual fund units for re-purchase, the distributor should consider the impact of Capital Gains Tax and ______ on the investor's portfolio.",
      answers: {
        A: "Beta",
        B: "Entry Load",
        C: "Exit Load",
        D: "Sharpe Ratio"
      },
      correctAnswer: "C"
    },
    {
      question: "Q 42. As per the fair valuation principles laid out by SEBI, it is mandatory to disclose the valuation policy in ______.",
      answers: {
        A: "Statement of Additional Information",
        B: "Statement of Accounts sent to investors periodically",
        C: "Fund fact sheet",
        D: "The fair valuation principles are not to be put in public"
      },
      correctAnswer: "A"
    },
    {
      question: "Q 43. The Market Value of a scheme is Rs 579 crores. Dividend accrued but not received is Rs 18 crore. The Expenses payable are Rs 3 crore. The total number of outstanding units is 300 lakhs. What is the NAV of the scheme?",
      answers: {
        A: "188",
        B: "198",
        C: "208",
        D: "218"
      },
      correctAnswer: "B"
    },
    {
      question: "Q 44. Identify the FALSE statement:\n1. The investor does not have to bear a tax on the capital gains as the re-purchase of units is done by the mutual fund\n2. Capital gains will be considered as Long term capital gain in case of debt funds only if the holding period is more than 3 years",
      answers: {
        A: "Both 1 and 2 is false",
        B: "Only 1 is false",
        C: "Only 2 is false"
      },
      correctAnswer: "A"
    },
    {
      question: "Q 45. A mutual fund scheme shall not invest more than 10 percent of its total NAV in debt instruments. This rule is not applicable for which type of debt instrument?",
      answers: {
        A: "Triparty repo on Government securities",
        B: "Treasury Bills",
        C: "Government Securities",
        D: "All of the above"
      },
      correctAnswer: "D"
    },
    {
      question: "Q 46. Identify the transactions on which Securities Transaction Tax (STT) is applicable",
      answers: {
        A: "Purchase transactions of debt mutual funds",
        B: "Purchase transactions of equity mutual funds",
        C: "Redemption transactions of debt mutual funds",
        D: "Redemption transactions of equity mutual funds"
      },
      correctAnswer: "D"
    },
    {
      question: "Q 47. Gold prices are used as benchmark for ________ .",
      answers: {
        A: "Gold Savings Fund",
        B: "Gilt Funds",
        C: "Gold Mining Companies fund",
        D: "All of the above"
      },
      correctAnswer: "A"
    },
    {
      question: "Q 48. The NAV which is applicable for processing an investor transaction depends on whether the transaction is received within the _________ .",
      answers: {
        A: "Asset Management Company's office timings",
        B: "R&T Agents office timings",
        C: "Stock Markets timing",
        D: "Cut-off time for the scheme"
      },
      correctAnswer: "D"
    },
    {
      question: "Q 49. Identify the TRUE statement/s with respect to Addendum.",
      answers: {
        A: "An Addendum must accompany the KIM",
        B: "Addendum is considered to be a part of the Scheme Related Documents",
        C: "Both of the above are true",
        D: "None of the above are true"
      },
      correctAnswer: "C"
    },
    {
      question: "Q 50. Identify which of these are Non-Financial transactions? A) Transmission B) Nomination C) Pledge D) Switch",
      answers: {
        A: "Transmission, Nomination, Switch",
        B: "Transmission, Nomination, Pledge",
        C: "Transmission, Pledge, Switch",
        D: "Nomination, Pledge, Switch"
      },
      correctAnswer: "B"
    }
  ]

  // Simulate async fetch
  getQuestions(): Observable<Question[]> {
    return of(this.questions);
  }

}
