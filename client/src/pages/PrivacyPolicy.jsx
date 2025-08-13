// PrivacyPolicy.jsx - Professional Financial Platform Style
import React, { useState, useEffect } from 'react';
import styles from './termsComponent.module.css';
import logo from '../assets/logos/logo.svg';

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState('1');
  const [lastUpdated] = useState('December 12, 2024');

  const sections = [
    { id: '1', title: 'Information We Collect', number: '1' },
    { id: '2', title: 'How We Use Information', number: '2' },
    { id: '3', title: 'Information Sharing', number: '3' },
    { id: '4', title: 'Data Storage & Security', number: '4' },
    { id: '5', title: 'Cookies & Tracking', number: '5' },
    { id: '6', title: 'Your Rights (GDPR)', number: '6' },
    { id: '7', title: 'Data Retention', number: '7' },
    { id: '8', title: 'Third-Party Services', number: '8' },
    { id: '9', title: 'International Transfers', number: '9' },
    { id: '10', title: 'Children\'s Privacy', number: '10' },
    { id: '11', title: 'Policy Updates', number: '11' },
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
            ← Home
          </button>
          <div className={styles.headerTitle}>
            <img src={logo} alt="SafeRiskX" className={styles.logo} />
            <span>Privacy Policy</span>
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
            <h1 className={styles.documentTitle}>Privacy Policy</h1>
            <p className={styles.documentSubtitle}>
              This Privacy Policy explains how SafeRiskX collects, uses, and protects your personal information.
            </p>
            <div className={styles.effectiveDate}>
              Effective: {lastUpdated}
            </div>
          </div>

          <div className={styles.riskBanner}>
            <div className={styles.riskIcon}>GDPR</div>
            <div className={styles.riskContent}>
              <div className={styles.riskTitle}>GDPR Compliant</div>
              <div className={styles.riskText}>
                We comply with the General Data Protection Regulation (GDPR) and respect your privacy rights.
              </div>
            </div>
          </div>

          <div className={styles.sections}>
            
            <section id="section-1" className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>1.</span>
                Information We Collect
              </h2>
              <div className={styles.sectionContent}>
                <p>We collect information you provide directly and information collected automatically through your use of our service.</p>
                
                <div className={styles.riskGrid}>
                  <div className={styles.riskCard}>
                    <div className={styles.riskCardTitle}>Personal Information</div>
                    <div className={styles.subsection}>
                      <h4 className={styles.subsectionTitle}>Account Registration</h4>
                      <ul className={styles.riskList}>
                        <li>Full name (as provided by you)</li>
                        <li>Email address</li>
                        <li>Encrypted password</li>
                        <li>Account creation timestamp</li>
                      </ul>
                    </div>
                    
                    <div className={styles.subsection}>
                      <h4 className={styles.subsectionTitle}>Payment Information</h4>
                      <ul className={styles.riskList}>
                        <li>Payment method details (processed by Stripe)</li>
                        <li>Billing history and transaction records</li>
                        <li>Subscription status and renewal dates</li>
                      </ul>
                    </div>
                  </div>

                  <div className={styles.riskCard}>
                    <div className={styles.riskCardTitle}>Technical Information</div>
                    <div className={styles.subsection}>
                      <h4 className={styles.subsectionTitle}>Usage Data</h4>
                      <ul className={styles.riskList}>
                        <li>Login timestamps and session duration</li>
                        <li>Pages visited and features used</li>
                        <li>Discord OAuth integration data</li>
                        <li>Platform interaction analytics</li>
                      </ul>
                    </div>
                    
                    <div className={styles.subsection}>
                      <h4 className={styles.subsectionTitle}>Device Information</h4>
                      <ul className={styles.riskList}>
                        <li>IP address and location data</li>
                        <li>Browser type and version</li>
                        <li>Operating system information</li>
                        <li>Device identifiers (where applicable)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className={styles.disclaimer}>
                  <strong>Payment Security:</strong> We do not store credit card numbers. All payment processing is handled securely by Stripe.
                </div>
              </div>
            </section>

            <section id="section-2" className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>2.</span>
                How We Use Information
              </h2>
              <div className={styles.sectionContent}>
                <p>We use your information for the following purposes, based on legitimate business interests and legal obligations:</p>
                
                <div className={styles.serviceGrid}>
                  <div className={styles.serviceItem}>
                    <div className={styles.serviceIcon}>SERVICE</div>
                    <div className={styles.serviceText}>
                      <strong>Service Provision</strong><br/>
                      Account management, Discord access, billing
                    </div>
                  </div>
                  
                  <div className={styles.serviceItem}>
                    <div className={styles.serviceIcon}>COMM</div>
                    <div className={styles.serviceText}>
                      <strong>Communication</strong><br/>
                      Service notifications, support responses
                    </div>
                  </div>
                  
                  <div className={styles.serviceItem}>
                    <div className={styles.serviceIcon}>SECURITY</div>
                    <div className={styles.serviceText}>
                      <strong>Security & Compliance</strong><br/>
                      Fraud prevention, legal compliance
                    </div>
                  </div>
                  
                  <div className={styles.serviceItem}>
                    <div className={styles.serviceIcon}>ANALYTICS</div>
                    <div className={styles.serviceText}>
                      <strong>Analytics & Improvement</strong><br/>
                      Usage analytics, service optimization
                    </div>
                  </div>
                </div>

                <div className={styles.gdprSection}>
                  <h3 className={styles.gdprTitle}>Legal Basis for Processing (GDPR)</h3>
                  <div className={styles.rightsGrid}>
                    <div className={styles.rightAvailable}>
                      <strong>Contract Performance:</strong> Service delivery
                    </div>
                    <div className={styles.rightAvailable}>
                      <strong>Legitimate Interests:</strong> Security, improvement
                    </div>
                    <div className={styles.rightAvailable}>
                      <strong>Legal Obligation:</strong> Regulatory compliance
                    </div>
                    <div className={styles.rightAvailable}>
                      <strong>Consent:</strong> Marketing communications
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="section-3" className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>3.</span>
                Information Sharing
              </h2>
              <div className={styles.sectionContent}>
                <div className={styles.noRefundAlert}>
                  <div className={styles.alertIcon}>✓</div>
                  <div className={styles.alertContent}>
                    <div className={styles.alertTitle}>We Do Not Sell Your Data</div>
                    <div className={styles.alertText}>
                      SafeRiskX does not sell, rent, or trade your personal information to third parties for marketing purposes.
                    </div>
                  </div>
                </div>

                <div className={styles.terminationGrid}>
                  <div className={styles.terminationType}>
                    <h3 className={styles.terminationTitle}>Service Providers</h3>
                    <p>We share data with trusted service providers:</p>
                    <ul className={styles.terminationList}>
                      <li>Stripe: Payment processing and billing</li>
                      <li>Discord: OAuth integration and community access</li>
                      <li>Hosting Services: Secure data storage</li>
                      <li>Analytics: Anonymized usage statistics</li>
                    </ul>
                  </div>
                  
                  <div className={styles.terminationType}>
                    <h3 className={styles.terminationTitle}>Legal Requirements</h3>
                    <p>We may disclose information when required:</p>
                    <ul className={styles.terminationList}>
                      <li>Court orders or legal process</li>
                      <li>Government investigations</li>
                      <li>Regulatory compliance requirements</li>
                      <li>Protection of rights and safety</li>
                    </ul>
                  </div>
                </div>

                <div className={styles.importantNote}>
                  All service providers are contractually bound to process data only for specified purposes and implement appropriate security measures.
                </div>
              </div>
            </section>

            <section id="section-4" className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>4.</span>
                Data Storage & Security
              </h2>
              <div className={styles.sectionContent}>
                <p>We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.</p>
                
                <div className={styles.rulesGrid}>
                  <div className={styles.ruleCategory}>
                    <h3 className={styles.ruleCategoryTitle}>Technical Safeguards</h3>
                    <ul className={styles.rulesList}>
                      <li>SSL/TLS encryption for data transmission</li>
                      <li>Password encryption using industry standards</li>
                      <li>Secure hosting infrastructure</li>
                      <li>Regular security updates and patches</li>
                      <li>Access controls and authentication systems</li>
                    </ul>
                  </div>
                  
                  <div className={styles.ruleCategory}>
                    <h3 className={styles.ruleCategoryTitle}>Operational Safeguards</h3>
                    <ul className={styles.rulesList}>
                      <li>Limited access to personal data</li>
                      <li>Employee data protection training</li>
                      <li>Regular security audits and monitoring</li>
                      <li>Incident response procedures</li>
                      <li>Data backup and recovery systems</li>
                    </ul>
                  </div>
                  
                  <div className={styles.ruleCategory}>
                    <h3 className={styles.ruleCategoryTitle}>Data Storage</h3>
                    <ul className={styles.rulesList}>
                      <li>Primary Storage: European Union data centers</li>
                      <li>Backup Storage: EU-compliant facilities</li>
                      <li>Payment Data: Processed by Stripe (PCI DSS)</li>
                      <li>Encrypted backups and secure transmission</li>
                    </ul>
                  </div>
                </div>

                <div className={styles.enforcement}>
                  <strong>Your Responsibility:</strong> Maintain password confidentiality, use secure networks, report security breaches, and keep account information updated.
                </div>
              </div>
            </section>

            <section id="section-5" className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>5.</span>
                Cookies & Tracking
              </h2>
              <div className={styles.sectionContent}>
                <p>We use cookies and similar technologies to provide and improve our service. Here's what you need to know:</p>
                
                <div className={styles.paymentInfo}>
                  <div className={styles.paymentItem}>
                    <strong>Essential Cookies:</strong> Required for basic functionality (authentication, session management, security)
                  </div>
                  <div className={styles.paymentItem}>
                    <strong>Analytics Cookies:</strong> Help us understand platform usage to improve service quality
                  </div>
                  <div className={styles.paymentItem}>
                    <strong>Browser Control:</strong> Most browsers allow cookie management through settings
                  </div>
                  <div className={styles.paymentItem}>
                    <strong>Service Impact:</strong> Disabling essential cookies will prevent proper functionality
                  </div>
                </div>

                <div className={styles.terminationNote}>
                  <strong>Important:</strong> Essential cookies cannot be disabled as they are required for service functionality and may result in service issues if blocked.
                </div>
              </div>
            </section>

            <section id="section-6" className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>6.</span>
                Your Rights (GDPR)
              </h2>
              <div className={styles.sectionContent}>
                <p>Under the General Data Protection Regulation (GDPR), you have several rights regarding your personal data:</p>
                
                <div className={styles.serviceGrid}>
                  <div className={styles.serviceItem}>
                    <div className={styles.serviceIcon}>ACCESS</div>
                    <div className={styles.serviceText}>
                      <strong>Right to Access</strong><br/>
                      Request copy of your personal data
                    </div>
                  </div>
                  
                  <div className={styles.serviceItem}>
                    <div className={styles.serviceIcon}>CORRECT</div>
                    <div className={styles.serviceText}>
                      <strong>Right to Rectification</strong><br/>
                      Request correction of inaccurate data
                    </div>
                  </div>
                  
                  <div className={styles.serviceItem}>
                    <div className={styles.serviceIcon}>PORT</div>
                    <div className={styles.serviceText}>
                      <strong>Right to Portability</strong><br/>
                      Request data in machine-readable format
                    </div>
                  </div>
                  
                  <div className={styles.serviceItem}>
                    <div className={styles.serviceIcon}>OBJECT</div>
                    <div className={styles.serviceText}>
                      <strong>Right to Object</strong><br/>
                      Object to processing for marketing
                    </div>
                  </div>
                </div>

                <div className={styles.gdprSection}>
                  <h3 className={styles.gdprTitle}>Rights Limitations</h3>
                  <div className={styles.rightsGrid}>
                    <div className={styles.rightLimited}>
                      <strong>Account Deletion:</strong> Cannot delete due to legal compliance
                    </div>
                    <div className={styles.rightLimited}>
                      <strong>Data Retention:</strong> Some data must be retained for legal purposes
                    </div>
                  </div>
                </div>

                <div className={styles.companyCard}>
                  <div className={styles.companyRow}>
                    <span className={styles.companyLabel}>Exercise Rights</span>
                    <span className={styles.companyValue}>Send request to privacy@saferiskx.com</span>
                  </div>
                  <div className={styles.companyRow}>
                    <span className={styles.companyLabel}>Verification</span>
                    <span className={styles.companyValue}>Identity verification required for security</span>
                  </div>
                  <div className={styles.companyRow}>
                    <span className={styles.companyLabel}>Response Time</span>
                    <span className={styles.companyValue}>30 days from verified request</span>
                  </div>
                </div>
              </div>
            </section>

            <section id="section-7" className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>7.</span>
                Data Retention
              </h2>
              <div className={styles.sectionContent}>
                <p>We retain personal data for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, and resolve disputes.</p>
                
                <div className={styles.serviceGrid}>
                  <div className={styles.serviceItem}>
                    <div className={styles.serviceIcon}>ACCOUNT</div>
                    <div className={styles.serviceText}>
                      <strong>Account Data</strong><br/>
                      Indefinite - Legal compliance
                    </div>
                  </div>
                  
                  <div className={styles.serviceItem}>
                    <div className={styles.serviceIcon}>PAYMENT</div>
                    <div className={styles.serviceText}>
                      <strong>Payment Records</strong><br/>
                      7 Years - Tax obligations
                    </div>
                  </div>
                  
                  <div className={styles.serviceItem}>
                    <div className={styles.serviceIcon}>USAGE</div>
                    <div className={styles.serviceText}>
                      <strong>Usage Analytics</strong><br/>
                      2 Years - Service improvement
                    </div>
                  </div>
                  
                  <div className={styles.serviceItem}>
                    <div className={styles.serviceIcon}>SUPPORT</div>
                    <div className={styles.serviceText}>
                      <strong>Support Communications</strong><br/>
                      3 Years - Dispute resolution
                    </div>
                  </div>
                </div>

                <div className={styles.liabilityCard}>
                  <h3 className={styles.liabilityTitle}>Retention Principles</h3>
                  <ul className={styles.liabilityList}>
                    <li>Proportionality: Data retained only as long as necessary</li>
                    <li>Security: Retained data subject to same security measures</li>
                    <li>Legal Basis: Based on legal requirements and business interests</li>
                    <li>Regular Review: Periodic review and deletion when no longer required</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="section-8" className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>8.</span>
                Third-Party Services
              </h2>
              <div className={styles.sectionContent}>
                <p>Our service integrates with third-party platforms to provide full functionality. Here's how your data is handled:</p>
                
                <div className={styles.terminationGrid}>
                  <div className={styles.terminationType}>
                    <h3 className={styles.terminationTitle}>Stripe Payment Processing</h3>
                    <ul className={styles.terminationList}>
                      <li>Purpose: Secure payment processing and subscription management</li>
                      <li>Data Shared: Payment information, billing details, transaction records</li>
                      <li>Privacy Policy: stripe.com/privacy</li>
                      <li>Compliance: PCI DSS Level 1 certified</li>
                    </ul>
                  </div>
                  
                  <div className={styles.terminationType}>
                    <h3 className={styles.terminationTitle}>Discord Community Integration</h3>
                    <ul className={styles.terminationList}>
                      <li>Purpose: OAuth authentication and community access</li>
                      <li>Data Shared: Discord user ID, username, authentication tokens</li>
                      <li>Privacy Policy: discord.com/privacy</li>
                      <li>Control: You can revoke access through Discord settings</li>
                    </ul>
                  </div>
                </div>

                <div className={styles.jurisdictionCard}>
                  <div className={styles.jurisdictionItem}>
                    <strong>Independent Controllers:</strong> Third-party services act as independent data controllers
                  </div>
                  <div className={styles.jurisdictionItem}>
                    <strong>Direct Rights:</strong> You may exercise rights directly with these services
                  </div>
                  <div className={styles.jurisdictionItem}>
                    <strong>Privacy Policies:</strong> Each service has its own privacy policy and practices
                  </div>
                </div>
              </div>
            </section>

            <section id="section-9" className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>9.</span>
                International Transfers
              </h2>
              <div className={styles.sectionContent}>
                <p>Your personal data may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place.</p>
                
                <div className={styles.dataGrid}>
                  <div className={styles.dataItem}>
                    <strong>Primary Processing:</strong> European Union data centers with full GDPR compliance
                  </div>
                  <div className={styles.dataItem}>
                    <strong>Service Providers:</strong> Global processing with appropriate safeguards
                  </div>
                  <div className={styles.dataItem}>
                    <strong>Adequacy Decisions:</strong> Transfers to countries with EU adequacy decisions
                  </div>
                  <div className={styles.dataItem}>
                    <strong>Standard Contractual Clauses:</strong> EU-approved contractual protections
                  </div>
                </div>
              </div>
            </section>

            <section id="section-10" className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>10.</span>
                Children's Privacy
              </h2>
              <div className={styles.sectionContent}>
                <div className={styles.criticalWarning}>
                  <div className={styles.warningHeader}>
                    <div className={styles.warningIcon}>18+</div>
                    <div className={styles.warningTitle}>Age Requirement</div>
                  </div>
                  <div className={styles.warningContent}>
                    <div className={styles.warningStatement}>
                      SERVICE NOT INTENDED FOR CHILDREN UNDER 18
                    </div>
                  </div>
                </div>

                <div className={styles.reasonsList}>
                  <div className={styles.reasonItem}>
                    <strong>No Collection:</strong> We do not knowingly collect information from children under 18
                  </div>
                  <div className={styles.reasonItem}>
                    <strong>Parental Notice:</strong> Contact privacy@saferiskx.com if child has provided information
                  </div>
                  <div className={styles.reasonItem}>
                    <strong>Verification:</strong> Users responsible for providing accurate age information
                  </div>
                  <div className={styles.reasonItem}>
                    <strong>Prompt Deletion:</strong> We will delete confirmed child information immediately
                  </div>
                </div>
              </div>
            </section>

            <section id="section-11" className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>11.</span>
                Policy Updates
              </h2>
              <div className={styles.sectionContent}>
                <p>We may update this Privacy Policy from time to time to reflect changes in our practices, legal requirements, or service offerings.</p>
                
                <div className={styles.paymentInfo}>
                  <div className={styles.paymentItem}>
                    <strong>Policy Review:</strong> Regular review of privacy practices and legal requirements
                  </div>
                  <div className={styles.paymentItem}>
                    <strong>Change Assessment:</strong> Evaluation of proposed changes and their impact
                  </div>
                  <div className={styles.paymentItem}>
                    <strong>User Notification:</strong> Notice of material changes via email or platform notification
                  </div>
                  <div className={styles.paymentItem}>
                    <strong>Effective Date:</strong> Changes become effective 30 days after notification
                  </div>
                </div>

                <div className={styles.importantNote}>
                  For significant changes, we provide prominent notice on our platform, email notification to users, and 30-day notice period before changes take effect.
                </div>

                <div className={styles.enforcement}>
                  <strong>Continued Use:</strong> Your continued use after the effective date constitutes acceptance of the updated Privacy Policy. You may cancel your subscription if you disagree with changes.
                </div>
              </div>
            </section>

            <section id="section-12" className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>12.</span>
                Contact Information
              </h2>
              <div className={styles.sectionContent}>
                <p>If you have questions about this Privacy Policy or our data practices, please contact us:</p>
                
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
                    <span className={styles.companyLabel}>Data Protection Officer</span>
                    <span className={styles.companyValue}>privacy@saferiskx.com</span>
                  </div>
                </div>

                <div className={styles.contactGrid}>
                  <div className={styles.contactCard}>
                    <div className={styles.contactType}>Privacy Officer</div>
                    <div className={styles.contactDetails}>
                      privacy@saferiskx.com<br/>
                      Response: 48-72 hours
                    </div>
                  </div>
                  
                  <div className={styles.contactCard}>
                    <div className={styles.contactType}>General Support</div>
                    <div className={styles.contactDetails}>
                      support@saferiskx.com<br/>
                      Response: 24-48 hours
                    </div>
                  </div>
                  
                  <div className={styles.contactCard}>
                    <div className={styles.contactType}>EU Supervisory Authority</div>
                    <div className={styles.contactDetails}>
                      UK Information Commissioner's Office<br/>
                      ico.org.uk | 0303 123 1113
                    </div>
                  </div>
                </div>

                <div className={styles.terminationNote}>
                  <strong>EU Rights:</strong> You have the right to lodge a complaint with a supervisory authority if you believe we have not complied with data protection laws.
                </div>
              </div>
            </section>

          </div>

          <footer className={styles.documentFooter}>
            <div className={styles.footerContent}>
              <div className={styles.footerText}>
                This Privacy Policy is effective as of the date listed above and applies to all users of SafeRiskX services.
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
