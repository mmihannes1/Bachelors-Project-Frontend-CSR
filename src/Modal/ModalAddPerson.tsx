/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../constants.ts';
interface ModalType {
  /*children: React.ReactNode;*/
  onSuccess: () => void;
}

const API_KEY = import.meta.env.VITE_API_KEY as string;

const ModalAddPerson: React.FC<ModalType> = ({ onSuccess }) => {
  const [first_name, setSelectedPersonFirstName] = useState<string | null>(null);
  const [last_name, setSelectedPersonLastName] = useState<string | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const [formkey, setFormkey] = useState(Date.now());

  const resetState = () => {
    setFormkey(Date.now());
    setSelectedPersonFirstName(null);
    setSelectedPersonLastName(null);
    setDate(null);
    setRole(null);
  };

  const openModal = () => {
    resetState();
    const modal = document.getElementById('add-person-modal') as HTMLDialogElement | null;
    modal?.showModal();
  };

  useEffect(() => {});

  const HandleSubmit = async () => {
    const person = {
      first_name: first_name,
      last_name: last_name,
      birthday: date,
      job_role: role,
    };
    console.log(person);

    if (!first_name || !last_name || !date || !role) {
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 3000); // Hide the alert after 3 seconds
      return;
    }

    try {
      const URL_ENDPOINT = `/person`;

      const response = await fetch(`${BASE_URL}${URL_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          access_token: API_KEY,
        },
        body: JSON.stringify(person),
      });

      if (!response.ok) {
        throw new Error(`Failed to add person: ${response.status}`);
      }

      const responseJson = await response.json();
      console.log(responseJson);
    } catch (error) {
      console.error('Failed to add person: ', error);
    }
    onSuccess();
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000); // Hide the alert after 3 seconds
  };

  return (
    <>
      <button className="btn" onClick={openModal}>
        Registrera ny person
      </button>
      <dialog id={'add-person-modal'} className="modal">
        <div>
          <div
            key={formkey}
            className="modal-box"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: '20%',
              marginLeft: 'auto',
              marginRight: 'auto',
              width: '35%',
            }}
          >
            <br />
            <label className="input input-bordered flex items-center gap-2">
              <input
                type="text"
                name="first_name"
                className="grow"
                placeholder="Förnamn"
                onChange={(e) => setSelectedPersonFirstName(e.target.value)}
                required
              />
            </label>
            <br />
            <label className="input input-bordered flex items-center gap-2">
              <input
                type="text"
                name="last_name"
                className="grow"
                placeholder="Efternamn"
                onChange={(e) => setSelectedPersonLastName(e.target.value)}
                required
              />
            </label>
            <br />
            <label className="input input-bordered flex items-center gap-2">
              <input
                type="text"
                name="role"
                className="grow"
                placeholder="Arbetsroll"
                onChange={(e) => setRole(e.target.value)}
                required
              />
            </label>
            <br />
            <label className="input input-bordered flex items-center gap-2">
              <input
                type="date"
                name="date"
                className="grow"
                placeholder="Arbetsroll"
                onChange={(e) => setDate(new Date(e.target.value))}
                required
              />
            </label>

            <br />

            <div className="modal-action">
              <form method="dialog">
                <button className="btn btn-sm btn-circle absolute right-2 top-2">✕</button>
              </form>
              <button className="btn" onClick={HandleSubmit}>
                Spara
              </button>
            </div>
          </div>

          <div>
            {showErrorAlert && (
              <div
                className="alert alert-error"
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: '70%',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  width: '27%',
                }}
              >
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Vänligen fyll i alla fält</span>
              </div>
            )}
            {showSuccessAlert && (
              <div
                className="alert alert-success"
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: '70%',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  width: '27%',
                }}
              >
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Personen har skapats!</span>
              </div>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
};

export default ModalAddPerson;
