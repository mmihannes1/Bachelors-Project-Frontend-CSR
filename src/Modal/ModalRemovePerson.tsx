import React from 'react';
import { BASE_URL } from '../constants.ts';

const API_KEY = import.meta.env.VITE_API_KEY as string;

type Props = {
  buttonLabel: string;
  id: number;
  name: string;
  display_tag: string;
  job_role: string;
  onSuccess: () => void;
};

const ModalRemovePerson: React.FC<Props> = ({ buttonLabel, id, name, display_tag, job_role, onSuccess }) => {
  const openModal = () => {
    const modal = document.getElementById('remove-person-modal' + id) as HTMLDialogElement | null;
    modal?.showModal();
  };

  const showSuccessAlert = () => {
    const modal = document.getElementById('remove-person-success-modal') as HTMLDialogElement | null;
    modal?.showModal();
  };

  const showErrorAlert = () => {
    const modal = document.getElementById('remove-person-error-modal') as HTMLDialogElement | null;
    modal?.showModal();
  };

  const [errorCode, setErrorCode] = React.useState(0);

  const removeApiCall = async () => {
    const ENDPOINT = `/person/${id}`;
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
      console.error('Error deleting person:', error);
    }
  };

  return (
    <>
      <button className="btn" onClick={openModal}>
        {buttonLabel}
      </button>
      <dialog id={'remove-person-modal' + id} className="modal">
        <div className="modal-box">
          <div>
            <p className="mr-2 font-medium text-base p-4">
              Du är på väg att ta bort följande person: <br />
              <br />
              {name} <br />
              {display_tag} <br />
              {job_role} <br />
            </p>
            <div className="modal-action">
              <form method="dialog">
                <button className="btn" onClick={removeApiCall} style={{ marginRight: '10px' }}>
                  Bekräfta
                </button>
                <form method="dialog">
                  <button className="btn btn-sm btn-circle absolute right-2 top-2">✕</button>
                </form>
              </form>
            </div>
          </div>
        </div>
      </dialog>

      <dialog id={'remove-person-error-modal'} className="modal">
        <div className="modal-box">
          <p className="mr-2 font-medium text-base p-4">Ett fel uppstod: {errorCode}</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Ok</button>
            </form>
          </div>
        </div>
      </dialog>

      <dialog id={'remove-person-success-modal'} className="modal">
        <div className="modal-box">
          <p className="mr-2 font-medium text-base p-4">Personen har tagits bort</p>
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

export default ModalRemovePerson;
