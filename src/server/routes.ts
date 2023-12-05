import express from 'express';
import { Pool } from 'pg';
import { config } from './dbconfig';
import _ from 'lodash';
const pool = new Pool(config);

const apiRouter = express.Router();

apiRouter.post('/submit_data', async (req, res: express.Response) => {
  try {
    const { day, minutes, seconds, email, year } = req.body;
    await pool.query(
      `INSERT into entries(email, day, minutes, seconds, year) values('${email}', ${day}, ${minutes}, ${seconds}, ${year})`,
    );
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

apiRouter.get('/get_emails', async (req, res: express.Response) => {
  try {
    const result = await pool.query(`select distinct email from entries`);
    res.json({ emails: result.rows.map(r => r.email) }).status(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

function getScore(rank: number) {
  return Math.ceil(50 * 0.8 ** rank);
}
function sortForDay(data: Record<string, ({ minutes: number; seconds: number } | undefined)[]>, day: number) {
  const dayData: {
    email: string;
    time: { minutes: number; seconds: number } | undefined;
    score: number;
    rank: number | undefined;
  }[] = Object.keys(data).map(email => ({ email, time: data[email][day], score: 0, rank: undefined }));
  dayData.sort((a, b) => {
    const aTime = a.time ? a.time.minutes * 60 + a.time.seconds : 1000000000;
    const bTime = b.time ? b.time.minutes * 60 + b.time.seconds : 1000000000;
    return aTime - bTime;
  });
  dayData.forEach((d, i) => {
    if (d.time) {
      d.score = getScore(i);
      d.rank = i;
    } else {
      d.score = 0;
      d.rank = undefined;
    }
  });
  return dayData;
}

apiRouter.get('/get_all_data/:year', async (req, res: express.Response) => {
  try {
    const result = await pool.query(`select * from entries where year = ${req.params.year} order by created_at`);
    let maxDay = 0;
    const data: Record<string, ({ minutes: number; seconds: number } | undefined)[]> = {};
    for (const line of result.rows) {
      maxDay = Math.max(maxDay, line.day);
      data[line.email] = data[line.email] || [];
      data[line.email][line.day] = { minutes: line.minutes, seconds: line.seconds };
    }
    const sortedData: { email: string; score: number }[][] = [];
    for (let day = 1; day <= maxDay; day++) {
      const dayData = sortForDay(data, day);
      sortedData.push(dayData);
    }
    const finalData: {
      email: string;
      totalScore: number;
      dailyScores: number[];
      dailyRanks: (number | undefined)[];
    }[] = [];
    for (const email of Object.keys(data)) {
      const dailyScores: number[] = [];
      const dailyRanks: (number | undefined)[] = [];
      for (let day = 1; day <= maxDay; day++) {
        const userIndex = sortedData[day - 1].findIndex(s => s.email === email);
        if (userIndex === undefined) throw new Error('Malformed Data!');
        const userDataForDay = sortedData[day - 1][userIndex];
        dailyRanks.push(userDataForDay.score !== 0 ? userIndex : undefined);
        dailyScores.push(userDataForDay.score);
      }
      finalData.push({ email, totalScore: _.sum(dailyScores), dailyScores, dailyRanks });
    }
    finalData.sort((a, b) => b.totalScore - a.totalScore);
    res.json({ data: finalData, days: maxDay }).status(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

apiRouter.get('/get_all_time_data/:year', async (req, res) => {
  try {
    const result = await pool.query(`select * from entries where year = ${req.params.year} order by created_at`);
    let maxDay = 0;
    const data: Record<string, ({ minutes: number; seconds: number } | undefined)[]> = {};

    for (const line of result.rows) {
      maxDay = Math.max(maxDay, line.day);
      data[line.email] = data[line.email] || [];
      data[line.email][line.day] = { minutes: line.minutes, seconds: line.seconds };
    }

    const sortedData: {
      email: string;
      totalTime: { minutes: number; seconds: number } | undefined;
      dailyTimes: { minutes: number; seconds: number } | undefined;
    }[][] = [];

    for (let day = 1; day <= maxDay; day++) {
      const dayData = sortForDay(data, day);
      sortedData.push(dayData);
    }

    const finalData: {
      email: string;
      totalTime: { minutes: number; seconds: number } | undefined;
      dailyTimes: { minutes: number; seconds: number } | undefined[];
      dailyRanks: (number | undefined)[];
      daysCompleted: number;
    }[] = [];

    for (const email of Object.keys(data)) {
      const dailyTimes: { minutes: number; seconds: number } | undefined[] = [];
      const dailyRanks: (number | undefined)[] = [];

      let daysCompleted = 0; // Initialize the daysCompleted variable

      for (let day = 1; day <= maxDay; day++) {
        const userIndex = sortedData[day - 1].findIndex(s => s.email === email);

        if (userIndex !== -1) {
          // Check if findIndex found a match
          const userDataForDay = sortedData[day - 1][userIndex];
          dailyTimes.push(userDataForDay.time || { minutes: 0, seconds: 0 });
          dailyRanks.push(userDataForDay.score !== 0 ? userIndex : undefined);

          // Check if there is data for the day, and increment daysCompleted if true
          if (userDataForDay.time !== undefined) {
            daysCompleted++;
          }
        } else {
          dailyTimes.push({ minutes: 0, seconds: 0 }); // or some default value if no match is found
        }
      }

      const totalMinutes = _.sumBy(dailyTimes, t => t.minutes);
      const totalSeconds = _.sumBy(dailyTimes, t => t.seconds);

      const totalTime = {
        minutes: Math.floor(totalMinutes + totalSeconds / 60),
        seconds: totalSeconds % 60,
      };

      finalData.push({ email, totalTime, dailyTimes, dailyRanks, daysCompleted });
    }

    finalData.sort((a, b) => {
      // Sort by higher daysCompleted first
      const daysCompletedDifference = b.daysCompleted - a.daysCompleted;

      if (daysCompletedDifference !== 0) {
        return daysCompletedDifference;
      }

      // If daysCompleted is equal, use totalTime as a tiebreaker
      const aTotalMinutes = a.totalTime ? a.totalTime.minutes * 60 + a.totalTime.seconds : 0;
      const bTotalMinutes = b.totalTime ? b.totalTime.minutes * 60 + b.totalTime.seconds : 0;

      return aTotalMinutes - bTotalMinutes;
    });

    res.json({ data: finalData, days: maxDay }).status(200);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

apiRouter.get('/get_day/:year/:day', async (req, res: express.Response) => {
  try {
    const day = parseInt(req.params.day, 10);
    const result = await pool.query(
      `select * from entries where year = ${req.params.year} and day = ${day} order by created_at`,
    );
    const data: Record<string, ({ minutes: number; seconds: number } | undefined)[]> = {};
    for (const line of result.rows) {
      data[line.email] = data[line.email] || [];
      data[line.email][line.day] = { minutes: line.minutes, seconds: line.seconds };
    }
    const sortedData = sortForDay(data, day);
    res.json({ data: sortedData }).status(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});
export default apiRouter;
