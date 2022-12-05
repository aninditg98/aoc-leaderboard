import React, { useState, useEffect } from 'react';
import axios from 'axios';
import _ from 'lodash';

const getBackgroundFromRank = (rank: number | undefined) => {
  if (_.isNil(rank)) return '#fa8072';
  if (rank > 2) return '#7ccd7c';
  if (rank === 0) return '#FFD700';
  if (rank === 1) return '#C0C0C0';
  if (rank === 2) return '#CD7F32';
};
const MainPage: React.FunctionComponent = () => {
  const [errorMsg, setErrorMsg] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<
    { email: string; totalScore: number; dailyScores: number[]; dailyRanks: (number | undefined)[] }[]
  >();
  const [days, setDays] = useState(0);
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const result = await axios.get('/api/get_all_data');
        setData(result.data.data);
        setDays(result.data.days);
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
          <u>Advent of Code Leaderboard</u>
        </b>
        <a href="/entry_form" style={{ fontSize: 20, color: 'blue', marginTop: 10 }}>
          Entry Form
        </a>
        {data && (
          <table
            style={{ marginTop: 10, borderStyle: 'solid', borderWidth: 2, borderColor: 'black', borderSpacing: 0 }}
          >
            <thead>
              <tr>
                <th style={{ borderStyle: 'solid', borderWidth: 1, borderColor: 'black', padding: 5 }}>Rank</th>
                <th style={{ borderStyle: 'solid', borderWidth: 1, borderColor: 'black', padding: 5 }}>Email</th>
                <th style={{ borderStyle: 'solid', borderWidth: 1, borderColor: 'black', padding: 5 }}>Total Score</th>
                {_.range(days).map(i => (
                  <th
                    style={{ borderStyle: 'solid', borderWidth: 1, borderColor: 'black', padding: 5 }}
                    key={`header-${i}`}
                  >
                    <a href={`/day/${i + 1}`} style={{ fontSize: 20, color: 'blue', marginTop: 10 }}>
                      Day {i + 1}
                    </a>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody style={{ fontSize: 16 }}>
              {data.map((r, i) => (
                <tr key={`row-{i}`}>
                  <td
                    style={{
                      borderStyle: 'solid',
                      borderWidth: 1,
                      borderColor: 'black',
                      backgroundColor: getBackgroundFromRank(i),
                      padding: 3,
                    }}
                  >
                    {i + 1}
                  </td>
                  <td
                    style={{
                      borderStyle: 'solid',
                      borderWidth: 1,
                      borderColor: 'black',
                      backgroundColor: getBackgroundFromRank(i),
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
                      backgroundColor: getBackgroundFromRank(i),
                      padding: 3,
                    }}
                  >
                    {r.totalScore}
                  </td>
                  {_.range(days).map(j => (
                    <td
                      key={`body-${j}`}
                      style={{
                        borderStyle: 'solid',
                        borderWidth: 1,
                        borderColor: 'black',
                        backgroundColor: getBackgroundFromRank(r.dailyRanks[j]),
                        padding: 3,
                      }}
                    >
                      {r.dailyScores[j]}
                    </td>
                  ))}
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

export default MainPage;
