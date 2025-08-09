import React from 'react';
import styles from '../styles/DashboardPage.module.css';

export default function DashboardPage() {
  // Date mock pentru user și subscription
  const user = {
    firstName: "Andrei",
    lastName: "Popescu",
    email: "andrei@saferiskx.com",
    discordLinked: true,
  };

  const subscription = {
    plan: "Pro",
    price: 29,
    status: "active",
    startDate: "2024-07-01T12:00:00Z",
    endDate: "2024-08-01T12:00:00Z",
    payments: [
      { id: 1, date: "2024-07-01T12:00:00Z", amount: 29, status: "paid", method: "Stripe", invoiceUrl: "#" },
      { id: 2, date: "2024-06-01T12:00:00Z", amount: 29, status: "paid", method: "Stripe", invoiceUrl: "#" }
    ]
  };

  return (
    <div className={styles.dashboardPage}>
      <div className={styles.dashboardCard}>
        <div className={styles.header}>
          <div className={styles.avatar}>
            <img
              src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=1976d2&color=fff`}
              alt="Avatar"
              className={styles.avatarImg}
            />
          </div>
          <div>
            <div className={styles.userName}>{user.firstName} {user.lastName}</div>
            <div className={styles.userEmail}>{user.email}</div>
            <div className={styles.discordStatus}>
              Discord: {user.discordLinked ? (
                <span className={styles.discordLinked}>Conectat ✅</span>
              ) : (
                <a href="/connect-discord" className={styles.discordBtn}>Conectează Discord</a>
              )}
            </div>
          </div>
        </div>
        <div className={styles.subscriptionSection}>
          <div className={styles.label}>Abonament:</div>
          <div>
            <span className={styles.plan}>{subscription.plan}</span>
            <span className={subscription.status === "active" ? styles.active : styles.inactive}>
              {subscription.status}
            </span>
            <span className={styles.price}>{subscription.price} EUR / lună</span>
            <div>
              <span className={styles.dates}>
                {subscription.startDate && `Start: ${subscription.startDate.slice(0,10)}`}
                {" | "}
                {subscription.endDate && `Expirare: ${subscription.endDate.slice(0,10)}`}
              </span>
            </div>
            <button className={styles.upgradeBtn}>Upgrade/Plătește cu Stripe</button>
          </div>
        </div>
        <div className={styles.signalInfo}>
          <div className={styles.signalTitle}>Ultimele semnale premium sunt pe Discord!</div>
          <a
            href="https://discord.gg/YOUR_DISCORD_LINK"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.joinDiscordBtn}
          >
            Intră în grupul Discord
          </a>
        </div>
        <div className={styles.sectionTitle}>Istoric plăți</div>
        <ul className={styles.paymentsList}>
          {subscription.payments.map(payment => (
            <li key={payment.id} className={styles.paymentItem}>
              <span className={styles.iconPay}>{payment.status === "paid" ? "✅" : "❌"}</span>
              <span>{payment.date.slice(0,10)}</span>
              <span>{payment.amount} EUR</span>
              <span className={payment.status === "paid" ? styles.paid : styles.unpaid}>
                {payment.status === "paid" ? "Plătit" : "Neplătit"}
              </span>
              {payment.invoiceUrl && (
                <a href={payment.invoiceUrl} target="_blank" rel="noopener noreferrer" className={styles.invoiceLink}>
                  <span className={styles.dlIcon}>⬇️</span> Factură
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
