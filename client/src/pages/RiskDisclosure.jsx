// RiskDisclosure.jsx - Professional Financial Platform Style
import React, { useState, useEffect } from 'react';
import styles from './termsComponent.module.css';
import logo from '../assets/logos/logo.svg';

export default function RiskDisclosure() {
  const [activeSection, setActiveSection] = useState('1');
  const [lastUpdated] = useState('December 12, 2024');

  const sections = [
    { id: '1', title: 'Overview', number: '1' },
    { id: '2', title: 'Financial Risk Warning', number: '2' },
    { id: '3', title: 'Market Volatility Risks', number: '3' },
    { id: '4', title: 'Signal Accuracy Disclaimer', number: '4' },
    { id: '5', title: 'Past Performance Warning', number: '5' },
    { id: '6', title: 'Educational Purpose Only', number: '6' },
    { id: '7', title: 'No Financial Advice', number: '7' },
    { id: '8', title: 'Technical Risk Factors', number: '8' },
    { id: '9', title: 'Regulatory Considerations', number: '9' },
    { id: '10', title: 'User Responsibility', number: '10' },
    { id: '11', title: 'Risk Management', number: '11' },
    { id: '12', title: 'Contact Information', number: '12' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(`section-${section.id}`);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const goBack = () => {
    window.location.href = '/';
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <button onClick={goBack} className={styles.backButton}>
            Home
          </button>
          <div className={styles.headerTitle}>
            <img src={logo} alt="SafeRiskX" className={styles.logo} />
            <span>Risk Disclosure</span>
          </div>
          <div className={styles.updateInfo}>
            Updated {lastUpdated}
          </div>
        </div>
      </header>

      <div className={styles.layout}>
        <nav className={styles.sidebar}>
          <div className={styles.sidebarContent}>
            <h3 className={styles.navTitle}>Contents</h3>
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`${styles.navItem} ${activeSection === section.id ? styles.navActive : ''}`}
              >
                <span className={styles.navNumber}>{section.number}</span>
                <span className={styles.navText}>{section.title}</span>
              </button>
            ))}
          </div>
        </nav>

        <main className={styles.content}>
          <div className={styles.documentHeader}>
            <h1 className={styles.documentTitle}>Risk Disclosure Statement</h1>
            <p className={styles.documentSubtitle}>
              Important information about trading risks and financial disclosures for SafeRiskX platform.
            </p>
            <div className={styles.effectiveDate}>
              Effective: {lastUpdated}
            </div>
          </div>

          <div className={styles.riskBanner}>
            <div className={styles.riskIcon}>!</div>
            <div className={styles.riskContent}>
              <div className={styles.riskTitle}>Critical Risk Warning</div>
              <div className={styles.riskText}>
                Trading involves substantial risk of loss. Past performance does not guarantee future results. 
                Never invest money you cannot afford to lose entirely.
              </div>
            </div>
          </div>

          <div className={styles.sections}>
            
            <section id="section-1" className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>1.</span>
                Overview
              </h2>
              <div className={styles.sectionContent}>
                <div className={styles.criticalWarning}>
                  <div className={styles.warningHeader}>
                    <div className={styles.warningIcon}>!</div>
                    <div className={styles.warningTitle}>IMPORTANT WARNING</div>
                  </div>
                  <div className={styles.warningContent}>
                    <div className={styles.warningStatement}>
                      TRADING INVOLVES SUBSTANTIAL RISK OF LOSS
                    </div>
                    <div className={styles.warningStatement}>
                      NOT SUITABLE FOR ALL INVESTORS
                    </div>
                  </div>
                </div>
                <p>
                  This Risk Disclosure Statement is provided by Signal SafeRiskX ("we," "our," or "the Company") 
                  to inform you of the significant risks associated with trading financial instruments based on 
                  signals, analysis, or recommendations provided through our platform and services.
                </p>
                <p>
                  By accessing or using our services, you acknowledge that you have read, understood, and agree 
                  to be bound by this Risk Disclosure Statement. If you do not understand or agree with any 
                  part of this disclosure, you should not use our services.
                </p>
              </div>
            </section>

            <section id="section-2" className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>2.</span>
                Financial Risk Warning
              </h2>
              <div className={styles.sectionContent}>
                <div className={styles.noRefundAlert}>
                  <div className={styles.alertIcon}>!</div>
                  <div className={styles.alertContent}>
                    <div className={styles.alertTitle}>Substantial Risk of Loss</div>
                    <div className={styles.alertText}>
                      Trading financial instruments carries a high level of risk and may result in the loss of 
                      all or part of your investment. Losses can exceed your initial investment.
                    </div>
                  </div>
                </div>

                <div className={styles.riskGrid}>
                  <div className={styles.riskCard}>
                    <div className={styles.riskCardTitle}>Key Financial Risks</div>
                    <ul className={styles.riskList}>
                      <li>You may lose more than your initial investment</li>
                      <li>Market conditions can change rapidly and unpredictably</li>
                      <li>Past performance does not guarantee future results</li>
                      <li>Economic events can significantly impact market prices</li>
                      <li>Currency fluctuations may affect your investments</li>
                      <li>Liquidity risks may prevent you from closing positions</li>
                    </ul>
                  </div>
                  <div className={styles.riskCard}>
                    <div className={styles.riskCardTitle}>Important Reminder</div>
                    <ul className={styles.riskList}>
                      <li>Never invest money you cannot afford to lose</li>
                      <li>Consider your level of experience carefully</li>
                      <li>Evaluate your investment objectives</li>
                      <li>Seek independent financial advice</li>
                      <li>Understand all risks before trading</li>
                      <li>Monitor your positions regularly</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section id="section-3" className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>3.</span>
                Market Volatility Risks
              </h2>
              <div className={styles.sectionContent}>
                <p>
                  Financial markets, particularly cryptocurrency markets, are highly volatile and subject to 
                  rapid and significant price movements. This volatility can result in substantial gains or 
                  losses within short periods.
                </p>
                
                <div className={styles.serviceGrid}>
                  <div className={styles.serviceItem}>
                    <div className={styles.serviceIcon}>SENTIMENT</div>
                    <div className={styles.serviceText}>
                      <strong>Market Sentiment</strong><br/>
                      Investor emotions drive extreme movements
                    </div>
                  </div>
                  <div className={styles.serviceItem}>
                    <div className={styles.serviceIcon}>NEWS</div>
                    <div className={styles.serviceText}>
                      <strong>News & Events</strong><br/>
                      Breaking news causes sudden volatility
                    </div>
                  </div>
                  <div className={styles.serviceItem}>
                    <div className={styles.serviceIcon}>LIQUIDITY</div>
                    <div className={styles.serviceText}>
                      <strong>Liquidity Conditions</strong><br/>
                      Low liquidity amplifies price movements
                    </div>
                  </div>
                  <div className={styles.serviceItem}>
                    <div className={styles.serviceIcon}>TECHNICAL</div>
                    <div className={styles.serviceText}>
                      <strong>Technical Factors</strong><br/>
                      Algorithmic trading triggers cascades
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="section-4" className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>4.</span>
                Signal Accuracy Disclaimer
              </h2>
              <div className={styles.sectionContent}>
                <div className={styles.liabilityCard}>
                  <h3 className={styles.liabilityTitle}>No Guarantee of Accuracy</h3>
                  <p>
                    The trading signals, analysis, and recommendations provided by Signal SafeRiskX are based on 
                    technical analysis, market research, and algorithmic models. However, we make no representations 
                    or warranties regarding the accuracy, completeness, or reliability of any signals or information provided.
                  </p>
                  
                  <div className={styles.maxLiability}>
                    <strong>Signal Limitations:</strong> Market conditions can change faster than signals can be updated. 
                    No signal system can predict market movements with certainty.
                  </div>
                </div>

                <div className={styles.subsection}>
                  <h3 className={styles.subsectionTitle}>Understanding Signal Limitations</h3>
                  <ul className={styles.list}>
                    <li>Signals are based on historical data and technical analysis</li>
                    <li>External factors may invalidate signal predictions</li>
                    <li>Technical indicators may produce false signals</li>
                    <li>Signal performance may vary across different market conditions</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="section-5" className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>5.</span>
                Past Performance Warning
              </h2>
              <div className={styles.sectionContent}>
                <div className={styles.criticalWarning}>
                  <div className={styles.warningHeader}>
                    <div className={styles.warningIcon}>!</div>
                    <div className={styles.warningTitle}>Past Performance Disclaimer</div>
                  </div>
                  <div className={styles.warningContent}>
                    <div className={styles.warningStatement}>
                      PAST PERFORMANCE IS NOT INDICATIVE OF FUTURE RESULTS
                    </div>
                  </div>
                </div>

                <p>
                  Any historical performance data, backtesting results, or track records presented are 
                  for informational purposes only and should not be considered as an indication of future 
                  performance. Market conditions change, and strategies that were successful in the past 
                  may not be successful in the future.
                </p>

                <div className={styles.reasonsList}>
                  <div className={styles.reasonItem}>
                    <strong>Historical Limitations:</strong> Results may not reflect actual trading conditions
                  </div>
                  <div className={styles.reasonItem}>
                    <strong>Backtesting Issues:</strong> May not account for all market factors
                  </div>
                  <div className={styles.reasonItem}>
                    <strong>Market Changes:</strong> Cycles and trends change over time
                  </div>
                  <div className={styles.reasonItem}>
                    <strong>Economic Evolution:</strong> Conditions evolve and impact performance
                  </div>
                </div>
              </div>
            </section>

            <section id="section-6" className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>6.</span>
                Educational Purpose Only
              </h2>
              <div className={styles.sectionContent}>
                <p>
                  The content, signals, analysis, and information provided by Signal SafeRiskX are intended 
                  for educational and informational purposes only. Our services are designed to help users 
                  learn about trading concepts, market analysis, and risk management.
                </p>
                
                <div className={styles.gdprSection}>
                  <h3 className={styles.gdprTitle}>Educational Nature of Our Services</h3>
                  <div className={styles.rightsGrid}>
                    <div className={styles.rightAvailable}>
                      <strong>Learning Focus:</strong> Content provided for research purposes
                    </div>
                    <div className={styles.rightAvailable}>
                      <strong>Skill Development:</strong> Users encouraged to develop trading skills
                    </div>
                  </div>
                </div>

                <div className={styles.disclaimer}>
                  <strong>No Guarantee:</strong> No guarantee of educational effectiveness or learning outcomes. 
                  Information should be used to enhance your trading knowledge only.
                </div>
              </div>
            </section>

            <section id="section-7" className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>7.</span>
                No Financial Advice
              </h2>
              <div className={styles.sectionContent}>
                <div className={styles.noRefundAlert}>
                  <div className={styles.alertIcon}>X</div>
                  <div className={styles.alertContent}>
                    <div className={styles.alertTitle}>NOT FINANCIAL ADVICE</div>
                    <div className={styles.alertText}>
                      The information, signals, analysis, and content provided by Signal SafeRiskX do not constitute 
                      financial advice, investment advice, trading advice, or any other sort of advice.
                    </div>
                  </div>
                </div>

                <div className={styles.paymentInfo}>
                  <div className={styles.paymentItem}>
                    <strong>No Personalized Advice:</strong> Content is general, not tailored to individuals
                  </div>
                  <div className={styles.paymentItem}>
                    <strong>Not Licensed Advisors:</strong> We are not licensed financial advisors
                  </div>
                  <div className={styles.paymentItem}>
                    <strong>Your Responsibility:</strong> All trading decisions are entirely your own
                  </div>
                  <div className={styles.paymentItem}>
                    <strong>Professional Advice:</strong> Consult qualified financial professionals before trading
                  </div>
                </div>

                <div className={styles.importantNote}>
                  Before making any investment decisions, you should seek advice from independent financial 
                  advisors and consider your individual financial situation, objectives, and risk tolerance.
                </div>
              </div>
            </section>

            <section id="section-8" className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>8.</span>
                Technical Risk Factors
              </h2>
              <div className={styles.sectionContent}>
                <p>
                  Our platform relies on technology infrastructure that may be subject to various technical 
                  risks and limitations that could affect service availability and signal delivery.
                </p>

                <div className={styles.rulesGrid}>
                  <div className={styles.ruleCategory}>
                    <h3 className={styles.ruleCategoryTitle}>Platform Availability</h3>
                    <ul className={styles.rulesList}>
                      <li>Server downtime or maintenance periods</li>
                      <li>Internet connectivity issues</li>
                      <li>Third-party service disruptions</li>
                      <li>System updates and maintenance</li>
                    </ul>
                  </div>
                  <div className={styles.ruleCategory}>
                    <h3 className={styles.ruleCategoryTitle}>Data & Signal Delivery</h3>
                    <ul className={styles.rulesList}>
                      <li>Delays in signal transmission</li>
                      <li>Data feed interruptions</li>
                      <li>Communication platform limitations</li>
                      <li>Network latency issues</li>
                    </ul>
                  </div>
                  <div className={styles.ruleCategory}>
                    <h3 className={styles.ruleCategoryTitle}>Security Considerations</h3>
                    <ul className={styles.rulesList}>
                      <li>Cybersecurity threats</li>
                      <li>Account security responsibilities</li>
                      <li>Data protection measures</li>
                      <li>Access control systems</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section id="section-9" className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>9.</span>
                Regulatory Considerations
              </h2>
              <div className={styles.sectionContent}>
                <p>
                  Financial markets are subject to regulation by various authorities worldwide. Regulatory 
                  changes, enforcement actions, and compliance requirements may affect market conditions 
                  and trading activities.
                </p>

                <div className={styles.terminationGrid}>
                  <div className={styles.terminationType}>
                    <h3 className={styles.terminationTitle}>Regulatory Risks</h3>
                    <ul className={styles.terminationList}>
                      <li>Changes in financial regulations may restrict trading</li>
                      <li>Different jurisdictions have varying frameworks</li>
                      <li>Compliance requirements may change over time</li>
                      <li>Regulatory actions may impact market conditions</li>
                    </ul>
                  </div>
                  <div className={styles.terminationType}>
                    <h3 className={styles.terminationTitle}>Compliance Obligations</h3>
                    <ul className={styles.terminationList}>
                      <li>Tax implications vary by jurisdiction</li>
                      <li>Users must comply with local laws</li>
                      <li>Reporting requirements may apply</li>
                      <li>Legal advice may be necessary</li>
                    </ul>
                  </div>
                </div>

                <div className={styles.jurisdictionCard}>
                  <div className={styles.jurisdictionItem}>
                    <strong>Our Jurisdiction:</strong> Signal SafeRiskX operates under UK jurisdiction
                  </div>
                  <div className={styles.jurisdictionItem}>
                    <strong>Your Obligations:</strong> Ensure compliance with your local laws and regulations
                  </div>
                </div>
              </div>
            </section>

            <section id="section-10" className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>10.</span>
                User Responsibility
              </h2>
              <div className={styles.sectionContent}>
                <p>
                  As a user of Signal SafeRiskX services, you have specific responsibilities and obligations 
                  regarding your trading activities and use of our platform.
                </p>

                <div className={styles.dataGrid}>
                  <div className={styles.dataItem}>
                    <strong>Due Diligence:</strong> Conduct your own research and analysis before trading
                  </div>
                  <div className={styles.dataItem}>
                    <strong>Risk Assessment:</strong> Evaluate your risk tolerance and financial situation
                  </div>
                  <div className={styles.dataItem}>
                    <strong>Compliance:</strong> Ensure compliance with applicable laws in your jurisdiction
                  </div>
                  <div className={styles.dataItem}>
                    <strong>Account Security:</strong> Maintain security of your credentials and information
                  </div>
                </div>

                <div className={styles.enforcement}>
                  <strong>Key Responsibility:</strong> Only trade with money you can afford to lose entirely. 
                  Verify information from multiple sources and understand the markets you trade.
                </div>
              </div>
            </section>

            <section id="section-11" className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>11.</span>
                Risk Management
              </h2>
              <div className={styles.sectionContent}>
                <p>
                  Effective risk management is crucial for successful trading. While we provide educational 
                  content about risk management, implementing proper risk controls is your responsibility.
                </p>
                
                <div className={styles.serviceGrid}>
                  <div className={styles.serviceItem}>
                    <div className={styles.serviceIcon}>POSITION</div>
                    <div className={styles.serviceText}>
                      <strong>Position Sizing</strong><br/>
                      Never risk more than small percentage
                    </div>
                  </div>
                  <div className={styles.serviceItem}>
                    <div className={styles.serviceIcon}>STOPS</div>
                    <div className={styles.serviceText}>
                      <strong>Stop Losses</strong><br/>
                      Use stop-loss orders to limit losses
                    </div>
                  </div>
                  <div className={styles.serviceItem}>
                    <div className={styles.serviceIcon}>DIVERSE</div>
                    <div className={styles.serviceText}>
                      <strong>Diversification</strong><br/>
                      Spread risk across multiple assets
                    </div>
                  </div>
                  <div className={styles.serviceItem}>
                    <div className={styles.serviceIcon}>EMOTION</div>
                    <div className={styles.serviceText}>
                      <strong>Emotional Control</strong><br/>
                      Maintain discipline in decision-making
                    </div>
                  </div>
                </div>

                <div className={styles.terminationNote}>
                  <strong>Important:</strong> No risk management strategy can eliminate all risks or 
                  guarantee profits. Always be prepared for the possibility of losses and trade responsibly.
                </div>
              </div>
            </section>

            <section id="section-12" className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>12.</span>
                Contact Information
              </h2>
              <div className={styles.sectionContent}>
                <p>
                  If you have questions about this Risk Disclosure Statement or need clarification about 
                  the risks associated with our services, please contact us using the information below.
                </p>
                
                <div className={styles.companyCard}>
                  <div className={styles.companyRow}>
                    <span className={styles.companyLabel}>Legal Name</span>
                    <span className={styles.companyValue}>Signal SafeRiskX</span>
                  </div>
                  <div className={styles.companyRow}>
                    <span className={styles.companyLabel}>Address</span>
                    <span className={styles.companyValue}>
                      10 New Road<br/>
                      London WC97 5XD<br/>
                      United Kingdom
                    </span>
                  </div>
                  <div className={styles.companyRow}>
                    <span className={styles.companyLabel}>Response Time</span>
                    <span className={styles.companyValue}>24-48 hours during business days</span>
                  </div>
                </div>

                <div className={styles.contactGrid}>
                  <div className={styles.contactCard}>
                    <div className={styles.contactType}>Risk Questions</div>
                    <div className={styles.contactDetails}>
                      Contact through Discord<br/>
                      Response: 24-48 hours
                    </div>
                  </div>
                  <div className={styles.contactCard}>
                    <div className={styles.contactType}>Platform Support</div>
                    <div className={styles.contactDetails}>
                      Official contact form<br/>
                      Response: 24-48 hours
                    </div>
                  </div>
                </div>

                <div className={styles.importantNote}>
                  <strong>Final Reminder:</strong> Trading involves substantial risk of loss. This Risk 
                  Disclosure Statement should be read in conjunction with our Terms of Service and Privacy 
                  Policy. By using our services, you acknowledge that you understand and accept these risks.
                </div>
              </div>
            </section>

          </div>

          <footer className={styles.documentFooter}>
            <div className={styles.footerContent}>
              <div className={styles.footerText}>
                By using SafeRiskX, you acknowledge reading and agreeing to this Risk Disclosure Statement.
              </div>
              <div className={styles.footerMeta}>
                <span>Version 1.0</span>
                <span>•</span>
                <span>Effective {lastUpdated}</span>
                <span>•</span>
                <span>© 2025 Signal SafeRiskX</span>
              </div>
            </div>
          </footer>

        </main>
      </div>
    </div>
  );
}
