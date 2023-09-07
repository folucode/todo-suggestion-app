import styles from '../styles/list-labels.module.css';

export const ListLabels = (props) => {
  const { Id, color, name, setLabelId, setLabelName } = props;

  return (
    <a className={styles['individual-list']}>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        height='24'
        viewBox='0 -960 960 960'
        width='24'
        fill={color}
      >
        <path d='M542.308-131.692q-11.529 11.461-28.573 11.461-17.043 0-28.504-11.461l-352-352q-6.385-6.385-9.808-14.02T120-514v-286q0-16.077 11.961-28.039Q143.923-840 160-840h286q7.769 0 15.452 3.166 7.683 3.167 13.317 8.526l352 352.231Q839-463.846 839.385-446.5q.384 17.346-11.077 28.808l-286 286ZM513.425-160l286.344-286-353.425-354H160v286l353.425 354ZM259.91-660q16.629 0 28.359-11.64Q300-683.281 300-699.909q0-16.63-11.64-28.36Q276.72-740 260.09-740q-16.629 0-28.359 11.64Q220-716.719 220-700.091q0 16.63 11.64 28.36Q243.28-660 259.91-660ZM160-800Z' />
      </svg>

      <p
        onClick={() => {
          setLabelId(Id);
          setLabelName(name);
        }}
      >
        {name}
      </p>
    </a>
  );
};
