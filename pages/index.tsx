
/*
*** Main
*/
import type { NextPage } from 'next'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

/*
*** Utils
*/
import { Fetch } from '../Utils/Fetch';
import { getCookie, setCookie } from 'cookies-next/client';

/*
*** Components
*/
import Loading from '../Components/Loading';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpnwardIcon from '@mui/icons-material/ArrowUpward';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import AppBarComponent from '../Components/AppBarComponent';
import Checkbox from '@mui/material/Checkbox';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'

/*
*** Models
*/
import { Data, Fetch_data } from '../Models/Models';

const API_SERVER = "http://localhost:3001";

const Home: NextPage = () => {

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [data, setData] = useState<Data[]>([]);
  const [scrollRequest, setScrollRequest] = useState<number | null>(0);
  const [token, setToken] = useState<string>('');
  const ref = useRef<HTMLDivElement>(null);
  const [blockToDoubleFetch, setBlockToDoubleFetch] = useState<boolean>(false);
  const [selcted, setSelected] = useState<string[]>([]);

  const sortInAscendingOrder = async () => {
    setData([...data.sort((x, y) => x.id - y.id)]);

    const sorted: Fetch_data = await Fetch.request(`${API_SERVER}/api/v1/set_sorted`, { token: token, sorted: 0 });

    console.log(sorted);

    // some kind of action

  }

  const sortInDescendingOrder = async () => {

    setData([...data.sort((x, y) => x.id - y.id).reverse()])

    const sorted: Fetch_data = await Fetch.request(`${API_SERVER}/api/v1/set_sorted`, { token: token, sorted: 1 });

    console.log(sorted);

    // some kind of action
  }

  const search_fetch = async (e: React.ChangeEvent<HTMLInputElement>) => {

    const search: string = e.target.value;

    setSearchQuery(search);

    const isNumber: boolean = /\d/.test(search);

    if (isNumber || search.length == 0) {

      setLoadingTable(true);

      setBlockToDoubleFetch(false);

      const data: Fetch_data = await Fetch.request(`${API_SERVER}/api/v1/get_search`, { token: token, query: isNumber ? parseInt(search) : null });

      if (data) {
        setData(data.data);
        setLoadingTable(false);
      }
    }

    /*
    *** Show some errors
    */
  }

  const getTokenData = async (): Promise<void> => {

    const data: Fetch_data = await Fetch.request(`${API_SERVER}/api/v1/get_token_data`, {});

    if (data) {

      setCookie('token', data.token)

      setToken(data.token);
      setData(data.data);
      setLoading(false);
      setSearchQuery(data.profile.search)

    }

    /*
    *** Show some errors
    */

  }

  const getData = async (token: string) => {

    const data: Fetch_data = await Fetch.request(`${API_SERVER}/api/v1/get_data`, { token: token });

    if (data) {

      console.log(data)

      setSelected(data.profile.selected);

      setToken(token);

      setData(data.data);

      setSearchQuery(data.profile.search);
    }

    /*
    *** Show some errors
    */

  }

  const fetchOffsetData = async (): Promise<void> => {

    if (blockToDoubleFetch) return;

    const data_offset: { data: Data[] } = await Fetch.request(`${API_SERVER}/api/v1/get_offset_data`, { token: token, offset: data.length });

    if (data_offset) {
      if (data_offset.data != null && data_offset.data.length) {

        setData(data.concat(data_offset.data));

        if (ref.current) {

          console.log(ref.current.clientHeight)
          setScrollRequest(ref.current.clientHeight - 300);
        }
        setBlockToDoubleFetch(false);
      }

    }

  }

  const onDragEndHandler = async (result: DropResult) => {
    const toIndex = result.destination?.index;
    const fromIndex = result.source.index;

    if (fromIndex != null && toIndex != null) {

      const array = data;
      const element: any = array.splice(fromIndex, 1)[0];

      array.splice(toIndex, 0, element);

      const move: Fetch_data = await Fetch.request(`${API_SERVER}/api/v1/set_move`, { token: token, draggingRow: fromIndex, hoveredRow: toIndex });

      console.log(move)

      setData(data);
    }
  }

  const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({ ...draggableStyle });

  const handleScroll = () => {
    const position: number = window.pageYOffset;

    if (scrollRequest != null) {
      if (scrollRequest < position) {
        setBlockToDoubleFetch(false);
        fetchOffsetData();
      }
    }

  };

  const checkboxSelect = (id: string) => async () => {

    const data: { db_selected: string[] } = await Fetch.request(`${API_SERVER}/api/v1/get_selected`, { token: token, selected: id });

    if (data) {

      setSelected(data.db_selected);
      /*
      *** Some do if needs
      */
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);

  });

  useEffect(() => {

    const token: string | undefined = getCookie('token');

    if (token) getData(token);
    else getTokenData();

  }, [token]);

  useLayoutEffect(() => {

    if (ref.current) {

      const { clientHeight } = ref.current;

      setScrollRequest(clientHeight / 2);

    }
  });

  return (
    <>{loading ? <Loading /> : <div>
      <AppBarComponent />

      <Box sx={{ margin: '20px 20px' }}>
        <Box sx={{ display: {xs: 'block', md: 'flex' } }}>
          <TextField id="outlined-basic" label="Search id" variant="outlined" value={searchQuery} onChange={search_fetch} />

          <Box sx={{ marginLeft: '20px' }}>

            <IconButton aria-label="filter" size="large" onClick={sortInDescendingOrder}>
              <ArrowUpnwardIcon />
            </IconButton>

            <IconButton aria-label="filter" size="large" onClick={sortInAscendingOrder}>
              <ArrowDownwardIcon />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ marginTop: '20px', minHeight: '100px', position: 'relative' }} >

          {loadingTable ? <Loading /> :
            <div ref={ref}>

              <DragDropContext onDragEnd={onDragEndHandler}>

                <Droppable droppableId={'TodosStatus.BacklogTodos'}>
                  {(droppableProvided, droppableSnapshot) => (

                    <TableContainer sx={{ overflowX: 'clip' }} ref={droppableProvided.innerRef} {...droppableProvided.droppableProps}>

                      <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                          <TableRow>
                            {['Check', 'Id', 'Name', 'Age'].map((column, i) => (
                              <TableCell
                                key={''}
                                style={{ textAlign: 'left', fontWeight: 'bold' }}
                              >
                                {column}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>

                        <TableBody >

                          {data.map((e, index) =>

                            <Draggable draggableId={e.id.toString()} index={index} key={e.id}>

                              {(provided, snapshot) => (

                                <TableRow hover role="checkbox" sx={{ minWidth: '100%' }} tabIndex={-1} key={''} ref={provided.innerRef} {...provided.draggableProps}
                                  {...provided.dragHandleProps} style={getItemStyle(
                                    snapshot.isDragging,
                                    provided.draggableProps.style
                                  )}>

                                  <TableCell sx={{ textAlign: 'left', minWidth: '30%' }}>
                                    <Checkbox onClick={checkboxSelect(e.id.toString())} checked={selcted.includes(e.id.toString()) ? true : false} />
                                  </TableCell>

                                  <TableCell sx={{ textAlign: 'left', minWidth: '30%' }}>{e.id}</TableCell>

                                  <TableCell sx={{ textAlign: 'left', minWidth: '60%' }}>{e.name}</TableCell>

                                  <TableCell sx={{ textAlign: 'left', minWidth: '20%' }}>
                                    {e.age}
                                  </TableCell>

                                </TableRow>)}
                            </Draggable>)

                          }

                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}

                </Droppable>

              </DragDropContext>
            </div>
          }

        </Box>
      </Box>

    </div>}
    </>
  )
}


export default Home
