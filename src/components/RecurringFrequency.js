import styles from '../styles/recurring-frequency.module.css';

export const RecurringFrequency = (props) => {
  const { setRecurringFrequency } = props;
  const RecurringTaskFrequency = [
    'hourly',
    'Daily',
    'Weekdays',
    'Weekly',
    'Fortnightly',
    'Monthly',
    'Every 3 Months',
    'Every 6 Months',
    'Yearly',
  ];

  return (
    <>
      {RecurringTaskFrequency.map((frequency, index) => (
        <div
          className={styles['individual-list']}
          key={index}
          onClick={() => setRecurringFrequency(frequency)}
        >
          {frequency}
        </div>
      ))}
    </>
  );
};
