import React, { useState, useEffect } from 'react';
import SearchBox from '../InputFields/SearchBox';
import { GenerateTimeOptions } from '../InputFields/TimeOptions';
import { BASE_URL } from '../constants.ts';

type Props = {
  onSuccess: () => void;
};

const ModalAddShift: React.FC<Props> = ({ onSuccess }) => {
  const openModal = () => {
    resetState();
    FetchPersons();
    const modal = document.getElementById('add-shift-modal') as HTMLDialogElement | null;
    modal?.showModal();
  };

  const [formkey, setFormkey] = useState(Date.now());

  const [persons, setPersons] = useState<Array<{ value: string; name: string }>>([]);
  const [id, setSelectedPersonID] = useState('');
  const [, setSelectedPersonName] = useState('');
  const [start_time, setStartTime] = useState('');
  const [end_time, setEndTime] = useState('');
  const [start_date, setStartDate] = useState('');
  const [end_date, setEndDate] = useState('');
  const [comment, setComment] = useState('');

  const [searchString, setSearchString] = useState('');

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const resetState = () => {
    setFormkey(Date.now());
    setSelectedPersonID('');
    setSelectedPersonName('');
    setStartTime('');
    setEndTime('');
    setStartDate('');
    setEndDate('');
    setComment('');
  };

  const updateSearchString = (str: string) => {
    setSearchString(str);
    FetchPersons();
  };

  interface PersonFetch {
    id: number;
    first_name: string;
    last_name: string;
    job_role?: string;
    birthday?: string | null;
  }

  const API_KEY = import.meta.env.VITE_API_KEY as string;

  const URL_ENDPOINT = `/person?search_string=${searchString}&page=1&size=15`;

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
      console.log('Received data:', data);

      if (!Array.isArray(data.items)) {
        throw new Error('Error not array');
      }

      const PersonImportantData = data.items.map((person: PersonFetch) => {
        return {
          value: person.id.toString(),
          name: `${person.first_name} ${person.last_name}`,
        };
      });

      setPersons(PersonImportantData);
    } catch (error) {
      console.error('Error fetching persons:', error);
    }
  };

  useEffect(() => {
    FetchPersons();
  }, []);

  const HandleSelectPerson = (value: string) => {
    const id = parseInt(value, 10);
    console.log(`ID from box: ${id}`);

    setSelectedPersonID(value);
    const selectedOption = persons.find((option) => option.value === value);

    if (selectedOption) {
      setSelectedPersonName(selectedOption.name);
    }
  };

  const FormatDateTime = (date: string, time: string) => {
    return `${date}T${time}:00.000Z`;
  };

  const HandleSubmit = async () => {
    const formattedStartTime = FormatDateTime(start_date, start_time);
    const formattedEndTime = FormatDateTime(end_date, end_time);

    const idNumber = parseInt(id, 10);
    if (isNaN(idNumber)) {
      return;
    }

    const shift = {
      start_time: formattedStartTime,
      end_time: formattedEndTime,
      person_id: idNumber,
      comment: comment,
    };
    console.log('shift to send:', shift);

    try {
      const URL_ENDPOINT = `/shift`;

      const response = await fetch(`${BASE_URL}${URL_ENDPOINT}`, {
        method: 'POST',
        headers: {
          access_token: API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shift),
      });

      console.log('Sending shift ID:', id);

      if (!response.ok) {
        throw new Error(`Failed to add shift (${response.status})`);
      }

      const responseJson = await response.json();
      console.log('Response from server:', responseJson);
      setFormkey(Date.now());
      const modal = document.getElementById('add-shift-modal') as HTMLDialogElement | null;
      onSuccess();
      modal?.close();
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

  const TimeOptions: string[] = GenerateTimeOptions();

  return (
    <>
      <button className="btn" onClick={openModal}>
        Efterregistrera arbetspass
      </button>
      <dialog id="add-shift-modal" className="modal">
        <div key={formkey} className="modal-box">
          <div className="flex justify-start font-bold">
            <h2>Efterregistrera arbetspass</h2>
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

          {/* Fix for the modal element, since it has an autofocus by default to first element, which made the searchbox list popup when opening search box */}
          <div tabIndex={-1}></div>

          <div className="focus:outline-none grid grid-cols-3 gap-4 mt-10">
            <span className="mr-2 font-medium text-base p-4">Välj personal: </span>
            <div className="col-span-2">
              <SearchBox
                options={persons}
                onSelect={HandleSelectPerson}
                onUpdateString={updateSearchString}
                placeholder="Sök efter personal..."
              />
            </div>

            <span className="mr-2 font-medium text-base p-4">Starttid:</span>
            <label className="col-span-1 input input-bordered flex items-center">
              <input
                type="Date"
                className="grow"
                placeholder="åååå-mm-dd"
                value={start_date}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </label>
            <select
              className="select select-bordered"
              value={start_time}
              onChange={(e) => setStartTime(e.target.value)}
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
                type="Date"
                className="grow"
                placeholder="åååå-mm-dd"
                value={end_date}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </label>
            <select
              className="col-span-1 select select-bordered"
              value={end_time}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEndTime(e.target.value)}
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
              placeholder="Fyll i här..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-sm btn-circle absolute right-2 top-2">✕</button>
            </form>
            <button className="btn" onClick={HandleSubmit}>
              Spara
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default ModalAddShift;
