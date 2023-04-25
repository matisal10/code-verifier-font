import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStorage } from '../hooks/useSessionStorage';

import { GetAllKatas, deleteKataByid } from '../services/katasServices';
import { AxiosResponse } from 'axios';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import { Kata } from '../utils/types/kata.type';
import { Pagination } from '@mui/material';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';


export interface State extends SnackbarOrigin {
    open: boolean;
}

export const KatasPages = () => {

    let loggedIn = useSessionStorage('sessionJWTToken')
    let creatorId = useSessionStorage("idUser")
    let navigate = useNavigate()
    const [katasArray, setKatasArray] = useState([])



    const getKatas = (page: number) => {
        GetAllKatas(loggedIn,page).then((response: AxiosResponse) => {
            if (response.status === 200) {
                setKatasArray(response.data.katas);
                // console.log(katasArray);
            }
            else {
                throw new Error('get error');
            }

        });
    }

    useEffect(() => {
        if (!loggedIn) {
            return navigate('/login')
        }
        else {
            getKatas(page)
        }

    }, [loggedIn])

    const navigateToKataDetail = (id: Number) => {
        navigate(`/katas/${id}`)
    }
    const createKata = () => {
        navigate(`/katas/create`)
    }

    const editKata = (id: string) => {
        navigate(`/katas/edit/${id}`)
    }

    const [state, setState] = React.useState<State>({
        open: false,
        vertical: 'top',
        horizontal: 'center',
    });
    const { vertical, horizontal, open } = state;

    const handleClose = () => {
        setState({ ...state, open: false });
    };


    const deleteKata = async (kata: Kata, newState: SnackbarOrigin) => {
        // new Promise((r) => setTimeout(Response, 2000))
        // alert(JSON.stringify(`esta por borrar la kata con id: ${id}`, null, 2))1
        if (kata.creator === creatorId && kata._id) {
            await deleteKataByid(loggedIn, kata._id, creatorId).then((response: AxiosResponse) => {
                // console.log(id, creatorId)
                if (response.status === 200) {
                    setState({ open: true, ...newState });
                    // console.log(response);
                }
                else {
                    throw new Error('get error');
                }

            });
        }

    }

    const myKatas = () => {
        navigate(`/katas/myKatas`)
    }

    const [page, setPage] = React.useState(1);
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        getKatas(value)
        // console.log(value)
    };

    return (
        <div>
            <h1> Katas Pages</h1>

            {katasArray.length > 0 ?

                katasArray.map((kata: any, index) =>
                (
                    <div key={index}>
                        <div>
                            <a style={{ 'cursor': "pointer" }} onClick={() => navigateToKataDetail(kata._id)}>name: {kata.name}</a>
                            {/* <Button onClick={()=>editKata(kata._id)}><EditIcon/></Button>
                            <Button style={{ background: "none", cursor: "pointer" }} onClick={() => deleteKata(kata, {
                                vertical: 'top',
                                horizontal: 'center',
                            })} ><DeleteForeverIcon />
                                <Snackbar
                                    anchorOrigin={{ vertical, horizontal }}
                                    open={open}
                                    autoHideDuration={2000}
                                    onClose={handleClose}
                                    message="kata Eliminada correctamente"
                                    key={vertical + horizontal}
                                />
                            </Button> */}
                        </div>
                    </div>
                )
                )
                :
                <div>
                    No katas found
                </div>
            }
            <div>
                <Button onClick={() => createKata()}>Create Kata</Button>
                <Button onClick={() => myKatas()}><EditIcon /></Button>
            </div>
            <div className='pagination'>
                <Stack spacing={2}>
                    <Pagination count={10} page={page} onChange={handleChange} />
                </Stack>
            </div>

        </div>
    )

}