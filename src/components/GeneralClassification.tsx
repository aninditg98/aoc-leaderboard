import React, { useState, useEffect } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { useParams } from 'react-router';

const getBackgroundFromRank = (rank: number | undefined) => {
  if (_.isNil(rank)) return '#ffa07a';
  if (rank > 2) return '#00ff00';
  if (rank === 0) return '#FFFF00';
  if (rank === 1) return '#d3d3d3';
  if (rank === 2) return '#cc7722';
};

const GeneralClassification: React.FunctionComponent = () => {
  const [errorMsg, setErrorMsg] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<
    {
      email: string;
      daysCompleted: number;
      totalTime: { minutes: number; seconds: number } | undefined;
      dailyTimes: { minutes: number; seconds: number } | undefined[];
    }[]
  >();
  const [days, setDays] = useState(0);
  const { year } = useParams<{ year: string }>();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const result = await axios.get(`/api/get_all_time_data/${year}`);
        setData(result.data.data);
        setDays(result.data.days);
        setLoading(false);
      } catch (e) {
        setErrorMsg('Didnt work, talk to Anindit or try refreshing');
        setLoading(false);
      }
    };
    fetch();
  }, [year]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', fontFamily: 'Andale Mono', overflowX: 'auto' }}>
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
          overflowX: 'auto',
        }}
      >
        <b style={{ fontSize: 30 }}>
          <u>General Classification</u>
        </b>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
          <a href={`/entry_form/${year}`} style={{ fontSize: 20, color: 'blue', marginRight: 10 }}>
            Entry Form
          </a>
          <a href={`/home/${year}`} style={{ fontSize: 20, color: 'blue' }}>
            Points Classification
          </a>
        </div>
        {data && (
          <table
            style={{ marginTop: 10, borderStyle: 'solid', borderWidth: 2, borderColor: 'black', borderSpacing: 0 }}
          >
            <thead>
              <tr>
                <th style={{ borderStyle: 'solid', borderWidth: 1, borderColor: 'black', padding: 5 }}>Rank</th>
                <th style={{ borderStyle: 'solid', borderWidth: 1, borderColor: 'black', padding: 5 }}>Email</th>
                <th style={{ borderStyle: 'solid', borderWidth: 1, borderColor: 'black', padding: 5 }}>
                  Days Completed
                </th>
                <th style={{ borderStyle: 'solid', borderWidth: 1, borderColor: 'black', padding: 5 }}>Total Time</th>
                {_.range(days - 1, -1, -1).map(i => (
                  <th
                    style={{ borderStyle: 'solid', borderWidth: 1, borderColor: 'black', padding: 5 }}
                    key={`header-${i}`}
                  >
                    <a href={`/day/${year}/${i + 1}`} style={{ fontSize: 20, color: 'blue', marginTop: 10 }}>
                      Day {i + 1}
                    </a>
                  </th>
                ))}
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
                    {r.daysCompleted}
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
                    {r.totalTime && (
                      <>
                        {r.totalTime.minutes >= 60
                          ? `${Math.floor(r.totalTime.minutes / 60)}h ${r.totalTime.minutes % 60}m`
                          : `${r.totalTime.minutes}m`}
                        :{String(r.totalTime.seconds).padStart(2, '0')}
                      </>
                    )}
                  </td>
                  {_.range(days - 1, -1, -1).map(j => (
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
                      {r.dailyTimes[j] &&
                        `${r.dailyTimes[j].minutes}:${String(r.dailyTimes[j].seconds).padStart(2, '0')}`}
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
        <div style={{ marginTop: 10 }}>
          {['2022', '2023'].map(y => (
            <a
              key={`${y}-link`}
              href={`/home/${y}`}
              style={{
                fontSize: 20,
                color: y === year ? 'white' : 'blue',
                marginTop: 10,
                backgroundColor: y === year ? 'blue' : undefined,
                marginLeft: 10,
              }}
            >
              {y}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GeneralClassification;
