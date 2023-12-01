import React, { useState, useEffect } from 'react';
import axios from 'axios';
import _ from 'lodash';
import classNames from 'classnames';

const getBackgroundFromRank = (rank: number | undefined) => {
  if (_.isNil(rank) || !rank) return '#ffa07a';
  if (rank > 2) return '#00ff00';
  if (rank === 0) return '#ffcc00';
  if (rank === 1) return '#d3d3d3';
  if (rank === 2) return '#cc7722';
};

const thRankClassNames = 'sticky left-0 max-w-[50px] min-w-[50px] w-[50px]';
const thEmailClassNames =
  'sticky left-[50px] max-w-[80px] min-w-[80px] w-[80px] sm:max-w-[170px] sm:min-w-[170px] sm:w-[170px]';
const thScoreClassNames =
  'sticky left-[130px] sm:left-[220px] max-w-[60px] min-w-[60px] w-[60px] sm:max-w-[140px] sm:min-w-[140px] sm:w-[140px]';
const cellClassNames = 'border border-black px-3 py-3 text-center tracking-wider whitespace overflow-x-auto';
const thClassNames = 'text-xs font-bold bg-gray-200 text-gray-500';

const MainPage: React.FunctionComponent = () => {
  const [errorMsg, setErrorMsg] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] =
    useState<{ email: string; totalScore: number; dailyScores: number[]; dailyRanks: (number | undefined)[] }[]>();
  const [days, setDays] = useState(0);
  const [year, setYear] = useState(2023);
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const result = await axios.get(`/api/get_all_data/${year}`);
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
    <>
      <div className="fixed left-0 right-0 top-0 text-center space-y-5 my-5 font-['Andale_Mono'] -z-10">
        <b className="font-mono text-xl">Advent of Code Leaderboard</b>
        <a href="/entry_form" className="block underline text-blue-500">
          Entry Form
        </a>
      </div>
      {data && (
        <table className="mt-32 min-w-full divide-y divide-gray-200 font-['Andale_Mono'] z-10">
          <thead className="sticky top-0 z-10">
            <tr>
              <th scope="col" className={classNames(thRankClassNames, cellClassNames, thClassNames)}>
                Rank
              </th>
              <th scope="col" className={classNames(thEmailClassNames, cellClassNames, thClassNames)}>
                Email
              </th>
              <th scope="col" className={classNames(thScoreClassNames, cellClassNames, thClassNames)}>
                TotalScore
              </th>
              {_.range(days).map(i => (
                <th
                  scope="col"
                  className={classNames(cellClassNames, thClassNames, 'max-w-[60px]')}
                  key={`header-${i}`}
                >
                  <a className="flex" href={`/day/${year}/${i + 1}`}>
                    D<span className="hidden sm:block">ay </span>
                    {i + 1}
                  </a>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((r, i) => {
              const rankBg = getBackgroundFromRank(i);
              return (
                <tr key={`row-${i}`}>
                  <td className={classNames(thRankClassNames, cellClassNames, `bg-[${rankBg}]`)}>{i + 1}</td>
                  <td className={classNames(thEmailClassNames, cellClassNames, `bg-[${rankBg}]`)}>{r.email}</td>
                  <td className={classNames(thScoreClassNames, cellClassNames, `bg-[${rankBg}]`)}>{r.totalScore}</td>
                  {_.range(days).map(j => {
                    const dailyRankBg = getBackgroundFromRank(r.dailyRanks[j]);
                    return (
                      <td
                        key={`body-${j}`}
                        className={classNames(cellClassNames, 'max-w-[60px]', `bg-[${dailyRankBg}]`)}
                      >
                        {r.dailyScores[j]}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <div className="mt-32">
        {loading && <div className="text-xl mt-5 text-center text-blue-300">Loading...</div>}
        {!loading && errorMsg && (
          <div className={`text-xl mt-5 text-center text-[${errorMsg === 'Success!' ? 'green' : 'red'}]`}>
            {errorMsg}
          </div>
        )}
      </div>
    </>
  );
};

export default MainPage;
