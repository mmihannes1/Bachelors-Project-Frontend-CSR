import React, { useState, useEffect } from 'react';
import { GenerateTimeOptions } from '../InputFields/TimeOptions';
import './ModalEditShift.css';
import { BASE_URL } from '../constants.ts';

interface ModalEditShiftProps {
  shiftID: number;
  onSuccess: () => void;
}

const ModalEditShift: React.FC<ModalEditShiftProps> = ({ shiftID, onSuccess }) => {
  const openModal = () => {
    const modal = document.getElementById(`edit-shift-modal-${shiftID}`) as HTMLDialogElement | null;
    if (modal) {
      FetchShiftData();
      modal.showModal();
    }
  };

  const [formkey, setFormkey] = useState(Date.now());

  const [person_id, setSelectedPersonID] = useState('');
  const [name, setSelectedPersonName] = useState('');
  const [shift_start_time, setShiftStartTime] = useState<string>('');
  const [shift_end_time, setShiftEndTime] = useState<string>('');
  const [shift_start_date, setShiftStartDate] = useState('');
  const [shift_end_date, setShiftEndDate] = useState('');
  const [shift_comment, setShiftComment] = useState('');

  const [initialPersonName, setInitialPersonName] = useState('');
  const [initialPersonId, setInitialPersonId] = useState('');
  const [initialStartTime, setInitialStartTime] = useState<string>('');
  const [initialEndTime, setInitialEndTime] = useState<string>('');
  const [initialStartDate, setInitialStartDate] = useState('');
  const [initialEndDate, setInitialEndDate] = useState('');
  const [initialComment, setInitialComment] = useState('');

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const resetState = () => {
    setSelectedPersonID(initialPersonId);
    setSelectedPersonName(initialPersonName);
    setShiftStartTime(initialStartTime);
    setShiftEndTime(initialEndTime);
    setShiftStartDate(initialStartDate);
    setShiftEndDate(initialEndDate);
    setShiftComment(initialComment);
  };

  const URL_ENDPOINT = `/shift`;

  const FetchShiftData = async () => {
    console.log(`Fetching data for shiftID: ${shiftID}`);
    try {
      const response = await fetch(`${BASE_URL}${URL_ENDPOINT}/${shiftID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          access_token: API_KEY,
        },
      });

      console.log('API Response:', await response.clone().json());

      if (!response.ok) {
        throw new Error(`Failed to fetch shift: ${response.status}`);
      }

      const shift = await response.json();
      console.log('Fetched shift data:', shift);

      setShiftStartDate(shift.start_time.split('T')[0]);
      setShiftEndDate(shift.end_time.split('T')[0]);
      setShiftStartTime(shift.start_time.split('T')[1].slice(0, 5));
      setShiftEndTime(shift.end_time.split('T')[1].slice(0, 5));
      setSelectedPersonID(shift.person_id.toString());
      setSelectedPersonName(`${shift.first_name} ${shift.last_name}`);
      setShiftComment(shift.comment || '');

      setInitialPersonName(`${shift.first_name} ${shift.last_name}`);
      setInitialPersonId(shift.person_id.toString());
      setInitialStartDate(shift.start_time.split('T')[0]);
      setInitialEndDate(shift.end_time.split('T')[0]);
      setInitialStartTime(shift.start_time.split('T')[1].slice(0, 5));
      setInitialEndTime(shift.end_time.split('T')[1].slice(0, 5));
      setInitialComment(shift.comment || '');
    } catch (error) {
      console.error('Failed to fetch shift data:', error);
    }
  };

  useEffect(() => {
    //FetchShiftData(); orsakar spamanrop
  }, [shiftID]);

  const FormatDateTime = (date: string, time: string) => {
    return `${date}T${time}:00.000Z`;
  };

  const HandleSubmit = async () => {
    const formattedStartTime = FormatDateTime(shift_start_date, shift_start_time);
    const formattedEndTime = FormatDateTime(shift_end_date, shift_end_time);

    const idNumber = parseInt(person_id, 10);
    if (isNaN(idNumber)) {
      return;
    }

    const editedShift = {
      start_time: formattedStartTime,
      end_time: formattedEndTime,
      person_id: idNumber,
      comment: shift_comment,
    };
    console.log('shift to send:', editedShift);

    try {
      const response = await fetch(`${BASE_URL}${URL_ENDPOINT}/${shiftID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          access_token: API_KEY,
        },
        body: JSON.stringify(editedShift),
      });

      if (!response.ok) {
        throw new Error(`Failed to update shift (${response.status})`);
      }

      const responseJson = await response.json();
      console.log('Response from server:', responseJson);
      console.log('Shift updated successfully');
      setFormkey(Date.now());
      const modal = document.getElementById(`edit-shift-modal-${shiftID}`) as HTMLDialogElement | null;
      modal?.close();
      onSuccess();
    } catch (error: unknown) {
      console.error('Failed to update shift:', error);
      if (Error instanceof Error) {
        setErrorMessage(Error.message);
      } else {
        setErrorMessage(`${error}`);
      }
      setShowError(true);
    }
  };

  const API_KEY = import.meta.env.VITE_API_KEY as string;

  useEffect(() => {
    const URL_ENDPOINT = `/person`;

    const FetchPersons = async () => {
      try {
        const response = await fetch(`${BASE_URL}${URL_ENDPOINT}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            access_token: API_KEY,
          },
        });

        if (!response.ok) {
          throw new Error(`Fetch failed: ${response.status}`);
        }

        const data = await response.json();
        {
          /*console.log("Received data:", data);*/
        }

        if (!Array.isArray(data.items)) {
          throw new Error('Error not array');
        }
      } catch (error) {
        console.error('Error fetching persons:', error);
      }
    };

    FetchPersons();
  }, []);

  const TimeOptions: string[] = GenerateTimeOptions();

  return (
    <>
      <button className="btn" onClick={openModal}>
        Uppdatera arbetspass
      </button>
      <dialog id={`edit-shift-modal-${shiftID}`} className="modal">
        <div
          key={formkey}
          className="modal-box"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            margin: 'auto',
            width: '35%',
          }}
        >
          <div className="flex justify-start font-bold">
            <h2>Ändra befintligt arbetspass</h2>
          </div>

          {showError && (
            <div role="alert" className="alert alert-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{errorMessage}</span>
              <button className="btn btn-sm btn-circle " onClick={() => setShowError(false)}>
                ✕
              </button>
            </div>
          )}

          <div tabIndex={-1}></div>

          <div className="focus:outline-none grid grid-cols-3 gap-4 mt-10">
            <span className="mr-2 font-medium text-base p-4">Personal: </span>
            <div className="col-span-2">
              <input type="text" placeholder={name} className="input input-bordered w-full max-w-xs" disabled />
            </div>

            <span className="mr-2 font-medium text-base p-4">Starttid:</span>
            <label className="col-span-1 input input-bordered flex items-center">
              <input
                type="date"
                id="shiftDate"
                value={shift_start_date}
                onChange={(e) => setShiftStartDate(e.target.value)}
              />
            </label>
            <select
              className="select select-bordered"
              value={shift_start_time}
              onChange={(e) => setShiftStartTime(e.target.value)}
            >
              <option disabled value="">
                Starttid
              </option>
              {TimeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>

            <span className="mr-2 font-medium text-base p-4">Sluttid:</span>
            <label className="col-span-1 input input-bordered flex items-center">
              <input
                type="date"
                id="shiftDate"
                className="ModalEditShift"
                value={shift_end_date}
                onChange={(e) => setShiftEndDate(e.target.value)}
              />
            </label>
            <select
              className="col-span-1 select select-bordered"
              value={shift_end_time}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setShiftEndTime(e.target.value)}
            >
              <option disabled value="">
                Sluttid
              </option>
              {TimeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>

            <span className="mr-2 font-medium text-base p-4 ">Kommentar:</span>
            <textarea
              className="col-span-2 textarea textarea-bordered"
              value={shift_comment}
              onChange={(e) => setShiftComment(e.target.value)}
            ></textarea>
          </div>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-sm btn-circle absolute right-2 top-2">✕</button>
            </form>
            <button className="btn" onClick={HandleSubmit}>
              Spara
            </button>
            <button className="btn" onClick={resetState}>
              Återställ
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default ModalEditShift;
