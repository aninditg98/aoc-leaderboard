import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash';

const getBackgroundFromRank = (rank: number | undefined) => {
  if (_.isNil(rank)) return '#ffa07a';
  if (rank > 2) return '#00ff00';
  if (rank === 0) return '#ffcc00';
  if (rank === 1) return '#d3d3d3';
  if (rank === 2) return '#cc7722';
};
const DayPage: React.FunctionComponent = () => {
  const params = useParams<{ day: string; year: string }>();
  const [errorMsg, setErrorMsg] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<
    {
      email: string;
      time: { minutes: number; seconds: number } | undefined;
      score: number;
      rank: number | undefined;
    }[]
  >();
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const result = await axios.get(`/api/get_day/${params.year}/${params.day}`);
        setData(result.data.data);
        setLoading(false);
      } catch (e) {
        setErrorMsg('Didnt work, talk to Anindit or try refreshing');
        setLoading(false);
      }
    };
    fetch();
  }, []);
  return (
    <div style={{ display: 'flex', justifyContent: 'center', fontFamily: 'Andale Mono' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          fontSize: 20,
          borderWidth: 5,
          padding: 10,
          borderStyle: 'solid',
          borderColor: 'black',
          textAlign: 'center',
        }}
      >
        <b style={{ fontSize: 30 }}>
          <u>Day {params.day}</u>
        </b>
        <a href="/" style={{ fontSize: 20, color: 'blue', marginTop: 10 }}>
          Home
        </a>
        {data && (
          <table
            style={{ marginTop: 10, borderStyle: 'solid', borderWidth: 2, borderColor: 'black', borderSpacing: 0 }}
          >
            <thead>
              <tr>
                <th style={{ borderStyle: 'solid', borderWidth: 1, borderColor: 'black', padding: 5 }}>Rank</th>
                <th style={{ borderStyle: 'solid', borderWidth: 1, borderColor: 'black', padding: 5 }}>Email</th>
                <th style={{ borderStyle: 'solid', borderWidth: 1, borderColor: 'black', padding: 5 }}>Time</th>
                <th style={{ borderStyle: 'solid', borderWidth: 1, borderColor: 'black', padding: 5 }}>Score</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: 16 }}>
              {data.map((r, i) => (
                <tr key={`row-${i}`}>
                  <td
                    style={{
                      borderStyle: 'solid',
                      borderWidth: 1,
                      borderColor: 'black',
                      backgroundColor: getBackgroundFromRank(r.rank),
                      padding: 3,
                    }}
                  >
                    {_.isNil(r.rank) ? '' : r.rank + 1}
                  </td>
                  <td
                    style={{
                      borderStyle: 'solid',
                      borderWidth: 1,
                      borderColor: 'black',
                      backgroundColor: getBackgroundFromRank(r.rank),
                      padding: 3,
                    }}
                  >
                    {r.email}
                  </td>
                  <td
                    style={{
                      borderStyle: 'solid',
                      borderWidth: 1,
                      borderColor: 'black',
                      backgroundColor: getBackgroundFromRank(r.rank),
                      padding: 3,
                    }}
                  >
                    {r.time
                      ? `${String(r.time.minutes).padStart(2, '0')}:${String(r.time.seconds).padStart(2, '0')}`
                      : undefined}
                  </td>
                  <td
                    style={{
                      borderStyle: 'solid',
                      borderWidth: 1,
                      borderColor: 'black',
                      backgroundColor: getBackgroundFromRank(r.rank),
                      padding: 3,
                    }}
                  >
                    {r.score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {loading && <div style={{ fontSize: 20, marginTop: 10, textAlign: 'center', color: 'blue' }}>Loading...</div>}
        {!loading && errorMsg && (
          <div
            style={{
              fontSize: 20,
              marginTop: 10,
              textAlign: 'center',
              color: errorMsg === 'Success!' ? 'green' : 'red',
            }}
          >
            {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
};

export default DayPage;
