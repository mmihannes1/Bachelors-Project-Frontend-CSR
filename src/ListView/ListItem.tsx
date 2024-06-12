import './ListItem.css';
import * as React from 'react';
import ModalEditShift from '../Modal/ModalEditShift';
import ModalRemoveShift from '../Modal/ModalRemoveShift';

// Define props interface for list item
export interface ListItemProps {
  person_id: number;
  name: string;
  start_time: Date;
  end_time: Date;
  comment: string;
  id: number;
  doClick: () => void;
  doRefresh: () => void;
}

const ListItem: React.FC<ListItemProps> = ({ id, name, start_time, end_time, comment, doClick, doRefresh }) => {
  // Format start and end times for display
  const startDate = start_time.toLocaleDateString('sv-SE');
  const startTime = start_time.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit', hour12: false });
  const endDate = end_time.toLocaleDateString('sv-SE');
  const endTime = end_time.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit', hour12: false });

  // Function to reload the view by calling the provided doRefresh function
  const reloadView = () => {
    doRefresh();
  };

  return (
    <tr className="w-full">
      <td>
        <button onClick={doClick}>
          <div className="person-name">{name}</div>
        </button>
      </td>
      <td>
        <div className="start-time">
          {startDate} {startTime}
        </div>
      </td>
      <td>
        <div className="end-time">
          {endDate} {endTime}
        </div>
      </td>
      <td>
        <div className="comment">{comment}</div>
      </td>
      <td>
        <div className="dropdown dropdown-left">
          <div tabIndex={0} role="button" className="dropdown-trigger m-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-5 w-5 stroke-current"
            >
              <g transform="rotate(90 12 12)">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                ></path>
              </g>
            </svg>
          </div>
          <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
            <li>
              <ModalRemoveShift
                id={id}
                name={name}
                start_time={start_time}
                end_time={end_time}
                comment={comment}
                buttonLabel="Radera arbetspass"
                onSuccess={reloadView}
              />
            </li>
            <li>
              <ModalEditShift shiftID={id} onSuccess={reloadView} />
            </li>
          </ul>
        </div>
      </td>
    </tr>
  );
};

export default ListItem;
