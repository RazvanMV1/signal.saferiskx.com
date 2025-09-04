// components/DailyTradingStats/DailyTradingStats.jsx
import React, { useState, useEffect } from 'react';
import styles from './DailyTradingStats.module.css';

const DailyTradingStats = () => {
  const [stats, setStats] = useState(null);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filterOutcome, setFilterOutcome] = useState('ALL');
  const [selectedDate, setSelectedDate] = useState('');
  const [availableDates, setAvailableDates] = useState([]);

  // Calculează ziua anterioară
  const getYesterdayDate = () => {
    const yesterday = new Date();
    // yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  };

  const yesterdayDate = getYesterdayDate();

  useEffect(() => {
    setSelectedDate(yesterdayDate);
    fetchAvailableDates();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchTradingStats(selectedDate);
      fetchTrades(selectedDate);
    }
  }, [selectedDate]);

  const fetchAvailableDates = async () => {
    try {
      const response = await fetch('http://localhost:8081/stats/recent?days=30');
      if (response.ok) {
        const result = await response.json();
        const dates = result.data.map(stat => stat.trade_date).sort((a, b) => b.localeCompare(a));
        setAvailableDates(dates);
      }
    } catch (err) {
      console.error('Failed to fetch available dates:', err);
    }
  };

  const fetchTradingStats = async (date) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:8081/stats/daily/${date}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`No trading statistics found for ${date}. Please run analytics first.`);
        }
        throw new Error(`Failed to fetch statistics: ${response.statusText}`);
      }
      
      const result = await response.json();
      setStats(result);
    } catch (err) {
      setError(err.message);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrades = async (date) => {
    try {
      const response = await fetch(`http://localhost:8081/trades/?date_from=${date}&date_to=${date}&limit=100`);
      
      if (response.ok) {
        const result = await response.json();
        setTrades(result);
      } else {
        setTrades([]);
      }
    } catch (err) {
      console.error('Failed to fetch trades:', err);
      setTrades([]);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchTradingStats(selectedDate);
      await fetchTrades(selectedDate);
      await fetchAvailableDates();
    } catch (err) {
      console.error('Refresh failed:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatRR = (rr) => {
    if (typeof rr === 'number') {
      return rr >= 0 ? `+${rr.toFixed(2)}R` : `${rr.toFixed(2)}R`;
    }
    return rr;
  };

  const getRRColor = (rr) => {
    const numRR = typeof rr === 'number' ? rr : parseFloat(rr);
    if (numRR > 0) return styles.positive;
    if (numRR < 0) return styles.negative;
    return styles.neutral;
  };

  const getStreakColor = (streak) => {
    if (streak > 0) return styles.positive;
    if (streak < 0) return styles.negative;
    return styles.neutral;
  };

  const getOutcomeBadgeClass = (isWinner) => {
    if (isWinner === true) return styles.winBadge;
    if (isWinner === false) return styles.lossBadge;
    return styles.breakevenBadge;
  };

  const getTradeOutcome = (isWinner, rr) => {
    if (isWinner === true) return 'WIN';
    if (isWinner === false) return 'LOSS';
    if (rr === 0) return 'BREAKEVEN';
    return 'UNKNOWN';
  };

  const formatCloseReason = (reason) => {
    const reasonMap = {
      'STOP_LOSS': 'SL',
      'TAKE_PROFIT': 'TP',
      'MANUAL': 'Manual'
    };
    return reasonMap[reason] || reason;
  };

  const filteredTrades = trades.filter(trade => {
    if (filterOutcome === 'ALL') return true;
    const outcome = getTradeOutcome(trade.is_winner, trade.actual_rr);
    return outcome === filterOutcome;
  });

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <span className={styles.loadingText}>Loading trading statistics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <h3 className={styles.errorTitle}>Unable to Load Data</h3>
          <p className={styles.errorMessage}>{error}</p>
          <button 
            className={styles.retryBtn}
            onClick={() => fetchTradingStats(selectedDate)}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.iconContainer}>
            <span className={styles.icon}>📊</span>
          </div>
          <div className={styles.headerText}>
            <h1 className={styles.title}>Daily Trading Statistics</h1>
            <p className={styles.subtitle}>{formatDate(selectedDate)}</p>
          </div>
        </div>
        
        <div className={styles.headerRight}>
          <div className={styles.dateSelector}>
            <label className={styles.dateLabel}>Analysis Date:</label>
            <select 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
              className={styles.dateSelect}
            >
              <option value={yesterdayDate}>Yesterday ({yesterdayDate})</option>
              {availableDates.map(date => (
                <option key={date} value={date}>
                  {date} {date === yesterdayDate ? '(Yesterday)' : ''}
                </option>
              ))}
            </select>
          </div>
          
          <button 
            onClick={handleRefresh}
            className={`${styles.refreshBtn} ${refreshing ? styles.refreshing : ''}`}
            disabled={refreshing}
          >
            <span className={styles.refreshIcon}>🔄</span>
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Core Performance Cards */}
      <div className={styles.performanceSection}>
        <div className={styles.performanceCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>🎯</span>
            <span className={styles.cardTitle}>Win Rate</span>
          </div>
          <div className={styles.cardValue}>
            <span className={`${styles.mainValue} ${styles.winRateValue}`}>
              {stats.win_rate.toFixed(1)}%
            </span>
            <span className={styles.subValue}>
              {stats.win_count} wins / {stats.total_trades} trades
            </span>
          </div>
        </div>

        <div className={styles.performanceCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>💰</span>
            <span className={styles.cardTitle}>Total RR</span>
          </div>
          <div className={styles.cardValue}>
            <span className={`${styles.mainValue} ${getRRColor(stats.total_rr)}`}>
              {formatRR(stats.total_rr)}
            </span>
            <span className={styles.subValue}>Risk/Reward</span>
          </div>
        </div>

        <div className={styles.performanceCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>📊</span>
            <span className={styles.cardTitle}>Average RR</span>
          </div>
          <div className={styles.cardValue}>
            <span className={`${styles.mainValue} ${getRRColor(stats.average_rr)}`}>
              {formatRR(stats.average_rr)}
            </span>
            <span className={styles.subValue}>Per Trade</span>
          </div>
        </div>

        <div className={styles.performanceCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>🔥</span>
            <span className={styles.cardTitle}>Current Streak</span>
          </div>
          <div className={styles.cardValue}>
            <span className={`${styles.mainValue} ${getStreakColor(stats.current_streak)}`}>
              {Math.abs(stats.current_streak)} {stats.current_streak >= 0 ? 'Wins' : 'Losses'}
            </span>
            <span className={styles.subValue}>Consecutive</span>
          </div>
        </div>
      </div>

      {/* Trade Breakdown */}
      <div className={styles.tradeSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>🎯</span>
            Trade Breakdown
          </div>
          
          <div className={styles.filterControls}>
            <select 
              value={filterOutcome} 
              onChange={(e) => setFilterOutcome(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="ALL">All Trades</option>
              <option value="WIN">Wins Only</option>
              <option value="LOSS">Losses Only</option>
              <option value="BREAKEVEN">Breakeven Only</option>
            </select>
            <span className={styles.tradeCount}>{filteredTrades.length} trades</span>
          </div>
        </div>

        <div className={styles.tradesTable}>
          {filteredTrades.length > 0 ? (
            <>
              <div className={styles.tableHeader}>
                <div className={styles.headerCell}>Symbol</div>
                <div className={styles.headerCell}>Type</div>
                <div className={styles.headerCell}>RR</div>
                <div className={styles.headerCell}>Outcome</div>
                <div className={styles.headerCell}>Close Reason</div>
                <div className={styles.headerCell}>Time</div>
              </div>
              
              <div className={styles.tableBody}>
                {filteredTrades.map((trade, index) => {
                  const outcome = getTradeOutcome(trade.is_winner, trade.actual_rr);
                  return (
                    <div key={trade.id} className={`${styles.tableRow} ${styles[outcome.toLowerCase()]}`}>
                      <div className={styles.tableCell}>
                        <span className={styles.symbolBadge}>{trade.symbol}</span>
                      </div>
                      <div className={styles.tableCell}>
                        <span className={`${styles.typeBadge} ${styles[trade.type.toLowerCase()]}`}>
                          {trade.type}
                        </span>
                      </div>
                      <div className={styles.tableCell}>
                        <span className={`${styles.rrValue} ${getRRColor(trade.actual_rr)}`}>
                          {formatRR(trade.actual_rr)}
                        </span>
                      </div>
                      <div className={styles.tableCell}>
                        <span className={`${styles.outcomeBadge} ${getOutcomeBadgeClass(trade.is_winner)}`}>
                          {outcome}
                        </span>
                      </div>
                      <div className={styles.tableCell}>
                        <span className={styles.reasonText}>
                          {formatCloseReason(trade.close_reason)}
                        </span>
                      </div>
                      <div className={styles.tableCell}>
                        <span className={styles.timeText}>
                          {new Date(trade.closed_at).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className={styles.noTrades}>
              <div className={styles.noTradesIcon}>📭</div>
              <h3 className={styles.noTradesTitle}>No Trades Found</h3>
              <p className={styles.noTradesMessage}>
                {filterOutcome === 'ALL' ? 
                  `No trades found for ${selectedDate}` : 
                  `No ${filterOutcome.toLowerCase()} trades found for ${selectedDate}`
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Daily Insights */}
      <div className={styles.insightsSection}>
        <div className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>💡</span>
          Daily Insights
        </div>
        
        <div className={styles.insightsGrid}>
          <div className={styles.insightCard}>
            <div className={styles.insightIcon}>🏆</div>
            <div className={styles.insightContent}>
              <span className={styles.insightLabel}>Best RR</span>
              <span className={`${styles.insightValue} ${getRRColor(stats.best_rr)}`}>
                {formatRR(stats.best_rr)}
              </span>
            </div>
          </div>

          <div className={styles.insightCard}>
            <div className={styles.insightIcon}>📉</div>
            <div className={styles.insightContent}>
              <span className={styles.insightLabel}>Worst RR</span>
              <span className={`${styles.insightValue} ${getRRColor(stats.worst_rr)}`}>
                {formatRR(stats.worst_rr)}
              </span>
            </div>
          </div>

          <div className={styles.insightCard}>
            <div className={styles.insightIcon}>📈</div>
            <div className={styles.insightContent}>
              <span className={styles.insightLabel}>Most Traded</span>
              <span className={styles.insightValue}>
                {stats.most_traded_symbol || 'N/A'}
              </span>
            </div>
          </div>

          <div className={styles.insightCard}>
            <div className={styles.insightIcon}>⏰</div>
            <div className={styles.insightContent}>
              <span className={styles.insightLabel}>Best Hour</span>
              <span className={styles.insightValue}>
                {stats.best_hour || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Footer */}
      <div className={styles.summarySection}>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Total Trades</span>
            <span className={styles.summaryValue}>{stats.total_trades}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Winners</span>
            <span className={`${styles.summaryValue} ${styles.positive}`}>
              {stats.win_count}
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Losers</span>
            <span className={`${styles.summaryValue} ${styles.negative}`}>
              {stats.loss_count}
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Volume</span>
            <span className={styles.summaryValue}>
              {stats.total_volume ? stats.total_volume.toFixed(2) : 'N/A'}
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Avg Duration</span>
            <span className={styles.summaryValue}>
              {stats.average_duration ? `${Math.round(stats.average_duration)}m` : 'N/A'}
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Generated</span>
            <span className={styles.summaryValue}>
              {stats.created_at ? 
                new Date(stats.created_at).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                }) : 
                'Unknown'
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyTradingStats;
