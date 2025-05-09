import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Question } from '../quiz2/question.model';

@Injectable({
  providedIn: 'root'
})
export class Quiz3Service {

  private questions: Question[] = [
    {
      question: "Q1. The additional Total Expense Ratio (TER) charged has to be credited back to the Mutual Fund in which of these situations?",
      answers: {
        A: "When the performance of the mutual fund declines as compared to previous year",
        B: "When the inflows from beyond the top 30 cities are redeemed within a period of 1 year from the date of investment.",
        C: "When the TER of the mutual fund exceeds the limit specified under the regulations",
        D: "All of the above"
      },
      correctAnswer: "B",
      explanation: "Mutual funds can charge additional TER if the new inflows are from beyond top 30 cities (subject to some conditions). However, the additional TER so charged shall be credited back to the scheme if the said inflows are redeemed within 1 year of the date of investment."
    },
    {
      question: "Q2. How will the AMC / R&T agent process an application for subscribing to mutual fund units if the ARN is wrongly mentioned in it?",
      answers: {
        A: "It will be processed as a direct plan application",
        B: "It will be rejected as incomplete application",
        C: "It will be considered as an incomplete application and sent back for completion",
        D: "It will be treated as a regular plan subject to the error being corrected in the required time frame"
      },
      correctAnswer: "D",
      explanation: "If the wrong ARN code is mentioned, the application is processed as a Regular Plan. The AMC will attempt to obtain the correct ARN within 30 days. If not corrected, it will be reprocessed as a Direct Plan without exit load."
    },
    {
      question: "Q3. _______ will help the investors understand the suitability of a mutual fund scheme to them.",
      answers: {
        A: "Product Label",
        B: "Standard Deviation / Beta",
        C: "Tracking Error",
        D: "Alpha of the scheme"
      },
      correctAnswer: "A",
      explanation: "Product Labels help investors understand the risk and suitability of mutual fund schemes by clearly indicating the risk level and nature of the investment."
    },
    {
      question: "Q4. Risk Profilers are used to ascertain the risk appetite of an investor. State whether True or False?",
      answers: {
        A: "True",
        B: "False"
      },
      correctAnswer: "A",
      explanation: "Risk Profilers are tools that help determine an investor’s willingness and capacity to take investment risks, guiding suitable product recommendations."
    },
    {
      question: "Q5. Trail commission is paid to a distributor in which of the following situations?",
      answers: {
        A: "As long as the investor stays invested in the mutual fund scheme",
        B: "When the investor invests into the mutual fund scheme",
        C: "When the investor exits the mutual fund scheme",
        D: "Trail Commission means no commission"
      },
      correctAnswer: "A",
      explanation: "Trail commission is calculated as a percentage of the net assets attributable to the units sold by the distributor. A mutual fund distributor is paid trail commission for as long as the investor’s money is held in the fund."
    },
    {
      question: "Q6. No investor can have a holding of more than 20 percent of a scheme - State True or False?",
      answers: {
        A: "True",
        B: "False"
      },
      correctAnswer: "B",
      explanation: "The scheme must have at least 20 investors, and no single investor shall account for more than 25% of the corpus of the scheme/plan."
    },
    {
      question: "Q7. In the case of a Sectoral Fund, the minimum investment in equity and equity related instruments of a particular sector of total assets should be _____ .",
      answers: {
        A: "65%",
        B: "70%",
        C: "80%",
        D: "95%"
      },
      correctAnswer: "C",
      explanation: "Sectoral fund is an open-ended equity scheme investing in a specific sector. A minimum of 80% of total assets must be invested in equity and equity-related instruments of that sector."
    },
    {
      question: "Q8. The ARN is allotted to the mutual fund distributors by ______ .",
      answers: {
        A: "SEBI",
        B: "NISM",
        C: "AMC",
        D: "AMFI"
      },
      correctAnswer: "D",
      explanation: "AMFI (Association of Mutual Funds in India) allots the ARN (AMFI Registration Number), which is mandatory for mutual fund distributors."
    },
    {
      question: "Q9. In order to ensure fairness to investors, _____ has prescribed cut-off timing to determine the applicable NAV.",
      answers: {
        A: "AMFI",
        B: "SEBI",
        C: "RBI",
        D: "Stock Exchange"
      },
      correctAnswer: "B",
      explanation: "SEBI has prescribed cut-off timings for mutual fund transactions to determine which day's NAV will be applicable, ensuring fairness to all investors."
    },
    {
      question: "Q 19. Identify the TRUE statement/s. 1. The market liquidity can get impacted due to market related events and company factors 2. There cannot be a price impact on mutual fund units due to liquidity demands due to redemption or portfolio rebalancing",
      answers: {
        A: "Only 1 is true",
        B: "Only 2 is true",
        C: "Both 1 and 2 are true",
        D: "Both 1 and 2 are false"
      },
      correctAnswer: "B",
      explanation: "The inheritance laws are applicable to the mutual fund unit-holder. A Power of Attorney holder cannot make a nomination."
    },
    {
      question: "Q11. The portfolio of a fund of funds consists of ______.",
      answers: {
        A: "Equity securities only",
        B: "Debt securities only",
        C: "Units of other mutual fund schemes",
        D: "Money market securities only"
      },
      correctAnswer: "C",
      explanation: "A ‘Fund Of Funds’ (FOF) is an investment strategy of holding a portfolio of other investment funds rather than investing directly in stocks, bonds or other securities. An FOF scheme primarily invests in the units of other Mutual Fund schemes."
    },
    {
      question: "Q12. _________ would not be an originator to a special purpose vehicle, in case of securitized asset.",
      answers: {
        A: "Reserve Bank of India (RBI)",
        B: "Non-banking finance company",
        C: "A Commercial Bank",
        D: "Housing finance company"
      },
      correctAnswer: "A",
      explanation: "A securitization transaction involves sale of receivables by the originator (a commercial bank, non-banking finance company, housing finance company, or a manufacturing/service company) to a Special Purpose Vehicle (SPV). RBI, being a regulator, cannot be an originator."
    },
    {
      question: "Q13. Identify the FALSE statement/s:\n1. A mutual fund investing across many countries will keep its benchmark index which is based on US equity markets.\n2. For Gold ETF, gold prices will be the ideal benchmark.",
      answers: {
        A: "Only 1 is false", // ✅ Correct
        B: "Only 2 is false",
        C: "Both 1 and 2 are false"
      },
      correctAnswer: "A",
      explanation: "Statement 1 is false because a fund investing across countries should use a blended or global benchmark index, not just one based on the US market. Statement 2 is true, as gold prices are an appropriate benchmark for a Gold ETF."
    },
    {
      question: "Q14. As per SEBI guidelines, dividends can be paid out of all the following **except**:",
      answers: {
        A: "Income accruals",
        B: "Realised gains from sale of investments",
        C: "Unrealised appreciation in value of investments" // ✅ Correct
      },
      correctAnswer: "C",
      explanation: "SEBI guidelines stipulate that dividends can only be paid from distributable reserves. These reserves include income accruals and realised gains from the sale of investments. However, unrealised gains (i.e., valuation gains from investments not yet sold) are not considered distributable and therefore cannot be used to pay dividends. Valuation losses, on the other hand, must be adjusted against profits."
    },
    {
      question: "Q15. When does an investor in mutual funds have to provide information under the Foreign Account Tax Compliance Act (FATCA)?",
      answers: {
        A: "When the investment is made through a foreign bank account",
        B: "When the investor's folio was a NRI account before change",
        C: "When the investor's place of birth is other than India", // ✅ Correct
        D: "When the investor is a resident of USA or UK only"
      },
      correctAnswer: "C",
      explanation: "For applicants (including guardians) whose place of birth, nationality, or tax residency is other than India, FATCA compliance requires them to submit additional information, irrespective of the current residency status."
    },
    {
      question: "Q16. Recency bias applies to ______ events.",
      answers: {
        A: "Only positive",
        B: "Only negative",
        C: "Both positive and negative" // ✅ Correct
      },
      correctAnswer: "C",
      explanation: "Recency bias is a behavioral bias where individuals give more importance to recent events, regardless of whether they are positive or negative, while ignoring the longer-term context."
    },
    {
      question: "Q17. As per SEBI guidelines, _________ is/are vested with the responsibility of developing indices as benchmark for debt mutual fund schemes.",
      answers: {
        A: "AMFI",
        B: "Research and rating agencies", // ✅ Correct
        C: "The mutual fund themselves",
        D: "The risk management department of the AMC's"
      },
      correctAnswer: "B",
      explanation: "As per SEBI guidelines, the benchmark for debt (and balanced schemes) should be developed by research and rating agencies recommended by AMFI. CRISIL, ICICI Securities, and NSE have developed such indices."
    },
    {
      question: "Q18. ______ is used to measure fund’s risk relative to market index.",
      answers: {
        A: "Tracking error",
        B: "Beta coefficient",
        C: "Income accruals",
        D: "Realised gains from sale of investments",
      },
      correctAnswer: "B",
      explanation: "As per the SEBI guidelines, the benchmark for debt (and balanced schemes) should be developed by research and rating agencies recommended by AMFI. CRISIL, ICICI Securities and NSE have developed various such indices."
    },
    {
      question: "Q19. Identify the TRUE statement/s.",
      answers: {
        A: "Only 1 is true", // ✅ Correct
        B: "Only 2 is true",
        C: "Both 1 and 2 are true",
        D: "Both 1 and 2 are false"
      },
      correctAnswer: "A",
      explanation: "Liquidity risk can arise due to market-related or company-specific events, which may impact market liquidity. However, it's incorrect to say there cannot be a price impact due to redemptions or rebalancing — such activities can indeed affect prices."
    },
    {
      question: "Q20. The AMC or its Trustees are not liable for any loss to Foreign Investors arising from adverse changes in foreign exchange rates. - State whether True or False?",
      answers: {
        A: "True", // ✅ Correct
        B: "False"
      },
      correctAnswer: "A",
      explanation: "True. Mutual fund offer documents state that neither the AMC nor the Trustees are liable for foreign exchange losses incurred by foreign investors. Such currency risk is borne by the investor."
    },
    {
      question: "Q21. The indices based on Government securities will be an appropriate benchmark for which type of funds?",
      answers: {
        A: "Credit Risk Funds",
        B: "Gilt Funds", // ✅ Correct
        C: "Money Market Funds",
        D: "Liquid Funds"
      },
      correctAnswer: "B",
      explanation: "Gilt Funds invest only in Government Securities. Therefore, benchmarks based on Government Securities are most suitable for these types of funds."
    },
    {
      question: "Q22. In case the units are pledged, the unit holder ______ .",
      answers: {
        A: "can sell the units after the lock-in period",
        B: "cannot sell the units", // ✅ Correct
        C: "cannot sell but can switch the units to another scheme",
        D: "cannot do additional purchase"
      },
      correctAnswer: "B",
      explanation: "Once units are pledged, the unit holder cannot redeem or switch them unless the pledgee (the lender) gives a written no-objection to release the pledge."
    }, 
    {
      question: "Q23. For which mutual fund distributors is a due diligence process mandated by SEBI?",
      answers: {
        A: "A mutual fund distributor who services more than 25 investors",
        B: "A mutual fund distributor who receives commission of over Rs. 50 Lakhs from a single mutual fund", // ✅ Correct
        C: "A mutual fund distributor who brings in investments of over Rs. 1 crore for a single mutual fund",
        D: "All of the above"
      },
      correctAnswer: "B",
      explanation: "SEBI mandates due diligence for distributors receiving over ₹50 lakh commission from a single mutual fund, having more than 20 locations, or ₹1 crore total commission industry-wide."
    },
    {
      question: "Q24. Identify the true statement(s): A) Individuals can register up to five bank accounts with a mutual fund B) A Non-Individual can register up to ten bank accounts with a mutual fund",
      answers: {
        A: "Only A is correct",
        B: "Only B is correct",
        C: "Both A and B are correct", // ✅ Correct
        D: "Both A and B are incorrect"
      },
      correctAnswer: "C",
      explanation: "Mutual funds allow individuals to register up to 5 bank accounts and non-individuals up to 10 to receive payouts like redemption and dividends."
    },
    {
      question: "Q25. Which amongst the following bias can lead to a concentrated portfolio?",
      answers: {
        A: "Familiarity Bias", // ✅ Correct
        B: "Herd Mentality",
        C: "Overconfidence Bias",
        D: "Recency Bias"
      },
      correctAnswer: "A",
      explanation: "Familiarity Bias leads investors to stick with known options, which reduces diversification and can result in a concentrated portfolio."
    },
    {
      question: "Q26. Identify the true statement(s) with respect to benchmark for Sector Funds. A) It’s ideal to benchmark a sector fund against an index representing the respective sector B) It’s advisable to benchmark a sector fund against a diversified fund",
      answers: {
        A: "Only A is true", // ✅ Correct
        B: "Only B is true",
        C: "Both A and B are true",
        D: "Both A and B are false"
      },
      correctAnswer: "A",
      explanation: "Sector funds should be benchmarked against indices of the same sector (e.g., Nifty Bank for banking sector funds)."
    },
    {
      question: "Q27. Which of these funds are suitable for investors who have a long-term investment horizon and are looking for growth?",
      answers: {
        A: "Income Funds",
        B: "Long Duration Funds",
        C: "Equity Funds", // ✅ Correct
        D: "Liquid Funds"
      },
      correctAnswer: "C",
      explanation: "Equity funds are growth-oriented and suitable for long-term goals despite short-term volatility."
    },
    {
      question: "Q28. Indicate which of these funds have the lowest to highest risk sequence? A) Liquid Fund B) Credit Risk Fund C) Corporate Bond Fund",
      answers: {
        A: "B - C - A",
        B: "C - A - B",
        C: "A - B - C",
        D: "A - C - B" // ✅ Correct
      },
      correctAnswer: "D",
      explanation: "Risk order: Liquid Fund < Corporate Bond Fund < Credit Risk Fund (which invests in lower-rated debt)."
    },
    {
      question: "Q29. Which of the following information about mutual fund distributors with multiple points of presence must be disclosed by the AMCs?",
      answers: {
        A: "Distributor-wise gross inflows and net inflows",
        B: "Average assets under management",
        C: "Total commission and expenses paid to distributors",
        D: "All A, B and C" // ✅ Correct
      },
      correctAnswer: "D",
      explanation: "SEBI requires detailed disclosures for large distributors on AMC websites, including commissions, inflows, and AUM."
    },
    {
      question: "Q30. With respect to the procedure for getting empanelled as a mutual fund distributor with an AMC, the applicant needs to sign a declaration for _______.",
      answers: {
        A: "Guarantee of adding a minimum of 5 investors every month",
        B: "Declaring the rebates given back to the investors",
        C: "Ensuring that all employees who are selling mutual funds will have more than one ARN code",
        D: "Commitment to abide by statutory codes, guidelines and circulars" // ✅ Correct
      },
      correctAnswer: "D",
      explanation: "To get empanelled, mutual fund distributors must declare they will follow all SEBI and statutory guidelines and circulars."
    },
    {
      question: "Q31. What is the investment objective of a mutual fund which seeks to grow in value over a period of time?",
      answers: {
        A: "Capital Adequacy",
        B: "Capital Appreciation", // ✅ Correct
        C: "Safety of Capital",
        D: "Regular Returns"
      },
      correctAnswer: "B",
      explanation: "Mutual funds with growth objectives typically seek capital appreciation over time, mostly through equity investments."
    },
    {
      question: "Q32. Which of these is a physical asset?",
      answers: {
        A: "Bank Deposits",
        B: "Units by Real Estate Investment Trusts",
        C: "Real Estate", // ✅ Correct
        D: "Shares in physical form"
      },
      correctAnswer: "C",
      explanation: "Real estate is a physical (tangible) asset. The others are classified as financial assets."
    },
    {
      question: "Q33. Which of these statement(s) is/are TRUE?\n1. There cannot be a price impact on mutual fund units due to portfolio rebalancing and/or liquidity demands on account of redemptions.\n2. Market liquidity of mutual fund units can get impacted on account of company/sector related events",
      answers: {
        A: "Only 1",
        B: "Only 2", // ✅ Correct
        C: "Both 1 and 2",
        D: "Neither 1 nor 2"
      },
      correctAnswer: "B",
      explanation: "Statement 1 is false as large redemptions can cause price impacts. Statement 2 is true—market liquidity can be impacted by sector-specific or company events."
    },
    {
      question: "Q34. How is the redemption transaction of a mutual fund priced?",
      answers: {
        A: "NAV plus exit load",
        B: "NAV minus exit load", // ✅ Correct
        C: "NAV plus entry load",
        D: "NAV minus entry load"
      },
      correctAnswer: "B",
      explanation: "Schemes are permitted to keep the repurchase price lower than the NAV. The difference between the NAV and repurchase price is called the 'exit load.' For example, if the NAV is ₹11 and an exit load of 1% applies, the repurchase price would be ₹10.89."
    },
    {
      question: "Q35. What is the Treynor Ratio of a mutual fund scheme if the scheme earns 7.5% return, the risk-free return is 6%, and the Beta is 0.62?",
      answers: {
        A: "4.77",
        B: "3.08",
        C: "1.92",
        D: "2.42", // ✅ Correct
      },
      correctAnswer: "D",
      explanation: "Treynor Ratio = (Return Earned - Risk-Free Return) / Beta = (7.5 - 6) / 0.62 = 1.5 / 0.62 = 2.42. The Treynor Ratio indicates the return earned per unit of market risk. Higher the ratio, better the scheme."
    },
    {
      question: "Q36. ________ is not a mutual fund distribution channel.",
      answers: {
        A: "Branches of Public sector banks",
        B: "Branches of Reserve Bank of India", // ✅ Correct
        C: "Branches of Private sector banks",
        D: "Branches of Foreign banks"
      },
      correctAnswer: "B",
      explanation: "The Reserve Bank of India (RBI) or its branches do not participate in the sales or distribution of mutual fund products. Other listed institutions may act as mutual fund distributors."
    },
    {
      question: "Q37. Which of these statement(s) is / are TRUE?\nA) The Asset Management Company (AMC) is not accountable for the procedures for detecting incorrect valuation\nB) It is mandatory for the AMC to disclose the valuation policy",
      answers: {
        A: "Only A is true",
        B: "Only B is true", // ✅ Correct
        C: "Both A and B are true",
        D: "Both A and B are false"
      },
      correctAnswer: "B",
      explanation: "AMCs are fully responsible for ensuring accurate valuation and NAV. They must also disclose their valuation policies publicly in their Statement of Additional Information and on their website for transparency."
    },
    {
      question: "Q38. What does financial goal setting involve?",
      answers: {
        A: "Determination of risk profile",
        B: "Estimating the amount required for a major life event", // ✅ Correct
        C: "Determining asset allocation"
      },
      correctAnswer: "B",
      explanation: "The first step in financial goal setting is identifying life events that require major funding—such as child education, marriage, or retirement. Asset allocation and risk profiling are steps that follow during the investment process."
    },
    {
      question: "Q39. A person wants to create a synthetic index. Guide him as to in which of these categories the weightage of equity index would be the lowest?",
      answers: {
        A: "Super aggressive hybrid fund",
        B: "Aggressive hybrid fund",
        C: "Conservative hybrid fund" // ✅ Correct
      },
      correctAnswer: "C",
      explanation: "In a CRISIL Conservative Hybrid Fund, the equity component is only 25%, and debt is 75%. In comparison, Aggressive Hybrid Funds have 75% equity, and Balanced Hybrid Funds have a 50:50 split."
    },
    {
      question: "Q40. Which of these statement(s) is/are TRUE?\nA) If the mutual fund units are held in demat form, they cannot be converted into physical form\nB) When a mutual fund is redeemed or when there is a dividend pay-out, the amount will be credited to the bank account linked to the demat account",
      answers: {
        A: "Only A is correct",
        B: "Only B is correct", // ✅ Correct
        C: "Both A and B are correct"
      },
      correctAnswer: "B",
      explanation: "Mutual fund investors can convert demat units back into physical form (re-materialization). Dividends and redemption proceeds are credited to the bank account linked to the demat account via electronic means such as NEFT or NACH."
    },
    {
      question: "Q41. How will an application to subscribe mutual fund units be treated if an AMFI Registration Number (ARN) is mentioned in the application form and the choice of Regular Plan is indicated?",
      answers: {
        A: "It will be treated as a regular plan application", // ✅ Correct
        B: "It will be treated as an incomplete application and rejected",
        C: "It will be treated as an incomplete application and returned for completion",
        D: "It will be treated as a direct plan application"
      },
      correctAnswer: "A",
      explanation: "If investment (purchase/repurchase) is routed through a distributor, then it is considered that one has chosen to invest in the Regular Plan. Mutual Fund distributors shall quote a valid ARN and EUIN in the client’s application / transaction feed, in order to place transactions in Regular Plan and receive commissions."
    },
    {
      question: "Q42. Calculate the Average Holding Period if the portfolio turnover ratio is 50 percent.",
      answers: {
        A: "50 months",
        B: "2 Years", // ✅ Correct
        C: "3.5 Years",
        D: "15 Years"
      },
      correctAnswer: "B",
      explanation: "Average Holding Period = 12 / (Portfolio Turnover Ratio). Here, 12 / 0.5 = 24 months = 2 years. A higher turnover means shorter holding periods."
    },
    {
      question: "Q43. Asset allocation means ____________.",
      answers: {
        A: "Distribution of funds between Fund Managers in a Mutual Fund",
        B: "Distribution of funds between various asset classes in a portfolio", // ✅ Correct
        C: "Allocating a portfolio to cash",
        D: "Allocating mutual funds to investors"
      },
      correctAnswer: "B",
      explanation: "Asset allocation refers to how an investor divides their investments among different asset classes such as equities, debt, and gold to match their financial goals and risk tolerance."
    },
    {
      question: "Q44. What is the NAV if the value of stocks in a Mutual Fund scheme is ₹100 crore, Bonds ₹10 crore, Money Market Instruments ₹25 crore, Dividend Accrued ₹3 crore, and Fees payable ₹5 crore? Number of outstanding units is 75 lakhs.",
      answers: {
        A: "173.33",
        B: "177.33", // ✅ Correct
        C: "184",
        D: "186.74"
      },
      correctAnswer: "B",
      explanation: "NAV = (100 + 10 + 25 + 3 - 5) / 75 = ₹133 crore / 75 lakhs = ₹177.33 per unit. This formula accounts for all portfolio assets minus liabilities, divided by total units."
    },
    {
      question: "Q45. Which entity processes the purchase and redemption transactions of investors of an open-ended fund?",
      answers: {
        A: "The Custodian",
        B: "The Broker / Mutual Fund Agent",
        C: "AMFI",
        D: "The R & T Agent" // ✅ Correct
      },
      correctAnswer: "D",
      explanation: "The Registrar and Transfer Agency (RTA) maintains investor records as well as allots or redeems units, processes purchase/redemption/switch requests, dividends, etc. It also generates the account statement that an investor receives."
    },
    {
      question: "Q 46. What is the regulatory requirement with respect to a change in the controlling interest in an AMC ?",
      answers: {
        A: "The unitholders have to be given the option to exit",  // ✅ Correct
        B: "A minimum of 50% of the unitholders have to approve the change in controlling interest",
        C: "The trustees have to give the unitholders the option to wind-up the scheme",
        D: "All of the above"
      },
      correctAnswer: "A",
      explanation: "A change in the control of the AMC directly or indirectly can be made only with the prior approval of the trustees and SEBI. A written communication about the change in the control of the AMC is sent to each unitholder and an advertisement is given. The unitholders are given the option to exit on the prevailing Net Asset Value (NAV) without any exit load within a time period not less than 30 calendar days from the date of communication."
    },
    {
      question: "Q47. The investment in equity and equity-related instruments is between _________ in a Balanced Hybrid Fund.",
      answers: {
        A: "Between 65 percent and 80 percent of total assets",
        B: "Between 50 percent and 75 percent of total assets",
        C: "Between 40 percent and 60 percent of total assets", // ✅ Correct
        D: "Between 10 percent and 25 percent of total assets"
      },
      correctAnswer: "C",
      explanation: "Balanced Hybrid Fund: An open-ended balanced scheme investing in both equity and debt. The investment in equity and equity-related instruments shall be between 40% and 60% of total assets, with the remainder in debt instruments."
    },
    {
      question: "Q48. Identify the FALSE statement/s.\nA) During redemption, the mutual fund distributor should guide the investor to redeem those schemes which have the highest exit load\nB) The best strategy in selecting a mutual fund scheme for investment is that based on its past performance",
      answers: {
        A: "Only A is false",
        B: "Only B is false",
        C: "Both A and B are false", // ✅ Correct
        D: "Neither A nor B are false"
      },
      correctAnswer: "C",
      explanation: "Both statements are false. Distributors should advise redemption from schemes with lower exit loads. Also, choosing a fund based only on past performance is risky, as past returns may not continue in the future."
    },
    {
      question: "Q49. The _______ is the promoter of a Mutual Fund.",
      answers: {
        A: "Trust",
        B: "AMC",
        C: "Sponsor", // ✅ Correct
        D: "Custodian"
      },
      correctAnswer: "C",
      explanation: "A Sponsor is the entity that sets up a mutual fund by creating a trust. The Sponsor promotes the mutual fund, while the AMC manages it, and a custodian holds the assets."
    },
    {
      question: "Q50. When an institutional investor is not allowed to invest in equity markets, the mutual fund distributor can sell _________ to such an investor.",
      answers: {
        A: "Corporate Bond Fund",
        B: "Equity Savings Fund", // ✅ Correct
        C: "Multi Asset Allocation Fund",
        D: "Arbitrage Fund"
      },
      correctAnswer: "B",
      explanation: "Equity Savings Funds offer partial equity exposure with significant debt allocation, making them suitable for institutional investors restricted from direct equity investments. These funds are managed by Indian mutual fund houses and can be accessed under specific regulatory frameworks."
    }
    
  ]

  // Simulate async fetch
  getQuestions(): Observable<Question[]> {
    return of(this.questions);
  }
}
