import * as React from 'react';
import { useState, useEffect } from 'react';
import ListItem from './ListItem';
import PaginationControls, { PaginationData } from './PaginationControls';
import Navbar from './Navbar';
import TableHeaderRow, { SortOptions } from './TableHeaderRow';
import ListViewHeader from './ListViewHeader';
import PersonViewHeader from './PersonViewHeader';
import Dropdown from './Dropdown';
import { BASE_URL } from '../constants.ts';

// Shift data
interface Shift {
  id: number;
  first_name: string;
  last_name: string;
  start_time: string;
  end_time: string;
  person_id: number;
  name: string;
  comment: string;
}

// Api Response Metadata
interface ApiResponse {
  total: number;
  page: number;
  size: number;
  pages: number;
  items: Shift[];
  pagination: PaginationData;
}

// Sends api request to URL
async function sendApiRequest(URL: string, API_KEY: string) {
  const response = await fetch(URL, {
    headers: {
      access_token: API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch data ${response.status}`);
  }

  return response;
}

// Saves Shift info into items
function parseApiResponse(response: ApiResponse): ApiResponse {
  const items: Shift[] = response.items.map((item: Shift) => ({
    ...item,
    name: `${item.first_name} ${item.last_name}`,
  }));

  const pagination: PaginationData = {
    total: response.total,
    page: response.page,
    size: response.size,
    pages: response.pages,
  };

  return {
    total: response.total,
    page: response.page,
    size: response.size,
    pages: response.pages,
    items,
    pagination,
  };
}

// Gets URL for api call based on current view
function getUrl(
  isPersonView: boolean,
  personId: number | null,
  sortOptions: SortOptions,
  searchQuery: string,
  startDate: string,
  endDate: string,
  currentPage: number,
  pageSize: number,
): string {
  let url = isPersonView && personId ? `${BASE_URL}/person/${encodeURIComponent(personId)}/shift` : `${BASE_URL}/shift`;
  url += `?page=${encodeURIComponent(currentPage)}&size=${encodeURIComponent(pageSize)}`;

  if (!isPersonView) {
    if (sortOptions.sortOrder !== 'none') {
      url += `&sort_by=${encodeURIComponent(sortOptions.columnName)}&order_type=${encodeURIComponent(sortOptions.sortOrder)}`;
    }
    if (searchQuery.trim() !== '') {
      url += `&search_string=${encodeURIComponent(searchQuery)}`;
    }
    if (startDate.trim() !== '') {
      url += `&start_date=${encodeURIComponent(startDate)}`;
    }
    if (endDate.trim() !== '') {
      url += `&end_date=${encodeURIComponent(endDate)}`;
    }
  }

  return url;
}

const paginationSizes = [25, 50, 75, 100];

// ListView React Component
const ListView: React.FC = () => {
  const [isPersonView, setIsPersonView] = useState(false);
  const [currentPersonId, setCurrentPersonId] = useState<number | null>(null);
  const [items, setItems] = useState<Shift[]>([]);
  const [pageSize, setPageSize] = useState<number>(paginationSizes[0]);
  const [paginationInfo, setPaginationInfo] = useState<PaginationData>({ total: 0, page: 1, size: pageSize, pages: 1 });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [sortOptions, setSortOptions] = useState<SortOptions>({ columnName: 'first_name', sortOrder: 'none' });

  const API_KEY = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchQuery, isPersonView, sortOptions, currentPersonId, startDate, endDate]);

  const fetchData = async () => {
    try {
      const URL = getUrl(
        isPersonView,
        currentPersonId,
        sortOptions,
        searchQuery,
        startDate,
        endDate,
        currentPage,
        pageSize,
      );
      const response = await sendApiRequest(URL, API_KEY);
      const responseData = await response.json();
      const parsedResponse: ApiResponse = parseApiResponse(responseData);
      setItems(parsedResponse.items);
      setPaginationInfo(parsedResponse.pagination);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Display an error message to the user
    }
  };

  const handlePersonClick = (personId: number | null) => {
    setIsPersonView(personId !== null);
    setCurrentPersonId(personId);
    if (personId === null) {
      setSearchQuery('');
    }
  };

  const onPageSizeChange = (newPageSize: number): void => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const resetAllStates = () => {
    setIsPersonView(false);
    setCurrentPersonId(null);
    setItems([]);
    setPaginationInfo({ total: 0, page: 1, size: paginationSizes[0], pages: 1 });
    setCurrentPage(1);
    setPageSize(paginationSizes[0]);
    setSearchQuery('');
    setStartDate('');
    setEndDate('');
    setSortOptions({ columnName: 'first_name', sortOrder: 'none' });
  };

  return (
    <div>
      {!isPersonView && <ListViewHeader onAddShift={fetchData} />}
      {isPersonView && (
        <PersonViewHeader
          id={currentPersonId as number}
          key={`person-header-${currentPersonId}`}
          onAddShift={fetchData}
          onRemovePerson={resetAllStates}
          onEditPerson={fetchData}
        />
      )}
      <Navbar
        onSearch={setSearchQuery}
        isPersonView={isPersonView}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        pageSize={pageSize}
        paginationSizes={paginationSizes}
        onPageSizeChange={onPageSizeChange}
        onReset={resetAllStates}
      />
      {!isPersonView ? (
        <div>
          <table className="table table-zebra">
            <TableHeaderRow onSortChange={(columnName, sortOrder) => setSortOptions({ columnName, sortOrder })} />
            <tbody>
              {items.map((item) => (
                <ListItem
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  start_time={new Date(item.start_time)}
                  end_time={new Date(item.end_time)}
                  person_id={item.person_id}
                  comment={item.comment}
                  doClick={() => handlePersonClick(item.person_id)}
                  doRefresh={fetchData}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <button
            className="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-r rounded-l"
            style={{ position: 'absolute', top: '76px', left: '10px', border: '0' }}
            onClick={resetAllStates}
          >
            Tillbaka
          </button>
          <table className="table table-zebra table-bordered centered-table">
            <TableHeaderRow onSortChange={(columnName, sortOrder) => setSortOptions({ columnName, sortOrder })} />
            <tbody>
              {items.map((item) => (
                <ListItem
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  start_time={new Date(item.start_time)}
                  end_time={new Date(item.end_time)}
                  person_id={item.person_id}
                  doClick={() => {}}
                  doRefresh={fetchData}
                  comment={item.comment}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
      <footer
        className="footer footer-center bg-base-300 p-4 text-base-content flex justify-center items-center"
        style={{ position: 'fixed', bottom: 0 }}
      >
        <aside className="flex">
          <PaginationControls paginationData={paginationInfo} onPageChange={setCurrentPage} />
          <Dropdown options={paginationSizes} value={pageSize} onChange={onPageSizeChange} />
          <span className="textalgin">Antal träffar: {paginationInfo.total}</span>
        </aside>
      </footer>
    </div>
  );
};

export default ListView;
