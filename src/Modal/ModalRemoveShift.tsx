import React, { useState } from 'react';
import { BASE_URL } from '../constants.ts';

const API_KEY = import.meta.env.VITE_API_KEY as string;

type Props = {
  buttonLabel: string;
  id: number;
  name: string;
  start_time: Date;
  end_time: Date;
  comment: string;
  onSuccess: () => void;
};

const ModalRemoveShift: React.FC<Props> = ({ buttonLabel, id, name, start_time, end_time, comment, onSuccess }) => {
  const openModal = () => {
    const modal = document.getElementById('remove-shift-modal' + id) as HTMLDialogElement | null;
    modal?.showModal();
  };

  const showSuccessAlert = () => {
    const modal = document.getElementById('remove-shift-success-modal') as HTMLDialogElement | null;
    modal?.showModal();
  };

  const showErrorAlert = () => {
    const modal = document.getElementById('remove-shift-error-modal') as HTMLDialogElement | null;
    modal?.showModal();
  };

  const [errorCode, setErrorCode] = useState(0);

  const removeApiCall = async () => {
    const ENDPOINT = `/shift/${id}`;
    setErrorCode(0);

    try {
      const response = await fetch(`${BASE_URL}${ENDPOINT}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          access_token: API_KEY,
        },
      });

      if (!response.ok) {
        setErrorCode(response.status);
        throw new Error(`Delete failed: ${response.status}`);
      } else {
        onSuccess();
        showSuccessAlert();
      }
    } catch (error) {
      showErrorAlert();
      console.error('Error deleting shift:', error);
    }
  };

  return (
    <>
      <button className="btn" onClick={openModal}>
        {buttonLabel}
      </button>
      <dialog id={'remove-shift-modal' + id} className="modal">
        <div
          className="modal-box"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            margin: 'auto',
            width: '35%',
          }}
        >
          <div>
            <p className="mr-2 font-medium text-base p-4">
              Du är på väg att ta bort följande arbetspass: <br />
              <br />
              {name} <br />
              Starttid: {start_time.toLocaleDateString()} {start_time.toLocaleTimeString()} <br />
              Sluttid: {end_time.toLocaleDateString()} {end_time.toLocaleTimeString()} <br />
              Kommentar: {comment} <br />
              <br />
              Vill du fortsätta? <br />
            </p>
            <div className="modal-action">
              <button className="btn" onClick={removeApiCall} style={{ marginRight: '10px' }}>
                Bekräfta
              </button>
              <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={() => {
                const modal = document.getElementById('remove-shift-modal' + id) as HTMLDialogElement | null;
                modal?.close();
              }}>
                ✕
              </button>
            </div>
          </div>
        </div>
      </dialog>

      <dialog id={'remove-shift-error-modal'} className="modal">
        <div
          className="modal-box"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            margin: 'auto',
            width: '35%',
          }}
        >
          <p className="mr-2 font-medium text-base p-4">Ett fel uppstod: {errorCode}</p>
          <div className="modal-action">
            <button className="btn" onClick={() => {
              const modal = document.getElementById('remove-shift-error-modal') as HTMLDialogElement | null;
              modal?.close();
            }}>
              Ok
            </button>
          </div>
        </div>
      </dialog>

      <dialog id={'remove-shift-success-modal'} className="modal">
        <div
          className="modal-box"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            margin: 'auto',
            width: '35%',
          }}
        >
          <p className="mr-2 font-medium text-base p-4">Passet har tagits bort</p>
          <div className="modal-action">
            <button className="btn" onClick={() => {
              const modal = document.getElementById('remove-shift-success-modal') as HTMLDialogElement | null;
              modal?.close();
            }}>
              Ok
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default ModalRemoveShift;
