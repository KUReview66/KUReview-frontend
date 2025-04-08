import { Bar } from 'react-chartjs-2';

function ScoreChart() {

  const data = {
    labels: ['Unit 1 Loop', 'Unit 2 Condition', 'Unit 3 List', 'Unit 4 Dictionary'],
    datasets: [
      {
        label: 'Student score',
        backgroundColor: '#8bd3c7',
        borderColor: '#8bd3c7',
        borderWidth: 1,
        hoverBackgroundColor: '#8bd3c7',
        hoverBorderColor: '#8bd3c7',
        data: [10, 12, 8, 10],
      },
      {
        label: 'Average',
        backgroundColor: '#2f80ed',
        borderColor: '#2f80ed',
        borderWidth: 1,
        hoverBackgroundColor: '#2f80ed',
        hoverBorderColor: '#2f80ed',
        data: [15, 18, 15, 25],
      },
    ],
  };

  const options = {
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
}

export default ScoreChart;
