import * as React from 'react';
import ModalAddPerson from '../Modal/ModalAddPerson';
import ModalAddShift from '../Modal/ModalAddShift';

type Props = {
  onAddShift: () => void;
};

const ListViewHeader: React.FC<Props> = ({ onAddShift }) => {
  return (
    <>
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
          <h1 className="font-bold">Rapporterad tid</h1>
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
            <ModalAddPerson onSuccess={onAddShift} />
          </div>
          <ModalAddShift onSuccess={onAddShift} />
        </div>
      </div>
    </>
  );
};

export default ListViewHeader;
