/* eslint-disable */
import React, { useState, useEffect, useContext } from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { UserContext } from '../index.jsx';
import axios from 'axios';
import { createTheme, ThemeProvider} from '@mui/material';
import Typography from '@mui/material/Typography';
import { black } from '@mui/material/colors';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const moment = require('moment');

const theme = createTheme({
  palette: {
    primary: {
      main: '#a373ab',
      darker: '#395B64',
    },
    neutral: {
      main: '#64748B',
      contrastText: '#fff',
    },
  },
});


const Event = (props) => {
  const [going, setGoing] = useState(false);
  
  const context = useContext(UserContext);

  const setStatus = () => {
    axios.get('/api/event', {
      params: {
        id: props.eventData._id
      }
    })

    .then((event) => {
      if (event.data.attendees.includes(context._id)){
        setGoing(true)
      } else {
        setGoing(false)
      }
    })
    .catch((err) => console.error(err))
  }
  useEffect(() => {
    setStatus();
  })

  const handleToggle = () => {
    console.log('toggled');
    axios.get('/api/event', {
      params: {
        id: props.eventData._id
      }
    }).then((event) => {
      axios.put('/api/event', {
        id: event.data._id,
        going,
        userId: context._id
        
      }).then((data) => console.log(data))
      .catch((err) => console.error(err));
    })
    .then(() => setGoing(going => !going))

  }
 return (
  <ThemeProvider theme={theme}>
     <div class="card">
     <Typography variant="h4"><p class="card-text">{props.eventData.catName}</p></Typography>
       <p class="card-text">{props.eventData.description}</p>
       <p class="card-text"><CalendarMonthIcon sx={{ color: black }} /> {moment(props.eventData.date).add(1, 'day').format('MMMM Do YYYY')} | {moment(props.eventData.time, 'h:mm a').format('h:mm a')}</p> 
       <p class="card-text"><LocationOnIcon sx={{ color: black }} /><strong>{props.eventData.locName}</strong> {props.eventData.address}</p>
       <FormGroup>
         <FormControlLabel
          control={<Switch checked={going} color='primary' onChange={handleToggle}/>}
          label=
            {going
              ? <div style={{color: 'green', fontWeight: 'bolder'}}> GOING <CheckCircleOutlineIcon/></div>
              : <div style={{color: '#395B64', fontWeight: 'bolder'}}>RSVP?</div>}
        />
       </FormGroup>

    </div>
      </ThemeProvider>
  );

}
export default Event;
