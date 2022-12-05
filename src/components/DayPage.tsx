import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash';

const getBackgroundFromRank = (rank: number | undefined) => {
  if (_.isNil(rank)) return '#fa8072';
  if (rank > 2) return '#7ccd7c';
  if (rank === 0) return '#FFD700';
  if (rank === 1) return '#C0C0C0';
  if (rank === 2) return '#CD7F32';
};
const DayPage: React.FunctionComponent = () => {
  const params = useParams<{ day: string }>();
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
        const result = await axios.get(`/api/get_day/${params.day}`);
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
    <div style={{ display: 'flex', justifyContent: 'center' }}>
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
          <u>Day 1</u>
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
                <th style={{ borderStyle: 'solid', borderWidth: 1, borderColor: 'black', padding: 5 }}>Mins</th>
                <th style={{ borderStyle: 'solid', borderWidth: 1, borderColor: 'black', padding: 5 }}>Seconds</th>
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
                    {r.time?.minutes}
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
                    {r.time?.seconds}
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
