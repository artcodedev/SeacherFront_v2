
import CircularProgress from '@mui/material/CircularProgress';
import style from '../Styles/Loading.module.scss'

const Loading = () => {

    return (
        <>
            <div className={style['Loading']}>
                <div className={style['Loading__wrapp']}>

                    <div className={style['Loading__wrapp__text']}>
                        <div className={style['Loading__wrapp__text__txt']}>

                            <CircularProgress />

                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default Loading;