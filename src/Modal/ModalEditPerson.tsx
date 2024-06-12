import React, { useState, useEffect } from 'react';
import './ModalEditShift.css';
import { BASE_URL } from '../constants.ts';

interface ModalEditPersonProps {
  personID: number;
  onSuccess: () => void;
}

const ModalEditPerson: React.FC<ModalEditPersonProps> = ({ personID, onSuccess }) => {
  const openModal = () => {
    const modal = document.getElementById(`edit-person-modal-${personID}`) as HTMLDialogElement | null;
    if (modal) {
      FetchPersonData();
      modal.showModal();
    }
  };

  const openErrorModal = () => {
    const modal = document.getElementById(`edit-person-modal-${personID}`) as HTMLDialogElement | null;
    modal?.close();

    const errModal = document.getElementById(`edit-person-error-modal`) as HTMLDialogElement | null;
    errModal?.showModal();
  };

  const [formkey, setFormkey] = useState(Date.now());

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const [initialFirstName, setInitialFirstName] = useState('');
  const [initialLastName, setInitialLastName] = useState('');
  const [initialJobRole, setInitialJobRole] = useState('');
  const [initialBirthDate, setInitialBirthDate] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const resetState = () => {
    setFirstName(initialFirstName);
    setLastName(initialLastName);
    setJobRole(initialJobRole);
    setBirthDate(initialBirthDate);
  };

  const URL_ENDPOINT = `/person`;

  const FetchPersonData = async () => {
    setErrorMessage(`Kunde inte hämta personinfo`);
    console.log(`Fetching data for shiftID: ${personID}`);
    try {
      const response = await fetch(`${BASE_URL}${URL_ENDPOINT}/${personID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          access_token: API_KEY,
        },
      });

      console.log('API Response:', await response.clone().json());

      if (!response.ok) {
        setErrorMessage(`Kunde inte hämta personinfo: ${response.status}`);
        throw new Error(`Failed to fetch shift: ${response.status}`);
      }

      const person = await response.json();
      console.log('Fetched shift data:', person);

      setFirstName(person.first_name);
      setLastName(person.last_name);
      setJobRole(person.job_role);
      setBirthDate(person.birthday.split('T')[0]);

      setInitialFirstName(person.first_name);
      setInitialLastName(person.last_name);
      setInitialJobRole(person.job_role);
      setInitialBirthDate(person.birthday.split('T')[0]);
    } catch (error) {
      openErrorModal();
      console.error('Failed to fetch person data:', error);
    }
  };

  useEffect(() => {
    //FetchShiftData(); orsakar spamanrop
  }, [personID]);

  const FormatDate = (date: string) => {
    return `${date}T20:00:00`;
  };

  const HandleSubmit = async () => {
    setErrorMessage(`Kunde inte uppdatera person`);
    const formattedBirthDate = FormatDate(birthDate);

    const editedShift = {
      first_name: firstName,
      last_name: lastName,
      job_role: jobRole,
      birthday: formattedBirthDate,
    };
    console.log('person to send:', editedShift);

    try {
      const response = await fetch(`${BASE_URL}${URL_ENDPOINT}/${personID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          access_token: API_KEY,
        },
        body: JSON.stringify(editedShift),
      });

      if (!response.ok) {
        setErrorMessage(`Kunde inte uppdatera person: ${response.status}`);
        throw new Error(`Failed to update shift (${response.status})`);
      }

      const responseJson = await response.json();
      console.log('Response from server:', responseJson);
      console.log('Person updated successfully');
      setFormkey(Date.now());
      const modal = document.getElementById(`edit-person-modal-${personID}`) as HTMLDialogElement | null;
      modal?.close();
      onSuccess();
    } catch (error: unknown) {
      openErrorModal();
      console.error('Failed to update person:', error);
    }
  };

  const API_KEY = import.meta.env.VITE_API_KEY as string;

  useEffect(() => {}, []);

  return (
    <>
      <button className="btn" onClick={openModal}>
        Uppdatera person
      </button>
      <dialog id={`edit-person-modal-${personID}`} className="modal">
        <div key={formkey} className="modal-box">
          <div className="flex justify-start font-bold">
            <h2>Ändra person</h2>
          </div>

          <div tabIndex={-1}></div>

          <div className="focus:outline-none grid grid-cols-3 gap-4 mt-10">
            <span className="mr-2 font-medium text-base p-4">Förnamn: </span>
            <input
              className="input input-bordered w-full col-span-2"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />

            <span className="mr-2 font-medium text-base p-4 ">Efternamn: </span>
            <input
              className="input input-bordered w-full max-w-xs col-span-2"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />

            <span className="mr-2 font-medium text-base p-4 ">Arbetsroll: </span>
            <input
              className="input input-bordered w-full max-w-xs col-span-2"
              type="text"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
            />

            <span className="mr-2 font-medium text-base p-4">Starttid: </span>
            <label className="col-span-1 input input-bordered flex items-center">
              <input type="date" id="shiftDate" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
            </label>
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

      <dialog id={'edit-person-error-modal'} className="modal">
        <div className="modal-box">
          <p className="mr-2 font-medium text-base p-4">{errorMessage}</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Ok</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default ModalEditPerson;
