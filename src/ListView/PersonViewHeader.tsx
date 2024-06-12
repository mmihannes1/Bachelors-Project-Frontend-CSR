import * as React from 'react';

import ModalAddShift from '../Modal/ModalAddShift';
import ModalRemovePerson from '../Modal/ModalRemovePerson';
import ModalEditPerson from '../Modal/ModalEditPerson';
import { BASE_URL } from '../constants.ts';

const API_KEY = import.meta.env.VITE_API_KEY as string;

type Props = {
  id: number;
  onRemovePerson: () => void;
  onAddShift: () => void;
  onEditPerson: () => void;
};

interface PersonInfo {
  first_name: string;
  last_name: string;
  display_tag: string;
  job_role: string;
}

const PersonViewHeader: React.FC<Props> = ({ id, onRemovePerson, onAddShift, onEditPerson }) => {
  const [personInfo, setPersonInfo] = React.useState<PersonInfo>({
    first_name: '',
    last_name: '',
    display_tag: '',
    job_role: '',
  } as PersonInfo);

  React.useEffect(() => {
    getPersonInfo();
  });

  const getPersonInfo = async () => {
    const ENDPOINT = `/person/${id}`;
    try {
      const response = await fetch(`${BASE_URL}${ENDPOINT}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          access_token: API_KEY,
        },
      });
      if (!response.ok) {
        throw new Error(`Fetch failed: ${response.status}`);
      }

      const data = (await response.json()) as PersonInfo;
      setPersonInfo(data);

      {
        /*console.log("Received data:", data);*/
      }
    } catch (error) {
      console.error('Error fetching person:', error);
      setPersonInfo({
        first_name: 'Error getting person info',
        last_name: '',
        display_tag: '',
        job_role: '',
      } as PersonInfo);
    }
  };

  return (
    <div
      className="form-line"
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div style={{ paddingLeft: '10px' }}>
        <h1>
          <b>Namn: </b>
          {personInfo.first_name + ' ' + personInfo.last_name}
        </h1>
        <h1>
          <b>Arbetsroll: </b>
          {personInfo.job_role}
        </h1>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: '10px',
        }}
      >
        <div style={{ marginRight: '10px' }}>
          <ModalAddShift onSuccess={onAddShift} />
        </div>
        <div style={{ marginRight: '10px' }}>
          <ModalEditPerson personID={id} onSuccess={onEditPerson} />
        </div>
        <ModalRemovePerson
          id={id}
          buttonLabel="Ta bort person"
          onSuccess={onRemovePerson}
          name={personInfo.first_name + ' ' + personInfo.last_name}
          display_tag={personInfo.display_tag}
          job_role={personInfo.job_role}
        />
      </div>
    </div>
  );
};

export default PersonViewHeader;
