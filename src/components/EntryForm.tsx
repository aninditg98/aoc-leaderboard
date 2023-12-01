import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router';

function getStartingDate(year: number) {
  const startingDate = new Date();
  startingDate.setUTCFullYear(year);
  startingDate.setUTCMonth(11);
  startingDate.setUTCDate(1);
  startingDate.setUTCHours(5);
  startingDate.setMinutes(0);
  startingDate.setSeconds(0);
  return startingDate;
}

const MS_IN_DAY = 24 * 60 * 60 * 1000;

function EntryForm() {
  const { year } = useParams<{ year: string }>();
  const [email, setEmail] = useState<string>('');
  const [emails, setEmails] = useState<string[]>();
  const curDay = useMemo(() => {
    const now = Date.now();
    const msElapsed = now - getStartingDate(+year).getTime();
    return Math.floor(msElapsed / MS_IN_DAY + 1);
  }, []);
  const [day, setDay] = useState<number>(Math.min(curDay, 25));
  const [minutes, setMinutes] = useState<number>();
  const [seconds, setSeconds] = useState<number>();
  const [errorMsg, setErrorMsg] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const disabled = !emails || !email || day === undefined || minutes === undefined || seconds === undefined;
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const result = await axios.get('/api/get_emails');
        setEmails(result.data.emails);
        setLoading(false);
      } catch (e) {
        setErrorMsg('Didnt work, talk to Anindit or try refreshing');
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const onSumbit = React.useCallback(async () => {
    if (!emails?.find(e => e === email)) {
      if (!window.confirm(`Email ${email} has not been seen before, is this a mistake?`)) {
        return;
      }
    }
    try {
      setLoading(true);
      await axios.post('/api/submit_data', { email, day, minutes, seconds, year });
      setLoading(false);
      setErrorMsg('Success!');
    } catch (e) {
      setLoading(false);
      setErrorMsg('Didnt work, talk to Anindit');
    }
  }, [email, day, minutes, seconds]);

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
        <b style={{ fontSize: 25 }}>
          <u>Entry Form</u>
        </b>
        {emails && (
          <table style={{ borderSpacing: 5, marginTop: 10 }}>
            <tbody>
              <tr>
                <td>
                  <b>Email:</b>
                </td>
                <td>
                  <input
                    onChange={e => setEmail(e.target.value.trim())}
                    style={{ fontSize: 20, width: 350 }}
                    type="text"
                    name="email"
                    placeholder="email"
                    value={email}
                  />
                </td>
              </tr>
              <tr>
                <td style={{ width: 30 }}>
                  <b>Day:</b>
                </td>
                <td>
                  <input
                    style={{ fontSize: 20, width: 350 }}
                    value={day}
                    type="number"
                    min={1}
                    max={25}
                    name="email"
                    placeholder="day"
                    onChange={e => setDay(parseInt(e.target.value, 10))}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <b>Mins:</b>
                </td>
                <td>
                  <input
                    style={{ fontSize: 20, width: 350 }}
                    value={minutes}
                    type="number"
                    name="mins"
                    placeholder="mins"
                    onChange={e => setMinutes(parseInt(e.target.value, 10))}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <b>Secs:</b>
                </td>
                <td>
                  <input
                    style={{ fontSize: 20, width: 350 }}
                    value={seconds}
                    type="number"
                    name="secs"
                    placeholder="secs"
                    onChange={e => setSeconds(parseInt(e.target.value, 10))}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        )}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            disabled={disabled}
            onClick={onSumbit}
            style={{
              width: 150,
              height: 30,
              backgroundColor: disabled ? 'gray' : 'green',
              fontSize: 20,
              color: 'white',
              marginTop: 10,
            }}
          >
            Submit
          </button>
        </div>
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
        {
          <div style={{ fontSize: 20, marginTop: 10, textAlign: 'center', color: 'blue' }}>
            <a href="/" style={{ fontSize: 20, color: 'blue' }}>
              Home
            </a>
          </div>
        }
      </div>
    </div>
  );
}

export default EntryForm;
