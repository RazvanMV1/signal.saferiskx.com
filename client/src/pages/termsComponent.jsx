// Terms.jsx - Professional Financial Platform Style
import React, { useState, useEffect } from 'react';
import styles from './termsComponent.module.css';
import logo from '../assets/logos/logo.svg';

export default function Terms() {
  const [activeSection, setActiveSection] = useState('1');
  const [lastUpdated] = useState('December 12, 2024');

  const sections = [
    { id: '1', title: 'Acceptance of Terms', number: '1' },
    { id: '2', title: 'Company Information', number: '2' },
    { id: '3', title: 'Services Description', number: '3' },
    { id: '4', title: 'Subscription & Payment', number: '4' },
    { id: '5', title: 'No Refund Policy', number: '5' },
    { id: '6', title: 'Trading Risks & Disclaimers', number: '6' },
    { id: '7', title: 'Limitation of Liability', number: '7' },
    { id: '8', title: 'Data Collection & Privacy', number: '8' },
    { id: '9', title: 'Discord Community Rules', number: '9' },
    { id: '10', title: 'Account Termination', number: '10' },
    { id: '11', title: 'Governing Law', number: '11' },
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
            <span>Terms of Service</span>
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
            <h1 className={styles.documentTitle}>Terms of Service</h1>
            <p className={styles.documentSubtitle}>
              These terms govern your use of SafeRiskX services. Please read them carefully.
            </p>
            <div className={styles.effectiveDate}>
              Effective: {lastUpdated}
            </div>
          </div>

          <div className={styles.riskBanner}>
            <div className={styles.riskIcon}>!</div>
            <div className={styles.riskContent}>
              <div className={styles.riskTitle}>Risk Warning</div>
              <div className={styles.riskText}>
                Trading involves substantial risk of loss. This service does not guarantee financial success. 
                All investments may result in total loss of capital.
              </div>
            </div>
          </div>

          <div className={styles.sections}>
            
            <section id="section-1" className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>1.</span>
                Acceptance of Terms
              </h2>
              <div className={styles.sectionContent}>
                <p>By accessing SafeRiskX ("Service"), you agree to these terms. If you disagree, discontinue use immediately.</p>
                
                <div className={styles.subsection}>
                  <h3 className={styles.subsectionTitle}>Eligibility Requirements</h3>
                  <ul className={styles.list}>
                    <li>You must be at least 18 years old</li>
                    <li>You must have legal capacity to enter contracts</li>
                    <li>You must comply with applicable laws in your jurisdiction</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="section-2" className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>2.</span>
                Company Information
              </h2>
              <div className={styles.sectionContent}>
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
                    <span className={styles.companyLabel}>Service Type</span>
                    <span className={styles.companyValue}>Educational Trading Platform</span>
                  </div>
                </div>
              </div>
            </section>

            <section id="section-3" className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>3.</span>
                Services Description
              </h2>
              <div className={styles.sectionContent}>
                <p>SafeRiskX provides educational trading content through Discord community access.</p>
                
                <div className={styles.serviceGrid}>
                  <div className={styles.serviceItem}>
                    <div className={styles.serviceIcon}>SIGNALS</div>
                    <div className={styles.serviceText}>
                      <strong>Daily Signals</strong><br/>
                      Educational trading analysis
                    </div>
                  </div>
                  <div className={styles.serviceItem}>
                    <div className={styles.serviceIcon}>DISCORD</div>
                    <div className={styles.serviceText}>
                      <strong>Discord Community</strong><br/>
                      Exclusive member access
                    </div>
                  </div>
                  <div className={styles.serviceItem}>
                    <div className={styles.serviceIcon}>EDUCATION</div>
                    <div className={styles.serviceText}>
                      <strong>Educational Content</strong><br/>
                      Risk management resources
                    </div>
                  </div>
                </div>

                <div className={styles.disclaimer}>
                  <strong>Educational Purpose Only:</strong> All content is for educational purposes and does not constitute financial advice.
                </div>
              </div>
            </section>

            <section id="section-4" className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>4.</span>
                Subscription & Payment
              </h2>
              <div className={styles.sectionContent}>
                <div className={styles.paymentInfo}>
                  <div className={styles.paymentItem}>
                    <strong>Billing:</strong> Monthly recurring subscription
                  </div>
                  <div className={styles.paymentItem}>
                    <strong>Payment:</strong> Processed securely via Stripe
                  </div>
                  <div className={styles.paymentItem}>
                    <strong>Access:</strong> Immediate Discord integration via OAuth
                  </div>
                  <div className={styles.paymentItem}>
                    <strong>Trial:</strong> No free trial available
                  </div>
                </div>

                <div className={styles.importantNote}>
                  By subscribing, you authorize recurring charges until cancellation.
                </div>
              </div>
            </section>

            <section id="section-5" className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>5.</span>
                No Refund Policy
              </h2>
              <div className={styles.sectionContent}>
                <div className={styles.noRefundAlert}>
                  <div className={styles.alertIcon}>X</div>
                  <div className={styles.alertContent}>
                    <div className={styles.alertTitle}>No Refunds Policy</div>
                    <div className={styles.alertText}>
                      All payments are final. No refunds under any circumstances due to immediate content access and operational costs.
                    </div>
                  </div>
                </div>

                <div className={styles.reasonsList}>
                  <div className={styles.reasonItem}>
                    <strong>Immediate Access:</strong> Exclusive content provided instantly
                  </div>
                  <div className={styles.reasonItem}>
                    <strong>Operational Costs:</strong> Daily expenses incurred from service start
                  </div>
                  <div className={styles.reasonItem}>
                    <strong>Educational Nature:</strong> Knowledge cannot be "returned"
                  </div>
                </div>
              </div>
            </section>

            <section id="section-6" className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>6.</span>
                Trading Risks & Disclaimers
              </h2>
              <div className={styles.sectionContent}>
                <div className={styles.criticalWarning}>
                  <div className={styles.warningHeader}>
                    <div className={styles.warningIcon}>!</div>
                    <div className={styles.warningTitle}>Critical Risk Disclosure</div>
                  </div>
                  <div className={styles.warningContent}>
                    <div className={styles.warningStatement}>
                      THIS SERVICE DOES NOT GUARANTEE FINANCIAL SUCCESS
                    </div>
                    <div className={styles.warningStatement}>
                      ALL TRADING INVOLVES SUBSTANTIAL RISK
                    </div>
                  </div>
                </div>

                <div className={styles.riskGrid}>
                  <div className={styles.riskCard}>
                    <div className={styles.riskCardTitle}>Financial Risks</div>
                    <ul className={styles.riskList}>
                      <li>Total loss of invested capital</li>
                      <li>No guaranteed returns</li>
                      <li>Market volatility impact</li>
                      <li>Leverage amplifies losses</li>
                    </ul>
                  </div>
                  <div className={styles.riskCard}>
                    <div className={styles.riskCardTitle}>Service Limitations</div>
                    <ul className={styles.riskList}>
                      <li>Educational content only</li>
                      <li>Not financial advice</li>
                      <li>No licensed advisors</li>
                      <li>Individual results vary</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section id="section-7" className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>7.</span>
                Limitation of Liability
              </h2>
              <div className={styles.sectionContent}>
                <div className={styles.liabilityCard}>
                  <h3 className={styles.liabilityTitle}>Complete Liability Limitation</h3>
                  <p>SafeRiskX is NOT liable for:</p>
                  <ul className={styles.liabilityList}>
                    <li>Trading losses or financial damages</li>
                    <li>Investment decisions based on content</li>
                    <li>Technical issues or service interruptions</li>
                    <li>Third-party platform problems</li>
                  </ul>
                  
                  <div className={styles.maxLiability}>
                    <strong>Maximum Liability:</strong> Limited to subscription fees paid in preceding 12 months
                  </div>
                </div>
              </div>
            </section>

            <section id="section-8" className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>8.</span>
                Data Collection & Privacy
              </h2>
              <div className={styles.sectionContent}>
                <div className={styles.dataSection}>
                  <h3 className={styles.dataTitle}>Data We Collect</h3>
                  <div className={styles.dataGrid}>
                    <div className={styles.dataItem}>
                      <strong>Account Data:</strong> Name, email, encrypted password
                    </div>
                    <div className={styles.dataItem}>
                      <strong>Technical Data:</strong> Login cookies, session information
                    </div>
                    <div className={styles.dataItem}>
                      <strong>Usage Data:</strong> Platform interaction analytics
                    </div>
                  </div>
                </div>

                <div className={styles.gdprSection}>
                  <h3 className={styles.gdprTitle}>Your Rights (EU/GDPR)</h3>
                  <div className={styles.rightsGrid}>
                    <div className={styles.rightAvailable}>
                      <strong>Available:</strong> Data access, correction, portability
                    </div>
                    <div className={styles.rightLimited}>
                      <strong>Limited:</strong> Account deletion not available
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="section-9" className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>9.</span>
                Discord Community Rules
              </h2>
              <div className={styles.sectionContent}>
                <div className={styles.rulesGrid}>
                  <div className={styles.ruleCategory}>
                    <h3 className={styles.ruleCategoryTitle}>Required Conduct</h3>
                    <ul className={styles.rulesList}>
                      <li>Respect all members and staff</li>
                      <li>Follow Discord Terms of Service</li>
                      <li>No spam or off-topic content</li>
                      <li>Report issues to moderators</li>
                    </ul>
                  </div>
                  <div className={styles.ruleCategory}>
                    <h3 className={styles.ruleCategoryTitle}>Prohibited Actions</h3>
                    <ul className={styles.rulesList}>
                      <li>Sharing content outside community</li>
                      <li>Recording or screenshotting</li>
                      <li>Promoting competing services</li>
                      <li>Creating multiple accounts</li>
                    </ul>
                  </div>
                </div>

                <div className={styles.enforcement}>
                  <strong>Enforcement:</strong> Violations may result in warnings, suspension, or permanent ban without refund.
                </div>
              </div>
            </section>

            <section id="section-10" className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>10.</span>
                Account Termination
              </h2>
              <div className={styles.sectionContent}>
                <div className={styles.terminationGrid}>
                  <div className={styles.terminationType}>
                    <h3 className={styles.terminationTitle}>User Cancellation</h3>
                    <ul className={styles.terminationList}>
                      <li>Cancel anytime via account settings</li>
                      <li>No refunds for current period</li>
                      <li>Access continues until period end</li>
                      <li>Data retained for compliance</li>
                    </ul>
                  </div>
                  <div className={styles.terminationType}>
                    <h3 className={styles.terminationTitle}>Company Termination</h3>
                    <ul className={styles.terminationList}>
                      <li>Terms of Service violations</li>
                      <li>Fraudulent payment methods</li>
                      <li>Abuse of services or community</li>
                      <li>Legal or regulatory requirements</li>
                    </ul>
                  </div>
                </div>

                <div className={styles.terminationNote}>
                  <strong>Important:</strong> Account deletion is not available. Accounts remain for legal compliance.
                </div>
              </div>
            </section>

            <section id="section-11" className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>11.</span>
                Governing Law
              </h2>
              <div className={styles.sectionContent}>
                <div className={styles.jurisdictionCard}>
                  <div className={styles.jurisdictionItem}>
                    <strong>Governing Law:</strong> European Union and United Kingdom law
                  </div>
                  <div className={styles.jurisdictionItem}>
                    <strong>Disputes:</strong> EU/UK court jurisdiction
                  </div>
                  <div className={styles.jurisdictionItem}>
                    <strong>Resolution:</strong> Good faith negotiation preferred
                  </div>
                  <div className={styles.jurisdictionItem}>
                    <strong>Language:</strong> English for all proceedings
                  </div>
                </div>
              </div>
            </section>

            <section id="section-12" className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>12.</span>
                Contact Information
              </h2>
              <div className={styles.sectionContent}>
                <div className={styles.contactGrid}>
                  <div className={styles.contactCard}>
                    <div className={styles.contactType}>Email Support</div>
                    <div className={styles.contactDetails}>
                      support@saferiskx.com<br/>
                      Response: 24-48 hours
                    </div>
                  </div>
                  <div className={styles.contactCard}>
                    <div className={styles.contactType}>Legal Inquiries</div>
                    <div className={styles.contactDetails}>
                      legal@saferiskx.com<br/>
                      Response: 48-72 hours
                    </div>
                  </div>
                  <div className={styles.contactCard}>
                    <div className={styles.contactType}>Postal Address</div>
                    <div className={styles.contactDetails}>
                      Signal SafeRiskX<br/>
                      10 New Road<br/>
                      London WC97 5XD, UK
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </div>

          <footer className={styles.documentFooter}>
            <div className={styles.footerContent}>
              <div className={styles.footerText}>
                By using SafeRiskX, you acknowledge reading and agreeing to these Terms of Service.
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
