import React from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const queryClient = new QueryClient();

export default function RealTime() {
  return (
    <QueryClientProvider client={queryClient}>
      <RealTimeContent />
    </QueryClientProvider>
  );
}

function RealTimeContent() {
  const { data: listData, error, refetch } = useQuery('realTimeList', async () => {
    const response = await axios.get('/ft/realTime/list');
    return response.data;
  }, {
    refetchInterval: 5000, 
  });

  const [rank, setRank] = React.useState(0);
  const navigate = useNavigate();

  React.useEffect(() => {
    const interval = setInterval(() => {
      setRank(prevRank => (prevRank === 9 ? 0 : prevRank + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const styles = {
    term: {
      fontSize: '16px',
    },
    rank: {
      color: 'orange',
      fontWeight: 'bold',
      fontFamily: 'Arial, sans-serif',
      marginLeft: 20
    },
    rankName: {
      fontFamily: 'Arial, sans-serif',
      marginLeft: 20,
      cursor: 'pointer',
    }
  };

  const handleClick = (event) => {
    const targetText = event.target.innerText;
    navigate(`/itemlist/${targetText}`)
  };

  if (error) return <div>Error fetching data</div>;
  if (!listData) return <div>Loading...</div>;

  return (
    <div style={styles.term}>
      <span style={styles.rank}>{(rank + 1).toString().padStart(2, '0')}</span>
      <span style={styles.rankName} onClick={handleClick}>{listData[rank]?.query}</span>
    </div>
  );
}
