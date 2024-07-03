import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'ID', width: 20 },
  { field: 'requestId', headerName: 'Req. ID', width: 80 },
  { field: 'requestStatus', headerName: 'Req. Status', width: 90 },
  { field: 'requestType', headerName: 'Req. Type', width: 80 },
  { field: 'requestTime', headerName: 'Req. Time', width: 160 },
  { field: 'contentType', headerName: 'Content Type', width: 140 },
  { field: 'ipAddress', headerName: 'IP Address', width: 100 },
  { field: 'os', headerName: 'OS', width: 80 },
  { field: 'userAgent', headerName: 'User Agent', width: 90 },
];

export function BasicTable(props) {
  return (
    <div className="box shadow" id={props.id}>
      <div className="chart-heading">{props.title}</div>
      <div className="chart-description">{props.description}</div>
      <DataGrid
        rows={props.data}
        columns={columns}
        autoHeight 
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        slots={{toolbar: GridToolbar}}
        />
    </div>
  );
}