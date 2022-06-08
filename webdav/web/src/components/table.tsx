import React, { useState} from 'react';
import { TableComposable, Thead, Tr, Th, Tbody, Td, ThProps } from '@patternfly/react-table';
import DownloadIcon from '../assets/download.svg'
import DeleteIcon from '../assets/trash3.svg'
import RefreshIcon from '../assets/refresh.svg'
import { createClient } from './webdavTools/clientCall';
import { BufferLike, FileStat, ResponseDataDetailed } from './webdavTools/types';

var repor : FileStat[]| ResponseDataDetailed<FileStat[]> = [];

export const ComposableTableSortable: React.FunctionComponent = () => {

const client = createClient(
  `http://localhost:8888/webdav`,
   {
     username: '',
     password: '',
     token: {access_token:'', token_type: ''}
   }
);
const [value, setValue] = useState(1);

async function fetchList(){
  const directoryItems = await client.getDirectoryContents("/");
  repor = directoryItems;
}

fetchList();

  const repositories: FileStat[] = repor as FileStat[]

  const columnNames = {
    basename: 'File Name',
    size: 'Size in Kb',
    lastmod: 'Date Modified',
    download: '',
    delete: ''
  };

  async function downloadFile(file4download: string){
    const filestream  = await client.getFileContents(file4download) as BufferLike
    const printabletext = new Blob([filestream])
    var link = window.document.createElement('a');
    link.href = window.URL.createObjectURL(printabletext);
    link.download = file4download;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(function(){alert('Downloaded File: ' + file4download)}, 1000);
  }

  async function deleteFile(file4delete: string){
    await client.deleteFile(file4delete)
    setTimeout(function(){alert('Deleted file: ' + file4delete.substring(1));}, 1000);
    fetchList()
  }

  // Index of the currently sorted column
  // Note: if you intend to make columns reorderable, you may instead want to use a non-numeric key
  // as the identifier of the sorted column. See the "Compound expandable" example.
  const [activeSortIndex, setActiveSortIndex] = React.useState<number>(0);

  // Sort direction of the currently sorted column
  const [activeSortDirection, setActiveSortDirection] = React.useState<'asc' | 'desc'>('asc');

  // Since OnSort specifies sorted columns by index, we need sortable values for our object by column index.
  // This example is trivial since our data objects just contain strings, but if the data was more complex
  // this would be a place to return simplified string or number versions of each column to sort by.
  const getSortableRowValues = (repo2: FileStat): (string | number)[] => {
    const { basename, size, lastmod, } = repo2;
    return [basename, size, lastmod,];
  };

  // Note that we perform the sort as part of the component's render logic and not in onSort.
  // We shouldn't store the list of data in state because we don't want to have to sync that with props.
  let sortedRepositories = repositories;
  if (activeSortIndex !== null) {
    sortedRepositories = repositories.sort((a, b) => {
      const aValue = getSortableRowValues(a)[activeSortIndex];
      const bValue = getSortableRowValues(b)[activeSortIndex];
      if (typeof aValue === 'number') {
        // Numeric sort
        if (activeSortDirection === 'asc') {
          return (aValue as number) - (bValue as number);
        }
        return (bValue as number) - (aValue as number);
      } else {
        // String sort
        if (activeSortDirection === 'asc') {
          return (aValue as string).localeCompare(bValue as string);
        }
        return (bValue as string).localeCompare(aValue as string);
      }
    });
  }

  const getSortParams = (columnIndex: number): ThProps['sort'] => ({
    sortBy: {
      index: activeSortIndex,
      direction: activeSortDirection,
      defaultDirection: 'asc' // starting sort direction when first sorting a column. Defaults to 'asc'
    },
    onSort: (_event, index, direction) => {
      setActiveSortIndex(index);
      setActiveSortDirection(direction);
    },
    columnIndex
  });

  //we wrap all but the 1st column and make the 1st 2nd and 3rd columns sortable.
  return (
    <>
    <div className="row">
      <div className="col-md-12">
      <button style = {{float: 'right'}} onClick={() => setValue((value + 1))}>
        <img src={RefreshIcon} alt="Refresh logo" />
      </button>
      </div>
    </div>

  <TableComposable aria-label="Sortable table">
      <Thead>
        <Tr>
          <Th sort={getSortParams(0)}>{columnNames.basename}</Th>
          <Th modifier="wrap" sort={getSortParams(1)}>{columnNames.size}</Th>
          <Th modifier="wrap" sort={getSortParams(2)} info={{ tooltip: 'More information ' }}>
            {columnNames.lastmod}
          </Th>
          <Th modifier="wrap">{columnNames.download}</Th>
          <Th modifier="wrap">{columnNames.delete}</Th>
        </Tr>
      </Thead>
      <Tbody>
        {sortedRepositories.map((repo, rowIndex) => (
          <Tr key={rowIndex}>
            <Td dataLabel={columnNames.basename}>{repo.basename}</Td>
            <Td dataLabel={columnNames.size}>{repo.size}</Td>
            <Td dataLabel={columnNames.lastmod}>{repo.lastmod}</Td>
            <Td dataLabel={columnNames.download}><button type="button" className="btn btn-primary"
              onClick={() => downloadFile(repo.basename)}><img src={DownloadIcon} alt="Download logo" /></button></Td>
            <Td dataLabel={columnNames.delete}><button type="button" className="btn btn-danger"
              onClick={() => deleteFile(repo.filename)}> <img src={DeleteIcon} alt="Download logo" /></button></Td>
          </Tr>
        ))}
      </Tbody>
    </TableComposable></>
  );
};
